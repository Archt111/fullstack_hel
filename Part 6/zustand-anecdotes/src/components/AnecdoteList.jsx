import { useAnecdotes, useAnecdoteActions } from '../store'

const Button = ({onClick, text}) => ( <button onClick={onClick}> {text}</button>)

const AnecdoteList = () => {
  const anecdotes = useAnecdotes()
  const { vote } = useAnecdoteActions()
  const sorted = anecdotes.toSorted((a, b) => b.votes - a.votes)

  return (
      <div>
        {sorted.map(anecdote => (
            <div key={anecdote.id}>
              <div>{anecdote.content}</div>
              <div>
                has {anecdote.votes} votes
                <Button onClick={() => vote(anecdote.id)} text='vote'/>
              </div>
            </div>
        ))}
      </div>
  )
}

export default AnecdoteList
