import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Paper, Grid, Button, Divider, ListItemText, Box } from '@mui/material';
import axios from 'axios';

const ReservationDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [reservation, setReservation] = useState(null);

    useEffect(() => {
        fetchReservation();
    }, [id]);

    const fetchReservation = async () => {
        try {
            const response = await axios.get(`/api/billing/${id}`);
            setReservation(response.data.data);
        } catch (error) {
            console.error('Failed to fetch reservation', error);
        }
    };

    if (!reservation) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="md" sx={{ mt: 8, pb: 8 }} className="fade-in">
            <Paper className="glass-panel" sx={{ p: { xs: 3, md: 6 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
                    <Box>
                        <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
                            Booking Details
                        </Typography>
                        <Typography variant="h6" sx={{ color: 'var(--primary)', fontWeight: 700 }}>
                            Reservation #{reservation.id}
                        </Typography>
                    </Box>
                    <Box sx={{
                        px: 2, py: 1, borderRadius: '12px',
                        fontSize: '0.875rem', fontWeight: 700,
                        background: reservation.status === 'CONFIRMED' || reservation.status === 'CHECKED_OUT'
                            ? 'rgba(34, 197, 94, 0.1)'
                            : 'rgba(245, 158, 11, 0.1)',
                        color: reservation.status === 'CONFIRMED' || reservation.status === 'CHECKED_OUT'
                            ? '#4ade80' : '#fbbf24',
                        border: '1px solid currentColor'
                    }}>
                        {reservation.status}
                    </Box>
                </Box>

                <Divider sx={{ mb: 4, borderColor: 'var(--glass-border)' }} />

                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                        <Typography variant="overline" sx={{ color: 'var(--text-muted)', fontWeight: 700 }}>Guest Information</Typography>
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>{reservation.guestName}</Typography>
                            <Typography variant="body1" sx={{ color: 'var(--text-muted)', mb: 1 }}>{reservation.address}</Typography>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>{reservation.contactNumber}</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant="overline" sx={{ color: 'var(--text-muted)', fontWeight: 700 }}>Stay Information</Typography>
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>Room {reservation.roomNumber}</Typography>
                            <Typography variant="body1" sx={{ color: 'var(--text-muted)', mb: 2 }}>{reservation.roomType}</Typography>

                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Typography variant="caption" sx={{ color: 'var(--text-muted)', display: 'block' }}>CHECK IN</Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 600 }}>{reservation.checkIn}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="caption" sx={{ color: 'var(--text-muted)', display: 'block' }}>CHECK OUT</Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 600 }}>{reservation.checkOut}</Typography>
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                </Grid>

                <Box sx={{
                    mt: 6, p: 3, borderRadius: '16px',
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid var(--glass-border)',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}>
                    <Box>
                        <Typography variant="caption" sx={{ color: 'var(--text-muted)', display: 'block' }}>TOTAL AMOUNT</Typography>
                        <Typography variant="h4" sx={{ fontWeight: 800, color: 'var(--primary)' }}>Rs. {reservation.totalAmount.toLocaleString()}</Typography>
                    </Box>
                    <Typography variant="body2" sx={{ color: 'var(--text-muted)' }}>
                        {reservation.totalNights} Nights Stay
                    </Typography>
                </Box>

                <Box sx={{ mt: 6, display: 'flex', gap: 2 }}>
                    <Button
                        variant="outlined"
                        onClick={() => navigate('/dashboard')}
                        sx={{ px: 4, py: 1.5, borderRadius: '12px', border: '1px solid var(--glass-border)', color: 'white' }}
                    >
                        Return to Dashboard
                    </Button>
                    <Button
                        variant="contained"
                        className="premium-btn"
                        onClick={() => navigate(`/billing/${reservation.id}`)}
                        sx={{ px: 4, py: 1.5 }}
                    >
                        Generate Invoice
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default ReservationDetails;
