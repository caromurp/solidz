import React, { useState } from 'react'
import {
  BrowserRouter as Router,
  Link,
  useHistory,
} from 'react-router-dom'
import axios from 'axios'
import Button from 'react-bootstrap/Button'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const history = useHistory()

  const login = async () => {
    try {
      await axios.post('/account/login', { username, password })
      history.push('/')
    } catch (e) {
      alert(`Error logging in user: ${e}`)
    }
  }

  const handleSignup = async () => {
    try {
      history.push('/signup')
    } catch (e) {
      alert('Cannot switch to signup')
    }
  }

  return (
    <div>
      <Router>
        <h1>Log In</h1>
        <form>
          <input placeholder="Username" onChange={e => setUsername(e.target.value)} />
          <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
          <Button value="Login" onClick={() => login(username, password)}>Submit</Button>
          <Button variant="link" onClick={handleSignup}>Don`t have an account? Sign up here!</Button>
        </form>
      </Router>
    </div>
  )
}

export default Login