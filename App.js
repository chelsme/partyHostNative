import React from 'react';
import { View, NavigatorIOS, StyleSheet, ImageBackground, Image, TouchableOpacity, Text, Alert } from 'react-native';
import HomeScreen from './screens/HomeScreen'
import HostTabNavigator from './navigation/HostTabNavigator'
import ProfileScreen from './screens/HostScreens/ProfileScreen';

export default class App extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			loggedIn: false,
			name: null,
			userID: null
		}
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
				let userName = (await response.json()).name
				fetch('http://localhost:3000/guests', {
					method: 'POST', // or 'PUT'
					body: JSON.stringify({ name: userName }), // data can be `string` or {object}!
					headers: {
						'Content-Type': 'application/json'
					}
				}).then(resp => resp.json()).then(data => {
					this.setState({
						name: data.name,
						userID: data.id
					})
					Alert.alert('Logged in!', `Hi ${userName}!`)
				})
				this.logIn()
			} else {
				// type === 'cancel'
			}
		} catch ({ message }) {
			alert(`Facebook Login Error: ${message}`);
		}
	}

	logIn = () => {
		this.setState({
			loggedIn: true
		})
	}

	logOut = () => {
		this.setState({
			loggedIn: false
		})
	}

	logInAmanda = () => {
		this.setState({
			loggedIn: true,
			name: "Amanda Spence",
			userID: 2
		})
	}

	// setUser = (name) => {
	//   this.setState({
	//     user: name
	//   })
	// }

	render() {
		return (
			<View style={{ flex: 1 }}>
				{this.state.loggedIn ?
					<HostTabNavigator logOut={this.logOut} name={this.state.name} userID={this.state.userID} />
					:
					<ImageBackground source={require('./assets/bckgd.jpg')} style={{ width: '100%', height: '120%' }}>
						<View style={{ display: "flex", alignItems: "center" }}>
							<Image source={require('./assets/dancehostwhite.png')} style={styles.image} />
							<TouchableOpacity style={styles.textButton}>
								<Text
									onPress={this.logInFB.bind(this)}
									title="Connect With Facebook"
									style={styles.text}
									accessibilityLabel="Connect With Facebook"
								>Facebook Login
                    			</Text>
							</TouchableOpacity>
							<TouchableOpacity style={styles.textButton}>
								<Text
									onPress={this.logInAmanda}
									title="Log In Test"
									style={styles.text}
									accessibilityLabel="Log In Test"
								>Log In Test
                    			</Text>
							</TouchableOpacity>
						</View >
					</ImageBackground>}
			</View>
		)
	}
}

const styles = StyleSheet.create({
	backgroundImage: {
		flex: 1,
		resizeMode: 'cover', // or 'stretch'
	},
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
		margin: 50
	},
	text: {
		color: 'white',
		textAlign: 'center',
		padding: 5,
		fontSize: 20
	}
})