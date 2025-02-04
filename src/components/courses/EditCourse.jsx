import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCourses, updateCourse } from '../../controllers/coursesController';
import Layout from '../Layout'; // Assuming Layout component is in the same directory

const EditCourse = () => {
    const { id } = useParams();
    const [courseData, setCourseData] = useState({ name: '', active: true });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const course = await getCourses();
                const selectedCourse = course.find(c => c.id === parseInt(id));
                setCourseData(selectedCourse);
            } catch (error) {
                console.error('Error fetching course:', error);
            }
        };
        fetchCourse();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCourseData({ ...courseData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateCourse(id, courseData);
            alert('Curso atualizado com sucesso!');
            navigate('/courses');
        } catch (error) {
            console.error('Error updating course:', error);
        }
    };

    return (
        <Layout>
            <form onSubmit={handleSubmit} className="p-6 max-w-7xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Editar Curso</h1>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Nome do Curso</label>
                    <input
                        type="text"
                        name="name"
                        value={courseData.name}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500"
                        placeholder="Nome do Curso"
                    />
                </div>
                <div className="mb-4">
                    <label className="inline-flex items-center">
                        <input
                            type="checkbox"
                            name="active"
                            checked={courseData.active}
                            onChange={(e) => setCourseData({ ...courseData, active: e.target.checked })}
                            className="form-checkbox"
                        />
                        <span className="ml-2 text-sm text-gray-700">Ativo</span>
                    </label>
                </div>
                <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                >
                    Atualizar Curso
                </button>
            </form>
        </Layout>
    );
};

export default EditCourse;
