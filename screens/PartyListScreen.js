import React from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity } from 'react-native';
import GuestsScreen from './HostScreens/GuestsScreen';


export default class PartyListScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            host_id: this.props.userID,
            allParties: null,
            hostingParties: null,
            attendingParties: null,
            selectedParty: null
        }
    }

    componentDidMount() {
        fetch('http://localhost:3000/parties')
            .then(resp => resp.json())
            .then(data => {
                let hostingParties = data.filter((party) => {
                    return party.host_id === this.props.userID
                })
                let attendingParties = data.filter((party) => {
                    party.guests.filter((guest) => {
                        return guest.id === this.props.userID
                    })
                    return party.host_id !== this.props.userID
                })
                this.setState({
                    allParties: data,
                    hostingParties: hostingParties,
                    attendingParties: attendingParties
                })
            })
    }

    changeTabs = (party) => {
        let partyID = party.id
        this.props.changeTabs('profile', partyID)
    }

    render() {
        return (
            <View style={{ display: "flex", alignItems: "center" }}>
                <Text style={{ textAlign: "center", margin: 30, textDecorationLine: 'underline' }}>PARTY LIST SCREEN</Text>
                <Text>{this.props.user}</Text>
                <Text style={{ textDecorationLine: 'underline' }}>Parties I'm Hosting</Text>
                {this.state.hostingParties ? this.state.hostingParties.map((party, index) => {
                    return <TouchableOpacity key={index} onPress={() => this.changeTabs(party)} style={styles.textButton}>
                        <Text
                            title={party.name}
                            style={styles.text}
                            accessibilityLabel={party.name}
                        >{party.name}
                        </Text>
                    </TouchableOpacity>
                }) : null}
                <Text style={{ textDecorationLine: 'underline' }}>Parties I'm Invited To</Text>
                {this.state.attendingParties ? this.state.attendingParties.map((party, index) => {
                    return <TouchableOpacity key={index} onPress={() => this.changeTabs(party)} style={styles.textButton}>
                        <Text
                            title={party.name}
                            style={styles.text}
                            accessibilityLabel={party.name}
                        >{party.name}
                        </Text>
                    </TouchableOpacity>
                }) : null}
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
    },
    text: {
        color: 'white',
        textAlign: 'center',
        padding: 5,
        fontSize: 20
    }
})