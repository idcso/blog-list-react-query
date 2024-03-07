import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Blog } from './Blogs'

describe('<Blog />', () => {
  const blog = {
    title: 'test blog title',
    author: 'test author',
    url: 'test url',
    likes: 444,
    user: {
      username: 'test username'
    }
  }
  const mockHandler = jest.fn()

  let container

  beforeEach(() => {
    container = render(<Blog blog={blog} handleBlogLike={mockHandler} />).container
  })

  test('renders the blog with title and author, but without url and likes', () => {
    const element = screen.getByText('test blog title test author')
    expect(element).toBeDefined()

    const div = container.querySelector('.blogInfo')
    expect(div).not.toBeInTheDocument()
  })

  test('after clicking the button, url and likes are displayed', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const div = container.querySelector('.blogInfo')
    expect(div).toBeInTheDocument()
  })

  test('when clicked twice, the event handler is called twice', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockHandler.mock.calls).toHaveLength(2)
  })
})