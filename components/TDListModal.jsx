export default function TDListModal({ todo, openModalForAdd, openModalForEdit, handleDeleteTodo }) {
    return <>
        <h2>Список задач</h2>
        <button onClick={openModalForAdd}>Добавить задачу</button>
        <ul>
            {todo?.map(todo => (
                <li key={todo.id}>
                    <div>
                        <span style={{ textDecoration: todo.checked ? 'line-through' : 'none' }}>
                            {todo.text}
                        </span>
                    </div>
                    <div>
                        <button onClick={() => openModalForEdit(todo)}>🖊 </button>
                        <button onClick={() => handleDeleteTodo(todo.id)}>❌</button>
                    </div>
                </li>
            ))}
        </ul>
    </>;

}
