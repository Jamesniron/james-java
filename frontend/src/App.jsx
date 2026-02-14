import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AddReservation from './pages/AddReservation';
import ReservationDetails from './pages/ReservationDetails';
import Billing from './pages/Billing';
import Help from './pages/Help';
import Navbar from './components/Navbar';
import { useState, useEffect } from 'react';

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#90caf9',
        },
        secondary: {
            main: '#f48fb1',
        },
        background: {
            default: '#121212',
            paper: '#1e1e1e',
        },
    },
});

function App() {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    useEffect(() => {
        // Optional: validate token with backend here if needed
    }, []);

    const ProtectedRoute = ({ children }) => {
        if (!user) {
            return <Navigate to="/login" replace />;
        }
        return children;
    };

    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <Router>
                {user && <Navbar user={user} setUser={setUser} />}
                <Routes>
                    <Route path="/login" element={<Login setUser={setUser} />} />
                    <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
                    <Route path="/dashboard" element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    } />
                    <Route path="/reservations/add" element={
                        <ProtectedRoute>
                            <AddReservation />
                        </ProtectedRoute>
                    } />
                    <Route path="/reservations/:id" element={
                        <ProtectedRoute>
                            <ReservationDetails />
                        </ProtectedRoute>
                    } />
                    <Route path="/billing/:id" element={
                        <ProtectedRoute>
                            <Billing />
                        </ProtectedRoute>
                    } />
                    <Route path="/help" element={
                        <ProtectedRoute>
                            <Help />
                        </ProtectedRoute>
                    } />
                </Routes>
            </Router>
        </ThemeProvider>
    );
}

export default App;
