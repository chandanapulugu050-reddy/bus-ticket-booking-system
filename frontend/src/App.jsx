import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import SearchResults from './pages/SearchResults';
import SeatSelection from './pages/SeatSelection';
import PassengerDetails from './pages/PassengerDetails';
import BookingSummary from './pages/BookingSummary';
import TicketConfirmation from './pages/TicketConfirmation';
import MyBookings from './pages/MyBookings';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AboutUs from './pages/AboutUs';
import Dashboard from './pages/Dashboard';
import Offers from './pages/Offers';
import LiveTracking from './pages/LiveTracking';
import Favorites from './pages/Favorites';
import AdminLogin from './pages/AdminLogin';
import AdminLayout from './pages/AdminLayout';
import AdminDashboard from './pages/AdminDashboard';
import AdminBuses from './pages/AdminBuses';
import AdminRoutes from './pages/AdminRoutes';
import AdminUsers from './pages/AdminUsers';
import AdminBookings from './pages/AdminBookings';
import AdminSchedules from './pages/AdminSchedules';
import AdminSeats from './pages/AdminSeats';
import AdminCoupons from './pages/AdminCoupons';
import AdminReviews from './pages/AdminReviews';
import AdminRefunds from './pages/AdminRefunds';
import AdminReports from './pages/AdminReports';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = React.useContext(AuthContext);
    
    if (loading) return <div>Loading...</div>;
    if (!user) return <Navigate to="/login" replace />;
    
    return children;
};

function App() {
  return (
    <AuthProvider>
        <BrowserRouter>
            <Routes>
                {/* User Routes with Navbar */}
                <Route path="/*" element={
                    <div className="min-h-screen flex flex-col bg-gray-50">
                        <Navbar />
                        <main className="flex-grow container mx-auto px-4 py-8">
                            <Routes>
                                <Route path="/" element={<Landing />} />
                                <Route path="/about" element={<AboutUs />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/register" element={<Register />} />
                                <Route path="/search-results" element={<SearchResults />} />
                                <Route path="/offers" element={<Offers />} />
                                <Route path="/track" element={<LiveTracking />} />
                                <Route path="/bus/:id/seat-selection" element={<SeatSelection />} />
                                <Route path="/passenger-details" element={<PassengerDetails />} />
                                <Route path="/booking-summary" element={<BookingSummary />} />
                                <Route path="/ticket-confirmation/:pnr" element={<TicketConfirmation />} />
                                <Route path="/my-bookings" element={<MyBookings />} />
                                <Route path="/favorites" element={
                                    <ProtectedRoute>
                                        <Favorites />
                                    </ProtectedRoute>
                                } />
                                <Route path="/dashboard" element={
                                    <ProtectedRoute>
                                        <Dashboard />
                                    </ProtectedRoute>
                                } />
                            </Routes>
                        </main>
                        <Footer />
                    </div>
                } />
                
                {/* Admin Routes OUTSIDE the main layout (no standard Navbar) */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<Navigate to="/admin/dashboard" replace />} />
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="buses" element={<AdminBuses />} />
                    <Route path="routes" element={<AdminRoutes />} />
                    <Route path="users" element={<AdminUsers />} />
                    <Route path="bookings" element={<AdminBookings />} />
                    <Route path="schedules" element={<AdminSchedules />} />
                    <Route path="seats" element={<AdminSeats />} />
                    <Route path="coupons" element={<AdminCoupons />} />
                    <Route path="reviews" element={<AdminReviews />} />
                    <Route path="refunds" element={<AdminRefunds />} />
                    <Route path="reports" element={<AdminReports />} />
                </Route>
            </Routes>
        </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
