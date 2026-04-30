import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import BlogForm from './BlogForm'

test('<BlogForm /> calls createBlog with correct details', async () => {
  const createBlog = vi.fn()
  const user = userEvent.setup()

  render(<BlogForm createBlog={createBlog} />)

  await user.type(screen.getByLabelText('title'), 'Test title')
  await user.type(screen.getByLabelText('author'), 'Test author')
  await user.type(screen.getByLabelText('url'), 'http://example.com/blog')
  await user.click(screen.getByRole('button', { name: 'create' }))

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0]).toEqual({
    title: 'Test title',
    author: 'Test author',
    url: 'http://example.com/blog'
  })
})