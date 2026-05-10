import { useState, useEffect } from 'react'
import { Link, Routes, Route, useMatch } from 'react-router-dom'
import { Container, AppBar, Toolbar, Button, Alert, TextField } from '@mui/material'
import BlogForm from './components/BlogForm'
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
    blogService.getAll().then((blogs) => setBlogs(blogs))
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

    setBlogs(blogs.map((currentBlog) => (currentBlog.id === blog.id ? updatedBlog : currentBlog)))
  }

  const handleDelete = async (blog) => {
    if (!window.confirm(`Remove blog '${blog.title}' by ${blog.author}?`)) return

    try {
      await blogService.remove(blog.id)
      setBlogs(blogs.filter((b) => b.id !== blog.id))
      setSuccessMessage(`blog '${blog.title}' removed`)
      setTimeout(() => setSuccessMessage(null), 5000)
    } catch {
      setErrorMessage('failed to delete blog')
      setTimeout(() => setErrorMessage(null), 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    blogService.setToken(null)
    setUser(null)
  }

  const loginForm = () => (
    /* {<form onSubmit={handleLogin}>
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
    </form>} */
    <div style={{ marginTop: 20 }}>
      <h2>Log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>
          <TextField label="username" value={username} onChange={({ target }) => setUsername(target.value)} />
        </div>
        <div style={{ marginTop: 10 }}>
          <TextField
            label="password"
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <Button variant="contained" color="primary" type="submit" style={{ marginTop: 10 }}>
          login
        </Button>
      </form>
    </div>
  )

  const blogList = () => {
    const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)
    return (
      <div style={{ marginTop: 20 }}>
        <h2>blogs</h2>
        {sortedBlogs.map((blog) => (
          <div key={blog.id} style={{ marginBottom: 10 }}>
            <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
          </div>
        ))}
      </div>
    )
  }

  const createBlogPage = () => (
    <div style={{ marginTop: 20 }}>
      <h2>create new blog</h2>
      <BlogForm createBlog={createBlog} />
    </div>
  )

  const navigation = () => (
    <AppBar position="static">
      <Toolbar>
        <div style={{ fontSize: '1.2em', fontWeight: 'bold', marginRight: 'auto' }}>Blog App</div>
        <Button color="inherit" component={Link} to="/">
          Blogs
        </Button>
        {user && (
          <>
            <Button color="inherit" component={Link} to="/create">
              new blog
            </Button>
            <Button color="inherit" onClick={handleLogout}>
              logout
            </Button>
          </>
        )}
        {!user && (
          <Button color="inherit" component={Link} to="/login">
            login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  )

  const blogMatch = useMatch('/blogs/:id')
  const matchedBlog = blogMatch ? blogs.find((blog) => blog.id === blogMatch.params.id) : null

  const singleBlogView = () => {
    if (!matchedBlog) return <div>blog not found</div>

    const isOwnBlog = user && matchedBlog.user && (user.id === matchedBlog.user.id || user.id === matchedBlog.user._id)

    return (
      <div style={{ marginTop: 20 }}>
        <h1>{matchedBlog.title}</h1>
        <p style={{ fontSize: '0.9em', color: '#666' }}>by {matchedBlog.author}</p>
        <p>
          <strong>Link:</strong> <a href={matchedBlog.url} target="_blank" rel="noreferrer">{matchedBlog.url}</a>
        </p>
        <p><strong>Added by:</strong> {matchedBlog.user?.name}</p>
        <p>
          <strong>Likes:</strong> {matchedBlog.likes}
          {user && <Button variant="contained" size="small" onClick={() => handleLike(matchedBlog)} style={{ marginLeft: 10 }}>Like</Button>}
        </p>
        {isOwnBlog && <Button variant="contained" color="error" onClick={() => handleDelete(matchedBlog)}>Remove</Button>}
      </div>
    )
  }

  return (
    <Container>
      {navigation()}
      {successMessage && <Alert severity="success">{successMessage}</Alert>}
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      <Routes>
        <Route path="/" element={user ? blogList() : loginForm()} />
        <Route path="/login" element={!user ? loginForm() : blogList()} />
        <Route path="/create" element={user ? createBlogPage() : loginForm()} />
        <Route path="/blogs/:id" element={user ? singleBlogView() : loginForm()} />
      </Routes>
    </Container>
  )
}

export default App
