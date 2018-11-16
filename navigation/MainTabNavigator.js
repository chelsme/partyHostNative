import React from 'react';
import GuestsScreen from '../screens/GuestsScreen'
import HomeScreen from '../screens/HomeScreen'
import ListsScreen from '../screens/ListsScreen'
import PlaylistScreen from '../screens/PlaylistScreen'
import ProfileScreen from '../screens/ProfileScreen'

import { StyleSheet, Text, View, Button, TextInput, Alert, Image, TabBarIOS, NavigatorIOS } from 'react-native';

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
        return (
            <TabBarIOS>
                <TabBarIOS.Item
                    title="Guests"
                    selected={this.state.selectedTab === 'tab1'}
                    // systemIcon='bookmarks'
                    onPress={() => this.changeTabs('tab1')}>
                    <View>
                        <GuestsScreen />
                    </View>
                </TabBarIOS.Item>
                <TabBarIOS.Item
                    title="Lists"
                    selected={this.state.selectedTab === 'tab2'}
                    // systemIcon='bookmarks'
                    onPress={() => this.changeTabs('tab2')}>
                    <View>
                        <ListsScreen />
                    </View>
                </TabBarIOS.Item>
                <TabBarIOS.Item
                    title="Profile"
                    selected={this.state.selectedTab === 'tab3'}
                    // systemIcon='bookmarks'
                    onPress={() => this.changeTabs('tab3')}>
                    <View>
                        <ProfileScreen />
                    </View>
                </TabBarIOS.Item>
                <TabBarIOS.Item
                    title="Playlists"
                    selected={this.state.selectedTab === 'tab4'}
                    // systemIcon='bookmarks'
                    onPress={() => this.changeTabs('tab4')}>
                    <View>
                        <PlaylistScreen />
                    </View>
                </TabBarIOS.Item>
                <TabBarIOS.Item
                    selected={this.state.selectedTab === 'tab5'}
                    systemIcon='bookmarks'
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