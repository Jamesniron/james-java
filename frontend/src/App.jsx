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
    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <Router>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/reservations/add" element={<AddReservation />} />
                    <Route path="/reservations/edit/:id" element={<AddReservation />} />
                    <Route path="/reservations/:id" element={<ReservationDetails />} />
                    <Route path="/billing" element={<Dashboard />} />
                    <Route path="/billing/:id" element={<Billing />} />
                    <Route path="/help" element={<Help />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Router>
        </ThemeProvider>
    );
}

export default App;
