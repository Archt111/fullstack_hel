
import { create } from 'zustand'

const anecdotesAtStart = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

const getId = () => (100000 * Math.random()).toFixed(0)

const asObject = anecdote => ({
  content: anecdote,
  id: getId(),
  votes: 0
})

const useAnecdoteStore = create((set) => ({
  anecdotes: anecdotesAtStart.map(asObject),
  filter: '',
  actions: {
    vote: id => set(state => {
      console.log('[store.actions.vote] called with id:', id)
      return {
        anecdotes: state.anecdotes.map(a =>
          a.id === id ? { ...a, votes: a.votes + 1 } : a
        )
      }
    }),
    add: content => set(state => {
      console.log('[store.actions.add] adding anecdote:', `"${content}"`)
      return {
        anecdotes: state.anecdotes.concat({ content, id: getId(), votes: 0 })
      }
    }),
    setFilter: filter => set(() => {
      console.log('[store.actions.setFilter] setting filter to:', `"${filter}"`)
      return { filter }
    }),
  },
}))

export const useAnecdotes = () => {
  const anecdotes = useAnecdoteStore((state) => state.anecdotes)
  const filter = useAnecdoteStore((state) => state.filter)
  const filtered = anecdotes.filter((anecdote) =>
    anecdote.content.toLowerCase().includes(filter.toLowerCase())
  )

  console.log(
    '[store.useAnecdotes] computed filtered anecdotes:',
    filtered.length,
    'items; filter =',
    `"${filter}"`
  )

  return filtered
}
export const useAnecdoteFilter = () => useAnecdoteStore((state) => state.filter)
export const useAnecdoteActions = () => useAnecdoteStore((state) => state.actions)
