import AnecdoteForm from './components/AnecdoteForm'
import AnecdoteList from './components/AnecdoteList'
import Filter from './components/Filter'
import Notification from './components/Notification'
import { useAnecdotes } from './hooks/useAnecdotes'

const App = () => {
  const { anecdotes, isPending, isError, addAnecdote, voteAnecdote } = useAnecdotes()

  // useEffect(() => {
  //   console.log('[App.useEffect] calling initialize')
  //   initialize().catch((error) => {
  //     console.log('[App.useEffect] initialize failed:', error.message)
  //   })
  // }, [initialize])
  // useEffect(() => {
  //   if (result.data) {
  //     setAnecdotes(result.data)
  //   }
  // }, [result.data, setAnecdotes])

  if (isPending) {
    return <div>loading data...</div>
  }

  if (isError) {
    return <div>anecdote service not available due to problems in server</div>
  }

  return (
    <div>
      <h2>Anecdotes</h2>
      <Notification />
      <Filter />
      <AnecdoteList anecdotes={anecdotes} voteAnecdote={voteAnecdote} />
      <AnecdoteForm addAnecdote={addAnecdote} />
    </div>
  )
}

export default App
