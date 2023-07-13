import React, { useEffect, useState } from 'react';

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await fetch('http://localhost:2000/api/todos');
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const addTodo = async () => {
    try {
      const response = await fetch('http://localhost:2000/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description }),
      });
      const data = await response.json();
      setTodos([...todos, data]);
      setTitle('');
      setDescription('');
     
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const updateTodo = async (id) => {
    try {
      // Find the todo with the matching ID
      const todoToUpdate = todos.find((todo) => todo._id === id);
      if (!todoToUpdate) {
        console.error('Todo not found');
        return;
      }
  
      const updatedTitle = prompt('Enter updated title:', todoToUpdate.title);
      const updatedDescription = prompt('Enter updated description:', todoToUpdate.description);
  
      // Make the update request
      const response = await fetch(`http://localhost:2000/api/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: updatedTitle, description: updatedDescription }),
      });
      const data = await response.json();
  
      // Update the todo in the list
      setTodos(todos.map((todo) => (todo._id === id ? data : todo)));
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };
  
  
  const deleteTodo = async (id) => {
    try {
      await fetch(`http://localhost:2000/api/todos${id}`, {
        method: 'DELETE',
      });
      setTodos(todos.filter((todo) => todo._id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  return (
    <div>
      <h1>Todo List</h1>
      <form onSubmit={addTodo}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
       
        <button type="submit">Add Todo</button>
      </form>
      <ul>
        {todos.map((todo) => (
          <li key={todo._id}>
            <div>
              <strong>{todo.title}</strong>
              <p>{todo.description}</p>
            
              <button onClick={() => updateTodo(todo._id)}>Update</button>
              <button onClick={() => deleteTodo(todo._id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
