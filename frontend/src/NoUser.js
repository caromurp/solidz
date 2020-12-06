import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {
  BrowserRouter as Router,
  useHistory,
  useParams
} from 'react-router-dom'
import s from 'styled-components'
import Button from 'react-bootstrap/Button'
import Navbar from 'react-bootstrap/Navbar'

const getUser = async setThisUser => {
  const u = await axios.get('/account/user', {})
  setThisUser(u.data)
}

const getIsLoggedIn = async setIsLoggedIn => {
  try {
    const ili = await axios.get('/account/isLoggedIn', {})
    const i = ili.data
    setIsLoggedIn(i)
  } catch (e) {
    console.log('user is not logged in')
  }
}

const NoUser = () => {
  const [thisUser, setThisUser] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const history = useHistory()
  const { username } = useParams() 

  const handleLogout = async () => {
    try {
      await axios.post('/account/logout', {})
      history.push('/login')
    } catch (e) {
      alert(`Error logging out: ${e}`)
    }
  }

  const handleHome = async () => {
    try {
      history.push('/')
    } catch (e) {
      alert(`Error switching to home: ${e}`)
    }
  }

  const handleProfile = async () => {
    try {
      history.push(`/profile/${thisUser}`)
    } catch (e) {
      alert(`Error switching users profile: ${e}`)
    }
  }

  const handleLogin = async () => {
    try {
      history.push('/login')
    } catch (e) {
      alert('Cannot switch to login')
    }
  }

  useEffect(async () => {
    const intervalID = setInterval(() => {
      getUser(setThisUser)
      getIsLoggedIn(setIsLoggedIn)
    }, 1000)
    return () => clearInterval(intervalID)
  }, [])

  return (
    <Router>
      <div>
        <Navbar className="bg-light justify-content-between">
          <Navbar.Brand>SOLIDZ</Navbar.Brand>
          {isLoggedIn ? (
            <div>
              <Navbar.Text>Hello {thisUser}</Navbar.Text>
              <Button variant="primary" onClick={handleHome}>Home</Button>
              <Button variant="primary" onClick={handleProfile}>Profile</Button>
              <Button variant="secondary" onClick={handleLogout}>Logout</Button>
            </div>
          ) : (
            <div>
              <Button variant="primary" onClick={handleHome}>Home</Button>
              <Button variant="secondary" onClick={handleLogin}>Login</Button>
            </div>
          )}
        </Navbar>
        <Container>
          <div>
            <h1>Sorry! {username} does not exist :( your search must match their exact username.</h1>
          </div>
        </Container>
      </div>
    </Router>
  )
}

const Container = s.div`
  display: flex;
  justify-content: space-between;
  flex-direction: row;
`

export default NoUser