import { useState, useEffect, useRef } from 'react'
import blogService from './services/blogs'
import loginService from './services/login'
import { Blogs } from './components/Blogs'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState('')
  const [style, setStyle] = useState('')

  const blogFormRef = useRef()

  useEffect(() => {
    (async () => setBlogs(await blogService.getAll()))()
  }, [])

  useEffect(() => {
    const localUser = JSON.parse(window.localStorage.getItem('loggedInUser'))
    if (localUser) {
      setUser(localUser)
    }
  }, [])

  const createNotification = (message, style) => {
    setNotification(message)
    setTimeout(() => setNotification(''), 5000)
    setStyle(style)
  }

  const userLogin = async (userObj) => {
    try {
      const user = await loginService.userLogin(userObj)
      createNotification('successfully logged in', 'success')
      setUser(user)
      window.localStorage.setItem('loggedInUser', JSON.stringify(user))
      return user
    } catch (error) {
      createNotification('wrong username or password', 'error')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedInUser')
    setUser(null)
    createNotification('successfully logged out', 'success')
  }

  const createBlog = async (blogObj, token) => {
    try {
      const blog = await blogService.createNewBlog(blogObj, token)
      setBlogs(blogs.concat(blog))
      createNotification(`a new blog ${blog.title} by ${blog.author} added`, 'success')
      blogFormRef.current.toggleVisibility()
      return blog
    } catch (error) {
      createNotification('title or url is not provided', 'error')
    }
  }

  const handleBlogLike = async (blog) => {
    return await blogService.likeBlog(blog)
  }

  const handleDeleteBlog = async (id, token = user.token) => {
    await blogService.deleteBlog(id, token)
    const leftBlogs = blogs.filter(blog => blog.id !== id)
    setBlogs(leftBlogs)
  }

  return (
    <div>
      {!user && (
        <LoginForm
          userLogin={userLogin}
          message={notification}
          style={style}
        />
      )}
      {user && (
        <div>
          <h2>blogs</h2>
          <Notification message={notification} style={style} />
          <p>
            {user.username} logged in
            <button onClick={handleLogout}>logout</button>
          </p>
          <Togglable buttonLabel='new blog' ref={blogFormRef}>
            <BlogForm
              createBlog={createBlog}
              token={user.token}
            />
          </Togglable>
          <Blogs
            blogs={blogs}
            username={user.username}
            handleBlogLike={handleBlogLike}
            handleDeleteBlog={handleDeleteBlog}
          />
        </div>
      )}
    </div>
  )
}

export default App