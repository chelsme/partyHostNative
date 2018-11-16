import React from 'react';
import { View, NavigatorIOS } from 'react-native';
import HomeScreen from './screens/HomeScreen'
import MainTabNavigator from './navigation/MainTabNavigator'
import ProfileScreen from './screens/ProfileScreen';

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
          <MainTabNavigator />
          : <HomeScreen logIn={this.logIn} />}
      </View>
    )
  }
}