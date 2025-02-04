import React from 'react';
import Layout from './Layout';

const Home = () => {
    return (
        <Layout>
            <div className="h-full space-y-6">
                {/* Welcome Section */}
                <div className="bg-gradient-to-r from-sky-500 to-sky-600 rounded-xl text-white p-6 shadow-lg">
                    <h1 className="text-3xl font-bold mb-2">Bem-vindo ao Igreja Controle</h1>
                    <p className="text-sky-100">Gerencie sua igreja de forma eficiente e organizada</p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-sky-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className="bg-sky-100 p-3 rounded-lg">
                                <span className="text-2xl">👥</span>
                            </div>
                            <span className="text-sm font-medium text-emerald-500">↑ 12%</span>
                        </div>
                        <h3 className="text-lg font-semibold text-sky-900">1,234</h3>
                        <p className="text-sm text-sky-600">Total de Membros</p>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border border-sky-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className="bg-sky-100 p-3 rounded-lg">
                                <span className="text-2xl">💰</span>
                            </div>
                            <span className="text-sm font-medium text-emerald-500">↑ 8%</span>
                        </div>
                        <h3 className="text-lg font-semibold text-sky-900">R$ 45.680</h3>
                        <p className="text-sm text-sky-600">Dízimos do Mês</p>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border border-sky-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className="bg-sky-100 p-3 rounded-lg">
                                <span className="text-2xl">📅</span>
                            </div>
                            <span className="text-sm font-medium text-sky-600">Esta semana</span>
                        </div>
                        <h3 className="text-lg font-semibold text-sky-900">8</h3>
                        <p className="text-sm text-sky-600">Eventos Ativos</p>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border border-sky-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className="bg-sky-100 p-3 rounded-lg">
                                <span className="text-2xl">✨</span>
                            </div>
                            <span className="text-sm font-medium text-emerald-500">↑ 18%</span>
                        </div>
                        <h3 className="text-lg font-semibold text-sky-900">28</h3>
                        <p className="text-sm text-sky-600">Novos Membros</p>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
                    {/* Próximos Eventos */}
                    <div className="bg-white rounded-xl shadow-sm border border-sky-100 overflow-hidden h-full flex flex-col">
                        <div className="p-6 flex-1">
                            <h3 className="text-lg font-semibold text-sky-900 mb-4">Próximos Eventos</h3>
                            <div className="space-y-4">
                                <div className="flex items-start space-x-4">
                                    <div className="bg-sky-100 p-2 rounded-lg text-center min-w-[4rem]">
                                        <span className="text-sm font-semibold text-sky-800">FEV</span>
                                        <span className="text-xl font-bold text-sky-600 block">15</span>
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-sky-900">Culto de Jovens</h4>
                                        <p className="text-sm text-sky-600">19:30 - Templo Principal</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-4">
                                    <div className="bg-sky-100 p-2 rounded-lg text-center min-w-[4rem]">
                                        <span className="text-sm font-semibold text-sky-800">FEV</span>
                                        <span className="text-xl font-bold text-sky-600 block">18</span>
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-sky-900">Escola Dominical</h4>
                                        <p className="text-sm text-sky-600">09:00 - Salas de Estudo</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-sky-50 p-4 text-center mt-auto">
                            <button className="text-sm font-medium text-sky-600 hover:text-sky-700">
                                Ver todos os eventos →
                            </button>
                        </div>
                    </div>

                    {/* Atividades Recentes */}
                    <div className="bg-white rounded-xl shadow-sm border border-sky-100 overflow-hidden h-full flex flex-col">
                        <div className="p-6 flex-1">
                            <h3 className="text-lg font-semibold text-sky-900 mb-4">Atividades Recentes</h3>
                            <div className="space-y-4">
                                <div className="flex items-start space-x-4">
                                    <div className="bg-sky-100 p-2 rounded-lg">
                                        <span className="text-xl">👤</span>
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-sky-900">Novo Membro</h4>
                                        <p className="text-sm text-sky-600">João Silva foi registrado</p>
                                        <span className="text-xs text-sky-400">2 horas atrás</span>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-4">
                                    <div className="bg-emerald-100 p-2 rounded-lg">
                                        <span className="text-xl">💰</span>
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-sky-900">Dízimo Registrado</h4>
                                        <p className="text-sm text-sky-600">R$ 500,00 recebido</p>
                                        <span className="text-xs text-sky-400">4 horas atrás</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-sky-50 p-4 text-center mt-auto">
                            <button className="text-sm font-medium text-sky-600 hover:text-sky-700">
                                Ver todas as atividades →
                            </button>
                        </div>
                    </div>

                    {/* Ações Rápidas */}
                    <div className="bg-white rounded-xl shadow-sm border border-sky-100 h-full flex flex-col">
                        <div className="p-6 flex-1">
                            <h3 className="text-lg font-semibold text-sky-900 mb-4">Ações Rápidas</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <button className="flex flex-col items-center p-4 rounded-xl border border-sky-100 hover:bg-sky-50 transition-colors group">
                                    <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">👥</span>
                                    <span className="text-sm font-medium text-sky-700">Adicionar Membro</span>
                                </button>
                                <button className="flex flex-col items-center p-4 rounded-xl border border-sky-100 hover:bg-sky-50 transition-colors group">
                                    <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">💰</span>
                                    <span className="text-sm font-medium text-sky-700">Registrar Dízimo</span>
                                </button>
                                <button className="flex flex-col items-center p-4 rounded-xl border border-sky-100 hover:bg-sky-50 transition-colors group">
                                    <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">📅</span>
                                    <span className="text-sm font-medium text-sky-700">Criar Evento</span>
                                </button>
                                <button className="flex flex-col items-center p-4 rounded-xl border border-sky-100 hover:bg-sky-50 transition-colors group">
                                    <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">📊</span>
                                    <span className="text-sm font-medium text-sky-700">Gerar Relatório</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Home;
