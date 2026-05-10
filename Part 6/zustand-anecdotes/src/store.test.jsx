import { beforeEach, describe, expect, it, vi } from 'vitest'
import { act, renderHook } from '@testing-library/react'

vi.mock('./services/anecdotes', () => ({
  default: {
    getAll: vi.fn(),
    createNew: vi.fn(),
    updateVote: vi.fn(),
  },
}))

import anecdoteService from './services/anecdotes'
import useAnecdoteStore, { useAnecdotes, useAnecdoteActions } from './store'

beforeEach(() => {
  useAnecdoteStore.setState({ anecdotes: [], filter: '' })
  vi.clearAllMocks()
})

describe('anecdote store', () => {
  it('6.12 initialize loads anecdotes from backend', async () => {
    const mockAnecdotes = [
      { id: '1', content: 'first', votes: 0 },
      { id: '2', content: 'second', votes: 3 },
    ]
    anecdoteService.getAll.mockResolvedValue(mockAnecdotes)

    const { result } = renderHook(() => useAnecdoteActions())

    await act(async () => {
      await result.current.initialize()
    })

    const { result: anecdotesResult } = renderHook(() => useAnecdotes())
    expect(anecdotesResult.current).toEqual(mockAnecdotes)
  })

  it('6.14 useAnecdotes returns filtered anecdotes', () => {
    useAnecdoteStore.setState({
      anecdotes: [
        { id: '1', content: 'react hooks', votes: 1 },
        { id: '2', content: 'zustand store', votes: 2 },
      ],
      filter: 'zustand',
    })

    const { result } = renderHook(() => useAnecdotes())
    expect(result.current).toEqual([
      { id: '2', content: 'zustand store', votes: 2 },
    ])
  })

  it('6.15 vote increases anecdote votes', async () => {
    const anecdote = { id: '1', content: 'test anecdote', votes: 2 }
    useAnecdoteStore.setState({ anecdotes: [anecdote], filter: '' })
    anecdoteService.updateVote.mockResolvedValue({ ...anecdote, votes: 3 })

    const { result } = renderHook(() => useAnecdoteActions())

    await act(async () => {
      await result.current.vote('1')
    })

    const updated = useAnecdoteStore.getState().anecdotes.find((a) => a.id === '1')
    expect(updated.votes).toBe(3)
  })
})

