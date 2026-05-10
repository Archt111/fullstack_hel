import { useAnecdoteActions } from '../store'
import { useNotify } from '../hooks/useNotify'

const AnecdoteForm = ({ addAnecdote }) => {
  // const { add } = useAnecdoteActions()
  const { add } = useAnecdoteActions()
  // const { setNotification } = useNotificationActions()
  const { notify } = useNotify()
  const addFn = addAnecdote ?? add

  const handleSubmit = async (e) => {
    e.preventDefault()
    const content = e.target.anecdote.value
    console.log('[AnecdoteForm.handleSubmit] submit content:', `"${content}"`)
    try {
      // Old way (zustand action directly):
      // await add(content)
      // New way for 6.17/6.19: mutation from custom hook.
      await addFn(content)
      notify(`you created '${content}'`, 5)
      e.target.reset()
    } catch {
      // 6.21 error notification is handled in mutation onError callback.
    }
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
