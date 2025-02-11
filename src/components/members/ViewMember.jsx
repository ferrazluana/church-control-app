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

    const tabLabels = {
        personal: 'Informações Pessoais',
        ministry: 'Ministério',
        courses: 'Cursos',
        notes: 'Anotações'
    };

    return (
        <Layout>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {member ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Personal Information Section */}
                        <div className="md:col-span-1 bg-white shadow rounded-lg p-6">
                            <div className="flex flex-col items-center mb-6">
                                <img 
                                    src={member.photo || '/default-avatar.png'} 
                                    alt={member.name} 
                                    className="w-32 h-32 rounded-full object-cover mb-4"
                                />
                                <h2 className="text-2xl font-bold text-gray-800">{member.name}</h2>
                                <p className="text-gray-600">{member.email}</p>
                            </div>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Telefone</label>
                                    <p className="mt-1 text-sm text-gray-900">{member.phone_number || 'Não informado'}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Data de Nascimento</label>
                                    <p className="mt-1 text-sm text-gray-900">
                                        {member.date_of_birth 
                                            ? new Date(member.date_of_birth).toLocaleDateString('pt-BR') 
                                            : 'Não informado'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Tabs and Content Section */}
                        <div className="md:col-span-2 space-y-6">
                            {/* Tabs Navigation */}
                            <div className="flex overflow-x-auto border-b">
                                {['personal', 'ministry', 'courses', 'notes'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`
                                            px-4 py-2 
                                            text-sm 
                                            font-medium 
                                            whitespace-nowrap
                                            ${activeTab === tab 
                                                ? 'border-b-2 border-sky-500 text-sky-600' 
                                                : 'text-gray-500 hover:text-gray-700'}
                                        `}
                                    >
                                        {tabLabels[tab]}
                                    </button>
                                ))}
                            </div>

                            {/* Tab Content */}
                            <div className="bg-white shadow rounded-lg p-6">
                                {activeTab === 'personal' && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Endereço</label>
                                            <p className="mt-1 text-sm text-gray-900">
                                                {member.address || 'Não informado'}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Estado Civil</label>
                                            <p className="mt-1 text-sm text-gray-900">
                                                {
                                                    {
                                                        'single': 'Solteiro(a)',
                                                        'married': 'Casado(a)',
                                                        'divorced': 'Divorciado(a)',
                                                        'widowed': 'Viúvo(a)'
                                                    }[member.marital_status] || member.marital_status || 'Não informado'
                                                }
                                            </p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Linguagem de Amor</label>
                                            <p className="mt-1 text-sm text-gray-900">
                                                {Array.isArray(member.love_language) && member.love_language.length > 0
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
                                                }
                                            </p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Personalidade</label>
                                            <p className="mt-1 text-sm text-gray-900">
                                                {(() => {
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
                                                })()}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'ministry' && (
                                    <div>
                                        {ministries.length > 0 ? (
                                            <ul className="space-y-2">
                                                {ministries.map((ministry) => (
                                                    <li 
                                                        key={ministry.id} 
                                                        className="bg-gray-100 p-3 rounded-md"
                                                    >
                                                        {ministry.name}
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-gray-500">Nenhum ministério encontrado</p>
                                        )}
                                    </div>
                                )}

                                {activeTab === 'courses' && (
                                    <div>
                                        {courses.length > 0 ? (
                                            <ul className="space-y-2">
                                                {courses.map((course) => (
                                                    <li 
                                                        key={course.id} 
                                                        className="bg-gray-100 p-3 rounded-md"
                                                    >
                                                        {course.courses.name}
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-gray-500">Nenhum curso encontrado</p>
                                        )}
                                    </div>
                                )}

                                {activeTab === 'notes' && (
                                    <div>
                                        <div className="flex justify-end mb-4">
                                            <button 
                                                onClick={() => setPopupOpen(true)} 
                                                className="bg-sky-500 text-white px-4 py-2 rounded hover:bg-sky-600"
                                            >
                                                Adicionar Nota
                                            </button>
                                        </div>
                                        <NotesList 
                                            notes={notes} 
                                            deleteNote={deleteNote} 
                                            id={id} 
                                            user={user} 
                                            selectNotesByMember={selectNotesByMember} 
                                            setNotes={setNotes} 
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex justify-center items-center h-64">
                        <p className="text-gray-500">Membro não encontrado</p>
                    </div>
                )}

                {/* Add Note Popup */}
                {isPopupOpen && (
                    <AddNotePopup 
                        isOpen={isPopupOpen} 
                        onClose={() => setPopupOpen(false)} 
                        onAddNote={handleAddNote}
                    />
                )}
            </div>
        </Layout>
    );
};

export default ViewMember;
