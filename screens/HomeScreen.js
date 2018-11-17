import React from 'react';

import { StyleSheet, Text, View, Button, TextInput, Alert, Image, TouchableOpacity } from 'react-native';
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
            userInfo: false,
            loggedIn: this.props.loggedIn
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
            <View style={{ display: "flex", alignItems: "center" }}>
                <Image source={require('../assets/dancehostwhite.png')} style={styles.image} />
                <TouchableOpacity style={styles.textButton}>
                    <Text
                        onPress={this.onPressLoginH}
                        title="Host Login"
                        style={styles.text}
                        accessibilityLabel="Host Login"
                    >Host Login
                    </Text>
                </TouchableOpacity>
                <TextInput
                    style={{ display: this.state.loginH ? 'flex' : 'none', backgroundColor: 'white', padding: 5, paddingLeft: 10, borderRadius: 50, width: 190, margin: 2, borderWidth: 1 }}
                    placeholder='username'
                />
                <TextInput
                    style={{ display: this.state.loginH ? 'flex' : 'none', backgroundColor: 'white', padding: 5, paddingLeft: 10, borderRadius: 50, width: 190, margin: 2, borderWidth: 1 }}
                    placeholder='password'
                />
                <TouchableOpacity style={styles.textButton}>
                    <Text
                        onPress={this.onPressLoginG}
                        title="Host Login"
                        style={styles.text}
                        accessibilityLabel="Guest Login"
                    >Guest Login
                    </Text>
                </TouchableOpacity>
                <TextInput
                    style={{ display: this.state.loginG ? 'flex' : 'none', backgroundColor: 'white', padding: 5, paddingLeft: 10, borderRadius: 50, width: 190, margin: 2, borderWidth: 1 }}
                    placeholder='username'
                />
                <TextInput
                    style={{ display: this.state.loginG ? 'flex' : 'none', backgroundColor: 'white', padding: 5, paddingLeft: 10, borderRadius: 50, width: 190, margin: 2, borderWidth: 1 }}
                    placeholder='password'
                />
                <TouchableOpacity style={styles.textButton}>
                    <Text
                        onPress={this.logInFB.bind(this)}
                        title="Connect With Facebook"
                        style={styles.text}
                        accessibilityLabel="Connect With Facebook"
                    >Facebook Login
                    </Text>
                </TouchableOpacity>
                {/* <Button
                    onPress={this.goToProfile}
                    style={{ width: 50, height: 50, backgroundColor: 'darkblue' }}
                    title="Profile"
                    color="white"
                    accessibilityLabel="Profile"
                /> */}
                <TouchableOpacity style={styles.textButton}>
                    <Text
                        onPress={this.props.logIn}
                        title="Log In"
                        style={styles.text}
                        accessibilityLabel="Log In"
                    >Log In
                    </Text>
                </TouchableOpacity>
            </View >
        );
    }
}

const styles = StyleSheet.create({
    image: {
        marginTop: 60,
        width: 170,
        height: 220,
        overlayColor: "white",
        margin: 3
    },
    textButton: {
        backgroundColor: '#4d5a63',
        opacity: 200,
        width: 200,
        height: 40,
        borderWidth: 1,
        textAlignVertical: "center",
        borderRadius: 50,
        borderWidth: 1,
        borderColor: 'white',
        margin: 2
    },
    text: {
        color: 'white',
        textAlign: 'center',
        padding: 5,
        fontSize: 20
    }
})