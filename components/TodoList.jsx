import useSWR, { mutate } from 'swr';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import ListForm from '@/components/ListForm';
import TDListModal from '@/components/TDListModal';

const URL_APP = '/api/todo';
// const URL_APP = 'http://localhost:3333/todo';

const fetcher = async (url) => {
    const response = await fetch(url);
    console.log('fetcher=',response )
    if (!response.ok) {
        throw new Error('Ошибка при загрузке данных','fetch ' + response.status);
    }
   
    return response.json();
    
};

const deleteTodo = async (id, todo) => {
    const response = await fetch(`${URL_APP}/${id}`, { method: 'DELETE' });
    
    if (!response.ok) {
        throw new Error('Ошибка при удалении задания');
    }
    console.log('удалена задача=id',id )
    return true;
};

const addTodo = async (todo) => {
    const response = await fetch(URL_APP, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(todo),
    });
    if (!response.ok) {
        throw new Error('Ошибка при добавлении задания');
    }
    console.log('Добавлена задача=',todo)
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
    console.log('editTodo=',id,todo)
    return response.json();
};

export default function TodoList() {
    const [todoData, setTodoData] = useState({ title: '', completed: false });
    const [editingTodoId, setEditingTodoId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { data: todo, error, isValidating } = useSWR(URL_APP, fetcher);

    const handleAddTodo = async () => {
        try {
            await addTodo(todoData);
            toast.success('Задание успешно добавлено');
            await mutate('todo');
            setTodoData({ title: '', completed: false });
            setIsModalOpen(false);
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleDeleteTodo = async (id) => {
        try {
            await deleteTodo(id);
            toast.success('Задание успешно удалено');
            await mutate('todo');
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleEditTodo = async () => {
        try {
            await editTodo(editingTodoId, todoData);
            toast.success('Задание успешно обновлено');
            await mutate('todo');
            setTodoData({ title: '', completed: false });
            setEditingTodoId(null);
            setIsModalOpen(false);
        } catch (error) {
            toast.error(error.message);
        }
    };

    const openModalForAdd = () => {
        setTodoData({ title: '', completed: false });
        setEditingTodoId(null);
        setIsModalOpen(true);
    };

    const openModalForEdit = (todo) => {
        const { id, title, completed } = todo;
        setEditingTodoId(id);
        setTodoData({ title, completed });

        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setTodoData({ title: '', completed: false });
        setEditingTodoId(null);
    };
    const
        handleChange = (field) => (e) => {
            switch (field) {
                case 'todoData':
                    setTodoData({ ...todoData, title: e.target.value })
                    break;
                case 'completed':
                    setTodoData({ ...todoData, completed: e.target.checked })
                    break;
            }
        };

    if (isValidating) return <div>Загрузка заданий...</div>;
    if (error) return <div>Ошибка загрузки заданий: {error.message}</div>;

    return <>
        <div className="container">
            <TDListModal
                todo={todo}
                openModalForAdd={openModalForAdd}
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