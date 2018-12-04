import React from 'react';
import { StyleSheet, Text, View, Button, LinearGradient, TouchableOpacity } from 'react-native';
import GuestsScreen from './GuestsScreen';


export default class ProfileScreen extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            party: null
        }
    }

    componentDidMount() {
        this.makeRemoteRequest()
    }

    componentDidUpdate(prevProps) {
        if (prevProps.screenProps.selectedParty !== this.props.screenProps.selectedParty) {
            this.makeRemoteRequest()
        }
    }

    makeRemoteRequest = () => {
        fetch('http://localhost:3000/parties')
            .then(resp => resp.json())
            .then(data => {
                let setParty = data.find((party) => {
                    return party.id === this.props.screenProps.selectedParty
                })
                this.setState({
                    party: setParty
                })
            })
    }

    goToAllParties = () => {
        console.log(this.props)
        this.props.navigation.navigate('Party')
    }

    render() {
        return (
            <View style={{ display: "flex", alignItems: "center", padding: 10, backgroundColor: '#4d5a63', height: 800 }} >
                {this.state.party ?
                    <View>
                        <View style={{ borderRadius: 5, backgroundColor: 'white', width: 300, padding: 20, margin: 5, marginTop: 20 }} >
                            <Text style={{ textAlign: "center", fontSize: 30, textDecorationLine: 'underline', fontWeight: "bold" }}>{this.state.party.name}</Text>
                        </View>
                        <View style={{ borderRadius: 5, backgroundColor: 'white', width: 300, padding: 10, margin: 5 }} >
                            <Text style={{ margin: 8 }}>
                                <Text style={{ textAlign: "center", fontSize: 22, fontWeight: 'bold' }}>Date:&nbsp;</Text>
                                <Text style={{ fontSize: 20 }}>{this.state.party.date}</Text>
                            </Text>
                            <Text style={{ margin: 8 }}>
                                <Text style={{ textAlign: "center", fontSize: 22, fontWeight: 'bold' }}>Time:&nbsp;</Text>
                                <Text style={{ fontSize: 20 }}>{this.state.party.time}</Text>
                            </Text>
                            <Text style={{ margin: 8 }}>
                                <Text style={{ textAlign: "center", fontSize: 20, fontWeight: 'bold' }}>Location:&nbsp;</Text>
                                <Text style={{ fontSize: 20 }}>{this.state.party.location}</Text>
                            </Text>
                        </View>
                        <View style={{ borderRadius: 5, backgroundColor: 'white', width: 300, padding: 10, margin: 5 }} >
                            <Text style={{ margin: 6 }}>
                                <Text style={{ textAlign: "center", fontSize: 18, fontWeight: 'bold' }}>Guests Invited:&nbsp;</Text>
                                <Text style={{ fontSize: 18 }}>{this.props.screenProps.guests.length ? this.props.screenProps.guests.length : this.state.party.guests.length}</Text>
                            </Text>
                            <Text style={{ margin: 6 }}>
                                <Text style={{ textAlign: "center", fontSize: 18, fontWeight: 'bold' }}>Songs on Playlist:&nbsp;</Text>
                                <Text style={{ fontSize: 18 }}>{this.props.screenProps.songCount ? this.props.screenProps.songCount : this.state.party.songs.length}</Text>
                            </Text>
                            <Text style={{ margin: 6 }}>
                                <Text style={{ textAlign: "center", fontSize: 18, fontWeight: 'bold' }}>Tasks Assigned:&nbsp;</Text>
                                <Text style={{ fontSize: 18 }}>{this.props.screenProps.taskCount ? this.props.screenProps.taskCount : this.state.party.tasks.length}</Text>
                            </Text>
                        </View>
                    </View>
                    : null}
                <TouchableOpacity style={styles.textButton}>
                    <Text
                        onPress={this.goToAllParties}
                        title="View All Parties"
                        style={styles.text}
                        accessibilityLabel="View All Parties"
                    >View All Parties
                            </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.textButton}>
                    <Text
                        onPress={this.props.screenProps.logOut}
                        title="Logout"
                        style={styles.text}
                        accessibilityLabel="Logout"
                    >Logout
                            </Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    textButton: {
        backgroundColor: '#4d5a63',
        opacity: 200,
        width: 200,
        height: 30,
        borderWidth: 1,
        textAlignVertical: "center",
        borderRadius: 50,
        borderWidth: 1,
        borderColor: 'white',
        marginBottom: 10,
        marginTop: 10
    },
    text: {
        color: 'white',
        textAlign: 'center',
        padding: 5,
        fontSize: 16
    }
})