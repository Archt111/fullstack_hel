import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import Todo from './Todo'

describe('Todo Component', () => {
  it('renders the todo text', () => {
    const mockTodo = { _id: '1', text: 'Learn Docker', done: false }
    const mockDeleteTodo = vi.fn()
    const mockCompleteTodo = vi.fn()

    render(
      <Todo 
        todo={mockTodo} 
        deleteTodo={mockDeleteTodo} 
        completeTodo={mockCompleteTodo} 
      />
    )

    expect(screen.getByText('Learn Docker')).toBeInTheDocument()
  })

  it('shows "not done" status for incomplete todos', () => {
    const mockTodo = { _id: '1', text: 'Learn Docker', done: false }
    const mockDeleteTodo = vi.fn()
    const mockCompleteTodo = vi.fn()

    render(
      <Todo 
        todo={mockTodo} 
        deleteTodo={mockDeleteTodo} 
        completeTodo={mockCompleteTodo} 
      />
    )

    expect(screen.getByText('This todo is not done')).toBeInTheDocument()
  })

  it('shows "done" status for completed todos', () => {
    const mockTodo = { _id: '1', text: 'Learn Docker', done: true }
    const mockDeleteTodo = vi.fn()
    const mockCompleteTodo = vi.fn()

    render(
      <Todo 
        todo={mockTodo} 
        deleteTodo={mockDeleteTodo} 
        completeTodo={mockCompleteTodo} 
      />
    )

    expect(screen.getByText('This todo is done')).toBeInTheDocument()
  })

  it('calls deleteTodo when delete button is clicked', async () => {
    const user = userEvent.setup()
    const mockTodo = { _id: '1', text: 'Learn Docker', done: false }
    const mockDeleteTodo = vi.fn()
    const mockCompleteTodo = vi.fn()

    render(
      <Todo 
        todo={mockTodo} 
        deleteTodo={mockDeleteTodo} 
        completeTodo={mockCompleteTodo} 
      />
    )

    const deleteButton = screen.getAllByRole('button', { name: /Delete/i })[0]
    await user.click(deleteButton)

    expect(mockDeleteTodo).toHaveBeenCalledWith(mockTodo)
  })

  it('calls completeTodo when "Set as done" button is clicked', async () => {
    const user = userEvent.setup()
    const mockTodo = { _id: '1', text: 'Learn Docker', done: false }
    const mockDeleteTodo = vi.fn()
    const mockCompleteTodo = vi.fn()

    render(
      <Todo 
        todo={mockTodo} 
        deleteTodo={mockDeleteTodo} 
        completeTodo={mockCompleteTodo} 
      />
    )

    const completeButton = screen.getByRole('button', { name: /Set as done/i })
    await user.click(completeButton)

    expect(mockCompleteTodo).toHaveBeenCalledWith(mockTodo)
  })

  it('only shows delete button for completed todos', () => {
    const mockTodo = { _id: '1', text: 'Learn Docker', done: true }
    const mockDeleteTodo = vi.fn()
    const mockCompleteTodo = vi.fn()

    render(
      <Todo 
        todo={mockTodo} 
        deleteTodo={mockDeleteTodo} 
        completeTodo={mockCompleteTodo} 
      />
    )

    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(1)
    expect(buttons[0]).toHaveTextContent('Delete')
  })
})
