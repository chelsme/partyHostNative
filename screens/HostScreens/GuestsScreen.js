import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

export default class GuestsScreen extends React.Component {
    constructor(props) {
        super(props)
    }

    // logout = () => {
    //     this.props.navigator.popToTop();
    // }
    render() {
        console.log(this.props)
        return (
            <View>
                <Text style={{ textAlign: "center", margin: 30, textDecorationLine: 'underline' }}>GUESTS SCREEN</Text>
                {/* {this.props.selectedParty.guests.map((guest) => {
                    return <Text>{guest.name}</Text>
                })} */}

                {/* <Button
                    onPress={this.logout}
                    title="Logout"
                    color="#841584"
                    accessibilityLabel="Logout"
                /> */}
            </View>
        );
    }
}