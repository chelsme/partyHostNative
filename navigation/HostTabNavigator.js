import React from 'react';
import {
    StyleSheet, Text, View, Button, TextInput, AlertIOS,
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
            selectedParty: null,
            partyName: null,
            guests: [],
            guestCount: 0,
            taskCount: null,
            songCount: null
        }
    }

    changeTabs = (tabId, partyID, partyName) => {
        this.setState({
            selectedTab: tabId,
            selectedParty: partyID,
            partyName: partyName
        })
    }

    getGuestList = (guestList) => {
        this.setState({
            guests: guestList,
            // guestCount: guestList.length
        })
    }

    setTaskCount = (count) => {
        this.setState({
            taskCount: count
        })
    }

    setSongCount = (count) => {
        this.setState({
            songCount: count
        })
    }

    cancelParty = (party) => {
        AlertIOS.alert(
            'Cancel Party',
            `Would you like to cancel ${this.state.partyName}?`,
            [
                { text: 'NO', onPress: () => AlertIOS.alert('phew!'), style: 'cancel' },
                {
                    text: 'YES', onPress: () => {
                        fetch(`http://localhost:3000/parties/${party}`, {
                            method: 'DELETE', // or 'PUT'
                        })
                            .then(this.setState({
                                selectedTab: 'partyList'
                            }))
                    }
                },
            ]
        )
    }

    logOut = () => {
        this.props.logOut()
    }

    render() {
        const partyList = <PartyListScreen changeTabs={this.changeTabs} userID={this.props.userID} getGuestList={this.getGuestList} />
        return (
            this.state.selectedTab === 'partyList' ?
                partyList
                : <TabBarIOS>
                    <TabBarIOS.Item
                        title="Guests"
                        selected={this.state.selectedTab === 'guests'}
                        icon={require('../assets/crowd.png')}
                        onPress={() => this.changeTabs('guests', this.state.selectedParty, this.state.partyName)}>
                        <View>
                            <GuestsScreen name={this.props.name} userID={this.props.userID} selectedParty={this.state.selectedParty} partyName={this.state.partyName} getGuestList={this.getGuestList} />
                        </View>
                    </TabBarIOS.Item>
                    <TabBarIOS.Item
                        title="Lists"
                        selected={this.state.selectedTab === 'lists'}
                        icon={require('../assets/lists.png')}
                        onPress={() => this.changeTabs('lists', this.state.selectedParty, this.state.partyName)}>
                        <View>
                            <ListsScreen name={this.props.name} userID={this.props.userID} selectedParty={this.state.selectedParty} partyName={this.state.partyName} guests={this.state.guests} setTaskCount={this.setTaskCount} />
                        </View>
                    </TabBarIOS.Item>
                    <TabBarIOS.Item
                        title="Party"
                        selected={this.state.selectedTab === 'profile'}
                        icon={require('../assets/partyhost.png')}
                        onPress={() => {
                            if (this.state.selectedTab === 'profile') {
                                this.changeTabs('partyList', this.state.selectedParty, this.state.partyName)
                                return partyList
                            } else { this.changeTabs('profile', this.state.selectedParty, this.state.partyName) }
                        }}>
                        <View>
                            <ProfileScreen name={this.props.name} userID={this.props.userID} selectedParty={this.state.selectedParty} partyName={this.state.partyName} guestCount={this.state.guestCount} taskCount={this.state.taskCount} songCount={this.state.songCount} guests={this.state.guests} />
                        </View>
                    </TabBarIOS.Item>
                    <TabBarIOS.Item
                        title="Playlist"
                        selected={this.state.selectedTab === 'playlist'}
                        icon={require('../assets/music.png')}
                        onPress={() => this.changeTabs('playlist', this.state.selectedParty, this.state.partyName)}>
                        <View>
                            <PlaylistScreen name={this.props.name} userID={this.props.userID} selectedParty={this.state.selectedParty} partyName={this.state.partyName} setSongCount={this.setSongCount} />
                        </View>
                    </TabBarIOS.Item>
                    <TabBarIOS.Item
                        title="more"
                        selected={this.state.selectedTab === 'more'}
                        systemIcon='more'
                        onPress={() => this.changeTabs('more', this.state.selectedParty, this.state.partyName)}>
                        <View style={{ display: "flex", alignItems: "center", margin: 20 }}>
                            <Text style={{ textAlign: "center", margin: 20, fontSize: 30, textDecorationLine: 'underline' }}>MORE</Text>
                            <TouchableOpacity style={styles.textButton}>
                                <Text
                                    onPress={() => this.cancelParty(this.state.selectedParty)}
                                    title="Cancel Party"
                                    style={styles.text}
                                    accessibilityLabel="Cancel Party"
                                >Cancel Party
                                </Text>
                            </TouchableOpacity>
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