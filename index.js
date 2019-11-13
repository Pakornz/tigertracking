import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import App from './src/App';
import { name as nameApp } from './app.json';
import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings(['Remote debugger']);

export default class Index extends Component {
  render() {
    return (
      <App />
    );
  }
}
AppRegistry.registerComponent(nameApp, () => Index);

// pakorn

// pakorn github