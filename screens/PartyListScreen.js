import React from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity } from 'react-native';
import GuestsScreen from './HostScreens/GuestsScreen';


export default class PartyListScreen extends React.Component {
    constructor(props) {
        super(props)
    }

    logout = () => {
        this.props.navigator.popToTop();
    }

    goToGuests = () => {
        this.props.navigator.push({
            title: 'Guests',
            component: GuestsScreen,
        });
    }

    changeTabs = () => {
        this.props.changeTabs('profile')
    }

    render() {
        return (
            <View style={{ display: "flex", alignItems: "center" }}>
                <Text style={{ textAlign: "center", margin: 30, textDecorationLine: 'underline' }}>PARTY LIST SCREEN</Text>
                <Text style={{ textDecorationLine: 'underline' }}>Parties I'm Hosting</Text>
                <TouchableOpacity onPress={this.changeTabs} style={styles.textButton}>
                    <Text
                        title="party placeholder"
                        style={styles.text}
                        accessibilityLabel="party placeholder"
                    >This is a placeholder for a party
                    </Text>
                </TouchableOpacity>
                <Text style={{ textDecorationLine: 'underline' }}>Parties I'm Invited To</Text>
                <TouchableOpacity onPress={this.changeTabs} style={styles.textButton}>
                    <Text
                        title="party placeholder"
                        style={styles.text}
                        accessibilityLabel="party placeholder"
                    >This also is a placeholder
                    </Text>
                </TouchableOpacity>

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
    }
})