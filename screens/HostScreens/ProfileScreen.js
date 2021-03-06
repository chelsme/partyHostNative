import React from 'react';
import { StyleSheet, Text, View, Button, LinearGradient, TouchableOpacity, ImageBackground } from 'react-native';
import GuestsScreen from './GuestsScreen';


export default class ProfileScreen extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            party: null,
            rsvps: null
        }
    }

    componentDidMount() {
        this.makeRemoteRequest()
    }

    componentDidUpdate(prevProps) {
        if (prevProps.screenProps.selectedParty !== this.props.screenProps.selectedParty) {
            this.makeRemoteRequest()
        }
        if (prevProps.screenProps.guests.length !== this.props.screenProps.guests.length) {
            this.makeRemoteRequest()
        }
    }

    makeRemoteRequest = () => {
        fetch(`http://10.10.10.111:3000/parties/${this.props.screenProps.selectedParty}`)
            .then(resp => resp.json())
            .then(data => {
                this.setState({
                    party: data
                })
            })
            .then(fetch('http://10.10.10.111:3000/party_guests')
                .then(resp => resp.json())
                .then(data => {
                    let rsvps = data.filter((guest) => {
                        return guest.party_id === this.props.screenProps.selectedParty
                    })
                    this.setState({
                        rsvps: rsvps
                    })
                })
            )
    }

    goToAllParties = () => {
        this.props.navigation.navigate('Party')
    }

    render() {
        console.log(this.props.screenProps.guests.length)
        return (
            <ImageBackground source={require('../../assets/images/background.jpg')} style={{ display: "flex", alignItems: "center", padding: 10, backgroundColor: '#4d5a63', height: 800 }} >
                {this.state.party ?
                    <View style={{ width: 300 }} >
                        <View style={{ borderRadius: 5, backgroundColor: 'white', marginTop: 15, padding: 10 }} >
                            <Text style={{ textAlign: "center", fontSize: 25, textDecorationLine: 'underline', fontWeight: "bold" }}>{this.state.party.name}</Text>
                        </View>
                        <View style={styles.section} >
                            <View style={[styles.header, { backgroundColor: this.props.screenProps.color }]}>
                                <Text style={styles.boldTextHeader}>Details</Text>
                            </View>
                            <Text style={{ margin: 4 }}>
                                <Text style={styles.boldText}>Date:&nbsp;</Text>
                                <Text style={{ fontSize: 16 }}>{this.state.party.date}</Text>
                            </Text>
                            <Text style={{ margin: 4 }}>
                                <Text style={styles.boldText}>Time:&nbsp;</Text>
                                <Text style={{ fontSize: 16 }}>{this.state.party.time}</Text>
                            </Text>
                            <Text style={{ margin: 4 }}>
                                <Text style={styles.boldText}>Location:&nbsp;</Text>
                                <Text style={{ fontSize: 16 }}>{this.state.party.location}</Text>
                            </Text>
                        </View>
                        <View style={styles.section} >
                            <View style={[styles.header, { backgroundColor: this.props.screenProps.color }]}>
                                <Text style={styles.boldTextHeader}>Guests</Text>
                            </View>
                            <Text style={{ margin: 4 }}>
                                <Text style={styles.boldText}>Accepted:&nbsp;</Text>
                                <Text style={{ fontSize: 16 }}>{this.state.rsvps ? this.state.rsvps.filter((rsvp) => {
                                    return rsvp.RSVP === 'yes'
                                }).length + 1 : null}</Text>
                            </Text>
                            <Text style={{ margin: 4 }}>
                                <Text style={styles.boldText}>Maybe:&nbsp;</Text>
                                <Text style={{ fontSize: 16 }}>{this.state.rsvps ? this.state.rsvps.filter((rsvp) => {
                                    return rsvp.RSVP === 'maybe'
                                }).length : null}</Text>
                            </Text>
                            <Text style={{ margin: 4 }}>
                                <Text style={styles.boldText}>Not Responded:&nbsp;</Text>
                                <Text style={{ fontSize: 16 }}>{this.state.rsvps ? this.state.rsvps.filter((rsvp) => {
                                    return rsvp.RSVP === 'tbd'
                                }).length - 1 : null}</Text>
                            </Text>
                        </View>
                        <View style={styles.section} >
                            <View style={[styles.header, { backgroundColor: this.props.screenProps.color }]}>
                                <Text style={styles.boldTextHeader}>Lists</Text>
                            </View><Text style={{ margin: 4 }}>
                                <Text style={styles.boldText}>Songs on Playlist:&nbsp;</Text>
                                <Text style={{ fontSize: 16 }}>{this.props.screenProps.songCount ? this.props.screenProps.songCount : this.state.party.songs.length}</Text>
                            </Text>
                            <Text style={{ margin: 4 }}>
                                <Text style={styles.boldText}>Tasks Assigned:&nbsp;</Text>
                                <Text style={{ fontSize: 16 }}>{this.props.screenProps.taskCount ? this.props.screenProps.taskCount : this.state.party.tasks.length}</Text>
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
            </ImageBackground>
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
        marginTop: 8
    },
    text: {
        color: 'white',
        textAlign: 'center',
        padding: 5,
        fontSize: 16
    },
    boldTextHeader: {
        textAlign: "center",
        fontSize: 22,
        fontWeight: 'bold'
    },
    boldText: {
        textAlign: "center",
        fontSize: 18,
        fontWeight: 'bold'
    },
    header: {
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
        width: 301,
        padding: 3,
        borderColor: 'black',
        borderWidth: .5,
        marginLeft: -.5
    },
    section: {
        borderRadius: 5,
        backgroundColor: 'white',
        marginTop: 8
    }
})