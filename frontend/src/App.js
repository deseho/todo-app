import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  // Definiere hier die URL deines Backends (kopierte öffentliche URL aus dem Ports-Tab)
  const backendUrl = 'https://musical-system-7v5p5wrpw4v6f459-5000.app.github.dev';

  // ToDos vom Backend laden
  useEffect(() => {
    fetch(`${backendUrl}/todos`)
      .then(res => res.json())
      .then(data => setTodos(data))
      .catch(err => console.error(err));
  }, [backendUrl]);

  // Neues ToDo hinzufügen
  const addTodo = () => {
    if (newTodo.trim() === "") return;
    fetch(`${backendUrl}/todos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: newTodo })
    })
      .then(res => res.json())
      .then(todo => {
        console.log('Neues Todo:', todo);
        setTodos([...todos, todo]);
        setNewTodo("");
      })
      .catch(err => console.error(err));
  };

  // ToDo löschen
  const deleteTodo = (id) => {
    fetch(`${backendUrl}/todos/${id}`, {
      method: 'DELETE'
    })
      .then(() => {
        setTodos(todos.filter(todo => todo.id !== id));
      })
      .catch(err => console.error(err));
  };

  // ToDo als erledigt markieren/abwählen
  const toggleComplete = (id, completed) => {
    fetch(`${backendUrl}/todos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !completed })
    })
      .then(res => res.json())
      .then(updatedTodo => {
        setTodos(todos.map(todo => todo.id === id ? updatedTodo : todo));
      })
      .catch(err => console.error(err));
  };

  return (
    <div className="App">
      <h1>ToDo Liste</h1>
      <div className="input-section">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Neues Todo..."
        />
        <button onClick={addTodo}>Hinzufügen</button>
      </div>
      <ul className="todo-list">
        {todos.map(todo => (
          <li key={todo.id} className={todo.completed ? "completed" : ""}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleComplete(todo.id, todo.completed)}
            />
            <span>{todo.text}</span>
            <button onClick={() => deleteTodo(todo.id)}>Löschen</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
