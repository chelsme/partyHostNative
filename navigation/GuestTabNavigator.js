import React from 'react';
import {
    StyleSheet, Text, View, Button, TextInput, AlertIOS,
    Image, TabBarIOS, TabBarItem, NavigatorIOS, TouchableOpacity
} from 'react-native';
import { createNavigator, SwitchRouter, createNavigationContainer, SceneView } from 'react-navigation';

import { Ionicons, FontAwesome, MaterialCommunityIcons, Octicons } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/Ionicons';
// import Icon from 'react-native-icons'

import GuestsScreen from '../screens/HostScreens/GuestsScreen'
import HomeScreen from '../screens/HomeScreen'
import ListsScreen from '../screens/HostScreens/ListsScreen'
import PlaylistScreen from '../screens/HostScreens/PlaylistScreen'
import ProfileScreen from '../screens/HostScreens/ProfileScreen'
import PartyListScreen from '../screens/PartyListScreen';

import { createNavigator, SwitchRouter, createNavigationContainer, SceneView } from 'react-navigation';
import GuestsScreen from '../screen/GuestsScreen';
import ListsScreen from '../screen/ListsScreen';
import Lis from '../screen/Lis';
import Screen4 from '../screen/Screen4';
import { screenWidth } from '../../utils/Styles';
const styles = {
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tab: {
        height: 56,
        width: screenWidth,
        position: 'absolute',
        bottom: 0,
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    txt: {
        padding: 20,
        fontSize: 15,
    }
};
function createCustomNavigator(routeConfigMap, config = {}) {
    let router = SwitchRouter(routeConfigMap, config);
    let NavigatorComponent = createNavigator(
        NavigationView,
        router,
        config,
    );
    return createNavigationContainer(NavigatorComponent);
}
class NavigationView extends React.Component {
    componentDidMount() {
        console.log('componentDidMount', this.props);
    }
    render() {
        let { state } = this.props.navigation;
        let activeKey = state.routes[state.index].key;
        let descriptor = this.props.descriptors[activeKey];
        let ScreenComponent = descriptor.getComponent();
        return (
            <View style={{ flex: 1 }}>
                <SceneView
                    component={ScreenComponent}
                    navigation={descriptor.navigation}
                    screenProps={this.props.screenProps}
                />
                <View style={styles.tab}>
                    {state.routes.map(({ routeName, key }) => (
                        <Button
                            key={key}
                            onPress={() => this.props.navigation.navigate(routeName)}
                            title={routeName}
                        />
                    ))}
                </View>
            </View>
        );
    }
}
export default createCustomNavigator({
    GuestsScreen,
    ListsScreen,
    Lis,
    Screen4,
});