import React, { useState, useEffect } from 'react';
import Form from './Form';
import Todo from './Todo';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import '../style/list.css'

const List = ({ onLogout }) => {
  const [todos, setTodos] = useState([]);

  const fetchTodos = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/todos', { withCredentials: true });
      setTodos(response.data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const addTodo = async (todo) => {
    if (!todo.text) {
      toast.error("Todo can't be empty!");
      return;
    }

    const isDuplicate = todos.some(value => value.text.toLowerCase() === todo.text.toLowerCase());

    if (isDuplicate) {
      toast.error("This task is already in the list");
      return;
    }

    try {
      await axios.post('http://localhost:5001/api/todos', todo, { withCredentials: true });
      fetchTodos();
      toast.success("Task Added Successfully");
    } catch (error) {
      toast.error("Error adding task");
    }
  };

  const updateTodo = async (todoId, newValue) => {
    if (!newValue.text) return;

    const isDuplicate = todos.some(value => value.id !== todoId && value.text.toLowerCase() === newValue.text.toLowerCase());

    if (isDuplicate) {
      toast.error("This task is already in the list");
      return;
    }

    try {
      await axios.put(`http://localhost:5001/api/todos/${todoId}`, newValue, { withCredentials: true });
      fetchTodos();
      toast.success("Task Updated Successfully");
    } catch (error) {
      toast.error("Error updating task");
    }
  };

  const removeTodo = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/api/todos/${id}`, { withCredentials: true });
      fetchTodos();
      toast.success("Task Deleted Successfully");
    } catch (error) {
      toast.error("Error deleting task");
    }
  };

  const completeTodo = async (id) => {
    const updatedTodo = todos.find(todo => todo.id === id);
    const updated = { ...updatedTodo, isComplete: !updatedTodo.isComplete };

    try {
      await axios.put(`http://localhost:5001/api/todos/${id}`, updated, { withCredentials: true });
      fetchTodos();
    } catch (error) {
      toast.error("Error updating task status");
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5001/api/logout', {}, { withCredentials: true });
      onLogout();
      toast.success("Logged Out");
    } catch (error) {
      toast.error("Error logging out");
    }
  };

  return (
    <div className='todo'>
      <button className='list-btn' onClick={handleLogout}>Logout</button>
      <h1>What's the plan for Today?</h1>
      <Form onSubmit={addTodo} updateTodo={updateTodo} />
      <Todo
        todos={todos}
        completeTodo={completeTodo}
        removeTodo={removeTodo}
        updateTodo={updateTodo}
      />
      <ToastContainer position="top-center" />
    </div>
  );
};

export default List;
