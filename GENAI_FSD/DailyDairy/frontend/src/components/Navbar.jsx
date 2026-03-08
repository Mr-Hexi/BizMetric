import { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);

    return (
        <nav className="sticky top-0 z-50 glass shadow-sm">
            <div className="container flex items-center justify-between mx-auto px-6 py-4">
                <Link to="/" className="flex items-center gap-2 text-2xl font-extrabold text-blue-700 tracking-tight transition-transform hover:scale-105">
                    <span className="text-3xl">🥛</span> DailyDairy
                </Link>
                <div className="flex items-center space-x-8 font-medium">
                    <Link to="/" className="text-gray-600 hover:text-blue-600 transition-colors">Home</Link>
                    {user ? (
                        <>
                            <Link to="/profile" className="text-gray-600 hover:text-blue-600 transition-colors">Profile</Link>
                            {user.is_staff && (
                                <Link to="/admin-dashboard" className="px-3 py-1 text-sm font-bold text-yellow-800 bg-yellow-100 rounded-full hover:bg-yellow-200 transition-colors">
                                    Admin View
                                </Link>
                            )}
                            <button onClick={logout} className="px-4 py-2 text-sm font-bold text-white transition-colors bg-red-500 rounded-full shadow-sm hover:bg-red-600 hover:shadow-md">
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-gray-600 hover:text-blue-600 transition-colors">Login</Link>
                            <Link to="/register" className="px-5 py-2 text-sm font-bold text-white transition-all bg-blue-600 rounded-full shadow-md hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5">
                                Get Started
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
