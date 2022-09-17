import './App.css';

import { useState, useEffect } from "react";
import { BsTrash, BsBookmarkCheck, BsBookmarkCheckFill } from "react-icons/bs";

const API = "http://localhost:5000";

function App() {
  const [title, setTitle] = useState("");
  const [urgency, setUrgency] = useState("");
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {

    const loadData = async () => {
      setLoading(true);
      const res = await fetch(API + "/todos").then((res) => res.json()).then((data) => data).catch((err) => console.log(err));
      setLoading(false);
      setTodos(res);
    }
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const todo = {
      id: Math.random(),
      title,
      urgency,
      done: false
    };

    await fetch(API + "/todos", {
      method: "POST",
      body: JSON.stringify(todo),
      headers: {
        "Content-Type": "application/json",
      },
    });

    setTodos((prevState) => [...prevState, todo]);
    setTitle("");
    setUrgency("");
  };

  const handleDelete = async (id) => {
    await fetch(API + "/todos/" + id, {
      method: "DELETE",
    });
    setTodos((prevState) => prevState.filter((todo) => todo.id !== id));
  };

  const handleEdit = async (todo) => {
    todo.done = !todo.done;

    const data = await fetch(API + "/todos/" + todo.id, {
      method: "PUT",
      body: JSON.stringify(todo),
      headers: {
        "Content-Type": "application/json",
      },
    });

    setTodos((prevState) => 
      prevState.map((t) => (t.id === data.id ? (t = data) : t))
    );
  };

  if (loading) {
    return (
      <div className='total'>
        <h4>Carregando conteúdo!</h4>
      </div>
    )
  }

  return (
    <div className='App'>
      <div className="header-todo">
        <h1>React to-do <code>📓</code></h1>
      </div>

      <div className="form-todo">
        <h2>Inserir nova tarefa:</h2>
        <form onSubmit={handleSubmit}>
          <div className='form-control'>
            <label htmlFor="description">Descrição da Tarefa:</label>
            <input
              type="text"
              placeholder='Título...'
              name="description"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
              required
            />
          </div>
          <div className='form-control'>
            <label htmlFor="urgency">Urgência da Tarefa:</label>
            <input
              type="text"
              placeholder='Referência...'
              name="urgency"
              onChange={(e) => setUrgency(e.target.value)}
              value={urgency}
              required
            />
          </div>
          <input type="submit" value="Criar tarefa" />
        </form>
      </div>

      <div className="list-todo">
        <h2>Lista de tarefas:</h2>
        {todos.length === 0 && <p>Não há tarefas!</p>}
        {todos.map((todo) => (
          <div className='todo' key={todo.id}>
            <h3 className={todo.done ? "todo-done" : ""}>{todo.title}</h3>
            <p>
              Urgência da Tarefa: <code className={
                todo.urgency === "Azul" ? "blue" : 
                todo.urgency === "Verde" ? "green" : 
                todo.urgency === "Amarela" ? "yellow" : 
                todo.urgency === "Laranja" ? "orange" : 
                todo.urgency === "Vermelha" ? "red" : "color"}> 
                {todo.urgency}</code> 
            </p>
            <div className="actions">
              <span onClick={() => handleEdit(todo)}>{!todo.done ? <BsBookmarkCheck/> : <BsBookmarkCheckFill/>}</span>
              <BsTrash onClick={() => handleDelete(todo.id)}/>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
