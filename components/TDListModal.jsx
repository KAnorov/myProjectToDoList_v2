export default function TDListModal({ todo, openModalForAdd, openModalForEdit, handleDeleteTodo, handleToggleComplete }) {
    return (
        <div>
            <h2>Список задач</h2>
            <button onClick={openModalForAdd}>Добавить задачу</button>
            <ul>
                {todo?.map(todoItem => (
                    <li key={todoItem.id}>
                        <div className="div-content">
                            <span style={{ textDecoration: todoItem.checked ? 'line-through' : 'none' }}>
                                {todoItem.text}
                            </span>
                        </div>
                        <div className="button-click">
                            <button onClick={() => openModalForEdit(todoItem)}>🖊 </button>
                            <button onClick={() => handleDeleteTodo(todoItem.id)}>❌</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
