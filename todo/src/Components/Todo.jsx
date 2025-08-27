import React, { useState } from 'react';
import { RiCloseCircleLine } from 'react-icons/ri';
import { TiEdit } from 'react-icons/ti';
import Form from './Form';
import '../style/todo.css'

const Todo = ({ todos, completeTodo, removeTodo, updateTodo }) => {
  const [editId, setEditId] = useState(null);
  const [editValue, setEditValue] = useState("");  


const submitUpdate = (value) => {
    updateTodo(editId, value);  
    setEditId(null);
    setEditValue("");
  };

  const clickEdit = (todo) => {
    setEditId(todo.id);
    setEditValue(todo.text);
  };

  return (
    <div className="todo-list">
      {todos.map((todo) => (
        <div
          className={todo.isComplete ? 'todo-row complete' : 'todo-row'}
          key={todo.id}
        >
          {editId === todo.id ? (
            <Form 
              edit={{ id: todo.id, value: editValue }}
              onSubmit={submitUpdate}
            />
          ) : (
            <div className="todo-text" onClick={() => completeTodo(todo.id)}>
              {todo.text}
            </div>
          )}
          <div className="icons">
            {editId !== todo.id && (
              <>
                <RiCloseCircleLine
                  className="delete-icon"
                  onClick={() => removeTodo(todo.id)}
                />
                <TiEdit
                  className="update-icon"
                  onClick={() => clickEdit(todo)}
                />
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Todo;
