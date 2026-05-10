import { useState, useEffect } from 'react'
import { Link, Navigate, Route, Routes, useMatch, useNavigate } from 'react-router-dom'
import blogService from './services/blogs'
import loginService from './services/login'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    blogService.getAll().then(blogs => {
      console.log('log blogs loaded', blogs.length)
      setBlogs(blogs)
    })
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
      console.log('log login ok')
      navigate('/')
    } catch {
      console.log('log login fail')
      setErrorMessage('wrong credentials')
      setTimeout(() => setErrorMessage(null), 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    blogService.setToken(null)
    setUser(null)
    console.log('log logout')
    navigate('/')
  }

  const createBlog = async (blogObject) => {
    try {
      const newBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(newBlog))
      setSuccessMessage(`a new blog '${newBlog.title}' by ${newBlog.author} added`)
      setTimeout(() => setSuccessMessage(null), 5000)
      console.log('log create ok', newBlog.id)
    } catch {
      setErrorMessage('failed to create blog')
      setTimeout(() => setErrorMessage(null), 5000)
      console.log('log create fail')
    }
  }

  const handleLike = async (blog) => {
    console.log('log like try', blog.id)
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user?.id || blog.user?._id || blog.user,
    }
    const returnedBlog = await blogService.update(blog.id, updatedBlog)
    setBlogs(blogs.map(b => b.id === blog.id ? returnedBlog : b))
    console.log('log like ok', blog.id)
  }

  const handleDelete = async (blog) => {
    if (window.confirm(`Remove blog '${blog.title}' by ${blog.author}?`)) {
      console.log('log delete try', blog.id)
      await blogService.remove(blog.id)
      setBlogs(blogs.filter(b => b.id !== blog.id))
      console.log('log delete ok', blog.id)
      navigate('/')
    }
  }

  const loginForm = () => (
    <div>
      <h2>log in to application</h2>
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
    </div>
  )

  const blogList = () => {
    const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)
    return (
      <div>
        <h2>blogs</h2>
        {user && <p>{user.name} logged in</p>}
        {sortedBlogs.map(blog => (
          <Blog
            key={blog.id}
            blog={blog}
            handleLike={handleLike}
            handleDelete={handleDelete}
            user={user}
          />
        ))}
      </div>
    )
  }

  const createBlogPage = () => (
    <div>
      <BlogForm createBlog={createBlog} />
    </div>
  )

  const blogMatch = useMatch('/blogs/:id')
  const matchedBlog = blogMatch ? blogs.find((blog) => blog.id === blogMatch.params.id) : null

  const singleBlogView = () => {
    if (!matchedBlog) return null
    const isOwnBlog = user && matchedBlog.user && (user.id === matchedBlog.user.id || user.id === matchedBlog.user._id)

    return (
      <div>
        <h2>{matchedBlog.title}: {matchedBlog.author}</h2>
        <div>
          <a href={matchedBlog.url} target="_blank" rel="noreferrer">{matchedBlog.url}</a>
        </div>
        <div>
          likes {matchedBlog.likes}
          {user && <button type="button" onClick={() => handleLike(matchedBlog)}>like</button>}
        </div>
        <div>Added by {matchedBlog.user?.name}</div>
        {isOwnBlog && <button type="button" onClick={() => handleDelete(matchedBlog)}>remove</button>}
      </div>
    )
  }

  return (
    <div>
      <div style={{ marginBottom: 10 }}>
        <Link style={{ marginRight: 10 }} to="/">blogs</Link>
        {!user && <Link to="/login">login</Link>}
        {user && <Link style={{ marginRight: 10 }} to="/create">new blog</Link>}
        {user && <button onClick={handleLogout}>logout</button>}
      </div>

      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

      <Routes>
        <Route path="/" element={blogList()} />
        <Route path="/login" element={user ? <Navigate to="/" replace /> : loginForm()} />
        <Route path="/create" element={user ? createBlogPage() : <Navigate to="/login" replace />} />
        <Route path="/blogs/:id" element={singleBlogView()} />
      </Routes>
    </div>
  )
}

export default App
