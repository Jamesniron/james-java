import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material';
import { NavLink, useNavigate } from 'react-router-dom';

const Navbar = ({ user, setUser }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
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
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button color="inherit" component={NavLink} to="/dashboard" sx={{ fontWeight: 500 }}>Dashboard</Button>
                        <Button color="inherit" component={NavLink} to="/reservations/add" sx={{ fontWeight: 500 }}>New Booking</Button>
                        {user.role === 'ADMIN' && (
                            <Button color="inherit" component={NavLink} to="/admin" sx={{ fontWeight: 500 }}>Admin</Button>
                        )}
                        <Button color="inherit" component={NavLink} to="/help" sx={{ fontWeight: 500 }}>Help</Button>
                        <Button
                            variant="outlined"
                            color="error"
                            onClick={handleLogout}
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
