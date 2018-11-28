import React from 'react';
import {
    StyleSheet, Text, View, Button, TextInput, AlertIOS,
    Image, TabBarIOS, TabBarItem, NavigatorIOS
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
            selectedTab: 'partyList'
        }
    }

    changeTabs = (tabId) => {
        this.setState({
            selectedTab: tabId
        })
    }

    render() {
        const partyList = <PartyListScreen changeTabs={this.changeTabs} />
        return (
            this.state.selectedTab === 'partyList' ?
                partyList
                : <TabBarIOS>
                    <TabBarIOS.Item
                        title="Guests"
                        selected={this.state.selectedTab === 'guests'}
                        icon={require('../assets/users.png')}
                        onPress={() => this.changeTabs('guests')}>
                        <View>
                            <GuestsScreen />
                            <Ionicons name="md-checkmark-circle" size={32} color="green" />
                        </View>
                    </TabBarIOS.Item>
                    <TabBarIOS.Item
                        title="Lists"
                        selected={this.state.selectedTab === 'lists'}
                        icon={require('../assets/lists.png')}
                        onPress={() => this.changeTabs('lists')}>
                        <View>
                            <ListsScreen />
                        </View>
                    </TabBarIOS.Item>
                    <TabBarIOS.Item
                        title="Profile"
                        selected={this.state.selectedTab === 'profile'}
                        icon={require('../assets/partyhost.png')}
                        onPress={() => {
                            if (this.state.selectedTab === 'profile') {
                                this.changeTabs('partyList')
                                return partyList
                            } else { this.changeTabs('profile') }
                        }}>
                        <View>
                            <ProfileScreen />
                        </View>
                    </TabBarIOS.Item>
                    <TabBarIOS.Item
                        title="Playlist"
                        selected={this.state.selectedTab === 'playlist'}
                        icon={require('../assets/playlist.png')}
                        onPress={() => this.changeTabs('playlist')}>
                        <View>
                            <PlaylistScreen />
                        </View>
                    </TabBarIOS.Item>
                    <TabBarIOS.Item
                        title="more"
                        selected={this.state.selectedTab === 'more'}
                        systemIcon='more'
                        onPress={() => this.changeTabs('more')}>
                        <View>
                            <Text>More</Text>
                            <Text>More</Text>
                            <Text>More</Text>
                            <Text>More</Text>
                            <Text>More</Text>
                            <Text>More</Text>
                        </View>
                    </TabBarIOS.Item>
                </TabBarIOS>
        )
    }
}