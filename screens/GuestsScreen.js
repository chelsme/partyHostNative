import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

export default class GuestsScreen extends React.Component {
    logout = () => {
        this.props.navigator.popToTop();
    }
    render() {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center"
                }}>
                <Text>Guests Screen</Text>
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