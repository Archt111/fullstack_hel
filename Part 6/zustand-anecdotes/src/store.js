
import { create } from 'zustand'
import anecdoteService from './services/anecdotes'

// const getId = () => (100000 * Math.random()).toFixed(0)

const useAnecdoteStore = create((set) => ({
  anecdotes: [],
  filter: '',
  actions: {
    // vote: id => set(state => {
    //   console.log('[store.actions.vote] called with id:', id)
    //   return {
    //     anecdotes: state.anecdotes.map(a =>
    //       a.id === id ? { ...a, votes: a.votes + 1 } : a
    //     )
    //   }
    // }),
    vote: async (id) => {
      console.log('[store.actions.vote] called with id:', id, 'anecdote voted')
      const anecdoteToVote = useAnecdoteStore.getState().anecdotes.find(a => a.id === id)
      if (!anecdoteToVote) {
        console.log('[store.actions.vote] missing id:', id)
        return
      }
      const updated = await anecdoteService.updateVote(anecdoteToVote)
      set(state => ({
        anecdotes: state.anecdotes.map(a => (a.id === id ? updated : a))
      }))
      console.log('[store.actions.vote] updated id:', id)
    },
    // add: content => set(state => {
    //   console.log('[store.actions.add] adding anecdote:', `"${content}"`)
    //   return {
    //     anecdotes: state.anecdotes.concat({ content, id: getId(), votes: 0 })
    //   }
    // }),
    add: async (content) => {
      console.log('[store.actions.add] called with content:', content)
      const created = await anecdoteService.createNew(content)
      set(state => ({
        anecdotes: state.anecdotes.concat(created)
      }))
      console.log('[store.actions.add] created id:', created.id)
    },
    initialize: async () => {
      console.log('[store.actions.initialize] called')
      const anecdotes = await anecdoteService.getAll()
      set(() => ({ anecdotes }))
      console.log('[store.actions.initialize] loaded count:', anecdotes.length)
    },
    setAnecdotes: (anecdotes) => set(() => ({ anecdotes })),
    setFilter: filter => set(() => {
      console.log('[store.actions.setFilter] called with filter:', filter)
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

  console.log('[store.useAnecdotes] called count:', filtered.length, 'filter:', filter)

  return filtered
}
export const useAnecdoteFilter = () => useAnecdoteStore((state) => state.filter)
export const useAnecdoteActions = () => useAnecdoteStore((state) => state.actions)
export default useAnecdoteStore
