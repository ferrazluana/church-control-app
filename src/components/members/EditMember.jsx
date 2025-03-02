import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMemberById, updateMember, getMemberMinistries } from '../../controllers/membersController';
import Layout from '../Layout';
import { addMemberToMinistry, getMinistriesActives, removeMemberFromMinistry } from '../../controllers/ministryController';
import { enrollMemberInCourse, getMemberCourses, removeMemberFromCourse } from '../../controllers/memberCoursesController';
import { getCourses } from '../../controllers/coursesController';

const EditMember = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [memberData, setMemberData] = useState({
        name: '',
        date_of_birth: '',
        baptized: false,
        baptism_date: '',
        church_of_baptism: '',
        marital_status: 'single',
        phone_number: '',
        address: '',
        rg: '',
        cpf: '',
        love_language: [],
        personality_test: [],
        is_pastor: false,
        is_leader: false,
        is_co_leader: false,
        spouse_name: '',
        marriage_date: '',
        is_active: true
    });
    const [ministries, setMinistries] = useState([]);
    const [selectedMinistries, setSelectedMinistries] = useState([]);
    const [courses, setCourses] = useState([]);
    const [selectedCourses, setSelectedCourses] = useState([]);
    const [currentStep, setCurrentStep] = useState(1);

    useEffect(() => {
        const fetchMember = async () => {
            try {
                const member = await getMemberById(id);
                console.log('Fetched member:', member);
                if (member) {
                    setMemberData(member);
                } else {
                    console.error('Member not found');
                }
            } catch (error) {
                console.error('Error fetching member:', error);
            }
        };
        fetchMember();
    }, [id]);

    useEffect(() => {
        const fetchMinistries = async () => {
            const ministries = await getMinistriesActives();
            setMinistries(ministries);
        };
        fetchMinistries();
    }, []);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const coursesData = await getCourses();
                setCourses(coursesData);
                
                // Fetch member's current courses
                const memberCourses = await getMemberCourses(id);
                setSelectedCourses(memberCourses.map(mc => mc.course_id));
            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        };
        fetchCourses();
    }, [id]);

    useEffect(() => {
        const fetchMemberData = async () => {
            const member = await getMemberById(id);
            setMemberData(member);

            // Fetch and set selected ministries
            const memberMinistries = await getMemberMinistries(id);
            setSelectedMinistries(memberMinistries.map(m => m.ministry_id));
        };
        fetchMemberData();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await updateMember(id, memberData);
            await removeMemberFromMinistry(id);

            for (const ministryId of selectedMinistries) {
                try {
                    await addMemberToMinistry(id, ministryId);
                } catch (error) {
                    console.error(`Error linking member to ministry ${ministryId}:`, error);
                }
            }

            // Handle course enrollments
            const currentCourses = await getMemberCourses(id);
            const currentCourseIds = currentCourses.map(c => c.course_id);

            // Remove courses that were unselected
            for (const courseId of currentCourseIds) {
                if (!selectedCourses.includes(courseId)) {
                    await removeMemberFromCourse(id, courseId);
                }
            }

            // Add newly selected courses
            for (const courseId of selectedCourses) {
                if (!currentCourseIds.includes(courseId)) {
                    await enrollMemberInCourse(id, courseId);
                }
            }

            navigate('/members');
        } catch (error) {
            console.error(`Error updating member ${id}:`, error);
            alert('Erro ao atualizar membro. Por favor, tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            setMemberData(prev => ({ ...prev, [name]: checked }));
        } else if (name === 'love_language' || name === 'personality_test') {
            const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
            setMemberData(prev => ({ ...prev, [name]: selectedOptions }));
        } else {
            setMemberData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleMinistryChange = (ministryId) => {
        if (selectedMinistries.includes(ministryId)) {
            setSelectedMinistries(selectedMinistries.filter(id => id !== ministryId));
        } else {
            setSelectedMinistries([...selectedMinistries, ministryId]);
        }
    };

    const handleCourseChange = (courseId) => {
        if (selectedCourses.includes(courseId)) {
            setSelectedCourses(selectedCourses.filter(id => id !== courseId));
        } else {
            setSelectedCourses([...selectedCourses, courseId]);
        }
    };

    const handleNext = () => {
        setCurrentStep(currentStep + 1);
    };

    const handleBack = () => {
        setCurrentStep(currentStep - 1);
    };

    return (
        <Layout>
            <div className="max-w-4xl mx-auto p-6">
                {currentStep === 1 && (
                    <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow px-6 py-8 rounded-lg">
                        {/* Active Status */}
                        <div className="space-y-6 pt-6">
                            <h2 className="text-lg font-medium text-gray-900">Status do Membro</h2>
                            <div className="grid grid-cols-1 gap-6">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name="is_active"
                                        checked={memberData.is_active}
                                        onChange={handleChange}
                                        className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded"
                                    />
                                    <label className="ml-2 block text-sm text-gray-700">Ativar Membro</label>
                                </div>
                            </div>
                        </div>
                        {/* Personal Information */}
                        <div className="space-y-6 border-t border-gray-200">
                            <h2 className="text-lg font-medium text-gray-900">Informações Pessoais</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Nome</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={memberData.name}
                                        onChange={handleChange}
                                        required
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Data de Nascimento</label>
                                    <input
                                        type="date"
                                        name="date_of_birth"
                                        value={memberData.date_of_birth}
                                        onChange={handleChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Telefone</label>
                                    <input
                                        type="tel"
                                        name="phone_number"
                                        value={memberData.phone_number}
                                        onChange={handleChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Estado Civil</label>
                                    <select
                                        name="marital_status"
                                        value={memberData.marital_status}
                                        onChange={handleChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500"
                                    >
                                        <option value="single">Solteiro(a)</option>
                                        <option value="married">Casado(a)</option>
                                        <option value="divorced">Divorciado(a)</option>
                                        <option value="widowed">Viúvo(a)</option>
                                    </select>
                                </div>
                                {memberData.marital_status === 'married' && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Nome do Cônjuge</label>
                                            <input
                                                type="text"
                                                name="spouse_name"
                                                value={memberData.spouse_name}
                                                onChange={handleChange}
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Data de Casamento</label>
                                            <input
                                                type="date"
                                                name="marriage_date"
                                                value={memberData.marriage_date}
                                                onChange={handleChange}
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500"
                                            />
                                        </div>
                                    </>
                                )}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Endereço</label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={memberData.address}
                                        onChange={handleChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500"
                                    />
                                </div>

                            </div>
                        </div>

                        <div className="space-y-6 pt-6 border-t border-gray-200">
                            <h2 className="text-lg font-medium text-gray-900">Informações da Personalidade</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Linguagem de Amor</label>
                                    <select
                                        name="love_language"
                                        value={memberData.love_language}
                                        onChange={handleChange}
                                        multiple
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500"
                                    >
                                        <option value="palavras">Palavras de Afirmação</option>
                                        <option value="tempo">Qualidade de Tempo</option>
                                        <option value="presentes">Presentes</option>
                                        <option value="atos">Atos de Serviço</option>
                                        <option value="toques">Toque Físico</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Tipo de Personalidade</label>
                                    <select
                                        name="personality_test"
                                        value={memberData.personality_test}
                                        onChange={handleChange}
                                        multiple
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500"
                                    >
                                        <option value="Determinado">Determinado</option>
                                        <option value="Influenciador">Influenciador</option>
                                        <option value="Seguro">Seguro</option>
                                        <option value="Cauteloso">Cauteloso</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Church Information */}
                        <div className="space-y-6 pt-6 border-t border-gray-200">
                            <h2 className="text-lg font-medium text-gray-900">Informações da Igreja</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name="baptized"
                                        checked={memberData.baptized}
                                        onChange={handleChange}
                                        className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded"
                                    />
                                    <label className="ml-2 block text-sm text-gray-700">Batizado</label>
                                </div>
                                {memberData.baptized && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Data do Batismo</label>
                                            <input
                                                type="date"
                                                name="baptism_date"
                                                value={memberData.baptism_date}
                                                onChange={handleChange}
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Igreja do Batismo</label>
                                            <input
                                                type="text"
                                                name="church_of_baptism"
                                                value={memberData.church_of_baptism}
                                                onChange={handleChange}
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500"
                                            />
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Leadership Information */}
                        <div className="space-y-6 pt-6 border-t border-gray-200">
                            <h2 className="text-lg font-medium text-gray-900">Informações de Liderança</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name="is_pastor"
                                        checked={memberData.is_pastor}
                                        onChange={handleChange}
                                        className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded"
                                    />
                                    <label className="ml-2 block text-sm text-gray-700">Pastor</label>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name="is_leader"
                                        checked={memberData.is_leader}
                                        onChange={handleChange}
                                        className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded"
                                    />
                                    <label className="ml-2 block text-sm text-gray-700">Líder</label>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name="is_co_leader"
                                        checked={memberData.is_co_leader}
                                        onChange={handleChange}
                                        className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded"
                                    />
                                    <label className="ml-2 block text-sm text-gray-700">Co-líder</label>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-gray-200">
                            <div className="flex justify-end space-x-3">
                                <button type="button" onClick={handleNext} className="bg-sky-600 text-white py-2 px-4 rounded">Próximo</button>
                            </div>
                        </div>
                    </form>
                )}
                {currentStep === 2 && (
                    <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow px-6 py-8 rounded-lg">
                        {/* Ministries Information */}
                        <div className="space-y-6 pt-6 border-t border-gray-200">
                            <h2 className="text-lg font-medium text-gray-900">Ministérios Ativos</h2>
                            <div className="grid grid-cols-2 gap-4">
                                {ministries.map(ministry => (
                                    <label key={ministry.id} className="block mb-2">
                                        <input
                                            type="checkbox"
                                            value={ministry.id}
                                            checked={selectedMinistries.includes(ministry.id)}
                                            onChange={() => handleMinistryChange(ministry.id)}
                                            className="mr-2"
                                        />
                                        {ministry.name}
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Courses Information */}
                        <div className="space-y-6 pt-6 border-t border-gray-200">
                            <h2 className="text-lg font-medium text-gray-900">Cursos</h2>
                            <div className="grid grid-cols-2 gap-4">
                                {courses.map(course => (
                                    <label key={course.id} className="block mb-2">
                                        <input
                                            type="checkbox"
                                            value={course.id}
                                            checked={selectedCourses.includes(course.id)}
                                            onChange={() => handleCourseChange(course.id)}
                                            className="mr-2"
                                        />
                                        {course.name}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="pt-6 border-t border-gray-200">
                            <div className="flex justify-end space-x-3">
                                <button type="button" onClick={handleBack} className="bg-gray-300 py-2 px-4 rounded">Voltar</button>
                                <button type="submit" className="bg-sky-600 text-white py-2 px-4 rounded">Salvar</button>
                            </div>
                        </div>
                    </form>
                )}
            </div>
        </Layout>
    );
};

export default EditMember;
