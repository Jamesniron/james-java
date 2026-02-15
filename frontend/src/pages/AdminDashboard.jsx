import React, { useEffect, useState } from 'react';
import { Box, Typography, Container, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, LinearProgress } from '@mui/material';
import axios from 'axios';
import Navbar from '../components/Navbar';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [auditLogs, setAuditLogs] = useState([]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get('/api/admin/stats');
                if (response.data.success) {
                    setStats(response.data.data);
                }
            } catch (error) {
                console.error('Error fetching admin stats:', error);
            }
        };

        const fetchAuditLogs = async () => {
            try {
                const response = await axios.get('/api/audit');
                if (response.data.success) {
                    setAuditLogs(response.data.data);
                }
            } catch (error) {
                console.error('Error fetching audit logs:', error);
            }
        };

        fetchStats();
        fetchAuditLogs();
    }, []);

    // Simple CSS Bar Chart Component
    const SimpleBarChart = ({ data }) => {
        if (!data || data.length === 0) return <Typography>No data available</Typography>;

        const maxRevenue = Math.max(...data.map(d => d.revenue));

        return (
            <Box sx={{ display: 'flex', alignItems: 'flex-end', height: '300px', gap: 2, pt: 4, pb: 2, overflowX: 'auto' }}>
                {data.map((d, index) => (
                    <Box key={index} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, minWidth: '40px' }}>
                        <TooltipBar
                            height={(d.revenue / maxRevenue) * 100}
                            color={index % 2 === 0 ? '#8b5cf6' : '#6366f1'}
                            value={d.revenue}
                        />
                        <Typography variant="caption" sx={{ color: 'gray', mt: 1 }}>{d.month.substring(0, 3)}</Typography>
                    </Box>
                ))}
            </Box>
        );
    };

    const TooltipBar = ({ height, color, value }) => (
        <Box
            sx={{
                width: '100%',
                height: `${height}%`,
                bgcolor: color,
                borderRadius: '4px 4px 0 0',
                transition: 'all 0.3s ease',
                position: 'relative',
                '&:hover': { opacity: 0.8 },
                '&:hover .tooltip': { opacity: 1, visibility: 'visible' }
            }}
        >
            <Box
                className="tooltip"
                sx={{
                    position: 'absolute',
                    top: '-30px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    bgcolor: '#1e293b',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    opacity: 0,
                    visibility: 'hidden',
                    transition: 'all 0.2s',
                    whiteSpace: 'nowrap',
                    zIndex: 10
                }}
            >
                ${value.toLocaleString()}
            </Box>
        </Box>
    );

    return (
        <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', pb: 4 }}>
            <Navbar />
            <Container maxWidth="xl" sx={{ mt: 4 }}>
                <Typography variant="h4" sx={{ color: 'white', mb: 4, fontWeight: 'bold' }}>
                    Admin Dashboard
                </Typography>

                {stats && (
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                        <Grid item xs={12} md={3}>
                            <Paper sx={{ p: 3, bgcolor: 'rgba(255,255,255,0.05)', color: 'white', backdropFilter: 'blur(10px)' }}>
                                <Typography variant="subtitle2" color="gray">Total Revenue</Typography>
                                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#10b981' }}>
                                    ${stats.totalRevenue ? stats.totalRevenue.toLocaleString() : '0'}
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Paper sx={{ p: 3, bgcolor: 'rgba(255,255,255,0.05)', color: 'white', backdropFilter: 'blur(10px)' }}>
                                <Typography variant="subtitle2" color="gray">Total Bookings</Typography>
                                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#3b82f6' }}>
                                    {stats.totalBookings}
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Paper sx={{ p: 3, bgcolor: 'rgba(255,255,255,0.05)', color: 'white', backdropFilter: 'blur(10px)' }}>
                                <Typography variant="subtitle2" color="gray">Confirmed</Typography>
                                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#f59e0b' }}>
                                    {stats.confirmedBookings}
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Paper sx={{ p: 3, bgcolor: 'rgba(255,255,255,0.05)', color: 'white', backdropFilter: 'blur(10px)' }}>
                                <Typography variant="subtitle2" color="gray">Checked Out</Typography>
                                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#8b5cf6' }}>
                                    {stats.checkedOutBookings}
                                </Typography>
                            </Paper>
                        </Grid>
                    </Grid>
                )}

                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} md={8}>
                        <Paper sx={{ p: 3, bgcolor: 'rgba(255,255,255,0.05)', color: 'white', height: '400px', display: 'flex', flexDirection: 'column' }}>
                            <Typography variant="h6" sx={{ mb: 2 }}>Monthly Revenue</Typography>
                            {stats && stats.revenueByMonth ? (
                                <Box sx={{ flex: 1 }}>
                                    <SimpleBarChart data={stats.revenueByMonth} />
                                </Box>
                            ) : (
                                <Typography color="gray">No revenue data available</Typography>
                            )}
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Paper sx={{ p: 3, bgcolor: 'rgba(255,255,255,0.05)', color: 'white', height: '400px' }}>
                            <Typography variant="h6" sx={{ mb: 2 }}>Booking Status</Typography>
                            {stats && (
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 4 }}>
                                    <Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                            <Typography variant="body2">Confirmed</Typography>
                                            <Typography variant="body2">{stats.confirmedBookings}</Typography>
                                        </Box>
                                        <LinearProgress variant="determinate" value={(stats.confirmedBookings / stats.totalBookings) * 100 || 0} sx={{ height: 10, borderRadius: 5, bgcolor: 'rgba(255,255,255,0.1)', '& .MuiLinearProgress-bar': { bgcolor: '#10b981' } }} />
                                    </Box>
                                    <Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                            <Typography variant="body2">Pending</Typography>
                                            <Typography variant="body2">{stats.pendingBookings}</Typography>
                                        </Box>
                                        <LinearProgress variant="determinate" value={(stats.pendingBookings / stats.totalBookings) * 100 || 0} sx={{ height: 10, borderRadius: 5, bgcolor: 'rgba(255,255,255,0.1)', '& .MuiLinearProgress-bar': { bgcolor: '#f59e0b' } }} />
                                    </Box>
                                    <Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                            <Typography variant="body2">Checked Out</Typography>
                                            <Typography variant="body2">{stats.checkedOutBookings}</Typography>
                                        </Box>
                                        <LinearProgress variant="determinate" value={(stats.checkedOutBookings / stats.totalBookings) * 100 || 0} sx={{ height: 10, borderRadius: 5, bgcolor: 'rgba(255,255,255,0.1)', '& .MuiLinearProgress-bar': { bgcolor: '#3b82f6' } }} />
                                    </Box>
                                </Box>
                            )}
                        </Paper>
                    </Grid>
                </Grid>

                <Paper sx={{ p: 3, bgcolor: 'rgba(255,255,255,0.05)', color: 'white' }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>Audit Logs (Staff Logins)</Typography>
                    <TableContainer sx={{ maxHeight: 400 }}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ bgcolor: '#1e293b', color: 'white' }}>ID</TableCell>
                                    <TableCell sx={{ bgcolor: '#1e293b', color: 'white' }}>User</TableCell>
                                    <TableCell sx={{ bgcolor: '#1e293b', color: 'white' }}>Action</TableCell>
                                    <TableCell sx={{ bgcolor: '#1e293b', color: 'white' }}>Details</TableCell>
                                    <TableCell sx={{ bgcolor: '#1e293b', color: 'white' }}>Time</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {auditLogs.map((log) => (
                                    <TableRow key={log.id} sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
                                        <TableCell sx={{ color: 'white' }}>{log.id}</TableCell>
                                        <TableCell sx={{ color: 'white' }}>
                                            <Chip
                                                label={log.username}
                                                size="small"
                                                sx={{ bgcolor: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa' }}
                                            />
                                        </TableCell>
                                        <TableCell sx={{ color: 'white' }}>
                                            <Chip
                                                label={log.action}
                                                size="small"
                                                sx={{
                                                    bgcolor: log.action === 'LOGIN' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                                                    color: log.action === 'LOGIN' ? '#34d399' : '#f87171'
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell sx={{ color: 'gray' }}>{log.details}</TableCell>
                                        <TableCell sx={{ color: 'gray' }}>
                                            {new Date(log.timestamp.year, log.timestamp.month - 1, log.timestamp.day, log.timestamp.hour, log.timestamp.minute).toLocaleString()}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </Container>
        </Box>
    );
};

export default AdminDashboard;
