import { useEffect, useRef } from 'react'
import blogService from './services/blogs'
import loginService from './services/login'
import { Blogs } from './components/Blogs'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import { useContext } from 'react'
import UserContext from './UserContext'
import { useNotificationDispatch } from './NotificationContext'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

const App = () => {
  const [user, userDispatch] = useContext(UserContext)
  const dispatch = useNotificationDispatch()
  const blogFormRef = useRef()
  const queryClient = useQueryClient()

  const newBlogMutation = useMutation({
    mutationFn: blogService.createNewBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    },
  })

  const likeBlogMutation = useMutation({
    mutationFn: blogService.likeBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    },
  })

  const deleteBlogMutation = useMutation({
    mutationFn: blogService.deleteBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    },
  })

  useEffect(() => {
    const localUser = JSON.parse(window.localStorage.getItem('loggedInUser'))
    if (localUser) {
      userDispatch({
        type: 'SETUP_USER',
        user: localUser,
      })
    }
  }, [])

  const result = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
  })

  if (result.isLoading) {
    return <div>loading data...</div>
  }

  const blogs = result.data

  const createNotification = (message, style) => {
    dispatch({
      type: 'CREATE_NOTIFICATION',
      message: message,
      style: style,
    })
    setTimeout(
      () =>
        dispatch({
          type: 'CREATE_NOTIFICATION',
          message: '',
          style: '',
        }),
      5000
    )
  }

  const userLogin = async (userObj) => {
    try {
      const user = await loginService.userLogin(userObj)
      createNotification('successfully logged in', 'success')
      userDispatch({
        type: 'SETUP_USER',
        user,
      })
      window.localStorage.setItem('loggedInUser', JSON.stringify(user))
      return user
    } catch (error) {
      createNotification('wrong username or password', 'error')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedInUser')
    userDispatch({
      type: 'SETUP_USER',
      user: null,
    })
    createNotification('successfully logged out', 'success')
  }

  const createBlog = (blogObj, token) => {
    try {
      newBlogMutation.mutate({ blogObj, token })
      createNotification(
        `a new blog ${blogObj.title} by ${blogObj.author} added`,
        'success'
      )
      blogFormRef.current.toggleVisibility()
    } catch (error) {
      createNotification('title or url is not provided', 'error')
    }
  }

  const handleBlogLike = async (blog) => {
    likeBlogMutation.mutate(blog)
  }

  const handleDeleteBlog = async (id, token = user.token) => {
    deleteBlogMutation.mutate({ id, token })
  }

  return (
    <div>
      {!user && <LoginForm userLogin={userLogin} />}
      {user && (
        <div>
          <h2>blogs</h2>
          <Notification />
          <p>
            {user.username} logged in
            <button onClick={handleLogout}>logout</button>
          </p>
          <Togglable buttonLabel="new blog" ref={blogFormRef}>
            <BlogForm createBlog={createBlog} />
          </Togglable>
          <Blogs
            blogs={blogs}
            handleBlogLike={handleBlogLike}
            handleDeleteBlog={handleDeleteBlog}
          />
        </div>
      )}
    </div>
  )
}

export default App
