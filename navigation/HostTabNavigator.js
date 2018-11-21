import React from 'react';
import {
    StyleSheet, Text, View, Button, TextInput, Alert,
    Image, TabBarIOS, TabBarItem, NavigatorIOS, TouchableOpacity
} from 'react-native';

import { Ionicons, FontAwesome } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons';
// import Icon from 'react-native-icons'

import GuestsScreen from '../screens/HostScreens/GuestsScreen'
import HomeScreen from '../screens/HomeScreen'
import ListsScreen from '../screens/HostScreens/ListsScreen'
import PlaylistScreen from '../screens/HostScreens/PlaylistScreen'
import ProfileScreen from '../screens/HostScreens/ProfileScreen'
import PartyListScreen from '../screens/PartyListScreen';


goToPage = () => {
    globalProps.navigator.push({
        title: 'profileScreen',
        component: ProfileScreen,
        passProps: { myElement: 'some value' }
    })
}

export default class HostTabNavigator extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            selectedTab: 'partyList',
            selectedParty: null
        }
    }

    changeTabs = (tabId, partyID) => {
        this.setState({
            selectedTab: tabId,
            selectedParty: partyID
        })
    }

    logOut = () => {
        this.props.logOut()
    }

    render() {
        const partyList = <PartyListScreen changeTabs={this.changeTabs} userID={this.props.userID} />
        return (
            this.state.selectedTab === 'partyList' ?
                partyList
                : <TabBarIOS>
                    <TabBarIOS.Item
                        title="Guests"
                        selected={this.state.selectedTab === 'guests'}
                        icon={require('../assets/crowd.png')}
                        onPress={() => this.changeTabs('guests', this.state.selectedParty)}>
                        <View>
                            <GuestsScreen name={this.props.name} userID={this.props.userID} selectedParty={this.state.selectedParty} />
                        </View>
                    </TabBarIOS.Item>
                    <TabBarIOS.Item
                        title="Lists"
                        selected={this.state.selectedTab === 'lists'}
                        icon={require('../assets/lists.png')}
                        onPress={() => this.changeTabs('lists', this.state.selectedParty)}>
                        <View>
                            <ListsScreen name={this.props.name} userID={this.props.userID} selectedParty={this.state.selectedParty} />
                        </View>
                    </TabBarIOS.Item>
                    <TabBarIOS.Item
                        title="Profile"
                        selected={this.state.selectedTab === 'profile'}
                        icon={require('../assets/partyhost.png')}
                        onPress={() => {
                            if (this.state.selectedTab === 'profile') {
                                this.changeTabs('partyList', this.state.selectedParty)
                                return partyList
                            } else { this.changeTabs('profile', this.state.selectedParty) }
                        }}>
                        <View>
                            <ProfileScreen name={this.props.name} userID={this.props.userID} selectedParty={this.state.selectedParty} />
                        </View>
                    </TabBarIOS.Item>
                    <TabBarIOS.Item
                        title="Playlist"
                        selected={this.state.selectedTab === 'playlist'}
                        icon={require('../assets/music.png')}
                        onPress={() => this.changeTabs('playlist', this.state.selectedParty)}>
                        <View>
                            <PlaylistScreen name={this.props.name} userID={this.props.userID} selectedParty={this.state.selectedParty} />
                        </View>
                    </TabBarIOS.Item>
                    <TabBarIOS.Item
                        title="more"
                        selected={this.state.selectedTab === 'more'}
                        systemIcon='more'
                        onPress={() => this.changeTabs('more', this.state.selectedParty)}>
                        <View style={{ display: "flex", alignItems: "center", margin: 30 }}>
                            <TouchableOpacity style={styles.textButton}>
                                <Text
                                    onPress={this.logOut}
                                    title="Logout"
                                    style={styles.text}
                                    accessibilityLabel="Logout"
                                >Logout
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </TabBarIOS.Item>
                </TabBarIOS>
        )
    }
}

const styles = StyleSheet.create({
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