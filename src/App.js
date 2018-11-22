import React, { Component } from 'react';
import './App.css';
import GoogleMapsContainer from './components/Map.js'


class App extends Component {
  render() {
    return (
      <div className="App">
        <GoogleMapsContainer/>
      </div>
    );
  }
}

export default App;
