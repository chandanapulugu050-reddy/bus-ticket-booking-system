import React, { useContext, useEffect } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
    LayoutDashboard, Bus, Route as RouteIcon, Map, Users, Ticket, 
    Settings, LogOut, FileText, BarChart3, CreditCard, CalendarClock
} from 'lucide-react';

const AdminLayout = () => {
    const { user, loading, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!loading && (!user || user.role !== 'admin')) {
            navigate('/admin/login', { replace: true });
        }
    }, [user, loading, navigate]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-xl font-bold">Verifying Admin Access...</div>;
    if (!user || user.role !== 'admin') return null; // Prevent flash of content before redirect

    const sidebarNav = [
        { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Buses', path: '/admin/buses', icon: Bus },
        { name: 'Routes', path: '/admin/routes', icon: RouteIcon },
        { name: 'Schedules', path: '/admin/schedules', icon: CalendarClock },
        { name: 'Seats', path: '/admin/seats', icon: Ticket },
        { name: 'Bookings', path: '/admin/bookings', icon: Ticket },
        { name: 'Users', path: '/admin/users', icon: Users },
        { name: 'Coupons', path: '/admin/coupons', icon: FileText },
        { name: 'Reviews', path: '/admin/reviews', icon: FileText },
        { name: 'Refunds', path: '/admin/refunds', icon: CreditCard },
        { name: 'Reports', path: '/admin/reports', icon: BarChart3 }
    ];

    return (
        <div className="flex min-h-screen bg-gray-50 font-sans">
            {/* Sidebar */}
            <div className="w-64 bg-[#0B2046] text-white flex flex-col fixed h-full shadow-2xl z-20">
                <div className="p-6 border-b border-white/10">
                    <h2 className="text-2xl font-black text-white flex items-center tracking-wide">
                        BUSBOOKER <span className="text-[#F97316] ml-2 text-sm uppercase px-2 py-0.5 rounded bg-white/10">Admin</span>
                    </h2>
                </div>
                
                <div className="flex-1 overflow-y-auto py-6 flex flex-col gap-2 px-4 custom-scrollbar">
                    {sidebarNav.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname.startsWith(item.path);
                        
                        return (
                            <Link 
                                key={item.name}
                                to={item.path}
                                className={`flex items-center px-4 py-3 rounded-xl transition font-bold ${
                                    isActive 
                                    ? 'bg-[#F97316] text-white shadow-md' 
                                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                                }`}
                            >
                                <Icon className="h-5 w-5 mr-3" /> {item.name}
                            </Link>
                        );
                    })}
                </div>
                
                <div className="p-4 border-t border-white/10 bg-black/20">
                    <div className="flex items-center mb-4 px-2">
                        <div className="h-10 w-10 bg-blue-500/20 text-blue-200 rounded-full flex items-center justify-center font-black mr-3">
                            {user.name.charAt(0)}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold text-white truncate">{user.name}</p>
                            <p className="text-xs text-gray-400 truncate">{user.email}</p>
                        </div>
                    </div>
                    
                    <button 
                        onClick={handleLogout}
                        className="flex items-center px-4 py-3 rounded-xl transition font-bold text-red-400 hover:bg-red-500/10 hover:text-red-300 w-full"
                    >
                        <LogOut className="h-5 w-5 mr-3" /> Exit Portal
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 ml-64 p-8 overflow-y-auto min-h-screen">
                {/* Header padding or breadcrumbs could go here */}
                <Outlet />
            </div>
            
            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent; 
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1); 
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.2); 
                }
            `}</style>
        </div>
    );
};

export default AdminLayout;
