export default function ListForm({ todoData, editingTodoId, handleAddTodo, handleEditTodo, closeModal, handleChange }) {
    const { text, checked } = todoData;
    return <>
    
        <fieldset >
            <h3>{editingTodoId ? 'Редактировать задание?' : 'Добавить задание?'}</h3>
            <textarea placeholder="Введите текс..." value={text} onChange={handleChange('todoData')}></textarea>
            <label>
                <input type="checkbox" checked={checked} onChange={handleChange('checked')} />Завершено
            </label>
            <button onClick={editingTodoId ? handleEditTodo : handleAddTodo}>{editingTodoId ? 'Сохранить' : 'Добавить'}</button>
            <button type="button" onClick={closeModal}>Закрыть</button>
        </fieldset>

    </>;
}