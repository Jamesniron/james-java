import { useState, useEffect } from 'react';
import { Container, Typography, TextField, Grid, Card, CardContent, CardActions, IconButton, Button, Box, InputAdornment, Chip } from '@mui/material';
import { Add as AddIcon, Search as SearchIcon, Visibility as ViewIcon, Print as PrintIcon, AdminPanelSettings, Badge } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
    const [reservations, setReservations] = useState([]);
    const [search, setSearch] = useState('');
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        fetchReservations();
    }, []);

    const fetchReservations = async () => {
        try {
            const response = await axios.get('/api/reservations');
            setReservations(response.data.data);
        } catch (error) {
            console.error('Failed to fetch reservations', error);
        }
    };

    const filteredReservations = reservations.filter(res =>
        res.guestName.toLowerCase().includes(search.toLowerCase()) ||
        String(res.id).includes(search)
    );

    return (
        <Container maxWidth="xl" sx={{ mt: 8, pb: 8 }} className="fade-in">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                        <Typography variant="h3" sx={{ fontWeight: 800 }}>
                            Dashboard
                        </Typography>
                        {user && (
                            <Chip
                                icon={user.role === 'ADMIN' ? <AdminPanelSettings /> : <Badge />}
                                label={user.role}
                                sx={{
                                    background: user.role === 'ADMIN'
                                        ? 'linear-gradient(45deg, #f06292 30%, #f48fb1 90%)'
                                        : 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                                    color: 'white',
                                    fontWeight: 'bold',
                                    height: '32px',
                                    px: 1,
                                    boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)'
                                }}
                            />
                        )}
                    </Box>
                    <Typography variant="body1" sx={{ color: 'var(--text-muted)' }}>
                        Manage and track all guest bookings | Welcome back, {user ? user.username : 'User'}
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    className="premium-btn"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/reservations/add')}
                    sx={{ px: 4, py: 1.5 }}
                >
                    New Reservation
                </Button>
            </Box>

            <TextField
                placeholder="Search by Guest Name or Booking ID..."
                variant="outlined"
                fullWidth
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{
                    mb: 4,
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '16px',
                        background: 'var(--glass-bg)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid var(--glass-border)'
                    }
                }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon sx={{ color: 'var(--text-muted)' }} />
                        </InputAdornment>
                    ),
                }}
            />

            <Grid container spacing={3}>
                {filteredReservations.map((res) => (
                    <Grid item xs={12} md={6} lg={4} key={res.id}>
                        <Card className="glass-card" sx={{ height: '100%', background: 'var(--glass-bg)' }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                        #{res.id}
                                    </Typography>
                                    <Box sx={{
                                        px: 1.5, py: 0.5, borderRadius: '8px',
                                        fontSize: '0.75rem', fontWeight: 600,
                                        background: res.status === 'CONFIRMED' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                                        color: res.status === 'CONFIRMED' ? '#4ade80' : '#fbbf24'
                                    }}>
                                        {res.status}
                                    </Box>
                                </Box>
                                <Typography variant="h5" sx={{ mb: 1, fontWeight: 600 }}>
                                    {res.guestName}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'var(--text-muted)', mb: 2 }}>
                                    Room {res.roomNumber} • {res.roomType}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
                                    <Box>
                                        <Typography variant="caption" sx={{ color: 'var(--text-muted)', display: 'block' }}>CHECK IN</Typography>
                                        <Typography variant="body2">{res.checkIn}</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" sx={{ color: 'var(--text-muted)', display: 'block' }}>CHECK OUT</Typography>
                                        <Typography variant="body2">{res.checkOut}</Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                            <CardActions sx={{ justifyContent: 'flex-end', p: 2, borderTop: '1px solid var(--glass-border)' }}>
                                <IconButton sx={{ color: 'var(--primary)' }} onClick={() => navigate(`/reservations/${res.id}`)}>
                                    <ViewIcon />
                                </IconButton>
                                <IconButton sx={{ color: 'var(--secondary)' }} onClick={() => navigate(`/billing/${res.id}`)}>
                                    <PrintIcon />
                                </IconButton>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default Dashboard;
