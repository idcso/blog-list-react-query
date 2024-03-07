Cypress.Commands.add('login', (user) => {
  cy.request('POST', '/api/login', user)
    .then(response => {
      localStorage.setItem('loggedInUser', JSON.stringify(response.body))
    })
  cy.reload()
})

Cypress.Commands.add('createBlog', (blog) => {
  cy.request({
    url: '/api/blogs',
    method: 'POST',
    body: blog,
    headers: {
      'Authorization': `Bearer ${JSON.parse(localStorage.getItem('loggedInUser')).token}`
    }
  })
  cy.reload()
})