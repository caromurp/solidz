import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {
  BrowserRouter as Router,
  useHistory,
} from 'react-router-dom'
import s from 'styled-components'
import Button from 'react-bootstrap/Button'
import Navbar from 'react-bootstrap/Navbar'
import Modal from 'react-bootstrap/Modal'
import ListGroup from 'react-bootstrap/ListGroup'
import Form from 'react-bootstrap/Form'

const getSolidz = async setSolidz => {
  const solidz = await axios.get('/api', {})
  const solidzList = solidz.data
  setSolidz(solidzList)
}

const getUser = async setUser => {
  const u = await axios.get('/account/user', {})
  setUser(u.data)
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

const Home = () => {
  const [solidz, setSolidz] = useState([])
  const [show, setShow] = useState(false)
  const [solidMessage, setSolidMessage] = useState('')
  const [solidRecipient, setSolidRecipient] = useState('')
  const [user, setUser] = useState('')
  const [searchedUser, setSearchedUser] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const history = useHistory()

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)
  
  const handleSubmit = async () => {
    try {
      await axios.post('/api/send', { recipient: solidRecipient, notificationText: solidMessage, sender: user })
      handleClose()
    } catch (e) {
      alert(`Error sending solid: ${e}`)
    }
  }
  const handleSearch = async () => {
    try {
      const isUser = await axios.get(`/account/isUser/${searchedUser}`)
      const { data } = isUser
      if (data) {
        history.replace(`/profile/${searchedUser}`)
      } else {
        history.replace(`/noUser/${searchedUser}`)
      }
    } catch (e) {
      alert(`Error searching user: ${e}`)
    }
  }

  const handleChangeSearch = e => {
    const { target } = e
    const { value } = target
    setSearchedUser(value)
  }
  const handleChangeMessage = e => {
    const { target } = e
    const { value } = target
    setSolidMessage(value)
  }
  const handleChangeRecipient = e => {
    const { target } = e
    const { value } = target
    setSolidRecipient(value)
  }

  const handleLogout = async () => {
    try {
      await axios.post('/account/logout', {})
      history.push('/login')
    } catch (e) {
      alert(`Error logging out: ${e}`)
    }
  }
  const handleProfile = async () => {
    try {
      history.push(`/profile/${user}`)
    } catch (e) {
      alert(`Error going to profile: ${e}`)
    }
  }
  const handleLogin = async () => {
    try {
      history.push('/login')
    } catch (e) {
      alert('Cannot switch to login')
    }
  }

  useEffect(() => {
    const intervalID = setInterval(() => {
      getSolidz(setSolidz)
      getUser(setUser)
      getIsLoggedIn(setIsLoggedIn)
    }, 2000)
    return () => clearInterval(intervalID)
  }, [])

  return (
    <Router>
      <div>
        <Navbar className="bg-light justify-content-between">
          <Navbar.Brand>SOLIDZ</Navbar.Brand>
          {isLoggedIn && (
            <div>
              <Navbar.Text>Hello {user}</Navbar.Text>
              <Button variant="primary" onClick={handleProfile}>Profile</Button>
              <Button variant="secondary" onClick={handleLogout}>Logout</Button>
            </div>
          )}
        </Navbar>
        <Container>
          <SubContainer>
            <Form>
              <Form.Group controlId="formSearchUser">
                <Form.Control type="username" placeholder="Search for users" onChange={handleChangeSearch}/>
                <Form.Text className="text-muted">
                  Search for other solidz users.
                </Form.Text>
              </Form.Group>
              <Button variant="primary" type="button" onClick={handleSearch}>
                Search
              </Button>
            </Form>
              {isLoggedIn ? (
                <div>
                  <Button variant="primary" onClick={handleShow}>
                    Send a Solid!
                  </Button>
                  <Modal
                    show={show}
                    onHide={handleClose}
                    backdrop="static"
                    keyboard={false}
                  >
                    <Modal.Header closeButton>
                      <Modal.Title>Send a Solid!</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <div className="form-group">
                        <input
                          type="text"
                          className="form-control"
                          name="newSolidRecipient"
                          placeholder="Recipient's username"
                          onChange={e => handleChangeRecipient(e)}
                        />
                        <input
                          type="text"
                          className="form-control"
                          name="newSolidMessage"
                          placeholder="Message"
                          onChange={e => handleChangeMessage(e)}
                        />
                      </div>
                    </Modal.Body>
                    <Modal.Footer>
                      <Button variant="secondary" onClick={handleClose}>
                        Close
                      </Button>
                      <Button variant="primary" onClick={handleSubmit}>Send</Button>
                    </Modal.Footer>
                  </Modal>
                </div>
              ) : (
                <div>
                  <Button variant="link" onClick={handleLogin}>Login to send and receive solidz!</Button>
                </div>
              )}
          </SubContainer>
          <div>
            <ListGroup variant="flush">
              {solidz.map(s => {
                let sndr = <a href={`/profile/${s.sender}`}>{s.sender}</a>
                let rcpnt = <a href={`/profile/${s.recipient}`}>{s.recipient}</a>
                return (
                  <div key={s._id}>
                    <ListGroup.Item>{sndr} sent {rcpnt} a solid: {s.notificationText}</ListGroup.Item>
                  </div>
                )
              })}
            </ListGroup>
          </div>
        </Container>
      </div>
    </Router>
  )
}

const Container = s.div`
  display: flex;
  justify-content: space-evenly;
  flex-direction: row;
`
const SubContainer = s.div`
  display: flex;
  justify-content: space-evenly;
  flex-direction: column;
`

export default Home