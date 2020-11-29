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
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const history = useHistory()

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)
  // CHANGE
  const handleSubmit = async () => {
    try {
      await axios.post('/api/send', { recipient: solidRecipient, notificationText: solidMessage, sender: user })
      handleClose()
    } catch (e) {
      alert(`Error sending solid: ${e}`)
    }
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
      history.push('/profile')
    } catch (e) {
      alert(`Error logging out: ${e}`)
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
          <div>
            <ListGroup variant="flush">
              {solidz.map(s => {
                let sndr = <a href={`/profile/${s.sender}`}>{s.sender}</a>;
                let rcpnt = <a href={`/profile/${s.recipient}`}>{s.recipient}</a>;
                (
                  <div key={s._id}>
                    <ListGroup.Item>{sndr} sent {rcpnt} a solid: {s.notificationText}</ListGroup.Item>
                  </div>
              )})}
            </ListGroup>
          </div>
          {/* <div>
            <Question isLoggedIn={isLoggedIn} question={currQuestion} />
          </div> */}
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

export default Home
