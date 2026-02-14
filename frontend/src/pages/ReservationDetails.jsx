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
            const response = await axios.get(`http://localhost:8080/oceanview/api/billing/${id}`);
            setReservation(response.data.data);
        } catch (error) {
            console.error('Failed to fetch reservation', error);
        }
    };

    if (!reservation) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Reservation Details #{reservation.id}
                </Typography>
                <Divider sx={{ my: 2 }} />

                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <ListItemText primary="Guest Name" secondary={reservation.guestName} />
                        <ListItemText primary="Address" secondary={reservation.address} />
                        <ListItemText primary="Contact Number" secondary={reservation.contactNumber} />
                    </Grid>
                    <Grid item xs={6}>
                        <ListItemText primary="Room Details" secondary={`Room ${reservation.roomNumber} - ${reservation.roomType}`} />
                        <ListItemText primary="Dates" secondary={`In: ${reservation.checkIn} | Out: ${reservation.checkOut}`} />
                        <ListItemText primary="Total Nights" secondary={`${reservation.totalNights} Nights`} />
                        <ListItemText primary="Status" secondary={reservation.status} />
                    </Grid>
                </Grid>

                <Divider sx={{ my: 2 }} />
                <Typography variant="h6">
                    Total Amount: ${reservation.totalAmount}
                </Typography>

                <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                    <Button variant="outlined" onClick={() => navigate('/dashboard')}>Back</Button>
                    <Button variant="contained" color="secondary" onClick={() => navigate(`/billing/${reservation.id}`)}>
                        Check Out / Bill
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default ReservationDetails;
