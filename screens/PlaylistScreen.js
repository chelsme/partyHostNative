import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import GuestsScreen from './GuestsScreen';

export default class PlaylistScreen extends React.Component {
    logout = () => {
        this.props.navigator.popToTop();
    }

    goToGuests = () => {
        this.props.navigator.push({
            title: 'Guests',
            component: GuestsScreen,
        });
    }


    render() {
        return (
            <View>
                <Text style={{ textAlign: "center", margin: 30, textDecorationLine: 'underline' }}>PLAYLIST SCREEN</Text>
                <Text>Playlist Screen</Text>
                <Button
                    onPress={this.goToGuests}
                    title="Go To Guests"
                    color="#841584"
                    accessibilityLabel="Go To Guests"
                />
                <Button
                    onPress={this.logout}
                    title="Logout"
                    color="#841584"
                    accessibilityLabel="Logout"
                />
            </View>
        );
    }
}