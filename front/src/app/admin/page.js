"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Link, Box, Button, TextField, Table, TableBody, TableCell, TableHead, TableRow, Paper, TableContainer, TablePagination, Container, Divider, Typography, Snackbar, Alert, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Refresh } from '@mui/icons-material';
import Image from 'next/image';

export default function AdminPage() {
    // Pagination

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    // Weight Map
    const [weightMap, setWeightMap] = useState([]);

    const loadWeights = useCallback(async () => {
        try {
            const response = await fetch('/api/weights?action=getTokenWeights');
            const data = await response.json();
            setWeightMap(data);
        } catch (err) {
            console.log(err);
        }
    }, [setWeightMap]);

    const handleWeightChange = (key, event) => {
        const updatedWeight = event.target.value;
        setWeightMap((prevWeightMap) =>
            prevWeightMap.map((weight) =>
                weight.key === key ? { ...weight, value: updatedWeight } : weight
            )
        );
    };

    const handleRefreshClick = async () => {
        try {
            const response = await fetch('/api/weights?action=getTokenWeights');
            const data = await response.json();
            setWeightMap(data);

            setMessage('ウェイトの更新に成功しました');
            setSeverity('success');
            setOpen(true);
        } catch (err) {
            console.log(err);
        }
    };


    // Function to handle weight map save to the db
    const handleSaveWeights = () => {
        const saveWeights = async () => {
            try {
                const response = await fetch('/api/weights?action=updateTokenWeights', {
                    method: 'POST',
                    body: JSON.stringify(weightMap),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                const jsonResponse = await response.json();

                if (jsonResponse.success) {
                    setSeverity('success');
                    setMessage('ウェイトが正常に保存されました');
                    setOpen(true);
                } else {
                    setSeverity('error');
                    setMessage('ウェイトの保存中にエラーが発生しました');
                    setOpen(true);
                }

            } catch (err) {
                console.log(err);
            }
        };
        saveWeights();
    };

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

    const handleFileChange = (event) => {
        const uploadedFile = event.target.files[0];
        if (uploadedFile) {
            const reader = new FileReader();
            reader.onload = async (event) => {
                const fileContent = event.target.result;
                const response = await fetch('/api/qa?action=processJaquadData', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: fileContent,
                });

                if (!response.ok) {
                    setSeverity('error');
                    setMessage('データの処理中にエラーが発生しました');
                    setOpen(true);
                    return;
                }

                // The processed data is now in the response
                const qaData = await response.json();
                downloadProcessedData(qaData);
            }

            reader.readAsText(uploadedFile);
        };
    };

    const downloadProcessedData = (qaData) => {
        const fileName = 'qa_data.json';
        const json = JSON.stringify(qaData);
        const blob = new Blob([json], { type: 'application/json' });
        const href = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = href;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
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
            const response = await fetch('/api/settings?action=saveSettings', {
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
            const response = await fetch('/api/settings?action=getSettings');
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
        loadWeights();
        loadSettings();
    }, [loadWeights, loadSettings]);

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
                        <VisuallyHiddenInput type="file" accept='.json' onChange={handleFileChange} />
                    </Button>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Button fullWidth component="label" variant="contained" onClick={handleRefreshClick} startIcon={<Refresh />}>
                        リフレッシュする
                    </Button>
                </Grid>
            </Grid>


            <Divider sx={{ mt: 2, mb: 2 }}></Divider>

            <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                <Typography sx={{ width: '100%', textAlign: 'center', mb: 2 }} variant="h6" gutterBottom>
                    日本語品詞リストと対応する BCCWJ の品詞名
                </Typography>
                <Paper sx={{ width: '100%', overflow: 'hidden', mb: 2 }} elevation={3}>
                    {/* Weight Map Table */}
                    <TableContainer sx={{ maxHeight: 440 }}>
                        <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>ラベル (EN)</TableCell>
                                    <TableCell>ラベル (JP)</TableCell>
                                    <TableCell>重味</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {weightMap.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((weight) => (
                                    <TableRow key={weight.key}>
                                        <TableCell>{weight.key}</TableCell>
                                        <TableCell>{weight.label}</TableCell>
                                        <TableCell>{weight.labelJP}</TableCell>
                                        <TableCell>
                                            <TextField
                                                type="number"
                                                value={weight.value}
                                                onChange={(event) => handleWeightChange(weight.key, event)}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[10, 25, 100]}
                        component="div"
                        count={weightMap.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button variant="contained" onClick={handleSaveWeights}>
                        保存する
                    </Button>
                </Box>

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

                <Divider sx={{ mt: 2, mb: 2 }}></Divider>
            </Box>
        </Container>
    );
}
