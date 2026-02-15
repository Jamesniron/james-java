import { useState, useEffect } from 'react';
import { Container, Typography, TextField, Grid, Card, CardContent, CardActions, IconButton, Button, Box, InputAdornment, Chip } from '@mui/material';
import { Add as AddIcon, Search as SearchIcon, Print as PrintIcon, AdminPanelSettings, Hotel as HotelIcon, Badge, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
    const [reservations, setReservations] = useState([]);
    const [search, setSearch] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchReservations();
    }, []);

    const fetchReservations = async () => {
        try {
            const response = await axios.get('/api/reservations');
            if (response.data && response.data.success && Array.isArray(response.data.data)) {
                setReservations(response.data.data);
            } else {
                setReservations([]);
                console.warn('Received invalid data format:', response.data);
            }
        } catch (error) {
            console.error('Failed to fetch reservations', error);
            setReservations([]);
        }
    };

    const filteredReservations = reservations.filter(res =>
        res.guestName.toLowerCase().includes(search.toLowerCase()) ||
        String(res.id).includes(search)
    );

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this reservation?')) {
            try {
                await axios.delete(`/api/reservations/${id}`);
                fetchReservations();
            } catch (error) {
                console.error('Failed to delete reservation', error);
                alert('Failed to delete reservation');
            }
        }
    };

    return (
        <Container maxWidth="xl" sx={{ mt: 8, pb: 8 }} className="fade-in">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 6 }}>
                <Box>
                    <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
                        Dashboard
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'var(--text-muted)' }}>
                        Manage and track all guest bookings
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    className="premium-btn"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/reservations/add')}
                    sx={{ px: 4, py: 1.8, fontSize: '1rem' }}
                >
                    New Reservation
                </Button>
            </Box>

            {/* Quick Stats */}
            <Grid container spacing={3} sx={{ mb: 6 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card className="glass-panel" sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="caption" sx={{ color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Total Bookings</Typography>
                        <Typography variant="h4" sx={{ fontWeight: 800, mt: 1 }}>{reservations.length}</Typography>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card className="glass-panel" sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="caption" sx={{ color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Confirmed</Typography>
                        <Typography variant="h4" sx={{ fontWeight: 800, mt: 1, color: '#4ade80' }}>
                            {reservations.filter(r => r.status === 'CONFIRMED' || r.status === 'CHECKED_OUT').length}
                        </Typography>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card className="glass-panel" sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="caption" sx={{ color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Pending</Typography>
                        <Typography variant="h4" sx={{ fontWeight: 800, mt: 1, color: '#fbbf24' }}>
                            {reservations.filter(r => r.status === 'PENDING').length}
                        </Typography>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card className="glass-panel" sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="caption" sx={{ color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Total Revenue</Typography>
                        <Typography variant="h4" sx={{ fontWeight: 800, mt: 1 }}>
                            Rs. {reservations.reduce((acc, r) => acc + (r.totalAmount || 0), 0).toLocaleString()}
                        </Typography>
                    </Card>
                </Grid>
            </Grid>

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
                        background: 'rgba(255, 255, 255, 0.02)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid var(--glass-border)',
                        transition: 'var(--transition)',
                        '&:hover': {
                            border: '1px solid var(--primary)'
                        },
                        '&.Mui-focused': {
                            border: '1px solid var(--primary)',
                            boxShadow: '0 0 0 4px var(--primary-glow)'
                        }
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
                {filteredReservations.length > 0 ? (
                    filteredReservations.map((res) => (
                        <Grid item xs={12} md={6} lg={4} key={res.id}>
                            <Card className="glass-card" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                        <Typography variant="h6" sx={{ fontWeight: 700, opacity: 0.8 }}>
                                            #{res.id}
                                        </Typography>
                                        <Box sx={{
                                            px: 1.5, py: 0.5, borderRadius: '8px',
                                            fontSize: '0.75rem', fontWeight: 700,
                                            background: res.status === 'CONFIRMED' || res.status === 'CHECKED_OUT'
                                                ? 'rgba(34, 197, 94, 0.1)'
                                                : res.status === 'PENDING' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                            color: res.status === 'CONFIRMED' || res.status === 'CHECKED_OUT'
                                                ? '#4ade80'
                                                : res.status === 'PENDING' ? '#fbbf24' : '#f87171',
                                            border: '1px solid currentColor'
                                        }}>
                                            {res.status}
                                        </Box>
                                    </Box>
                                    <Typography variant="h5" sx={{ mb: 1, fontWeight: 700, letterSpacing: '-0.01em' }}>
                                        {res.guestName}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'var(--text-muted)', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <HotelIcon sx={{ fontSize: '1rem', opacity: 0.7 }} /> Room {res.roomNumber} • {res.roomType}
                                    </Typography>

                                    <Grid container spacing={2} sx={{ mb: 1 }}>
                                        <Grid item xs={6}>
                                            <Typography variant="caption" sx={{ color: 'var(--text-muted)', display: 'block', mb: 0.5 }}>CHECK IN</Typography>
                                            <Typography variant="body2" sx={{ fontWeight: 600 }}>{res.checkIn}</Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="caption" sx={{ color: 'var(--text-muted)', display: 'block', mb: 0.5 }}>CHECK OUT</Typography>
                                            <Typography variant="body2" sx={{ fontWeight: 600 }}>{res.checkOut}</Typography>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                                <CardActions sx={{ justifyContent: 'space-between', px: 3, py: 2, borderTop: '1px solid var(--glass-border)' }}>
                                    <Typography variant="h6" sx={{ fontWeight: 800, color: 'var(--primary)' }}>
                                        Rs. {res.totalAmount}
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 1 }}>

                                        <IconButton
                                            sx={{ color: 'var(--text-muted)', '&:hover': { color: '#fbbf24', background: 'rgba(251, 191, 36, 0.1)' } }}
                                            onClick={() => navigate(`/reservations/edit/${res.id}`)}
                                            title="Edit Reservation"
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            sx={{ color: 'var(--text-muted)', '&:hover': { color: '#f87171', background: 'rgba(248, 113, 113, 0.1)' } }}
                                            onClick={() => handleDelete(res.id)}
                                            title="Delete Reservation"
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                        <IconButton
                                            sx={{ color: 'var(--text-muted)', '&:hover': { color: 'var(--secondary)', background: 'rgba(217, 70, 239, 0.1)' } }}
                                            onClick={() => navigate(`/billing/${res.id}`)}
                                            title="Billing / Print"
                                        >
                                            <PrintIcon />
                                        </IconButton>
                                    </Box>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))
                ) : (
                    <Grid item xs={12}>
                        <Box sx={{ textAlign: 'center', py: 10, opacity: 0.5 }}>
                            <SearchIcon sx={{ fontSize: '4rem', mb: 2 }} />
                            <Typography variant="h5">No reservations found matching your search.</Typography>
                        </Box>
                    </Grid>
                )}
            </Grid>
        </Container>
    );
};

export default Dashboard;
