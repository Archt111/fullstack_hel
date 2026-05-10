import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import AnecdoteList from './AnecdoteList'

const voteMock = vi.fn()

vi.mock('../store', () => ({
  useAnecdotes: vi.fn(() => [
    { id: '1', content: 'lowest', votes: 1 },
    { id: '2', content: 'highest', votes: 9 },
    { id: '3', content: 'middle', votes: 4 },
  ]),
  useAnecdoteActions: vi.fn(() => ({
    vote: voteMock,
  })),
}))

vi.mock('../notificationStore', () => ({
  useNotificationActions: vi.fn(() => ({
    setNotification: vi.fn(),
  })),
}))

describe('AnecdoteList', () => {
  it('6.13 renders anecdotes sorted by votes (high to low)', () => {
    const { container } = render(<AnecdoteList />)
    const fullText = container.textContent || ''
    const highestIndex = fullText.indexOf('highest')
    const middleIndex = fullText.indexOf('middle')
    const lowestIndex = fullText.indexOf('lowest')

    expect(highestIndex).toBeGreaterThan(-1)
    expect(middleIndex).toBeGreaterThan(-1)
    expect(lowestIndex).toBeGreaterThan(-1)
    expect(highestIndex).toBeLessThan(middleIndex)
    expect(middleIndex).toBeLessThan(lowestIndex)
    expect(screen.getAllByText('vote')).toHaveLength(3)
  })
})
