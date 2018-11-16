import React from 'react';

import { StyleSheet, Text, View, Button, TextInput, Alert, Image } from 'react-native';
import { underline } from 'ansi-colors';
import ProfileScreen from './ProfileScreen';
import MainTabNavigator from '../navigation/MainTabNavigator'

export default class HomeScreen extends React.Component {
    constructor(props) {
        super(props)
        console.log("props", typeof props);
        this.state = {
            loginH: false,
            loginG: false,
            userInfo: false
        }
    }

    onPressLoginH = () => {
        console.log('log in')
        this.setState((state, props) => {
            return { loginH: !state.loginH };
        });
        this.state.loginG ? this.setState({ loginG: false }) : null
    }

    onPressLoginG = () => {
        console.log('log in')
        this.setState((state, props) => {
            return { loginG: !state.loginG };
        });
        this.state.loginH ? this.setState({ loginH: false }) : null
    }

    goToProfile = () => {
        console.log("i'm a new page")
        this.props.navigator.push({
            title: 'profileScreen',
            component: ProfileScreen,
            passProps: { myElement: 'some value' }
        })
    }

    async logInFB() {
        try {
            const {
                type,
                token,
                expires,
                permissions,
                declinedPermissions,
            } = await Expo.Facebook.logInWithReadPermissionsAsync('524817904702380', {
                permissions: ['public_profile'],
            });
            if (type === 'success') {
                // Get the user's name using Facebook's Graph API
                const response = await fetch(`https://graph.facebook.com/me?access_token=${token}`);

                Alert.alert('Logged in!', `Hi ${(await response.json()).name}!`);
            } else {
                // type === 'cancel'
            }
        } catch ({ message }) {
            alert(`Facebook Login Error: ${message}`);
        }
    }

    render() {
        return (
            <View>
                <Text style={{ textAlign: "center", margin: 20, textDecorationLine: 'underline' }}>HOME SCREEN</Text>
                <Button
                    onPress={this.onPressLoginH}
                    title="Host Login"
                    color="#841584"
                    accessibilityLabel="Host Login"
                />
                <TextInput
                    style={{ display: this.state.loginH ? 'flex' : 'none' }}
                    placeholder='username'
                />
                <TextInput
                    style={{ display: this.state.loginH ? 'flex' : 'none' }}
                    placeholder='password'
                />
                <Button
                    onPress={this.onPressLoginG}
                    title="Guest Login"
                    color="#841584"
                    accessibilityLabel="Guest Login"
                />
                <TextInput
                    style={{ display: this.state.loginG ? 'flex' : 'none' }}
                    placeholder='username'
                />
                <TextInput
                    style={{ display: this.state.loginG ? 'flex' : 'none' }}
                    placeholder='password'
                />
                <Button
                    onPress={this.logInFB.bind(this)}
                    style={{ width: 50, height: 50, backgroundColor: 'powderblue' }}
                    title="Connect With Facebook"
                    color="#841584"
                    accessibilityLabel="Connect With Facebook"
                />
                <Button
                    onPress={this.goToProfile}
                    style={{ width: 50, height: 50, backgroundColor: 'darkblue' }}
                    title="Profile"
                    color="#841584"
                    accessibilityLabel="Profile"
                />
                <MainTabNavigator />
            </View>
        );
    }
}