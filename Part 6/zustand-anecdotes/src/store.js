
import { create } from 'zustand'
import anecdoteService from './services/anecdotes'

const getId = () => (100000 * Math.random()).toFixed(0)

const useAnecdoteStore = create((set) => ({
  anecdotes: [],
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
    initialize: async () => {
      console.log('[store.actions.initialize] start')
      const anecdotes = await anecdoteService.getAll()
      set(() => ({ anecdotes }))
      console.log('[store.actions.initialize] store updated with anecdotes:', anecdotes.length)
    },
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
