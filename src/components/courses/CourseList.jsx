import React, { useEffect, useState } from 'react';
import { getCourses, deleteCourse } from '../../controllers/coursesController';
import { Link } from 'react-router-dom';
import Layout from '../Layout'; // Assuming Layout component is in the same directory

const CourseList = () => {
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const data = await getCourses();
                setCourses(data);
            } catch (error) {
                console.error('Error fetching courses:', error.message || error);
            }
        };
        fetchCourses();
    }, []);

    const handleDelete = async (id) => {
        await deleteCourse(id);
        setCourses(courses.filter(course => course.id !== id));
    };

    return (
        <Layout>
            <div className="p-6 max-w-7xl mx-auto">
                <div className="sm:flex sm:items-center sm:justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Cursos</h1>
                        <p className="mt-2 text-sm text-gray-700">Lista de todos os cursos cadastrados</p>
                    </div>
                    <div className="mt-4 sm:mt-0">
                        <Link
                            to="/courses/add"
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                        >
                            <span className="mr-2">➕</span>
                            Adicionar Curso
                        </Link>
                    </div>
                </div>

                <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">Nome</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {courses.map(course => (
                                <tr key={course.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">
                                            {course.name}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${course.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{course.active ? 'Ativo' : 'Inativo'}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <Link to={`/courses/${course.id}/edit`} className="text-indigo-600 hover:text-indigo-900 mr-4">Editar</Link>
                                        <button onClick={() => handleDelete(course.id)} className="text-red-600 hover:text-red-900">Excluir</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </Layout>
    );
};

export default CourseList;
