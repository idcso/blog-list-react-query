import { useState } from 'react'
import Notification from './Notification'

const LoginForm = props => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleUserLogin = async event => {
    event.preventDefault()

    const user = await props.userLogin({ username, password })

    if (user) {
      setUsername('')
      setPassword('')
    }
  }

  return (
    <div>
      <h2>log in to application</h2>
      <Notification message={props.message} style={props.style} />
      <form onSubmit={handleUserLogin} className='loginForm'>
        <div>
					username
          <input
            type="text"
            value={username}
            name='Username'
            id='username'
            onChange={ ({ target }) => setUsername(target.value) }
          />
        </div>
        <div>
					password
          <input
            type="text"
            value={password}
            name='Password'
            id='password'
            onChange={ ({ target }) => setPassword(target.value) }
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}

export default LoginForm