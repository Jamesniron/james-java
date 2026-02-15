import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Container, TextField, Button, Typography, Box, Alert, CircularProgress, Paper, Tooltip, IconButton } from '@mui/material';
import { AdminPanelSettings, Badge } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = ({ setUser }) => {
    // ... existing hook logic ... 
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const formik = useFormik({
        initialValues: {
            username: '',
            password: '',
        },
        validationSchema: Yup.object({
            username: Yup.string().required('Username is required'),
            password: Yup.string().required('Password is required'),
        }),
        onSubmit: async (values) => {
            setLoading(true);
            setError('');
            try {
                const response = await axios.post('/api/login', values);
                if (response.data.success) {
                    const userData = response.data.data;
                    localStorage.setItem('user', JSON.stringify(userData));
                    setUser(userData);
                    if (userData.role === 'ADMIN') {
                        navigate('/admin');
                    } else {
                        navigate('/dashboard');
                    }
                } else {
                    setError(response.data.message || 'Login failed');
                }
            } catch (err) {
                console.error('Login Error:', err);
                const status = err.response?.status;
                const message = err.response?.data?.message;

                if (status === 401) {
                    setError('Invalid Username or Password');
                } else if (status === 404) {
                    setError('Login service not found (404). Check backend URL.');
                } else if (status >= 500) {
                    setError('Server error. Please try again later.');
                } else if (!status) {
                    setError('Network Error: Unable to reach backend. Ensure server is running.');
                } else {
                    setError(message || 'Login failed. Please try again.');
                }
            } finally {
                setLoading(false);
            }
        },
    });

    const fillCredentials = (role) => {
        if (role === 'admin') {
            formik.setValues({ username: 'admin', password: 'password' });
        } else {
            formik.setValues({ username: 'staff', password: 'staff123' });
        }
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'radial-gradient(circle at center, rgba(99, 102, 241, 0.1) 0%, transparent 70%)'
        }}>
            <Container maxWidth="xs" className="fade-in">
                <Paper className="glass-panel" sx={{ p: 5, textAlign: 'center' }}>
                    <Typography
                        variant="h3"
                        className="gradient-text"
                        sx={{ fontWeight: 800, mb: 1, letterSpacing: '-0.05em' }}
                    >
                        OCEAN VIEW
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'var(--text-muted)', mb: 2, fontWeight: 500 }}>
                        Management Portal
                    </Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 4 }}>
                        <Tooltip title="Login as Admin">
                            <IconButton
                                onClick={() => fillCredentials('admin')}
                                sx={{
                                    border: '1px solid rgba(244, 143, 177, 0.3)',
                                    background: 'rgba(244, 143, 177, 0.1)',
                                    '&:hover': { background: 'rgba(244, 143, 177, 0.2)' }
                                }}
                            >
                                <AdminPanelSettings sx={{ color: '#f48fb1' }} />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Login as Staff">
                            <IconButton
                                onClick={() => fillCredentials('staff')}
                                sx={{
                                    border: '1px solid rgba(144, 202, 249, 0.3)',
                                    background: 'rgba(144, 202, 249, 0.1)',
                                    '&:hover': { background: 'rgba(144, 202, 249, 0.2)' }
                                }}
                            >
                                <Badge sx={{ color: '#90caf9' }} />
                            </IconButton>
                        </Tooltip>
                    </Box>

                    <Box component="form" onSubmit={formik.handleSubmit}>
                        {error && <Alert severity="error" sx={{ mb: 3, borderRadius: '12px', background: 'rgba(244, 63, 94, 0.1)', color: '#fb7185' }}>{error}</Alert>}
                        <TextField
                            margin="normal"
                            fullWidth
                            id="username"
                            label="Username"
                            name="username"
                            autoComplete="username"
                            autoFocus
                            value={formik.values.username}
                            onChange={formik.handleChange}
                            error={formik.touched.username && Boolean(formik.errors.username)}
                            helperText={formik.touched.username && formik.errors.username}
                            sx={{
                                mb: 2,
                                '& .MuiOutlinedInput-root': { borderRadius: '12px', background: 'rgba(255,255,255,0.02)' },
                                '& .MuiInputLabel-root': { color: 'var(--text-muted)' }
                            }}
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            error={formik.touched.password && Boolean(formik.errors.password)}
                            helperText={formik.touched.password && formik.errors.password}
                            sx={{
                                mb: 2,
                                '& .MuiOutlinedInput-root': { borderRadius: '12px', background: 'rgba(255,255,255,0.02)' },
                                '& .MuiInputLabel-root': { color: 'var(--text-muted)' }
                            }}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            className="premium-btn"
                            sx={{ mt: 4, mb: 2, py: 2 }}
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : 'Enter System'}
                        </Button>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default Login;
