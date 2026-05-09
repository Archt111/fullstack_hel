import { useAnecdotes, useAnecdoteActions } from '../store'

const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>

const AnecdoteList = () => {
  const anecdotes = useAnecdotes()
  const { vote } = useAnecdoteActions()
  const visibleAnecdotes = anecdotes.toSorted((a, b) => b.votes - a.votes)
  console.log('[AnecdoteList] render; anecdotes to show =', visibleAnecdotes.length)

  return (
      <div>
        {visibleAnecdotes.map(anecdote => (
            <div key={anecdote.id}>
              <div>{anecdote.content}</div>
              <div>
                has {anecdote.votes} votes
                <Button
                  onClick={() => {
                    console.log('[AnecdoteList.voteClick] clicked id:', anecdote.id)
                    vote(anecdote.id)
                  }}
                  text='vote'
                />
              </div>
            </div>
        ))}
      </div>
  )
}

export default AnecdoteList
