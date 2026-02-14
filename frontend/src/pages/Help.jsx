import { Container, Typography, Paper, Accordion, AccordionSummary, AccordionDetails, Box } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HelpCenterIcon from '@mui/icons-material/HelpCenter';

const Help = () => {
    return (
        <Container maxWidth="md" sx={{ mt: 10, pb: 8 }} className="fade-in">
            <Box sx={{ textAlign: 'center', mb: 6 }}>
                <HelpCenterIcon sx={{ fontSize: 60, color: 'var(--primary)', mb: 2 }} />
                <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
                    How can we help?
                </Typography>
                <Typography variant="body1" sx={{ color: 'var(--text-muted)' }}>
                    Everything you need to know about the Ocean View Resort System.
                </Typography>
            </Box>

            <Paper className="glass-panel" sx={{ p: 2, background: 'var(--glass-bg)' }}>
                <Accordion sx={{ background: 'transparent', boxShadow: 'none', '&:before': { display: 'none' } }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'var(--primary)' }} />}>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>Secure Login Process</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography sx={{ color: 'var(--text-muted)' }}>
                            Access the system using your corporate credentials. Authorized roles are: <br /><br />
                            • <strong>ADMIN</strong>: Full access to users, rooms, and reports.<br />
                            • <strong>STAFF</strong>: Access to bookings and billing operations.
                        </Typography>
                    </AccordionDetails>
                </Accordion>

                <Accordion sx={{ background: 'transparent', boxShadow: 'none', '&:before': { display: 'none' } }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'var(--primary)' }} />}>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>Guest Reservation Workflow</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography sx={{ color: 'var(--text-muted)' }}>
                            1. Navigate to <strong>New Booking</strong>.<br />
                            2. Verify guest ID and contact information.<br />
                            3. Select an available room from the dynamic list.<br />
                            4. Confirm dates. The system automatically calculates taxes and total amounts.
                        </Typography>
                    </AccordionDetails>
                </Accordion>

                <Accordion sx={{ background: 'transparent', boxShadow: 'none', '&:before': { display: 'none' } }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'var(--primary)' }} />}>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>Billing & Invoicing</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography sx={{ color: 'var(--text-muted)' }}>
                            Bill generation is automated. You can view the final invoice from the <strong>Dashboard</strong> by clicking the print icon.
                            The system supports printing to connected printers or saving as a PDF for digital guest records.
                        </Typography>
                    </AccordionDetails>
                </Accordion>

                <Accordion sx={{ background: 'transparent', boxShadow: 'none', '&:before': { display: 'none' } }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'var(--primary)' }} />}>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>Technical Support</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography sx={{ color: 'var(--text-muted)' }}>
                            If you encounter "Database Connection" errors, please ensure the MySQL service is active. For session timeouts, simply re-login to refresh your credentials.
                        </Typography>
                    </AccordionDetails>
                </Accordion>
            </Paper>
        </Container>
    );
};

export default Help;
