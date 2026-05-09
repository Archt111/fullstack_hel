import { useAnecdoteActions } from '../store'

const AnecdoteForm = () => {
  const { add } = useAnecdoteActions()

  const handleSubmit = (e) => {
    e.preventDefault()
    const content = e.target.anecdote.value
    console.log('[AnecdoteForm.handleSubmit] submit content:', `"${content}"`)
    add(content)
    e.target.reset()
  }

  return (
      <div>
        <h2>create new</h2>
        <form onSubmit={handleSubmit}>
          <div><input name='anecdote'/></div>
          <button type='submit'>create</button>
        </form>
      </div>
  )
}

export default AnecdoteForm
