import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Layout from '../Layout';
import { getMembers } from '../../controllers/membersController';
import { getMemberMinistries } from '../../controllers/ministryController';
import { getMemberCourses } from '../../controllers/memberCoursesController';
import AddNotePopup from './AddNotePopup';
import { createNote, selectNotesByMember, deleteNote } from '../../controllers/notesController';
import { useAuth } from '../../context/AuthContext';
import NotesList from './NotesList';

const ViewMember = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [member, setMember] = useState(null);
    const [ministries, setMinistries] = useState([]);
    const [courses, setCourses] = useState([]);
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('personal');
    const [isPopupOpen, setPopupOpen] = useState(false);

    const handleAddNote = async (text) => {
        const memberId = id; // ID do membro atual
        const userId = user ? user.id : null;
        try {
            await createNote({ text, member_id: memberId, user_id: userId });
            // Fetch updated notes
            const memberNotes = await selectNotesByMember(memberId, userId);
            setNotes(memberNotes);
            // Switch to notes tab
            setActiveTab('notes');
        } catch (error) {
            console.error('Error adding note:', error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const members = await getMembers();
                const foundMember = members.find(m => m.id === parseInt(id));

                if (foundMember) {
                    setMember(foundMember);
                    
                    // Fetch member's ministries
                    const memberMinistries = await getMemberMinistries(foundMember.id);
                    setMinistries(memberMinistries);

                    // Fetch member's courses
                    const memberCourses = await getMemberCourses(foundMember.id);
                    setCourses(memberCourses);

                    // Fetch notes for the member
                    const memberNotes = await selectNotesByMember(foundMember.id, user.id);
                    setNotes(memberNotes);
                    
                    setLoading(false);
                } else {
                    navigate('/members');
                }
            } catch (error) {
                console.error('Error fetching member:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, [id, user.id, navigate]);

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
                        {(user && (user.user_roles[0].roles.role_name === 'master' || user.user_roles[0].roles.role_name === 'pastor')) && (
                            <button onClick={() => setPopupOpen(true)} className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500">
                                Add Anotação
                            </button>
                        )}
                    </div>
                </div>

                <AddNotePopup isOpen={isPopupOpen} onClose={() => setPopupOpen(false)} onAddNote={handleAddNote} />

                <nav className="flex space-x-4 mb-6">
                    <button onClick={() => setActiveTab('personal')} className={`text-sm font-medium ${activeTab === 'personal' ? 'text-sky-600' : 'text-gray-600'}`}>Informações Pessoais</button>
                    <button onClick={() => setActiveTab('ministry')} className={`text-sm font-medium ${activeTab === 'ministry' ? 'text-sky-600' : 'text-gray-600'}`}>Ministério</button>
                    <button onClick={() => setActiveTab('courses')} className={`text-sm font-medium ${activeTab === 'courses' ? 'text-sky-600' : 'text-gray-600'}`}>Cursos</button>
                    <button onClick={() => setActiveTab('notes')} className={`text-sm font-medium ${activeTab === 'notes' ? 'text-sky-600' : 'text-gray-600'}`}>Anotações</button>
                </nav>

                <div>
                    {activeTab === 'personal' && (
                        <div>
                            {/* Personal Information */}
                            <InfoSection title="Informações Pessoais">
                                <InfoItem label="Nome" value={member.name} />
                                <InfoItem
                                    label="Data de Nascimento"
                                    value={member.date_of_birth ? new Date(member.date_of_birth).toLocaleDateString('pt-BR') : 'Não informado'}
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
                                <InfoItem label="Linguagem de Amor" value={
                                    Array.isArray(member.love_language) && member.love_language.length > 0
                                        ? member.love_language
                                            .map(lang => ({
                                                'tempo': 'Tempo de Qualidade',
                                                'presentes': 'Receber Presentes',
                                                'atos': 'Atos de Serviço',
                                                'palavras': 'Palavras de Afirmação',
                                                'toque': 'Toque Físico'
                                            }[lang] || lang))
                                            .join(', ')
                                        : 'Não informado'
                                } />
                                <InfoItem label="Personalidade" value={
                                    (() => {
                                        return Array.isArray(member.personality_test) && member.personality_test.length > 0
                                            ? member.personality_test
                                                .map(type => ({
                                                    'Determinado': 'Determinado',
                                                    'Influenciador': 'Influenciador',
                                                    'Seguro': 'Seguro',
                                                    'Cauteloso': 'Cauteloso'
                                                }[type] || type))
                                                .join(', ')
                                            : 'Não informado';
                                    })()
                                } />
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
                    )}
                    {activeTab === 'ministry' && (
                        <div>
                            {/* Ministries Section */}
                            <InfoSection title="Ministérios">
                                <div className="px-4 py-4">
                                    {ministries && ministries.length > 0 ? (
                                        <div className="space-y-2">
                                            {ministries.map((ministry) => (
                                                <p key={ministry.id} className="text-sm text-gray-900">
                                                    <span className="font-medium">{ministry.name}</span>
                                                    {ministry.leader && (
                                                        <span className="text-gray-600">
                                                            {" - Líder: "}{ministry.leader.name}
                                                        </span>
                                                    )}
                                                </p>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-500">Não participa de nenhum ministério</p>
                                    )}
                                </div>
                            </InfoSection>
                        </div>
                    )}
                    {activeTab === 'courses' && (
                        <div>
                            {/* Courses Section */}
                            <InfoSection title="Cursos">
                                <div className="px-4 py-4">
                                    {courses && courses.length > 0 ? (
                                        <ul>
                                            {courses.map(course => (
                                                <li key={course.id}>{course.courses.name}</li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-sm text-gray-500">Não está matriculado em nenhum curso</p>
                                    )}
                                </div>
                            </InfoSection>
                        </div>
                    )}
                    {activeTab === 'notes' && (
                        <div>
                            {/* Notes Section */}
                            <InfoSection title="Anotações">
                                <div className="px-4 py-4">
                                    <NotesList notes={notes} deleteNote={deleteNote} id={id} user={user} selectNotesByMember={selectNotesByMember} setNotes={setNotes} />
                                </div>
                            </InfoSection>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default ViewMember;
