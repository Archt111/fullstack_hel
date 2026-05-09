import { useAnecdoteActions } from '../store'
import { useNotificationActions } from '../notificationStore'

const AnecdoteForm = () => {
  const { add } = useAnecdoteActions()
  const { setNotification } = useNotificationActions()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const content = e.target.anecdote.value
    console.log('[AnecdoteForm.handleSubmit] submit content:', `"${content}"`)
    await add(content)
    setNotification(`you created '${content}'`, 5)
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
