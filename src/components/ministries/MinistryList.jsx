import React, { useEffect, useState } from 'react';
import { getMinistries, deleteMinistry } from '../../controllers/ministryController';
import { Link } from 'react-router-dom';
import Layout from '../Layout';

const MinistryList = () => {
    const [ministries, setMinistries] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [paginatedMinistries, setPaginatedMinistries] = useState([]);

    useEffect(() => {
        const fetchMinistries = async () => {
            try {
                const data = await getMinistries();
                
                setMinistries(data);
            } catch (error) {
                console.error('Error fetching ministries:', error.message || error);
                console.error('Full error object:', error);
            }
        };
        fetchMinistries();
    }, []);

    useEffect(() => {
        const filteredMinistries = ministries.filter((ministry) => {
            if (statusFilter === 'all') return true;
            if (statusFilter === 'active') return ministry.is_active;
            if (statusFilter === 'inactive') return !ministry.is_active;
        });

        const searchedMinistries = filteredMinistries.filter((ministry) =>
            ministry.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

        setPaginatedMinistries(searchedMinistries);
    }, [ministries, statusFilter, searchTerm]);

    const handleDelete = async (id) => {
        if (window.confirm('Tem certeza que deseja excluir este ministério?')) {
            await deleteMinistry(id);
            setMinistries(ministries.filter((ministry) => ministry.id !== id));
        }
    };

    const handleSort = (field) => {
        const sortedMinistries = [...ministries];
        sortedMinistries.sort((a, b) => {
            if (a[field] < b[field]) return -1;
            if (a[field] > b[field]) return 1;
            return 0;
        });
        setMinistries(sortedMinistries);
    };

    return (
        <Layout>
            <div className="p-6 max-w-7xl mx-auto">
                <div className="sm:flex sm:items-center sm:justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Ministérios</h1>
                        <p className="mt-2 text-sm text-gray-700">Lista de todos os ministérios cadastrados</p>
                    </div>
                    <div className="mt-4 sm:mt-0">
                        <Link
                            to="/ministries/add"
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                        >
                            <span className="mr-2">➕</span>
                            Adicionar Ministério
                        </Link>
                    </div>
                </div>

                <div className="mb-6 sm:flex sm:items-center sm:justify-between gap-4">
                    <div className="flex-1">
                        <input
                            type="text"
                            className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-sky-500 focus:border-sky-500"
                            placeholder="Buscar por nome..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="mt-4 sm:mt-0">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-sky-500 focus:border-sky-500"
                        >
                            <option value="all">Todos os Status</option>
                            <option value="active">Ativos</option>
                            <option value="inactive">Inativos</option>
                        </select>
                    </div>
                </div>

                <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('name')}>Nome</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('leader')}>Líder</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('co_leader')}>Co-líder</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('is_active')}>Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {paginatedMinistries.map((ministry) => (
                                <tr key={ministry.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">
                                            <Link to={`/ministries/${ministry.id}`} className="hover:text-sky-600">
                                                {ministry.name}
                                            </Link>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500">{ministry.leader ? ministry.leader.name : 'N/A'}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500">{ministry.co_leader ? ministry.co_leader.name : 'N/A'}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            ministry.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                        }`}>{ministry.is_active ? 'Ativo' : 'Inativo'}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <Link to={`/ministries/${ministry.id}/edit`} className="text-indigo-600 hover:text-indigo-900 mr-4">Editar</Link>
                                        <button onClick={() => handleDelete(ministry.id)} className="text-red-600 hover:text-red-900">Excluir</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </Layout>
    );
};

export default MinistryList;
