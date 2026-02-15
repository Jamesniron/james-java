import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Container, TextField, Button, Typography, MenuItem, Box, Alert, CircularProgress, Paper, Grid, InputAdornment } from '@mui/material';
import { Person, Phone, Home, Hotel, CalendarToday, DateRange } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddReservation = () => {
    const navigate = useNavigate();
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchRooms();
    }, []);

    const fetchRooms = async () => {
        try {
            const response = await axios.get('/api/rooms');
            setRooms(response.data.data);
        } catch (err) {
            console.error(err);
        }
    };

    const formik = useFormik({
        initialValues: {
            guestName: '',
            address: '',
            contactNumber: '',
            roomId: '',
            checkIn: '',
            checkOut: '',
        },
        validationSchema: Yup.object({
            guestName: Yup.string().required('Required'),
            address: Yup.string().required('Required'),
            contactNumber: Yup.string().required('Required'),
            roomId: Yup.string().required('Required'),
            checkIn: Yup.date().required('Required'),
            checkOut: Yup.date().required('Required').min(
                Yup.ref('checkIn'),
                "Check-out date can't be before check-in date"
            ),
        }),
        onSubmit: async (values) => {
            setLoading(true);
            setError('');
            try {
                await axios.post('/api/reservations', values);
                navigate('/dashboard');
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to create reservation');
            } finally {
                setLoading(false);
            }
        },
    });

    return (
        <Container maxWidth="md" sx={{ mt: 10, pb: 8 }} className="fade-in">
            <Paper className="glass-panel" sx={{ p: { xs: 3, md: 6 } }}>
                <Typography variant="h3" sx={{ mb: 1, fontWeight: 800 }}>
                    New Booking
                </Typography>
                <Typography variant="body1" sx={{ color: 'var(--text-muted)', mb: 5 }}>
                    Enter guest details and room preferences below.
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 4, borderRadius: '12px' }}>{error}</Alert>}

                <Box component="form" onSubmit={formik.handleSubmit}>
                    <Grid container spacing={3}>

                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                name="guestName"
                                label="Guest Full Name"
                                value={formik.values.guestName}
                                onChange={formik.handleChange}
                                error={formik.touched.guestName && Boolean(formik.errors.guestName)}
                                helperText={formik.touched.guestName && formik.errors.guestName}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Person sx={{ color: 'var(--text-muted)' }} />
                                        </InputAdornment>
                                    ),
                                }}

                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                name="contactNumber"
                                label="Contact Number"
                                value={formik.values.contactNumber}
                                onChange={formik.handleChange}
                                error={formik.touched.contactNumber && Boolean(formik.errors.contactNumber)}
                                helperText={formik.touched.contactNumber && formik.errors.contactNumber}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Phone sx={{ color: 'var(--text-muted)' }} />
                                        </InputAdornment>
                                    ),
                                }}

                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                name="address"
                                label="Home Address"
                                multiline
                                rows={2}
                                value={formik.values.address}
                                onChange={formik.handleChange}
                                error={formik.touched.address && Boolean(formik.errors.address)}
                                helperText={formik.touched.address && formik.errors.address}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Home sx={{ color: 'var(--text-muted)', mt: 1 }} />
                                        </InputAdornment>
                                    ),
                                }}

                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                select
                                fullWidth
                                name="roomId"
                                label="Select Available Room"
                                value={formik.values.roomId}
                                onChange={formik.handleChange}
                                error={formik.touched.roomId && Boolean(formik.errors.roomId)}
                                helperText={formik.touched.roomId && formik.errors.roomId}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Hotel sx={{ color: 'var(--text-muted)' }} />
                                        </InputAdornment>
                                    ),
                                }}
                            >
                                {rooms.map((room) => (
                                    <MenuItem key={room.id} value={room.id}>
                                        {room.type} - Room {room.roomNumber} (${room.pricePerNight}/night)
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                name="checkIn"
                                label="Check-in Date"
                                type="date"
                                InputLabelProps={{ shrink: true }}
                                value={formik.values.checkIn}
                                onChange={formik.handleChange}
                                error={formik.touched.checkIn && Boolean(formik.errors.checkIn)}
                                helperText={formik.touched.checkIn && formik.errors.checkIn}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <CalendarToday sx={{ color: 'var(--text-muted)' }} />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                name="checkOut"
                                label="Check-out Date"
                                type="date"
                                InputLabelProps={{ shrink: true }}
                                value={formik.values.checkOut}
                                onChange={formik.handleChange}
                                error={formik.touched.checkOut && Boolean(formik.errors.checkOut)}
                                helperText={formik.touched.checkOut && formik.errors.checkOut}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <DateRange sx={{ color: 'var(--text-muted)' }} />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                    </Grid>

                    <Box sx={{ display: 'flex', gap: 2, mt: 6 }}>
                        <Button
                            type="submit"
                            variant="contained"
                            className="premium-btn"
                            fullWidth
                            disabled={loading}
                            sx={{ py: 2 }}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : 'Confirm Reservation'}
                        </Button>
                        <Button
                            variant="outlined"
                            fullWidth
                            onClick={() => navigate('/dashboard')}
                            sx={{ borderRadius: '12px', border: '1px solid var(--glass-border)', color: 'var(--text-main)', textTransform: 'none' }}
                        >
                            Cancel
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default AddReservation;
