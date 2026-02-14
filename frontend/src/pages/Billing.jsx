import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Paper, Divider, Button, Box, Grid, IconButton } from '@mui/material';
import { useReactToPrint } from 'react-to-print';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PrintIcon from '@mui/icons-material/Print';
import axios from 'axios';

const Billing = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const componentRef = useRef();
    const [bill, setBill] = useState(null);

    useEffect(() => {
        fetchBill();
    }, [id]);

    const fetchBill = async () => {
        try {
            const response = await axios.get(`/api/billing/${id}`);
            setBill(response.data.data);
        } catch (error) {
            console.error('Failed to fetch bill', error);
        }
    };

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    if (!bill) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
                <Typography variant="h5" sx={{ color: 'var(--text-muted)' }}>Preparing Invoice...</Typography>
            </Box>
        );
    }

    return (
        <Container maxWidth="md" sx={{ mt: 10, pb: 8 }} className="fade-in">
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 2 }}>
                <IconButton onClick={() => navigate('/dashboard')} sx={{ color: 'var(--text-main)' }}>
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>Invoice Details</Typography>
            </Box>

            <Paper ref={componentRef} sx={{
                p: { xs: 4, md: 8 },
                background: '#fff',
                color: '#000',
                borderRadius: '0px', // Standard for printing
                boxShadow: 'none'
            }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 6 }}>
                    <Box>
                        <Typography variant="h4" sx={{ fontWeight: 800, color: '#6366f1' }}>
                            OCEAN VIEW
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.7 }}>Resort & Spa • Galle</Typography>
                    </Box>
                    <Box textAlign="right">
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>INVOICE</Typography>
                        <Typography variant="body2">No: #INV-{bill.id}</Typography>
                        <Typography variant="body2">Date: {new Date().toLocaleDateString()}</Typography>
                    </Box>
                </Box>

                <Grid container spacing={4} sx={{ mb: 6 }}>
                    <Grid item xs={6}>
                        <Typography variant="caption" sx={{ textTransform: 'uppercase', fontWeight: 700, color: '#666' }}>Bill To</Typography>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>{bill.guestName}</Typography>
                        <Typography variant="body2">{bill.address}</Typography>
                        <Typography variant="body2">{bill.contactNumber}</Typography>
                    </Grid>
                    <Grid item xs={6} textAlign="right">
                        <Typography variant="caption" sx={{ textTransform: 'uppercase', fontWeight: 700, color: '#666' }}>Resort Contact</Typography>
                        <Typography variant="body2">contact@oceanviewresort.com</Typography>
                        <Typography variant="body2">+94 91 123 4567</Typography>
                    </Grid>
                </Grid>

                <Box sx={{ mb: 6 }}>
                    <Box sx={{ display: 'flex', pb: 1, borderBottom: '2px solid #eee' }}>
                        <Typography sx={{ flex: 1, fontWeight: 700 }}>Item Description</Typography>
                        <Typography sx={{ width: 100, textAlign: 'right', fontWeight: 700 }}>Nights</Typography>
                        <Typography sx={{ width: 120, textAlign: 'right', fontWeight: 700 }}>Amount</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', py: 3, borderBottom: '1px solid #eee' }}>
                        <Box sx={{ flex: 1 }}>
                            <Typography sx={{ fontWeight: 600 }}>Room Stay ({bill.roomType})</Typography>
                            <Typography variant="caption" color="textSecondary">
                                Room {bill.roomNumber} • {bill.checkIn} to {bill.checkOut}
                            </Typography>
                        </Box>
                        <Typography sx={{ width: 100, textAlign: 'right' }}>{bill.totalNights}</Typography>
                        <Typography sx={{ width: 120, textAlign: 'right' }}>${bill.totalAmount}</Typography>
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <Box sx={{ width: 250 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography>Subtotal:</Typography>
                            <Typography>${bill.totalAmount}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography>Service Tax (Included):</Typography>
                            <Typography>10%</Typography>
                        </Box>
                        <Divider sx={{ my: 2 }} />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="h5" sx={{ fontWeight: 800 }}>Total Due:</Typography>
                            <Typography variant="h5" sx={{ fontWeight: 800 }}>${bill.totalAmount}</Typography>
                        </Box>
                    </Box>
                </Box>

                <Box sx={{ mt: 10, textAlign: 'center' }}>
                    <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#888' }}>
                        * This is a computer generated invoice and does not require a signature.
                    </Typography>
                    <Typography variant="h6" sx={{ mt: 2, fontWeight: 700, letterSpacing: 2, color: '#ccc' }}>
                        THANK YOU
                    </Typography>
                </Box>
            </Paper>

            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                <Button
                    className="premium-btn"
                    variant="contained"
                    startIcon={<PrintIcon />}
                    onClick={handlePrint}
                    sx={{ px: 6, py: 1.5 }}
                >
                    Print or Save Invoice
                </Button>
            </Box>
        </Container>
    );
};

export default Billing;
