import React from 'react';
import Navigation from './navigation/Navigation';

const Layout = ({ children }) => {
    return (
        <div className="flex min-h-screen bg-sky-50">
            <Navigation />
            <div className="flex-1 flex flex-col">
                <header className="bg-white shadow-sm z-10">
                    <div className="mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            <h2 className="text-2xl font-bold text-sky-800">Dashboard</h2>
                            <div className="flex items-center space-x-4">
                                <span className="relative">
                                    <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-rose-300 ring-2 ring-white" />
                                    <button className="p-2 text-sky-600 hover:text-sky-700">
                                        🔔
                                    </button>
                                </span>
                            </div>
                        </div>
                    </div>
                </header>
                <main className="flex-1 overflow-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
