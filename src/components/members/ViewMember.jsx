import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getMembers } from '../../controllers/membersController';
import Layout from '../Layout';

const ViewMember = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [member, setMember] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMember = async () => {
            try {
                const members = await getMembers();
                const foundMember = members.find(m => m.id === parseInt(id));
                if (foundMember) {
                    setMember(foundMember);
                } else {
                    alert('Membro não encontrado');
                    navigate('/members');
                }
            } catch (error) {
                console.error('Error fetching member:', error);
                alert('Erro ao carregar dados do membro');
                navigate('/members');
            } finally {
                setLoading(false);
            }
        };
        fetchMember();
    }, [id, navigate]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-gray-600">Carregando...</div>
            </div>
        );
    }

    if (!member) {
        return null;
    }

    const InfoSection = ({ title, children }) => (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
            <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">{title}</h3>
            </div>
            <div className="border-t border-gray-200">
                <dl>{children}</dl>
            </div>
        </div>
    );

    const InfoItem = ({ label, value }) => (
        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">{label}</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{value}</dd>
        </div>
    );

    return (
        <Layout>
            <div className="max-w-7xl mx-auto p-6">
                <div className="md:flex md:items-center md:justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{member.name}</h1>
                        <p className="mt-2 text-sm text-gray-700">
                            Detalhes do membro
                        </p>
                    </div>
                    <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
                        <Link
                            to="/members"
                            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                        >
                            Voltar
                        </Link>
                        <Link
                            to={`/members/${id}/edit`}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                        >
                            Editar
                        </Link>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Personal Information */}
                    <InfoSection title="Informações Pessoais">
                        <InfoItem label="Nome" value={member.name} />
                        <InfoItem
                            label="Data de Nascimento"
                            value={member.birth_date ? new Date(member.birth_date).toLocaleDateString('pt-BR') : 'Não informado'}
                        />
                        <InfoItem label="Telefone" value={member.phone_number || 'Não informado'} />
                        <InfoItem label="Estado Civil" value={
                            {
                                'single': 'Solteiro(a)',
                                'married': 'Casado(a)',
                                'divorced': 'Divorciado(a)',
                                'widowed': 'Viúvo(a)'
                            }[member.marital_status] || member.marital_status || 'Não informado'
                        } />
                        <InfoItem label="Endereço" value={member.address || 'Não informado'} />
                        <InfoItem label="RG" value={member.rg || 'Não informado'} />
                        <InfoItem label="CPF" value={member.cpf || 'Não informado'} />
                    </InfoSection>

                    {/* Church Information */}
                    <InfoSection title="Informações da Igreja">
                        <InfoItem
                            label="Batizado"
                            value={member.baptized ? 'Sim' : 'Não'}
                        />
                        {member.baptized && (
                            <>
                                <InfoItem
                                    label="Data do Batismo"
                                    value={member.baptism_date ? new Date(member.baptism_date).toLocaleDateString('pt-BR') : 'Não informado'}
                                />
                                <InfoItem
                                    label="Igreja do Batismo"
                                    value={member.church_of_baptism || 'Não informado'}
                                />
                            </>
                        )}
                    </InfoSection>

                    {/* Leadership Information */}
                    <InfoSection title="Informações de Liderança">
                        <InfoItem
                            label="Cargo na Igreja"
                            value={
                                [
                                    member.is_pastor && 'Pastor',
                                    member.is_leader && 'Líder',
                                    member.is_co_leader && 'Co-líder'
                                ].filter(Boolean).join(', ') || 'Membro'
                            }
                        />
                        <InfoItem
                            label="Status"
                            value={
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${member.is_active
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-gray-100 text-gray-800'
                                    }`}>
                                    {member.is_active ? 'Ativo' : 'Inativo'}
                                </span>
                            }
                        />
                    </InfoSection>
                </div>
            </div>
        </Layout>
    );
};

export default ViewMember;
