import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Navigation from './navigation/Navigation';
import { useAuth } from '../context/AuthContext';
import { 
    HomeIcon, 
    UsersIcon, 
    AcademicCapIcon, 
    XMarkIcon,
    BuildingLibraryIcon,
    UserGroupIcon
} from '@heroicons/react/24/outline';

const Layout = ({ children }) => {
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { signOut } = useAuth();

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const handleLogout = () => {
        signOut();
    };

    const mobileMenuItems = [
        { 
            name: 'Home', 
            path: '/home', 
            icon: <HomeIcon className="w-6 h-6" /> 
        },
        { 
            name: 'Membros', 
            path: '/members', 
            icon: <UsersIcon className="w-6 h-6" /> 
        },
        { 
            name: 'Ministérios', 
            path: '/ministries', 
            icon: <BuildingLibraryIcon className="w-6 h-6" /> 
        },
        { 
            name: 'Cursos', 
            path: '/courses', 
            icon: <AcademicCapIcon className="w-6 h-6" /> 
        },
        { 
            name: 'Usuários', 
            path: '/users', 
            icon: <UserGroupIcon className="w-6 h-6" /> 
        }
    ];

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Navigation */}
            {/* <Navigation 
                isMobileMenuOpen={isMobileMenuOpen}
                toggleMobileMenu={toggleMobileMenu}
            /> */}

            {/* Main Content Area */}
            <main 
                className={`
                    flex-grow 
                    transition-all 
                    duration-300 
                    ease-in-out
                    lg:ml-64 
                    md:ml-16 
                    ml-0 
                    p-4 
                    sm:p-6 
                    lg:p-8
                    relative
                `}
            >
                <div className="w-full max-w-7xl mx-auto">
                    {/* Header */}
                    <header 
                        className="
                            bg-white 
                            shadow-sm 
                            rounded-lg 
                            mb-6 
                            p-4 
                            flex 
                            items-center 
                            justify-between
                        "
                    >
                        <div className="flex items-center space-x-4">
                            {/* Page Title */}
                            <h2 className="text-xl sm:text-2xl font-bold text-sky-800">
                                {(() => {
                                    const pathnames = {
                                        '/dashboard': 'Dashboard',
                                        '/members': 'Membros',
                                        '/ministries': 'Ministérios',
                                        '/users': 'Usuários',
                                        '/courses': 'Cursos'
                                    };
                                    return pathnames[location.pathname] || 'Página Atual';
                                })()}
                            </h2>
                        </div>

                        {/* User Notifications and Actions */}
                        <div className="flex items-center space-x-4">
                            {/* Notification Indicator */}
                            <span className="relative">
                                <svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    className="h-6 w-6 text-gray-600 hover:text-gray-900" 
                                    fill="none" 
                                    viewBox="0 0 24 24" 
                                    stroke="currentColor"
                                >
                                    <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth={2} 
                                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" 
                                    />
                                </svg>
                                <span 
                                    className="
                                        absolute 
                                        top-0 
                                        right-0 
                                        block 
                                        h-2 
                                        w-2 
                                        rounded-full 
                                        bg-rose-300 
                                        ring-2 
                                        ring-white
                                    "
                                />
                            </span>

                            {/* Logout Button */}
                            <button
                                onClick={handleLogout}
                                className="flex items-center p-2 transition-colors text-sky-600 hover:text-sky-700"
                            >
                                <span className="w-5 h-5 mr-3 flex items-center justify-center">
                                    ❌
                                </span>
                                Logout
                            </button>
                        </div>
                    </header>

                    {/* Page Content */}
                    <div 
                        className="
                            bg-white 
                            shadow-sm 
                            rounded-lg 
                            p-4 
                            sm:p-6 
                            lg:p-8
                        "
                    >
                        {children}
                    </div>
                </div>

                {/* Floating Mobile Menu Button */}
                <div 
                    className="
                        fixed 
                        bottom-6 
                        right-6 
                        z-50 
                        
                    "
                >
                    <button 
                        onClick={toggleMobileMenu}
                        className="
                            w-16 
                            h-16 
                            bg-sky-500 
                            text-white 
                            rounded-full 
                            shadow-2xl 
                            flex 
                            items-center 
                            justify-center 
                            hover:bg-sky-600 
                            transition-all 
                            duration-300 
                            focus:outline-none
                            transform 
                            active:scale-95
                        "
                    >
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            className="h-8 w-8" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M4 6h16M4 12h16M4 18h16" 
                            />
                        </svg>
                    </button>
                </div>
            </main>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div 
                    className="
                        fixed 
                        inset-0 
                        bg-black 
                        bg-opacity-50 
                        z-50
                        flex 
                        items-center 
                        justify-center
                    " 
                    onClick={toggleMobileMenu}
                >
                    <div 
                        className="
                            bg-white 
                            w-11/12 
                            max-w-md 
                            rounded-2xl 
                            shadow-2xl 
                            p-6 
                            relative
                            max-h-[80vh]
                            overflow-auto
                        "
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button 
                            onClick={toggleMobileMenu}
                            className="
                                absolute 
                                top-4 
                                right-4 
                                text-gray-600 
                                hover:text-gray-900
                                focus:outline-none
                            "
                        >
                            <XMarkIcon className="w-6 h-6" />
                        </button>

                        {/* Menu Title */}
                        <h2 className="text-2xl font-bold text-sky-800 mb-6 text-center">
                            Menu
                        </h2>

                        {/* Menu Items */}
                        <div className="space-y-4">
                            {mobileMenuItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={toggleMobileMenu}
                                    className="
                                        flex 
                                        items-center 
                                        space-x-4 
                                        p-4 
                                        bg-sky-50 
                                        rounded-lg 
                                        hover:bg-sky-100 
                                        transition-colors
                                        group
                                    "
                                >
                                    <span 
                                        className="
                                            text-sky-600 
                                            group-hover:text-sky-800
                                        "
                                    >
                                        {item.icon}
                                    </span>
                                    <span 
                                        className="
                                            text-lg 
                                            font-medium 
                                            text-sky-800 
                                            group-hover:text-sky-900
                                        "
                                    >
                                        {item.name}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Layout;
