import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import Blog from './Blog'

describe('<Blog />', () => {
  const blog = {
    title: 'Test blog title',
    author: 'Test Author',
    url: 'http://example.com/blog',
    likes: 7,
    user: {
      name: 'Blog Owner',
      id: 'user-1'
    }
  }

  test('renders title and author but hides details by default', () => {
    render(<Blog blog={blog} />)

    expect(screen.getByText('Test blog title Test Author')).toBeDefined()
    expect(screen.queryByText('http://example.com/blog')).toBeNull()
    expect(screen.queryByText('likes 7')).toBeNull()
  })

  test('shows url and likes when view is clicked', async () => {
    const user = userEvent.setup()

    render(<Blog blog={blog} />)

    await user.click(screen.getByRole('button', { name: 'view' }))

    expect(screen.getByText('http://example.com/blog')).toBeVisible()
    expect(screen.getByText('likes 7')).toBeVisible()
  })

  test('clicking like twice calls handler twice', async () => {
    const user = userEvent.setup()
    const handleLike = vi.fn()

    render(<Blog blog={blog} handleLike={handleLike} />)

    await user.click(screen.getByRole('button', { name: 'view' }))
    const likeButton = screen.getByRole('button', { name: 'like' })

    await user.click(likeButton)
    await user.click(likeButton)

    expect(handleLike.mock.calls).toHaveLength(2)
  })
})