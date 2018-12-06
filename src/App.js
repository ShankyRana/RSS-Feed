import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { AppContainer } from 'react-hot-loader';

import './App.css';

class App extends Component {
  render() {
    return (
      <AppContainer errorReporter={Error}>
        <this.props.Component routerHistory={browserHistory} />
      </AppContainer>
    );
  }
}

export default App;
