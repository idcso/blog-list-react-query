import axios from 'axios'
const baseUrl = '/api/blogs'

const config = (token) => {
  const header = { headers: { Authorization: `Bearer ${token}` } }
  return header
}

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const createNewBlog = async (blog) => {
  const response = await axios.post(baseUrl, blog.blogObj, config(blog.token))
  return response.data
}

const likeBlog = async (blog) => {
  const response = await axios.put(`${baseUrl}/${blog.id}`, blog)
  return response.data
}

const deleteBlog = async (parameter) => {
  await axios.delete(`${baseUrl}/${parameter.id}`, config(parameter.token))
}

export default { getAll, createNewBlog, likeBlog, deleteBlog }
