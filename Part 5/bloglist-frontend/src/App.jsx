import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const loggedUser = JSON.parse(loggedUserJSON)
      setUser(loggedUser)
      blogService.setToken(loggedUser.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const loggedUser = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(loggedUser))

      blogService.setToken(loggedUser.token)
      setUser(loggedUser)
      setUsername('')
      setPassword('')
    } catch {
      setErrorMessage('wrong credentials')
      setTimeout(() => setErrorMessage(null), 5000)
    }
  }

  const createBlog = async (blogObject) => {
    try {
      const newBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(newBlog))
      setSuccessMessage(`a new blog '${newBlog.title}' by ${newBlog.author} added`)
      setTimeout(() => setSuccessMessage(null), 5000)
    } catch {
      setErrorMessage('failed to create blog')
      setTimeout(() => setErrorMessage(null), 5000)
    }
  }

  const handleLike = async (blog) => {
    const updatedBlog = await blogService.update(blog.id, {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user?.id || blog.user?._id || blog.user,
    })

    setBlogs(blogs.map(currentBlog => currentBlog.id === blog.id ? updatedBlog : currentBlog))
  }

  const handleDelete = async (blog) => {
    if (!window.confirm(`Remove blog '${blog.title}' by ${blog.author}?`)) return

    try {
      await blogService.remove(blog.id)
      setBlogs(blogs.filter(b => b.id !== blog.id))
      setSuccessMessage(`blog '${blog.title}' removed`)
      setTimeout(() => setSuccessMessage(null), 5000)
    } catch {
      setErrorMessage('failed to delete blog')
      setTimeout(() => setErrorMessage(null), 5000)
    }
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type="text"
          value={username}
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  )

  const blogList = () => {
    const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)
    return (
      <div>
        <h2>blogs</h2>
        <p>{user.name} logged in</p>
        <Togglable buttonLabel="create new blog">
          <BlogForm createBlog={createBlog} />
        </Togglable>
        {sortedBlogs.map(blog => <Blog key={blog.id} blog={blog} handleLike={handleLike} handleDelete={handleDelete} user={user} />)}
      </div>
    )
  }

  return (
    <div>
      <h2>log in to application</h2>
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {!user && loginForm()}
      {user && blogList()}
    </div>
  )
}

export default App