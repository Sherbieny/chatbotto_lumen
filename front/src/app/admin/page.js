"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Link, Box, Button, TextField, Container, Divider, Typography, Snackbar, Alert, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Refresh } from '@mui/icons-material';
import Image from 'next/image';

export default function AdminPage() {

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

    // File upload

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/upload`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                setSeverity('error');
                setMessage('データのアップロード中にエラーが発生しました');
                setOpen(true);
            } else {
                setSeverity('success');
                setMessage('データが正常にアップロードされました');
                setOpen(true);

                // Start the indexing process
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/process`, {
                    method: 'POST',
                }).then((response) => {
                    if (response.ok) {
                        setSeverity('info');
                        setMessage('インデックス作成プロセスを開始します - 約 10 分間お待ちください');
                        setOpen(true);
                    } else {
                        setSeverity('error');
                        setMessage('インデックス作成プロセス中にエラーが発生しました.');
                        setOpen(true);
                    }
                });
            }

        } catch (err) {
            console.error(err);
            setSeverity('error');
            setMessage('データのアップロード中にエラーが発生しました');
            setOpen(true);
        }
    };

    const VisuallyHiddenInput = styled('input')({
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: 1,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        whiteSpace: 'nowrap',
        width: 1,
    });

    // Settings
    const [settings, setSettings] = useState([]);

    const handleSettingChange = (key, value) => {
        setSettings((prevSettings) =>
            prevSettings.map((setting) =>
                setting.key === key ? { ...setting, value: value } : setting
            )
        );
    };

    const handleSaveSettings = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/settings`, {
                method: 'POST',
                body: JSON.stringify(settings),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const jsonResponse = await response.json();

            if (jsonResponse.success) {
                setSeverity('success');
                setMessage('設定が正常に保存されました');
                setOpen(true);
            } else {
                setSeverity('error');
                setMessage('設定の保存中にエラーが発生しました');
                setOpen(true);
            }

        } catch (err) {
            console.log(err);

            setSeverity('error');
            setMessage('設定の保存中にエラーが発生しました');
            setOpen(true);
        }
    };


    const loadSettings = useCallback(async () => {
        const defaultSettings = [
            { key: 'suggestionsCount', label: '提案の数', value: 5 }
            // Add more settings here
        ];
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/settings`);
            const data = await response.json();

            if (data.length === 0) {
                setSettings(defaultSettings);
                return;
            }

            setSettings(data);
        } catch (err) {
            console.log(err);

            setSettings(defaultSettings);
        }
    }, [setSettings]);


    // Effects

    useEffect(() => {
        loadSettings();
    }, [loadSettings]);

    return (
        <Container maxWidth="xl">
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
                    {message}
                </Alert>
            </Snackbar>

            <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
                <Image src="/images/admin_icon_1.png" alt="Chatbot" width={150} height={150} priority />
                <Typography variant="h4" gutterBottom>
                    管理
                </Typography>
            </Box>

            <Grid container spacing={2} justifyContent="center">
                <Grid item xs={12} sm={4}>
                    <Link href="/">
                        <Button fullWidth component="label" variant="contained" startIcon={<ArrowBackIcon />}>
                            戻る
                        </Button>
                    </Link>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Button fullWidth component="label" variant="contained" startIcon={<CloudUploadIcon />}>
                        JaQuAD データセット（JSON）を処理す
                        <VisuallyHiddenInput type="file" accept='.json' onChange={handleFileUpload} />
                    </Button>
                </Grid>
            </Grid>


            <Divider sx={{ mt: 2, mb: 2 }}></Divider>

            <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                <Typography sx={{ width: '100%', textAlign: 'center', mb: 2 }} variant="h6" gutterBottom>
                    設定
                </Typography>
                {settings.map((setting, index) => (
                    <Box border={1} borderColor="divider" borderRadius={1} p={1} mb={1} key={index}>
                        <Grid container item xs={12} alignItems="center">
                            <Grid item xs={10} sm={8}>
                                <Typography variant="h5" align='center'>{setting.label}</Typography>
                            </Grid>
                            <Grid item xs={2} sm={4}>
                                <TextField
                                    type="number"
                                    value={setting.value}
                                    onChange={(event) => handleSettingChange(setting.key, event.target.value)}
                                    fullWidth
                                />
                            </Grid>
                        </Grid>
                    </Box>
                ))}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button variant="contained" onClick={handleSaveSettings}>
                        設定を保存
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}
