export default function ListForm({ todoData, editingTodoId, handleAddTodo, handleEditTodo, closeModal, handleChange }) {
    const { title, completed } = todoData;
    return <>
        <fieldset >
            <h3>{editingTodoId ? 'Редактировать задание?' : 'Добавить задание?'}</h3>
            <textarea placeholder="Введите текс..." value={title} onChange={handleChange('todoData')}></textarea>
            <label>
                <input type="checkbox" checked={completed} onChange={handleChange('completed')} />Завершено
            </label>
            <button onClick={editingTodoId ? handleEditTodo : handleAddTodo}>{editingTodoId ? 'Сохранить' : 'Добавить'}</button>
            <button type="button" onClick={closeModal}>Закрыть</button>
        </fieldset>

    </>;
}