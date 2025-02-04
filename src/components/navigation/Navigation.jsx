import React from 'react';
import { Link, useLocation } from 'react-router-dom';   

const Navigation = () => {
    const location = useLocation();

    const menuItems = [
        { path: '/home', icon: '🏠', label: 'Home' },
        { path: '/members', icon: '👥', label: 'Membros' },
        { path: '/ministries', icon: '🏛️', label: 'Ministérios' },
        { path: '/users', icon: '👤', label: 'Usuários' },
        { path: '/events', icon: '📅', label: 'Eventos' },
        { path: '/finance', icon: '💰', label: 'Finanças' },
    ];

    menuItems.push({ path: '/courses', icon: '📚', label: 'Cursos' });

    return (
        <nav className="w-64 bg-white border-r border-sky-100 h-screen flex-shrink-0">
            <div className="h-full flex flex-col">
                {/* Logo */}
                <div className="p-6 border-b border-sky-100">
                    <h1 className="text-xl font-bold text-sky-900">Igreja Controle</h1>
                    <p className="text-sm text-sky-600">Sistema de Gestão</p>
                </div>

                {/* Menu Items */}
                <div className="flex-1 overflow-y-auto py-4">
                    <ul className="space-y-1 px-3">
                        {menuItems.map((item) => (
                            <li key={item.path}>
                                <Link
                                    to={item.path}
                                    className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                        location.pathname === item.path
                                            ? 'bg-sky-50 text-sky-700'
                                            : 'text-sky-600 hover:bg-sky-50 hover:text-sky-700'
                                    }`}
                                >
                                    <span className="w-5 h-5 mr-3 flex items-center justify-center">
                                        {item.icon}
                                    </span>
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navigation;
