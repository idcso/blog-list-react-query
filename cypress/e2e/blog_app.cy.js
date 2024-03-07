const { func } = require("prop-types")

describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', '/api/testing/reset')
    const users = [
      {
        username: 'testUser',
        password: 'password',
        name: 'test user'
      },
      {
        username: 'testUser2',
        password: 'password2',
        name: 'test user2'
      }
    ]
    cy.request('POST', '/api/users', users[0])
    cy.request('POST', '/api/users', users[1])
    cy.visit('')
  })

  it('Login form is shown', function() {
    cy.contains('log in to application')
    cy.get('.loginForm').should('exist')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('testUser')
      cy.get('#password').type('password')
      cy.contains('login').click()

      cy.contains('successfully logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('wrongUsername')
      cy.get('#password').type('wrongPassword')
      cy.contains('login').click()

      cy.contains('wrong username or password').should('have.css', 'color', 'rgb(255, 0, 0)')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({username: 'testUser', password: 'password'})
    })

    it('A blog can be created', function() {
      cy.get('.createBlog').contains('new blog').click()
      cy.get('#title').type('new test title')
      cy.get('#author').type('author')
      cy.get('#url').type('url')
      cy.get('[datatype="create-blog"]').click()

      cy.get('.blogs').should('contain', 'new test title')
    })

    describe('and when blog created', function() {
      beforeEach(function() {
        cy.createBlog({
          title: 'new test title',
          author: 'author',
          url: 'url'
        })
      })

      it('user can like a blog', function() {
        cy.contains('view').click()
        cy.get('[datatype="like-button"]').click()
        cy.get('.blog').should('contain', 'likes ' + 1)
      })

      it('user, that created a blog, can delete it', function() {
        cy.contains('view').click()
        cy.get('.blog').contains('remove').click()

        cy.get('.blog').should('not.exist')
      })

      it('only creator of the blog can see the delete button', function() {
        cy.contains('view').click()
        cy.get('.blog').should('contain', 'remove')
        cy.contains('logout').click()

        cy.login({username: 'testUser2', password: 'password2'})
        cy.contains('view').click()
        cy.get('.blog').should('not.contain', 'remove')
      })

      it('blogs are ordered according to number of likes', function() {
        cy.createBlog({
          title: 'The title with the most likes',
          author: 'author2',
          url: 'url2'
        })

        cy.createBlog({
          title: 'The title with the second most likes',
          author: 'author3',
          url: 'url3'
        })

        cy.get('.blog:nth-child(2)').contains('view').click()
        cy.get('.blog:nth-child(2) [datatype="like-button"]').click()
        cy.wait(200)
        cy.get('.blog:nth-child(2) [datatype="like-button"]').click()
        cy.wait(200)
        cy.get('.blog:nth-child(2) [datatype="like-button"]').click()
        cy.wait(200)

        cy.get('.blog:nth-child(3)').contains('view').click()
        cy.get('.blog:nth-child(3) [datatype="like-button"]').click()
        cy.wait(200)
        cy.get('.blog:nth-child(3) [datatype="like-button"]').click()
        cy.wait(200)

        cy.reload()

        cy.get('.blog').eq(0).should('contain', 'The title with the most likes')
        cy.get('.blog').eq(1).should('contain', 'The title with the second most likes')
        cy.get('.blog').eq(2).should('contain', 'new test title')
      })
    })
  })
})