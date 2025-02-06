import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getMinistry, updateMinistry } from '../../controllers/ministryController';
import Layout from '../Layout';
import { getMembers } from '../../controllers/membersController';

const EditMinistry = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [ministryData, setMinistryData] = useState({
        name: '',
        leader: '',
        co_leader: '',
        is_active: true
    });
    const [members, setMembers] = useState([]);

    useEffect(() => {
        const fetchMinistry = async () => {
            const ministry = await getMinistry(id);
            setMinistryData(ministry);
        };
        fetchMinistry();
    }, [id]);

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
            setMinistryData(prev => ({ ...prev, [name]: checked }));
        } else {
            setMinistryData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = {
            name: ministryData.name,
            leader: ministryData.leader || null,
            co_leader: ministryData.co_leader || null,
            is_active: ministryData.is_active,
        };

        try {
            await updateMinistry(id, formData);
            alert('Ministério atualizado com sucesso!');
            navigate('/ministries');
        } catch (error) {
            console.error('Error updating ministry:', error);
            alert('Erro ao atualizar ministério. Por favor, tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="max-w-4xl mx-auto p-6">
                <div className="md:flex md:items-center md:justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Editar Ministério</h1>
                        <p className="mt-2 text-sm text-gray-700">Atualize as informações do ministério</p>
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
                                    value={ministryData.name}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Líder</label>
                                <select
                                    name="leader"
                                    value={ministryData.leader}
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
                                    value={ministryData.co_leader}
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
                                        checked={ministryData.is_active}
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

export default EditMinistry;
