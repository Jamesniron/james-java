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
import AdminDashboard from './pages/AdminDashboard';
import { useState, useEffect } from 'react';
import axios from 'axios';

// Configure Axios
axios.defaults.withCredentials = true;

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
        // Setup Axios Interceptor for 401s
        const interceptor = axios.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response && error.response.status === 401) {
                    // Session expired or unauthorized
                    localStorage.removeItem('user');
                    setUser(null);
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axios.interceptors.response.eject(interceptor);
        };
    }, []);

    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <Router>
                {/* Navbar is rendered inside AdminDashboard for admin, so we hide it here for ADMIN users */}
                {user && user.role !== 'ADMIN' && <Navbar />}
                <Routes>
                    <Route
                        path="/login"
                        element={!user ? <Login setUser={setUser} /> : <Navigate to={user.role === 'ADMIN' ? "/admin" : "/dashboard"} />}
                    />
                    <Route
                        path="/"
                        element={
                            user ? (
                                user.role === 'ADMIN' ? <Navigate to="/admin" /> : <Navigate to="/dashboard" />
                            ) : (
                                <Navigate to="/login" />
                            )
                        }
                    />
                    <Route
                        path="/dashboard"
                        element={user ? (user.role === 'ADMIN' ? <Navigate to="/admin" /> : <Dashboard />) : <Navigate to="/login" />}
                    />
                    <Route
                        path="/admin"
                        element={user && user.role === 'ADMIN' ? <AdminDashboard /> : <Navigate to={user ? "/dashboard" : "/login"} />}
                    />
                    <Route
                        path="/reservations/add"
                        element={user ? <AddReservation /> : <Navigate to="/login" />}
                    />
                    <Route
                        path="/reservations/edit/:id"
                        element={user ? <AddReservation /> : <Navigate to="/login" />}
                    />
                    <Route
                        path="/reservations/:id"
                        element={user ? <ReservationDetails /> : <Navigate to="/login" />}
                    />
                    <Route
                        path="/billing"
                        element={user ? <Dashboard /> : <Navigate to="/login" />}
                    />
                    <Route
                        path="/billing/:id"
                        element={user ? <Billing /> : <Navigate to="/login" />}
                    />
                    <Route
                        path="/help"
                        element={user ? <Help /> : <Navigate to="/login" />}
                    />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Router>
        </ThemeProvider>
    );
}

export default App;
