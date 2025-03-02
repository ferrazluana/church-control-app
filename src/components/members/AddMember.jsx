import React, { useState, useEffect } from 'react';
import { createMember } from '../../controllers/membersController';
import { useNavigate } from 'react-router-dom';
import Layout from '../Layout';
import { addMemberToMinistry, getMinistriesActives } from '../../controllers/ministryController';
import { enrollMemberInCourse } from '../../controllers/memberCoursesController';
import { getCourses } from '../../controllers/coursesController';

const AddMember = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
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
        personality_test: [],
        love_language: [],
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
            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        };
        fetchCourses();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const memberDataToSubmit = {
                ...memberData,
                date_of_birth: memberData.date_of_birth || null,
                baptism_date: memberData.baptism_date || null,
                marriage_date: memberData.marriage_date || null,
            };
            console.log('Creating member with data:', memberDataToSubmit);

            const newMember = await createMember(memberDataToSubmit);
            console.log('Member created:', newMember);

            for (const ministryId of selectedMinistries) {
                try {
                    await addMemberToMinistry(newMember.id, ministryId);
                } catch (error) {
                    console.error(`Error linking member to ministry ${ministryId} ${newMember.id}:`, error);
                }
            }

            for (const courseId of selectedCourses) {
                try {
                    await enrollMemberInCourse(newMember.id, courseId);
                } catch (error) {
                    console.error(`Error enrolling member in course ${courseId}:`, error);
                }
            }

            navigate('/members');
        } catch (error) {
            console.error('Error creating member:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            setMemberData(prev => ({ ...prev, [name]: checked }));
        } else if (name === 'personality_test' || name === 'love_language') {
            const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
            setMemberData(prev => ({ ...prev, [name]: selectedOptions }));
        } else {
            setMemberData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleMinistryChange = (ministryId) => {
        setSelectedMinistries((prev) =>
            prev.includes(ministryId) ? prev.filter(id => id !== ministryId) : [...prev, ministryId]
        );
    };

    const handleCourseChange = (courseId) => {
        setSelectedCourses((prev) =>
            prev.includes(courseId) ? prev.filter(id => id !== courseId) : [...prev, courseId]
        );
    };

    const nextStep = () => {
        setCurrentStep(currentStep + 1);
    };

    const prevStep = () => {
        setCurrentStep(currentStep - 1);
    };

    return (
        <Layout>
            <div className="max-w-4xl mx-auto p-6">
                <div className="md:flex md:items-center md:justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Adicionar Novo Membro</h1>
                        <p className="mt-2 text-sm text-gray-700">
                            Preencha os dados do novo membro
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow px-6 py-8 rounded-lg">
                    {currentStep === 1 && (
                        <div className="space-y-6">
                             {/* Active/Inactive Toggle */}
                             <div className="space-y-6 ">
                                <h2 className="text-lg font-medium text-gray-900">Status do Membro</h2>
                                <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
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
                            <div className="space-y-6 pt-6 border-t border-gray-200">
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
                                        <label className="block text-sm font-medium text-gray-700">Endereço</label>
                                        <input
                                            type="text"
                                            name="address"
                                            value={memberData.address}
                                            onChange={handleChange}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500"
                                            placeholder="Rua, número, bairro, cidade"
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
                                    )}
                                    {memberData.marital_status === 'married' && (
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
                                    )}
                                </div>
                            </div>
                            {/* Church Information */}
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
                           

                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={nextStep}
                                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                                >
                                    Próximo
                                </button>
                            </div>
                        </div>
                    )}

                    {currentStep === 2 && (
                        <div className="space-y-6">
                            {/* Ministries Section */}
                            <div>
                                <h2 className="text-lg font-medium text-gray-900 mb-4">Ministérios</h2>
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

                            {/* Courses Section */}
                            <div>
                                <h2 className="text-lg font-medium text-gray-900 mb-4">Cursos</h2>
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

                            <div className="flex justify-between">
                                <button
                                    type="button"
                                    onClick={prevStep}
                                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                                >
                                    Voltar
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                                >
                                    {loading ? 'Salvando...' : 'Salvar'}
                                </button>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </Layout>
    );
};

export default AddMember;
