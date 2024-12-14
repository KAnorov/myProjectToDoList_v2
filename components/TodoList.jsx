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
    const { data: todo, error, isValidating, mutate } = useSWR(URL_APP, fetcher);

    const editTodo = async (id, todo) => {
        const response = await fetch(`${URL_APP}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(todo),
        });
        setIsModalOpen(false);
        if (!response.ok) {
            setIsModalOpen(false);
            throw new Error('Ошибка при редактировании задания');
        }
        return response.json();
    };

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

    const handleAddTodo = async () => {
        try {
            await addTodo(todoData);
            toast.success('Задание успешно добавлено');
            setTodoData({ text: '', checked: false });
            setIsModalOpen(false);
        } catch (error) {
            toast.error(error.message);
        }

        mutate();
    }
    const handleDeleteTodo = async (id) => {
        try {
            const response = await fetch(`${URL_APP}/${id}`, { method: 'DELETE' });
            if (!response.ok) {
                throw new Error('Ошибка при удалении задания');
            }
            toast.success('Задание успешно удалено');
        } catch (error) {
            toast.error(error.message);
        }
        mutate();
    };

    const handleEditTodo = async () => {
        try {
            await editTodo(editingTodoId, todoData);
            toast.success('Задание успешно обновлено');
            setTodoData({ text: '', checked: false });
            setEditingTodoId(null);
            setIsModalOpen(false);
        } catch (error) {
            toast.error(error.message);
        }
        mutate();
    };

    function openModalForEdit(todo) {
        const { id, text, checked } = todo;
        setEditingTodoId(id);
        setTodoData({ text, checked });
        setIsModalOpen(true);
    }

    function closeModal() {
        setIsModalOpen(false);
        setTodoData({ text: '', checked: false });
        setEditingTodoId(null);
    }
    function handleChange(field) {
        return (e) => {
            switch (field) {
                case 'todoData':
                    setTodoData({ ...todoData, text: e.target.value });
                    break;
                case 'checked':
                    setTodoData({ ...todoData, checked: e.target.checked });
                    break;
            }
        };
    }

    if (isValidating) return <div>Загрузка заданий...</div>;
    if (error) return <div>Ошибка загрузки заданий: {error.message}</div>;

    return <>
        <div className="container">
            <TDListModal
                todo={todo}
                openModalForAdd={() => {
                    setTodoData({ text: '', checked: false });
                    setEditingTodoId(null);
                    setIsModalOpen(true);
                }}
                openModalForEdit={openModalForEdit}
                handleDeleteTodo={handleDeleteTodo}
            />
            {isModalOpen && (
                <div className="modal">
                    <ListForm
                        isModalOpen={isModalOpen}
                        handleChange={handleChange}
                        todoData={todoData}
                        setTodoData={setTodoData}
                        editingTodoId={editingTodoId}
                        handleAddTodo={handleAddTodo}
                        handleEditTodo={handleEditTodo}
                        closeModal={closeModal}
                    />
                </div>
            )}
        </div>
    </>;
}