import useSWR from 'swr';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import ListForm from '@/components/ListForm';
import TDListModal from '@/components/TDListModal';

const URL_APP = '/api/todo';
// const URL_APP = 'http://localhost:3333/todo';

const fetcher = async (url) => {
    const response = await fetch(url);
    console.log('fetcher=', response)
    if (!response.ok) {
        throw new Error('Ошибка при загрузке данных', 'fetch ' + response.status);
    }
    return response.json();

};
export default function TodoList() {
    const [todoData, setTodoData] = useState({ text: '', checked: false });
    const [editingTodoId, setEditingTodoId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { data: todo, error, isValidating, isLoading, mutate } = useSWR(URL_APP, fetcher);

    const addTodo = async (todo) => {
        const response = await fetch(URL_APP, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(todo),
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error('Ошибка при добавлении задания: ' + errorMessage);
        }

        return response.json();
    };
    const editTodo = async (id, todo) => {
        const response = await fetch(`${URL_APP}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(todo),
        });
        if (!response.ok) {
            throw new Error('Ошибка при редактировании задания');
        }
        return response.json();
    };
    const handleAddTodo = async () => {
        if (!todoData.text.trim()) {
            toast.error('Задание не может быть пустым!');
            return;
        }
        const newTodo = { ...todoData, id: Date.now(), createdAt: new Date() };
        mutate((currentTodos) => [...(currentTodos || []), newTodo], false);
        try {
            const addedTodo = await addTodo(todoData);
            toast.success('Задание успешно добавлено');
            mutate((currentTodos) => currentTodos.map((todo) => todo.id === newTodo.id ? { ...todo, id: addedTodo.id } : todo), false);
            setTodoData({ text: '', checked: false });
            setIsModalOpen(false);
        } catch (error) {
            toast.error(error.message);
            mutate((currentTodos) => currentTodos.filter((todo) => todo.id !== newTodo.id), false);
        }
        mutate();

    };
    const handleDeleteTodo = async (id) => {
        try {
            const response = await fetch(`${URL_APP}/${id}`, { method: 'DELETE' });
            if (!response.ok) {
                throw new Error('Ошибка при удалении задания');
            }
            toast.success('Задание успешно удалено');
            mutate();
        } catch (error) {
            toast.error(error.message);
        }
    };
    const handleEditTodo = async () => {
        if (!todoData.text.trim()) {
            toast.error('Задание не может быть пустым!');
            return;
        }
        try {
            await editTodo(editingTodoId, todoData);
            toast.success('Задание успешно обновлено');
            setTodoData({ text: '', checked: false });
            setEditingTodoId(null);
            setIsModalOpen(false);
            mutate();
        } catch (error) {
            toast.error(error.message);
        }
    };
    const handleChange = (field) => async (event) => {
        const value = field === 'checked' ? event.target.checked : event.target.value;
        setTodoData((prevTodoData) => ({ ...prevTodoData, [field]: value, }));
        if (editingTodoId) {
            try {
                const response = await fetch(`${URL_APP}/${editingTodoId}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ [field]: value }),
                });

                if (!response.ok) {
                    throw new Error('Ошибка обновления задачи');
                }
                const data = await response.json();
                console.log('Задача обновлена:', data);
            } catch (error) {
                console.error('Ошибка:', error);
            }
        }
    };
    const openModalForAdd = () => {
        setTodoData({ text: '', checked: false });
        setEditingTodoId(null);
        setIsModalOpen(true);
    };
    const openModalForEdit = (todo) => {
        setEditingTodoId(todo.id);
        setTodoData({ text: todo.text, checked: todo.checked });
        setIsModalOpen(true);
    };
    const closeModal = () => {
        setIsModalOpen(false);
        setTodoData({ text: '', checked: false });
        setEditingTodoId(null);
    };
    return <>
        <div className="container">

            <div
                style={{ position: 'absolute', fontSize: 'xxx-large', top: '200px' }}>
                {isLoading && '⌛'}
                {isValidating && '👁'}
                {error && `💀 ${error.toString()}`}
            </div>
            <TDListModal
                todo={todo}
                openModalForAdd={openModalForAdd}
                openModalForEdit={openModalForEdit}
                handleDeleteTodo={handleDeleteTodo}
            />

            {isModalOpen && (
                <div className="modal">
                    <ListForm
                        todoData={todoData}
                        editingTodoId={editingTodoId}
                        handleAddTodo={handleAddTodo}
                        handleEditTodo={handleEditTodo}
                        closeModal={closeModal}
                        handleChange={handleChange}
                    />
                </div>
            )}
        </div>
    </>;
}