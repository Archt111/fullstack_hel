import React from 'react'
import { useAnecdotes, useAnecdoteActions } from '../store'
import { useNotificationActions } from '../notificationStore'

const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>

const AnecdoteList = ({ anecdotes, voteAnecdote }) => {
  // const anecdotes = useAnecdotes()
  // const { vote } = useAnecdoteActions()
  const storeAnecdotes = useAnecdotes()
  const { vote } = useAnecdoteActions()
  const { setNotification } = useNotificationActions()
  const anecdotesToShow = anecdotes ?? storeAnecdotes
  const voteFn = voteAnecdote ?? vote
  // We keep this line so old path is easy to compare while reading:
  // const visibleAnecdotes = storeAnecdotes.toSorted((a, b) => b.votes - a.votes)
  const visibleAnecdotes = anecdotesToShow.toSorted((a, b) => b.votes - a.votes)
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
                    // Old way:
                    // await vote(anecdote.id)
                    // New way for 6.18/6.19:
                    await voteFn(anecdote.id)
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
