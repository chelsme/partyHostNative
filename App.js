import React from 'react';
import { View, NavigatorIOS, StyleSheet, ImageBackground } from 'react-native';
import HomeScreen from './screens/HomeScreen'
import HostTabNavigator from './navigation/HostTabNavigator'
import ProfileScreen from './screens/HostScreens/ProfileScreen';

export default class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      loggedIn: false
    }
  }

  logIn = () => {
    this.setState({
      loggedIn: true
    })
  }

  render() {
    return (
      /* <NavigatorIOS
          initialRoute={{
            component: HomeScreen,
            title: 'My Initial Scene',
            passProps: { index: 1 },
          }}
          style={{ flex: 1 }}
        /> */
      <View style={{ flex: 1 }}>
        {this.state.loggedIn ?
          <HostTabNavigator />
          :
          <ImageBackground source={require('./assets/bckgd.jpg')} style={{ width: '100%', height: '120%' }}>
            <HomeScreen style={{ flex: 1 }} logIn={this.logIn} />
          </ImageBackground>}
      </View>
    )
  }
}

let styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // or 'stretch'
  }
})