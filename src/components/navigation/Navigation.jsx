import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navigation = () => {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(true);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLogout = async () => {
        try {
            await signOut();
            navigate('/login');
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
        }
    };

    const menuItems = [
        { path: '/home', icon: '🏠', label: 'Home' },
        { path: '/members', icon: '👥', label: 'Membros' },
        { path: '/ministries', icon: '🏛️', label: 'Ministérios' },
        { path: '/users', icon: '👤', label: 'Usuários' },
        { path: '/courses', icon: '📚', label: 'Cursos' }
    ];

    return (
        <div className="flex">
            {/* Side Menu */}
            <div 
                className={`transition-all duration-300 ease-in-out ${
                    isMenuOpen ? 'w-64' : 'w-16'
                } bg-white border-r border-sky-100 h-screen fixed left-0 top-0`}
            >
                <div className={`${isMenuOpen ? 'block p-6 border-b border-sky-100' : 'hidden'}`}>
                    <h1 className="text-xl font-bold text-sky-900">Igreja Controle</h1>
                    <p className="text-sm text-sky-600">Sistema de Gestão</p>
                </div>

                <div className="p-4 flex justify-between items-center">
                    <button 
                        onClick={toggleMenu} 
                        className="text-sky-900 focus:outline-none"
                    >
                        {isMenuOpen ? '←' : '→'}
                    </button>
                </div>

                {/* Menu Items */}
                <nav className="overflow-hidden">
                    <ul className="space-y-1 px-3">
                        {menuItems.map((item) => (
                            <li 
                                key={item.path} 
                                className={`
                                    ${location.pathname === item.path ? 'bg-sky-100' : ''} 
                                    flex items-center 
                                    ${isMenuOpen ? 'justify-between' : 'justify-center'}
                                    hover:bg-sky-100 
                                    py-2 
                                    rounded
                                `}
                            >
                                <Link 
                                    to={item.path} 
                                    className="flex items-center w-full"
                                >
                                    <span className="text-2xl mr-2">{item.icon}</span>
                                    {isMenuOpen && <span>{item.label}</span>}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>

            {/* Main Content Offset */}
            <div 
                className={`transition-all duration-300 ease-in-out ${
                    isMenuOpen ? 'ml-64' : 'ml-16'
                } flex-grow`}
            >
                {/* Your main content goes here */}
            </div>
        </div>
    );
};

export default Navigation;
