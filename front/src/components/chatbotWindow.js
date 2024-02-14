"use client";

import styles from './chatbot.module.css';
import Image from 'next/image';
import {
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    TextField,
    Button,
    Container,
    Stack,
    CircularProgress,
    Snackbar,
    Alert
} from '@mui/material';
import Suggestions from './suggestions';
import { useState, useEffect, useRef, useCallback } from 'react';
import { debounce } from 'lodash';


export default function ChatWindow() {
    const [userInput, setUserInput] = useState('');
    const [chatHistory, setChatHistory] = useState([{ user: 'bot', text: 'こんにちは！本日はどのようにお手伝いできますか？' }]);
    const [isLoading, setIsLoading] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [hasSuggestions, setHasSuggestions] = useState(false);
    const lastMessageRef = useRef(null);

    // Snackbar
    const [open, setOpen] = useState(false);
    const [severity, setSeverity] = useState('success');
    const [message, setMessage] = useState('');

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    const handleInputChange = (event) => {
        setUserInput(event.target.value);
        debouncedFetchSuggestions(event.target.value);
    };

    const getBestAnswer = async (message) => {
        setIsLoading(true);
        let answer = 'その質問に対する答えはわかりません。';
        if (message.length > 0) {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/message`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query: message }),
            });
            const data = await response.json();
            answer = data.message;
        }

        setChatHistory(prevChatHistory => [...prevChatHistory, { user: 'user', text: message }, { user: 'bot', text: answer }]);
        setUserInput('');
        setIsLoading(false);
    };

    // Modify handleSendClick to call getBestAnswer with userInput
    const handleSendClick = () => {
        getBestAnswer(userInput);
    };

    // Modify handleSuggestClick to call sendMessage with the clicked suggestion
    const handleSuggestClick = (suggestion) => {
        setChatHistory(prevChatHistory => [...prevChatHistory, { user: 'user', text: suggestion.prompt }, { user: 'bot', text: suggestion.answer }]);
        setUserInput('');
    };

    const fetchSuggestions = useCallback(async (userInput) => {
        if (userInput.length < 1) return;
        try {
            //console.log('Fetching suggestions...');
            setIsLoading(true);

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/suggestions?query=` + encodeURIComponent(userInput));
            const filteredQA = await response.json();

            if (filteredQA.length === 0) {
                setHasSuggestions(false);
                setIsLoading(false);

                setSeverity('error');
                setMessage('入力されたテキストにトークンが含まれていません');
                setOpen(true);

                return setSuggestions([]);
            }

            setSuggestions([...filteredQA]);
            setHasSuggestions(filteredQA.length > 0);
            setIsLoading(false);
        } catch (err) {
            console.log(err);
            setHasSuggestions(false);
            setIsLoading(false);
            setSeverity('error');
            setMessage('入力されたテキストにトークンが含まれていません');
            setOpen(true);
        }
    }, []);

    const debouncedFetchSuggestions = useCallback(
        debounce(async (userInput) => {
            if (userInput.length < 1) return;
            try {
                console.log('Fetching suggestions...');
                setIsLoading(true);
                console.log('backend url', process.env.NEXT_PUBLIC_API_URL);
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/suggestions?query=` + encodeURIComponent(userInput));
                const filteredQA = await response.json();

                if (filteredQA.length === 0) {
                    setHasSuggestions(false);
                    setIsLoading(false);

                    setSeverity('error');
                    setMessage('入力されたテキストにトークンが含まれていません');
                    setOpen(true);

                    return setSuggestions([]);
                }

                setSuggestions([...filteredQA]);
                setHasSuggestions(filteredQA.length > 0);
                setIsLoading(false);
            } catch (err) {
                console.log(err);
                setHasSuggestions(false);
                setIsLoading(false);
                setSeverity('error');
                setMessage('入力されたテキストにトークンが含まれていません');
                setOpen(true);
            }
        }, 3000),
        [] // delay in ms
    );

    useEffect(() => {

        if (lastMessageRef.current) {
            lastMessageRef.current.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
        }

    }, [userInput, chatHistory]);

    return (
        <Container id='chatContainer' maxWidth="sm" className={styles.chatContainer}>
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
                    {message}
                </Alert>
            </Snackbar>

            <Stack className={`${styles.chatStack} ${hasSuggestions ? styles.suggestionsPoppedOut : ''}`}>
                {/* Chat panel */}
                <List className={styles.chatMessagesList}>
                    {chatHistory.map((message, index) => (
                        <ListItem key={index} ref={index === chatHistory.length - 1 ? lastMessageRef : null}>
                            <ListItemAvatar>
                                <Avatar>
                                    <Image src={message.user === 'bot' ? "/images/chatbot_icon_1.png" : "/images/user_icon2.png"} alt={message.user} width={40} height={40} priority />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={message.text} />
                        </ListItem>
                    ))}
                </List>
                {/* Input field */}
                <Stack direction="row" spacing={0.5} className={styles.inputField}>
                    <TextField
                        className={styles.chatInput}
                        fullWidth
                        placeholder="メッセージを入力してください..."
                        variant="outlined"
                        value={userInput}
                        onChange={handleInputChange}
                    />
                    <Button
                        variant="contained"
                        className={styles.sendButton}
                        onClick={handleSendClick}
                        disabled={isLoading}
                    >
                        送信
                    </Button>
                </Stack>
                {/* Suggestions panel */}
                <Suggestions suggestions={suggestions} onSuggestionClick={handleSuggestClick} />
            </Stack>
            <div style={{ position: 'fixed', bottom: '50%', right: '50%', zIndex: 1 }}>
                {isLoading && <CircularProgress color="inherit" />}
            </div>
        </Container>
    );
}
