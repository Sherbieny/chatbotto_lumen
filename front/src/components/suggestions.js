import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import PsychologyAltIcon from '@mui/icons-material/PsychologyAlt';
import Styles from './suggestions.module.css';
import Stack from '@mui/material/Stack';
import { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

export default function Suggestions({ suggestions, onSuggestionClick }) {
    const [isSuggestionsPoppedOut, setSuggestionsPoppedOut] = useState(false);

    if (!suggestions) return (<></>);
    return (
        <Stack spacing={2} className={isSuggestionsPoppedOut ? Styles.suggestionsPanel : Styles.suggestionContainer}>
            <div className={Styles.suggestionsHeader}>
                <Tooltip title={isSuggestionsPoppedOut ? 'Close Panel' : 'Open Panel'}>
                    <IconButton size="small" onClick={() => setSuggestionsPoppedOut(!isSuggestionsPoppedOut)}>
                        <OpenInNewIcon />
                    </IconButton>
                </Tooltip>
            </div>
            <List className={Styles.suggestionsList}>
                {suggestions.map((suggestion, index) => (
                    <ListItem key={index} button onClick={() => onSuggestionClick(suggestion)}>
                        <ListItemIcon>
                            <PsychologyAltIcon className={Styles.questionIcon} />
                        </ListItemIcon>
                        <ListItemText primary={suggestion.prompt} />
                    </ListItem>
                ))}
            </List>
        </Stack>
    );
}