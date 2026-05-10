import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import anecdoteService from '../services/anecdotes'
import { useAnecdoteFilter } from '../store'

export const useAnecdotes = () => {
  const queryClient = useQueryClient()
  const filter = useAnecdoteFilter()

  // Grab anecdotes from backend and keep them cached here.
  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: anecdoteService.getAll,
    retry: false,
  })

  // Create new anecdote on server, then update cache so UI updates right away.
  const createMutation = useMutation({
    mutationFn: anecdoteService.createNew,
    onSuccess: (created) => {
      const anecdotes = queryClient.getQueryData(['anecdotes']) || []
      queryClient.setQueryData(['anecdotes'], anecdotes.concat(created))
    },
  })

  // Vote on anecdote on server, then replace that one item in cache.
  const voteMutation = useMutation({
    mutationFn: anecdoteService.updateVote,
    onSuccess: (updated) => {
      const anecdotes = queryClient.getQueryData(['anecdotes']) || []
      queryClient.setQueryData(
        ['anecdotes'],
        anecdotes.map((a) => (a.id === updated.id ? updated : a))
      )
    },
  })

  const anecdotes = (result.data || []).filter((anecdote) =>
    anecdote.content.toLowerCase().includes(filter.toLowerCase())
  )

  const addAnecdote = async (content) => {
    await createMutation.mutateAsync(content)
  }

  const voteAnecdote = async (id) => {
    const anecdote = (queryClient.getQueryData(['anecdotes']) || []).find((a) => a.id === id)
    if (!anecdote) return
    await voteMutation.mutateAsync(anecdote)
  }

  return {
    anecdotes,
    isPending: result.isPending,
    isError: result.isError,
    addAnecdote,
    voteAnecdote,
  }
}

