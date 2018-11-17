import React from 'react';
import {
    StyleSheet, Text, View, Button, TextInput, Alert,
    Image, TabBarIOS, TabBarItem, NavigatorIOS
} from 'react-native';

import { Ionicons, FontAwesome } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons';
// import Icon from 'react-native-icons'

import GuestsScreen from '../screens/GuestsScreen'
import HomeScreen from '../screens/HomeScreen'
import ListsScreen from '../screens/ListsScreen'
import PlaylistScreen from '../screens/PlaylistScreen'
import ProfileScreen from '../screens/ProfileScreen'


goToPage = () => {
    globalProps.navigator.push({
        title: 'profileScreen',
        component: ProfileScreen,
        passProps: { myElement: 'some value' }
    })
}

export default class MainTabNavigator extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            selectedTab: 'tab3'
        }
    }

    changeTabs = (tabId) => {
        this.setState({
            selectedTab: tabId
        })
    }

    render() {
        // systemIcon='bookmarks'
        // iconName="ios-people"
        console.log(Icon.TabBarItem)
        return (
            <TabBarIOS>
                <TabBarIOS.Item
                    title="Guests"
                    selected={this.state.selectedTab === 'tab1'}
                    icon={require('../assets/users.png')}
                    onPress={() => this.changeTabs('tab1')}>
                    <View>
                        <GuestsScreen />
                        <Ionicons name="md-checkmark-circle" size={32} color="green" />
                    </View>
                </TabBarIOS.Item>
                <TabBarIOS.Item
                    title="Lists"
                    selected={this.state.selectedTab === 'tab2'}
                    icon={require('../assets/lists.png')}
                    onPress={() => this.changeTabs('tab2')}>
                    <View>
                        <ListsScreen />
                    </View>
                </TabBarIOS.Item>
                <TabBarIOS.Item
                    title="Profile"
                    selected={this.state.selectedTab === 'tab3'}
                    icon={require('../assets/partyhost.png')}
                    onPress={() => this.changeTabs('tab3')}>
                    <View>
                        <ProfileScreen />
                    </View>
                </TabBarIOS.Item>
                <TabBarIOS.Item
                    title="Playlists"
                    selected={this.state.selectedTab === 'tab4'}
                    icon={require('../assets/playlist.png')}
                    onPress={() => this.changeTabs('tab4')}>
                    <View>
                        <PlaylistScreen />
                    </View>
                </TabBarIOS.Item>
                <TabBarIOS.Item
                    selected={this.state.selectedTab === 'tab5'}
                    systemIcon='more'
                    onPress={() => this.changeTabs('tab5')}>
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