import React from 'react'
import { useAnecdotes, useAnecdoteActions } from '../store'
import { useNotificationActions } from '../notificationStore'

const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>

const AnecdoteList = () => {
  const anecdotes = useAnecdotes()
  const { vote } = useAnecdoteActions()
  const { setNotification } = useNotificationActions()
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
                  onClick={async () => {
                    console.log('[AnecdoteList.voteClick] clicked id:', anecdote.id)
                    await vote(anecdote.id)
                    setNotification(`you voted '${anecdote.content}'`, 5)
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
