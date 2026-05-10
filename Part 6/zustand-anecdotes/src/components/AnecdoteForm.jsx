import { useAnecdoteActions } from '../store'
import { useNotificationActions } from '../notificationStore'

const AnecdoteForm = ({ addAnecdote }) => {
  // const { add } = useAnecdoteActions()
  const { add } = useAnecdoteActions()
  const { setNotification } = useNotificationActions()
  const addFn = addAnecdote ?? add

  const handleSubmit = async (e) => {
    e.preventDefault()
    const content = e.target.anecdote.value
    console.log('[AnecdoteForm.handleSubmit] submit content:', `"${content}"`)
    // Old way (zustand action directly):
    // await add(content)
    // New way for 6.17/6.19: mutation from custom hook.
    await addFn(content)
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
