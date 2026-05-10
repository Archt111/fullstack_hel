import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import Blog from './Blog'

vi.mock('react-router-dom', () => ({
  Link: ({ children }) => <span>{children}</span>,
  useNavigate: () => vi.fn(),
}))

describe('<Blog />', () => {
  const blog = {
    id: 'blog-1',
    title: 'Test blog title',
    author: 'Test Author',
    url: 'http://example.com/blog',
    likes: 7,
    user: {
      name: 'Blog Owner',
      id: 'user-1'
    }
  }

  test('unauthenticated users see blog info and likes, but no buttons', () => {
    render(<Blog blog={blog} isSingleView={true} />)

    expect(screen.getByText('Test blog title')).toBeDefined()
    expect(screen.getByText('http://example.com/blog')).toBeDefined()
    expect(screen.getByText('likes 7')).toBeDefined()
    expect(screen.queryByRole('button', { name: 'like' })).toBeNull()
    expect(screen.queryByRole('button', { name: 'remove' })).toBeNull()
  })

  test('authenticated non-owner sees only like button', () => {
    const loggedUser = { id: 'user-2', name: 'Different User' }

    render(<Blog blog={blog} user={loggedUser} isSingleView={true} />)

    expect(screen.getByRole('button', { name: 'like' })).toBeDefined()
    expect(screen.queryByRole('button', { name: 'remove' })).toBeNull()
  })

  test('blog creator sees both like and remove buttons', () => {
    const creatorUser = { id: 'user-1', name: 'Blog Owner' }
    render(<Blog blog={blog} user={creatorUser} isSingleView={true} />)

    expect(screen.getByRole('button', { name: 'like' })).toBeDefined()
    expect(screen.getByRole('button', { name: 'remove' })).toBeDefined()
  })
})
