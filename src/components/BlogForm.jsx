import { useState } from 'react'
import PropTypes from 'prop-types'

const BlogForm = ({ createBlog, token }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleCreateBlog = async event => {
    event.preventDefault()

    const response = await createBlog({ title, author, url }, token)

    if (response) {
      setTitle('')
      setAuthor('')
      setUrl('')
    }
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={handleCreateBlog}>
				title:
        <input
          type="text"
          value={title}
          name='title'
          id='title'
          onChange={ ({ target }) => setTitle(target.value) }
        /><br />
				author:
        <input
          type="text"
          value={author}
          name='author'
          id='author'
          onChange={ ({ target }) => setAuthor(target.value) }
        /><br />
				url:
        <input
          type="text"
          value={url}
          name='url'
          id='url'
          onChange={ ({ target }) => setUrl(target.value) }
        /><br />
        <button datatype='create-blog'>create</button>
      </form>
    </div>
  )
}

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired,
  token: PropTypes.string.isRequired
}

export default BlogForm