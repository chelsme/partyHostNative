import React from 'react';
import { View, NavigatorIOS, StyleSheet, ImageBackground, Image, TouchableOpacity, Text, AlertIOS, TextInput } from 'react-native';
import HomeScreen from './screens/HomeScreen'
import HostTabNavigator from './navigation/HostTabNavigator'
import ProfileScreen from './screens/HostScreens/ProfileScreen';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

export default class App extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			loggedIn: false,
			name: null,
			userID: null,
			loginShow: false,
			signUpShow: false,
			name: "",
			userName: "",
			password: "",
			passwordVerify: "",
			loginUserName: "",
			loginPassword: "",
			allUsers: null,
		}
	}

	componentDidMount() {
		fetch('http://localhost:3000/guests')
			.then(resp => resp.json())
			.then(data => {
				this.setState({
					allUsers: data
				})
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
				let userName = (await response.json()).name
				fetch('http://localhost:3000/guests', {
					method: 'POST', // or 'PUT'
					body: JSON.stringify({ name: userName }), // data can be `string` or {object}!
					headers: {
						'Content-Type': 'application/json'
					}
				})
					.then(resp => resp.json())
					.then(data => {
						this.setState({
							name: data.name,
							userID: data.id,
							loggedIn: true
						})
					})
					.then(AlertIOS.alert('Logged in!', `Hi ${userName}!`))
			}
		} catch ({ message }) {
			alert(`Facebook Login Error: ${message}`);
		}
	}

	logOut = () => {
		this.setState({
			loggedIn: false
		})
	}

	show = (button) => {
		switch (button) {
			case 'login':
				this.setState({
					loginShow: !this.state.loginShow,
					signUpShow: false
				})
				break;
			case 'signup':
				this.setState({
					signUpShow: !this.state.signUpShow,
					loginShow: false
				})
				break;
			default:
				console.log('broke it')
		}
	}

	submit = (button) => {
		switch (button) {
			case 'login':
				sessionUser = this.state.allUsers.find((user) => {
					return user.username === this.state.loginUserName && user.password === this.state.loginPassword
				})
				sessionUser && this.state.loginUserName !== "" && this.state.loginPassword !== "" ?
					this.setState({
						userID: sessionUser.id,
						loggedIn: true
					})
					: AlertIOS.alert('Incorrect Username or Password')
				break;
			case 'signup':
				let sessionUser = this.state.allUsers.find((user) => {
					return user.name === this.state.name && user.password !== ""
				})
				let newSessionUser = this.state.allUsers.find((user) => {
					return user.name === this.state.name && user.password === ""
				})
				if (sessionUser) {
					AlertIOS.alert('Selected name or username already in use.')
				} else if (this.state.password !== this.state.passwordVerify) {
					AlertIOS.alert('Passwords do not match.')
				} else if (newSessionUser) {
					fetch(`http://localhost:3000/guests/${newSessionUser.id}`, {
						method: 'PATCH', // or 'PUT'
						body: JSON.stringify({
							username: this.state.userName,
							password: this.state.password
						}), // data can be `string` or {object}!
						headers: {
							'Content-Type': 'application/json'
						}
					})
						.then(resp => resp.json())
						.then(data => {
							this.setState({
								userID: data.id,
								loggedIn: true
							})
						})
				} else if (this.state.name !== "" && this.state.userName !== "" && this.state.password !== "") {
					fetch('http://localhost:3000/guests', {
						method: 'POST', // or 'PUT'
						body: JSON.stringify({
							name: `${this.state.name}`,
							username: this.state.userName,
							password: this.state.password
						}), // data can be `string` or {object}!
						headers: {
							'Content-Type': 'application/json'
						}
					})
						.then(resp => resp.json())
						.then(data => {
							this.setState({
								userID: data.id,
								loggedIn: true
							})
						})
				}
				break;
			default:
				console.log('broke it')
		}
	}

	handleloginUserName = (typedText) => {
		this.setState({
			loginUserName: typedText
		})
	}

	handleloginPassword = (typedText) => {
		this.setState({
			loginPassword: typedText
		})
	}

	handleSignUpName = (typedText) => {
		this.setState({
			name: typedText
		})
	}

	handleSignUpUsername = (typedText) => {
		this.setState({
			userName: typedText
		})
	}

	handleSignUpPassword = (typedText) => {
		this.setState({
			password: typedText
		})
	}

	handleSignUpPasswordVerify = (typedText) => {
		this.setState({
			passwordVerify: typedText
		})
	}

	logInAmanda = () => {
		this.setState({
			loggedIn: true,
			name: "Amanda Spence",
			userID: 2
		})
	}

	render() {
		return (
			<View style={{ flex: 1 }}>
				{this.state.loggedIn ?
					<HostTabNavigator logOut={this.logOut} name={this.state.name} userID={this.state.userID} />
					:
					<ImageBackground source={require('./assets/images/bckgd.jpg')} style={{ width: '100%', height: '120%' }}>
						<KeyboardAwareScrollView style={{ display: "flex" }}>
							<Image source={require('./assets/images/dancehostwhite.png')} style={styles.image} />

							{/* login with facebook */}
							<TouchableOpacity style={styles.textButton}>
								<Text
									onPress={this.logInFB.bind(this)}
									title="Connect With Facebook"
									style={styles.text}
									accessibilityLabel="Connect With Facebook"
								>Facebook Login
                    			</Text>
							</TouchableOpacity>

							{/* login with username */}
							<TouchableOpacity style={styles.textButton}>
								<Text
									onPress={() => this.show("login")}
									title="Login with Username"
									style={styles.text}
									accessibilityLabel="Login with Username"
								>Username Login
                    </Text>
							</TouchableOpacity>

							{/* hidden input fields */}
							<TextInput
								autoCapitalize='none'
								style={[styles.textInput, { display: this.state.loginShow ? 'flex' : 'none' }]}
								placeholder='Username'
								onChangeText={this.handleloginUserName}
								value={this.state.loginUserName}
							/>
							<TextInput
								autoCapitalize='none'
								secureTextEntry={true}
								style={[styles.textInput, { display: this.state.loginShow ? 'flex' : 'none' }]}
								placeholder='Password'
								onChangeText={this.handleloginPassword}
								value={this.state.loginPassword}
							/>
							<TouchableOpacity style={[styles.submitButton, { display: this.state.loginShow ? 'flex' : 'none' }]}
								onPress={() => this.submit("login")}>
								<Text
									title="Login"
									style={styles.text}
									accessibilityLabel="Login"
								>Login
                    </Text>
							</TouchableOpacity>

							{/* sign up */}
							<TouchableOpacity style={styles.textButton}>
								<Text
									onPress={() => this.show('signup')}
									title="Sign Up"
									style={styles.text}
									accessibilityLabel="Sign Up"
								>Sign Up
                    </Text>
							</TouchableOpacity>

							{/* hidden input fields */}
							<TextInput
								style={[styles.textInput, { display: this.state.signUpShow ? 'flex' : 'none' }]}
								placeholder='Full Name'
								onChangeText={this.handleSignUpName}
								value={this.state.name}
							/>
							<TextInput
								autoCapitalize='none'
								style={[styles.textInput, { display: this.state.signUpShow ? 'flex' : 'none' }]}
								placeholder='Username'
								onChangeText={this.handleSignUpUsername}
								value={this.state.userName}
							/>
							<TextInput
								autoCapitalize='none'
								secureTextEntry={true}
								style={[styles.textInput, { display: this.state.signUpShow ? 'flex' : 'none' }]}
								placeholder='Password'
								onChangeText={this.handleSignUpPassword}
								value={this.state.password}
							/>
							<TextInput
								autoCapitalize='none'
								secureTextEntry={true}
								style={[styles.textInput, { display: this.state.signUpShow ? 'flex' : 'none' }]}
								placeholder='Password Verify'
								onChangeText={this.handleSignUpPasswordVerify}
								value={this.state.passwordVerify}
							/>
							<TouchableOpacity style={[styles.submitButton, { display: this.state.signUpShow ? 'flex' : 'none' }]}
								onPress={() => this.submit("signup")}>
								<Text
									title="Sign Up"
									style={styles.text}
									accessibilityLabel="Sign Up"
								>Sign Up
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
						</KeyboardAwareScrollView >
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
		marginTop: 40,
		marginBottom: 10,
		width: 170,
		height: 220,
		overlayColor: "white",
		margin: 3,
		alignSelf: 'center'
	},
	textButton: {
		backgroundColor: '#4d5a63',
		opacity: 200,
		width: 200,
		height: 35,
		borderWidth: 1,
		textAlignVertical: "center",
		borderRadius: 50,
		borderWidth: 1,
		borderColor: 'white',
		marginTop: 6,
		alignSelf: 'center'
	},
	textInput: {
		backgroundColor: 'white',
		padding: 5,
		paddingLeft: 10,
		borderRadius: 50,
		width: 190,
		margin: 2,
		borderWidth: 1,
		alignSelf: 'center'
	},
	submitButton: {
		backgroundColor: 'grey',
		paddingLeft: 5,
		borderRadius: 50,
		width: 190,
		margin: 2,
		borderWidth: 1,
		alignSelf: 'center'
	},
	text: {
		color: 'white',
		textAlign: 'center',
		padding: 5,
		fontSize: 16
	}
})