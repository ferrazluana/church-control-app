import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getMembers, deleteMember } from '../../controllers/membersController';
import { getMemberMinistries } from '../../controllers/ministryController';
import { getMemberCourses } from '../../controllers/memberCoursesController';
import Layout from '../Layout';
import { ChevronLeftIcon, ChevronRightIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const MemberList = () => {
    const [members, setMembers] = useState([]);
    const [filteredMembers, setFilteredMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const membersPerPage = 10;
    const navigate = useNavigate();

    useEffect(() => {
        fetchMembers();
    }, []);

    useEffect(() => {
        // Filter members when search term changes
        const filtered = members.filter(member => 
            member.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredMembers(filtered);
        setCurrentPage(1); // Reset to first page when search changes
    }, [searchTerm, members]);

    const fetchMembers = async () => {
        try {
            const data = await getMembers();
            setMembers(data);
            setFilteredMembers(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching members:', error);
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Tem certeza que deseja excluir este membro?')) {
            try {
                await deleteMember(id);
                fetchMembers();
            } catch (error) {
                console.error('Error deleting member:', error);
            }
        }
    };

    // Pagination logic
    const indexOfLastMember = currentPage * membersPerPage;
    const indexOfFirstMember = indexOfLastMember - membersPerPage;
    const currentMembers = filteredMembers.slice(indexOfFirstMember, indexOfLastMember);

    const totalPages = Math.ceil(filteredMembers.length / membersPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    if (loading) {
        return (
            <Layout>
                <div className="flex justify-center items-center h-screen">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <h1 className="text-xl font-semibold text-gray-900">Membros</h1>
                        <p className="mt-2 text-sm text-gray-700">
                            Lista de todos os membros da igreja 
                            ({indexOfFirstMember + 1}-{Math.min(indexOfLastMember, filteredMembers.length)} de {filteredMembers.length})
                        </p>
                    </div>
                    <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none flex items-center space-x-4">
                        {/* Search Input */}
                        <div className="relative flex-grow max-w-md">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Pesquisar membros por nome"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="
                                    block 
                                    w-full 
                                    pl-10 
                                    pr-3 
                                    py-2 
                                    border 
                                    border-gray-300 
                                    rounded-md 
                                    leading-5 
                                    bg-white 
                                    placeholder-gray-500 
                                    focus:outline-none 
                                    focus:ring-2 
                                    focus:ring-sky-500 
                                    focus:border-sky-500 
                                    sm:text-sm
                                "
                            />
                        </div>
                        <Link
                            to="/members/add"
                            className="inline-flex items-center justify-center rounded-md border border-transparent bg-sky-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 sm:w-auto"
                        >
                            Adicionar Membro
                        </Link>
                    </div>
                </div>

                <div className="mt-8 flex flex-col">
                    <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                                <table className="min-w-full divide-y divide-gray-300">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Nome</th>
                                            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                                            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {currentMembers.length > 0 ? (
                                            currentMembers.map((member) => (
                                                <tr key={member.id}>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                                                        {member.name}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${member.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                            {member.is_active ? 'Ativo' : 'Inativo'}
                                                        </span>
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                                                        <Link
                                                            to={`/members/${member.id}`}
                                                            className="text-sky-600 hover:text-sky-900 mr-4"
                                                        >
                                                            Detalhes
                                                        </Link>
                                                        <Link
                                                            to={`/members/${member.id}/edit`}
                                                            className="text-sky-600 hover:text-sky-900 mr-4"
                                                        >
                                                            Editar
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(member.id)}
                                                            className="text-red-600 hover:text-red-900"
                                                        >
                                                            Excluir
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="3" className="text-center py-4 text-gray-500">
                                                    Nenhum membro encontrado
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Pagination Controls */}
                    {filteredMembers.length > membersPerPage && (
                        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
                            <div className="flex flex-1 justify-between sm:hidden">
                                <button
                                    onClick={() => paginate(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                                >
                                    Anterior
                                </button>
                                <button
                                    onClick={() => paginate(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                                >
                                    Próximo
                                </button>
                            </div>
                            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-gray-700">
                                        Mostrando{' '}
                                        <span className="font-medium">{indexOfFirstMember + 1}</span>{' '}
                                        a{' '}
                                        <span className="font-medium">{Math.min(indexOfLastMember, filteredMembers.length)}</span>{' '}
                                        de{' '}
                                        <span className="font-medium">{filteredMembers.length}</span>{' '}
                                        membros
                                    </p>
                                </div>
                                <div>
                                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                                        <button
                                            onClick={() => paginate(currentPage - 1)}
                                            disabled={currentPage === 1}
                                            className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                                        >
                                            <span className="sr-only">Anterior</span>
                                            <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                                        </button>
                                        {[...Array(totalPages)].map((_, index) => (
                                            <button
                                                key={index}
                                                onClick={() => paginate(index + 1)}
                                                className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                                                    currentPage === index + 1 
                                                        ? 'bg-sky-600 text-white' 
                                                        : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
                                                }`}
                                            >
                                                {index + 1}
                                            </button>
                                        ))}
                                        <button
                                            onClick={() => paginate(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                            className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                                        >
                                            <span className="sr-only">Próximo</span>
                                            <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                                        </button>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default MemberList;
