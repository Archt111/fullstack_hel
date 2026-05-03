import { useEffect, useState } from 'react'
import axios from '../util/apiClient'

import List from './List'
import Form from './Form'

const TodoView = () => {
  const [todos, setTodos] = useState([])

  const refreshTodos = async () => {
  try {
    const { data } = await axios.get('/todos')
    setTodos(Array.isArray(data) ? data : (data.todos || []))
  } catch (error) {
    console.error("Failed to fetch todos:", error)
    setTodos([]) 
  }
}

  useEffect(() => {
    const fetchTodos = async () => { await refreshTodos(); };
    fetchTodos();
  }, [])

  const createTodo = async (todo) => {
    const { data } = await axios.post('/todos', todo)
    setTodos([...todos, data])
  }

  const deleteTodo = async (todo) => {
    await axios.delete(`/todos/${todo._id}`)
    refreshTodos()
  }

  const completeTodo = async (todo) => {
    await axios.put(`/todos/${todo._id}`, {
      text: todo.text,
      done: true
    })
    refreshTodos()
  }

  return (
    <>
      <h1>Todos</h1>
      <Form createTodo={createTodo} />
      <List todos={todos} deleteTodo={deleteTodo} completeTodo={completeTodo} />
    </>
  )
}

export default TodoView
