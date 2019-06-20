import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';

import logo from './assets/logo.svg';
import './App.css';

import Login from './Login.js';
import { defaultQueueRender, Table } from './Table.js';
import GoogleItem from './GoogleItem.js';

const loggedInRender = () => {
  return sessionStorage.getItem('user:credentials') ? (
    <Redirect to="/queue" />
  ) : (
    <Redirect to="/login" />
  );
};

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <div className="jumbotron text-center">
            <img src={logo} className="App-logo" alt="logo" />
          </div>
          <Route exact path="/" render={loggedInRender}/>
          <Route exact path="/login" component={Login} />
          <Route exact path="/queue" render={defaultQueueRender}/>
          <Route exact path="/queue/:queueName" component={Table} />
          <Route exact path="/queue/google/:jid" component={GoogleItem} />
        </div>
      </Router>
    );
  }
}

export default App;
