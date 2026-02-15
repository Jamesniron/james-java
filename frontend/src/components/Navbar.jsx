import { AppBar, Toolbar, Typography, Button, Box, Container, Chip, Avatar } from '@mui/material';
import { NavLink, useNavigate } from 'react-router-dom';
import { AdminPanelSettings, Badge, Logout, Dashboard as DashboardIcon, AddCircleOutline, HelpOutline, Print as PrintIcon } from '@mui/icons-material';
import axios from 'axios';

const Navbar = () => {
    const navigate = useNavigate();

    return (
        <AppBar position="sticky" elevation={0} className="glass-panel" sx={{
            background: 'rgba(15, 23, 42, 0.8)',
            mt: 2,
            mx: 'auto',
            width: '95%',
            borderRadius: '20px',
            top: '20px'
        }}>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Typography
                        variant="h5"
                        component="div"
                        className="gradient-text"
                        sx={{ flexGrow: 1, fontWeight: 700, cursor: 'pointer' }}
                        onClick={() => navigate('/')}
                    >
                        OCEAN VIEW
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Button
                            color="inherit"
                            component={NavLink}
                            to="/dashboard"
                            startIcon={<DashboardIcon />}
                            sx={{ fontWeight: 500 }}
                        >
                            Dashboard
                        </Button>
                        <Button
                            color="inherit"
                            component={NavLink}
                            to="/reservations/add"
                            startIcon={<AddCircleOutline />}
                            sx={{ fontWeight: 500 }}
                        >
                            New Booking
                        </Button>

                        <Button
                            color="inherit"
                            component={NavLink}
                            to="/billing"
                            startIcon={<PrintIcon />}
                            sx={{ fontWeight: 500 }}
                        >
                            Billing
                        </Button>
                        <Button
                            color="inherit"
                            component={NavLink}
                            to="/help"
                            startIcon={<HelpOutline />}
                            sx={{ fontWeight: 500 }}
                        >
                            Help
                        </Button>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Navbar;
