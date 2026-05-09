import { useEffect } from 'react'
import AnecdoteForm from './components/AnecdoteForm'
import AnecdoteList from './components/AnecdoteList'
import Filter from './components/Filter'
import { useAnecdoteActions } from './store'

const App = () => {
  const { initialize } = useAnecdoteActions()

  useEffect(() => {
    console.log('[App.useEffect] calling initialize')
    initialize().catch((error) => {
      console.log('[App.useEffect] initialize failed:', error.message)
    })
  }, [initialize])

  return (
    <div>
      <h2>Anecdotes</h2>
      <Filter />
      <AnecdoteList />
      <AnecdoteForm />
    </div>
  )
}

export default App
