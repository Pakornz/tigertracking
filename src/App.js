import React, { Component } from 'react';
import allReducers from './reducers/index.js';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import RouterComponent from './Router';
import { StyleProvider } from 'native-base';
import getTheme from './theme/components';
import variables from './theme/variables/commonColor';

const store = createStore(allReducers);

export default class App extends Component {
  render() {
    return (

      <StyleProvider style={getTheme(variables)}>
        <Provider store={store}>
          <RouterComponent />
        </Provider>
      </StyleProvider>

    );
  }
}