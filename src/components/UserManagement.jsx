import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Layout from './Layout';

const UserManagement = () => {
    const { createUser, readUsers, updateUser, deleteUser, loading, error } = useAuth();
    const [users, setUsers] = useState([]);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        role: ''
    });
    const [editingUser, setEditingUser] = useState(null);

    // Load users on component mount
    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        const usersData = await readUsers();
        setUsers(usersData);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingUser) {
                await updateUser(editingUser.id, formData);
            } else {
                await createUser(formData.email, formData.password, formData.role);
            }
            // Reset form and reload users
            setFormData({ email: '', password: '', role: '' });
            setEditingUser(null);
            await loadUsers();
        } catch (err) {
            console.error('Error:', err);
        }
    };

    const handleEdit = (user) => {
        setEditingUser(user);
        setFormData({
            email: user.email,
            password: '', // Don't set the password for security
            role: user.user_roles?.[0]?.roles?.role_name || ''
        });
    };

    const handleDelete = async (id) => {
        if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
            try {
                await deleteUser(id);
                await loadUsers();
            } catch (err) {
                console.error('Error deleting user:', err);
            }
        }
    };

    if (loading) return <Layout><div>Carregando...</div></Layout>;
    if (error) return <Layout><div>Erro: {error}</div></Layout>;

    return (
        <Layout>
            <div className="space-y-6">
                {/* User Form */}
                <div className="bg-white rounded-lg shadow-sm p-6 border border-sky-100">
                    <h2 className="text-lg font-medium text-sky-800 mb-4">
                        {editingUser ? 'Editar Usuário' : 'Criar Novo Usuário'}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-sky-700">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-sky-200 shadow-sm focus:border-sky-500 focus:ring-sky-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-sky-700">
                                Senha
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-sky-200 shadow-sm focus:border-sky-500 focus:ring-sky-500"
                                required={!editingUser}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-sky-700">
                                Função
                            </label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-sky-200 shadow-sm focus:border-sky-500 focus:ring-sky-500"
                                required
                            >
                                <option value="">Selecione uma função</option>
                                <option value="1">Master</option>
                                <option value="2">Pastor</option>
                                <option value="3">Líder</option>
                                <option value="4">Tesoreiro</option>
                            </select>
                        </div>
                        <div className="flex justify-end space-x-3">
                            {editingUser && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditingUser(null);
                                        setFormData({ email: '', password: '', role: '' });
                                    }}
                                    className="px-4 py-2 border border-sky-200 rounded-md text-sm font-medium text-sky-700 hover:bg-sky-50"
                                >
                                    Cancelar
                                </button>
                            )}
                            <button
                                type="submit"
                                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700"
                            >
                                {editingUser ? 'Atualizar' : 'Criar'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Users List */}
                <div className="bg-white rounded-lg shadow-sm p-6 border border-sky-100">
                    <h2 className="text-lg font-medium text-sky-800 mb-4">Usuários</h2>
                    <div className="space-y-4">
                        {users.map(user => (
                            <div key={user.id} className="flex items-center justify-between p-4 border border-sky-100 rounded-lg">
                                <div>
                                    <p className="font-medium text-sky-800">{user.email}</p>
                                    <p className="text-sm text-sky-600">
                                        Função: {user.user_roles?.[0]?.roles?.role_name || 'Sem função'}
                                    </p>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handleEdit(user)}
                                        className="px-3 py-1 text-sm text-amber-700 bg-amber-50 rounded-md hover:bg-amber-100"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => handleDelete(user.id)}
                                        className="px-3 py-1 text-sm text-rose-700 bg-rose-50 rounded-md hover:bg-rose-100"
                                    >
                                        Excluir
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default UserManagement;
