import React, { useEffect, useState } from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom'
import Home from './Home'
import Signup from './Signup'
import Login from './Login'
import Profile from './Profile'
import NoUser from './NoUser'

const App = () => (
  <Router>
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route path="/signup">
        <Signup />
      </Route>
      <Route path="/login">
        <Login />
      </Route>
      <Route path="/profile/:username">
        <Profile />
      </Route>
      <Route path="/noUser/:username">
        <NoUser />
      </Route>
    </Switch>
  </Router>
)

export default App