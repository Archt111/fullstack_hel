import { useState } from 'react'
import { Link } from 'react-router-dom'

const Blog = ({ blog, handleLike, handleDelete, user, isSingleView = false }) => {
  const [detailsVisible, setDetailsVisible] = useState(isSingleView)
/*
const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    //border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }
    
const toggleDetails = () => { setDetailsVisible(!detailsVisible)}
*/

  const isOwnBlog = user && blog.user && (user.id === blog.user.id || user.id === blog.user._id)
  return (
    <div>
      <div>
        <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
      </div>
      {detailsVisible && (
        <div>
          <div>{blog.url}</div>
          <div>
            likes {blog.likes}
            {user && <button type="button" onClick={() => handleLike(blog)}>like</button>}
          </div>
          <div>{blog.user?.name}</div>
          {isOwnBlog && <button type="button" onClick={() => handleDelete(blog)}>remove</button>}
        </div>
      )}
    </div>
  )
}

export default Blog
