import React from 'react';

const NotesList = ({ notes, deleteNote, id, user, selectNotesByMember, setNotes }) => {
    const handleDelete = async (noteId) => {
        try {
            await deleteNote(noteId);
            // Fetch updated notes after deletion
            const memberId = id;
            const userId = user ? user.id : null;
            const memberNotes = await selectNotesByMember(memberId, userId);
            setNotes(memberNotes);
        } catch (error) {
            console.error('Error deleting note:', error);
        }
    };

    return (
        <div>
            <h2>Anotações:</h2>
            <div className="grid grid-cols-1 gap-4">
                {notes && notes.length > 0 ? (
                    notes.map(note => (
                        <div key={note.id} className="p-4 border rounded-lg shadow-md flex justify-between align-items-center">
                            <span className='px-2'>
                                <p>{note.text}</p>
                                <p className="text-gray-500 text-sm">Criado em: {new Date(note.date).toLocaleString('pt-BR')}</p>
                            </span>
                            <button
                                onClick={() => handleDelete(note.id)}
                                className="mt-2 text-red-600 hover:text-red-800"
                            >
                                ❌
                            </button>
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-gray-500">Não há anotações para este membro</p>
                )}
            </div>
        </div>
    );
};

export default NotesList;
