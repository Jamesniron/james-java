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

                        {(() => {
                            try {
                                const userStr = localStorage.getItem('user');
                                const user = userStr ? JSON.parse(userStr) : null;
                                return user ? (
                                    <Box sx={{ display: 'flex', alignItems: 'center', ml: 2, gap: 1 }}>
                                        <Chip
                                            avatar={<Avatar sx={{ bgcolor: 'primary.main' }}>{user.username ? user.username.charAt(0).toUpperCase() : 'U'}</Avatar>}
                                            label={user.username || 'User'}
                                            variant="outlined"
                                            sx={{ color: 'white' }}
                                        />
                                        <Button
                                            color="error"
                                            onClick={async () => {
                                                try {
                                                    await axios.post('/api/logout');
                                                    localStorage.removeItem('user');
                                                    window.location.href = '/login';
                                                } catch (err) {
                                                    console.error('Logout failed', err);
                                                    localStorage.removeItem('user');
                                                    window.location.href = '/login';
                                                }
                                            }}
                                            startIcon={<Logout />}
                                            sx={{ fontWeight: 500, ml: 1 }}
                                        >
                                            Logout
                                        </Button>
                                    </Box>
                                ) : null;
                            } catch (e) {
                                return null;
                            }
                        })()}
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Navbar;
