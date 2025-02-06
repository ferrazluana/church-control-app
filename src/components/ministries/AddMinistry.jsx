import React, { useEffect, useState } from 'react';
import { createMinistry } from '../../controllers/ministryController';
import { useNavigate } from 'react-router-dom';
import Layout from '../Layout';
import { getMembers } from '../../controllers/membersController';

const AddMinistry = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        leader: '',
        co_leader: '',
        is_active: true
    });
    const [members, setMembers] = useState([]);

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const allMembers = await getMembers();
                const activeBaptizedMembers = allMembers.filter(member => member.is_active && member.baptized);
                setMembers(activeBaptizedMembers);
            } catch (error) {
                console.error('Error fetching members:', error);
            }
        };
        fetchMembers();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const ministryData = {
            name: formData.name,
            leader: formData.leader || null,
            co_leader: formData.co_leader || null,
            is_active: formData.is_active,
        };

        try {
            await createMinistry(ministryData);
            alert('Ministério adicionado com sucesso!');
            navigate('/ministries');
        } catch (error) {
            console.error('Error creating ministry:', error);
            alert('Erro ao adicionar ministério. Por favor, tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="max-w-4xl mx-auto p-6">
                <div className="md:flex md:items-center md:justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Adicionar Novo Ministério</h1>
                        <p className="mt-2 text-sm text-gray-700">Preencha os dados do novo ministério</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow px-6 py-8 rounded-lg">
                    <div className="space-y-6">
                        <h2 className="text-lg font-medium text-gray-900">Informações do Ministério</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Nome</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Líder</label>
                                <select
                                    name="leader"
                                    value={formData.leader}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500"
                                    
                                >
                                    <option value="">Selecione um líder</option>
                                    {members.map(member => (
                                        <option key={member.id} value={member.id}>{member.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Co-líder</label>
                                <select
                                    name="co_leader"
                                    value={formData.co_leader}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500"
                                >
                                    <option value="">Selecione um co-líder</option>
                                    {members.map(member => (
                                        <option key={member.id} value={member.id}>{member.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Status</label>
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name="is_active"
                                        checked={formData.is_active}
                                        onChange={handleChange}
                                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                                        Ativo
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-5">
                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={() => navigate('/ministries')}
                                className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                Salvar
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </Layout>
    );
};

export default AddMinistry;
