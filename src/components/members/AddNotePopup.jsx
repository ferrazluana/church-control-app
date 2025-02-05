import React, { useState } from 'react';

const AddNotePopup = ({ isOpen, onClose, onAddNote }) => {
    const [text, setText] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onAddNote(text);
        setText('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded shadow-md w-96">
                <h2 className="text-lg font-bold mb-4">Adicionar Anotação</h2>
                <form onSubmit={handleSubmit}>
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        rows="4"
                        className="w-full border border-gray-300 rounded-md p-2"
                        placeholder="Escreva sua anotação aqui..."
                        required
                    />
                    <div className="flex justify-end mt-4">
                        <button type="button" onClick={onClose} className="mr-2 bg-gray-300 px-4 py-2 rounded">Cancelar</button>
                        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Adicionar Anotação</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddNotePopup;
