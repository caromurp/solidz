import React, { useState } from 'react'
import {
  BrowserRouter as Router,
  Link,
  useHistory,
} from 'react-router-dom'
import axios from 'axios'
import Button from 'react-bootstrap/Button'

const Signup = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const history = useHistory()

  const signup = async () => {
    try {
      await axios.post('/account/signup', { username, password })
      history.push('/')
    } catch (e) {
      alert(`Error signing up user: ${e}`)
    }
  }

  const handleLogin = async () => {
    try {
      history.push('/login')
    } catch (e) {
      alert('Cannot switch to login')
    }
  }

  return (
    <div>
      <Router>
        <h1>Sign Up</h1>
        <form>
          <input placeholder="Username" onChange={e => setUsername(e.target.value)} />
          <input placeholder="Password" onChange={e => setPassword(e.target.value)} />
          <Button variant="primary" value="Signup" onClick={() => signup(username, password)}>Submit</Button>
          <Button variant="link" onClick={handleLogin}>Already have an account? Log in here!</Button>
        </form>
      </Router>
    </div>
  )
}

export default Signup
