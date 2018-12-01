import React from 'react';
import {
    StyleSheet, Text, View, Button, TextInput, AlertIOS,
    Image, TabBarIOS, TabBarItem, NavigatorIOS, TouchableOpacity
} from 'react-native';
import { createBottomTabNavigator, createSwitchNavigator } from 'react-navigation'

import { Ionicons, FontAwesome, MaterialCommunityIcons, Octicons } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/Ionicons';
// import Icon from 'react-native-icons'

import GuestsScreen from '../screens/HostScreens/GuestsScreen'
import HomeScreen from '../screens/HomeScreen'
import ListsScreen from '../screens/HostScreens/ListsScreen'
import PlaylistScreen from '../screens/HostScreens/PlaylistScreen'
import ProfileScreen from '../screens/HostScreens/ProfileScreen'
import PartyListScreen from '../screens/PartyListScreen';

const SwitchNavigator = createSwitchNavigator(
    {
        Party: PartyListScreen,
        Details: ProfileScreen,
    },
    {
        initialRouteName: 'Party',
    },
);

const LoginNavigator = createBottomTabNavigator({
    Guests:
    {
        screen: GuestsScreen,
        navigationOptions: {
            tabBarLabel: 'Guests',
            tabBarIcon: ({ tintColor }) => (
                <Ionicons name="ios-people" color={tintColor} size={24} />
            )
        }
    },
    Tasks:
    {
        screen: ListsScreen,
        navigationOptions: {
            tabBarLabel: 'Tasks',
            tabBarIcon: ({ tintColor }) => (
                <Octicons name="checklist" color={tintColor} size={24} />
            )
        }
    },
    Party:
    {
        screen: PartyListScreen,
        navigationOptions: {
            tabBarLabel: 'Party',
            tabBarIcon: ({ tintColor }) => (
                <MaterialCommunityIcons name="cupcake" color={tintColor} size={24} />
            ),
            tabBarVisible: false,
            // tabBarOnPress: (navigation) => {
            //     console.log(navigation.navigation.actions.navigate)
            //     // navigation.actions.navigate('Playlist')
            // },
        }
    },
    Playlist:
    {
        screen: PlaylistScreen,
        navigationOptions: {
            tabBarLabel: 'Playlist',
            tabBarIcon: ({ tintColor }) => (
                <Ionicons name="md-musical-notes" color={tintColor} size={24} />
            )
        }
    },
}, {
        initialRouteName: 'Party',
        // order: ['Guests', 'Tasks', 'Party', 'Playlist', 'Details'],
        navigationOptions: {
            tabBarVisible: true
        },
        tabBarOptions: {
            activeTintColor: 'red',
            inactiveTintColor: 'grey'
        }
    })




const MainNavigator = createBottomTabNavigator({
    Guests:
    {
        screen: GuestsScreen,
        navigationOptions: {
            tabBarLabel: 'Guests',
            tabBarIcon: ({ tintColor }) => (
                <Ionicons name="ios-people" color={tintColor} size={24} />
            )
        }
    },
    Tasks:
    {
        screen: ListsScreen,
        navigationOptions: {
            tabBarLabel: 'Tasks',
            tabBarIcon: ({ tintColor }) => (
                <Octicons name="checklist" color={tintColor} size={24} />
            )
        }
    },
    Party:
    {
        screen: ProfileScreen,
        navigationOptions: {
            tabBarLabel: 'Party',
            tabBarIcon: ({ tintColor }) => (
                <MaterialCommunityIcons name="cupcake" color={tintColor} size={24} />
            ),
            // tabBarOnPress: ({ navigation: onPressNavigation, defaultHandler }) => {
            //     console.log('navigation#############################################', onPressNavigation);
            //     defaultHandler();
            //     console.log('navigation2############################################', onPressNavigation);
            // },
        }
    },
    Playlist:
    {
        screen: PlaylistScreen,
        navigationOptions: {
            tabBarLabel: 'Playlist',
            tabBarIcon: ({ tintColor }) => (
                <Ionicons name="md-musical-notes" color={tintColor} size={24} />
            )
        }
    },
}, {
        initialRouteName: 'Party',
        // order: ['Guests', 'Tasks', 'Party', 'Playlist', 'Details'],
        navigationOptions: {
            tabBarVisible: true
        },
        tabBarOptions: {
            activeTintColor: 'red',
            inactiveTintColor: 'grey'
        }
    })


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
            songCount: null,
            hostID: null,
            userID: this.props.userID
        }
    }

    changeTabs = (tabId, partyID, partyName) => {
        this.setState({
            selectedTab: tabId,
            selectedParty: partyID,
            partyName: partyName
        })
    }

    setHostID = (hostID) => {
        this.setState({
            hostID: hostID
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
                { text: 'NO', style: 'cancel' },
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
        this.props.screenProps.logOut()
    }

    render() {
        const screenProps = {
            selectedTab: this.state.selectedParty,
            selectedParty: this.state.selectedParty,
            partyName: this.state.partyName,
            guests: this.state.guests,
            guestCount: this.state.guestCount,
            taskCount: this.state.taskCount,
            songCount: this.state.songCount,
            hostID: this.state.hostID,
            userID: this.props.userID,
            changeTabs: this.changeTabs,
            setHostID: this.setHostID,
            getGuestList: this.getGuestList,
            setTaskCount: this.setTaskCount,
            setSongCount: this.setSongCount,
            cancelParty: this.cancelParty,
            logOut: this.logOut,
        }
        return (

            <View style={{ flex: 1 }} >
                {/* <SwitchNavigator screenProps={screenProps} /> */}
                {this.state.selectedTab === 'partyList' ? <LoginNavigator screenProps={screenProps} />
                    : <MainNavigator screenProps={screenProps} />}
            </View>

        );
    }
}