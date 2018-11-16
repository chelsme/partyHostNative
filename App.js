import React from 'react';
import { StyleSheet, Text, View, Button, NavigatorIOS, } from 'react-native';
import PropTypes from 'prop-types';
import HomeScreen from './screens/HomeScreen'
export default class App extends React.Component {
  render() {
    return (
      <NavigatorIOS
        initialRoute={{
          component: HomeScreen,
          title: 'My Initial Scene',
          passProps: { index: 1 },
        }}
        style={{ flex: 1 }}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: .15,
    fontSize: 26,
    color: 'darkgreen'
  },
  subtitle: {
    flex: .1,
    fontSize: 20,
  },
  abilities: {
    paddingLeft: 3,
  },
  listItem: {
    flex: .09,
    fontSize: 16
  }
});