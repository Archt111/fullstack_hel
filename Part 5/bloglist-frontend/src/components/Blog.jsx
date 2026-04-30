import { useState } from 'react'

const Blog = ({ blog, handleLike, handleDelete, user }) => {
  const [detailsVisible, setDetailsVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const toggleDetails = () => { setDetailsVisible(!detailsVisible)}

  const isOwnBlog = user && blog.user && (user.id === blog.user.id || user.id === blog.user._id)

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button onClick={toggleDetails}>{detailsVisible ? 'hide' : 'view'}</button>
      </div>
      {detailsVisible && (
        <div>
          <div>{blog.url}</div>
          <div>
            likes {blog.likes}
            <button type="button" onClick={() => handleLike(blog)}>like</button>
          </div>
          <div>{blog.user?.name}</div>
          {isOwnBlog && <button type="button" onClick={() => handleDelete(blog)}>remove</button>}
        </div>
      )}
    </div>
  )
}

export default Blog