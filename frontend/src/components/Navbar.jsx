import { AppBar, Toolbar, Typography, Button, Box, Container, Chip, Avatar } from '@mui/material';
import { NavLink, useNavigate } from 'react-router-dom';
import { AdminPanelSettings, Badge, Logout, Dashboard as DashboardIcon, AddCircleOutline, HelpOutline } from '@mui/icons-material';
import axios from 'axios';

const Navbar = ({ user, setUser }) => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await axios.post('/api/logout');
        } catch (error) {
            console.error('Logout failed:', error);
        }
        localStorage.removeItem('user');
        setUser(null);
        navigate('/login');
    };

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

                        {user.role === 'ADMIN' && (
                            <Button
                                color="inherit"
                                component={NavLink}
                                to="/admin"
                                startIcon={<AdminPanelSettings />}
                                sx={{ fontWeight: 500 }}
                            >
                                Admin
                            </Button>
                        )}

                        <Button
                            color="inherit"
                            component={NavLink}
                            to="/help"
                            startIcon={<HelpOutline />}
                            sx={{ fontWeight: 500 }}
                        >
                            Help
                        </Button>

                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            background: 'rgba(255, 255, 255, 0.05)',
                            px: 2,
                            py: 0.5,
                            borderRadius: '50px',
                            gap: 1,
                            border: '1px solid rgba(255, 255, 255, 0.1)'
                        }}>
                            {user.role === 'ADMIN' ? (
                                <AdminPanelSettings sx={{ color: '#f48fb1' }} />
                            ) : (
                                <Badge sx={{ color: '#90caf9' }} />
                            )}
                            <Typography variant="body2" sx={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                                {user.username}
                            </Typography>
                            <Chip
                                label={user.role}
                                size="small"
                                sx={{
                                    height: '24px',
                                    fontSize: '0.7rem',
                                    background: user.role === 'ADMIN' ? 'rgba(244, 143, 177, 0.2)' : 'rgba(144, 202, 249, 0.2)',
                                    color: user.role === 'ADMIN' ? '#f48fb1' : '#90caf9',
                                    fontWeight: 700
                                }}
                            />
                        </Box>

                        <Button
                            variant="outlined"
                            color="error"
                            onClick={handleLogout}
                            startIcon={<Logout />}
                            sx={{ borderRadius: '10px', textTransform: 'none' }}
                        >
                            Logout
                        </Button>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Navbar;
