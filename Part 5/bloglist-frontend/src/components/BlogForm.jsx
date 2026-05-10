import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TextField, Button } from '@mui/material'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (event) => {
    event.preventDefault()
    createBlog({ title, author, url })
    setTitle('')
    setAuthor('')
    setUrl('')
    navigate('/')
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <TextField label="title" id="title" value={title} onChange={({ target }) => setTitle(target.value)} fullWidth />
      </div>
      <div style={{ marginTop: 10 }}>
        <TextField label="author" id="author" value={author} onChange={({ target }) => setAuthor(target.value)} fullWidth />
      </div>
      <div style={{ marginTop: 10 }}>
        <TextField label="url" id="url" value={url} onChange={({ target }) => setUrl(target.value)} fullWidth />
      </div>
      <Button variant="contained" color="primary" type="submit" style={{ marginTop: 10 }}>
        create
      </Button>
    </form>
  )
}

export default BlogForm
