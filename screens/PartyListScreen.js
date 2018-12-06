import React from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, TextInput, AlertIOS, Image, ScrollView, ImageBackground } from 'react-native';
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';
import { Ionicons, FontAwesome, Octicons, MaterialIcons } from '@expo/vector-icons';


export default class PartyListScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            host_id: this.props.screenProps.userID,
            hostingParties: null,
            attendingParties: null,
            selectedParty: this.props.screenProps.selectedParty,
            addPartyShow: false,
            editPartyShow: false,
            newPartyName: '',
            newPartyDate: '',
            newPartyTime: '',
            newPartyLocation: '',
            editPartyName: '',
            editPartyDate: '',
            editPartyTime: '',
            editPartyLocation: '',
            guests: '',
            editParty: null,
            rsvps: null,
            RsvpValue: null
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

    makeRemoteRequest() {
        fetch(`http://10.185.7.174:3000/guests/${this.props.screenProps.userID}`)
            .then(resp => resp.json())
            .then(data => {
                let hostingParties = data.parties.filter((party) => {
                    return party.host_id === this.props.screenProps.userID
                })
                let attendingParties = data.parties.filter((party) => {
                    return party.host_id !== this.props.screenProps.userID
                })
                let rsvps = data.party_guests
                this.setState({
                    hostingParties: hostingParties,
                    attendingParties: attendingParties,
                    rsvps: rsvps
                })
            })
    }

    sendGuestList = (guests) => {
        this.props.screenProps.getGuestList(guests)
    }

    // create new party
    addParty = () => {
        this.setState((state) => {
            return {
                addPartyShow: !state.addPartyShow,
                editPartyShow: false
            };
        });
    }

    handleNewName = (typedText) => {
        this.setState({
            newPartyName: typedText
        })
    }

    handleNewDate = (typedText) => {
        this.setState({
            newPartyDate: typedText
        })
    }

    handleNewTime = (typedText) => {
        this.setState({
            newPartyTime: typedText
        })
    }

    handleNewLocation = (typedText) => {
        this.setState({
            newPartyLocation: typedText
        })
    }

    handleSubmitParty = () => {
        {
            this.state.newPartyName !== '' && this.state.newPartyDate !== '' && this.state.newPartyTime !== '' && this.state.newPartyLocation !== '' ?
                fetch('http://10.185.7.174:3000/parties', {
                    method: 'POST', // or 'PUT'
                    body: JSON.stringify({
                        name: this.state.newPartyName,
                        date: this.state.newPartyDate,
                        time: this.state.newPartyTime,
                        location: this.state.newPartyLocation,
                        host_id: this.props.screenProps.userID
                    }), // data can be `string` or {object}!
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then(resp => resp.json())
                    .then(() => {
                        alert(`New Party Created`)
                    })
                    .then(() => {
                        this.setState({
                            addPartyShow: false,
                            newPartyName: '',
                            newPartyDate: '',
                            newPartyTime: '',
                            newPartyLocation: ''
                        })
                    })
                :
                AlertIOS.alert('must fill out party details')
        }
        setTimeout(() => {
            this.makeRemoteRequest()
        }, 200)
    }
    // end create new party

    // edit party
    editParty = (party) => {
        this.setState((state) => {
            return {
                editPartyShow: !state.editPartyShow,
                addPartyShow: false,
                editPartyName: party.name,
                editPartyDate: party.date,
                editPartyTime: party.time,
                editPartyLocation: party.location,
                editParty: party.id
            };
        });
    }

    handleChangePartyName = (typedText) => {
        this.setState({
            editPartyName: typedText
        })
    }

    handleChangePartyDate = (typedText) => {
        this.setState({
            editPartyDate: typedText
        })
    }

    handleChangePartyTime = (typedText) => {
        this.setState({
            editPartyTime: typedText
        })
    }

    handleChangePartyLocation = (typedText) => {
        this.setState({
            editPartyLocation: typedText
        })
    }

    handleEditParty = () => {
        {
            fetch(`http://10.185.7.174:3000/parties/${this.state.editParty}`, {
                method: 'PATCH', // or 'PUT'
                body: JSON.stringify({
                    name: this.state.editPartyName,
                    date: this.state.editPartyDate,
                    time: this.state.editPartyTime,
                    location: this.state.editPartyLocation,
                }), // data can be `string` or {object}!
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(resp => resp.json())
                .then(alert(`Your party has been updated.`))
        }
        this.setState({
            editPartyShow: false,
            editPartyName: '',
            editPartyDate: '',
            editPartyTime: '',
            editPartyLocation: ''
        })
        setTimeout(() => this.makeRemoteRequest(), 200)
    }
    // end edit party

    getGuestList = (id) => {
        fetch(`http://10.185.7.174:3000/parties/${id}`)
            .then(resp => resp.json())
            .then(data => {
                let partyGuests = data.guests.map((guest) => {
                    return guest
                })
                this.sendGuestList(partyGuests)
            })
    }

    changeTabs = (party, color) => {
        this.props.screenProps.setHostID(party.host_id)
        this.props.screenProps.changeTabs('profile', party.id, party.name)
        this.getGuestList(party.id)
        this.props.navigation.navigate('Details')
        this.setState({
            selectedParty: party.id
        })
        this.setColor(color)
    }

    setColor = (color) => {
        this.props.screenProps.setColor(color)
    }

    cancelParty = (party) => {
        AlertIOS.alert(
            'Cancel Party',
            `Would you like to cancel ${party.name}?`,
            [
                { text: 'NO', style: 'cancel' },
                {
                    text: 'YES', onPress: () => {
                        fetch(`http://10.185.7.174:3000/parties/${party.id}`, {
                            method: 'DELETE', // or 'PUT'
                        })
                            .then(setTimeout(() => this.makeRemoteRequest(), 200))
                    }
                },
            ]
        )
    }

    rsvp = (party, rsvp) => {
        console.log(rsvp.id)
        AlertIOS.alert(
            'RSVP',
            `${party.name}`,
            [
                {
                    text: 'Yes', onPress: () => {
                        fetch(`http://10.185.7.174:3000/party_guests/${rsvp.id}`, {
                            method: 'PATCH', // or 'PUT'
                            body: JSON.stringify({
                                RSVP: 'yes',
                            }), // data can be `string` or {object}!
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        })
                            .then(resp => resp.json())
                            .then(setTimeout(() => this.makeRemoteRequest(), 200))
                            .then(AlertIOS.alert(`You RSVP'd yes to ${party.name}`))
                    }
                },
                {
                    text: 'No', onPress: () => {
                        fetch(`http://10.185.7.174:3000/party_guests/${rsvp.id}`, {
                            method: 'PATCH', // or 'PUT'
                            body: JSON.stringify({
                                RSVP: 'no',
                            }), // data can be `string` or {object}!
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        })
                            .then(resp => resp.json())
                            .then(setTimeout(() => this.makeRemoteRequest(), 200))
                            .then(AlertIOS.alert(`You RSVP'd no to ${party.name}`))
                    }
                },
                {
                    text: 'Maybe', onPress: () => {
                        fetch(`http://10.185.7.174:3000/party_guests/${rsvp.id}`, {
                            method: 'PATCH', // or 'PUT'
                            body: JSON.stringify({
                                RSVP: 'maybe',
                            }), // data can be `string` or {object}!
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        })
                            .then(resp => resp.json())
                            .then(setTimeout(() => this.makeRemoteRequest(), 200))
                            .then(AlertIOS.alert(`You RSVP'd maybe to ${party.name}`))
                    }
                },
                { text: 'Cancel', style: 'cancel' }
            ]
        )
    }

    render() {
        let hostColorWheel = ['#FF7400', '#fcd303', '#009999', '#0f87ff']
        let guestColorWheel = ['#3e67c7', '#cf6523', '#EBAC00', '#017a7a']
        return (
            <ImageBackground source={require('../assets/images/background.jpg')} style={{ display: "flex", paddingTop: 20, backgroundColor: '#4d5a63' }} >
                <View style={{ alignItems: 'flex-end' }}>
                    <TouchableOpacity style={{ display: 'flex', width: 70, marginBottom: 5, fontSize: 14, marginRight: 20, marginTop: 5, borderRadius: 5, backgroundColor: 'grey', right: 0 }}>
                        <Text style={{ textAlign: "center", fontSize: 14, textAlignVertical: "center", padding: 5 }}
                            onPress={() => this.props.screenProps.logOut()}
                        >Logout</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ alignItems: "center" }} >

                    {/* create new party */}
                    < TouchableOpacity onPress={this.addParty}>
                        <Image
                            style={{ width: 60, height: 60, marginBottom: 5, marginTop: -25 }}
                            source={require('../assets/images/cupcakeadd.png')}
                            onPress={this.addParty}
                        />
                    </TouchableOpacity >

                    {/* hidden input fields CREATE PARTY */}
                    < TextInput
                        style={{ display: this.state.addPartyShow ? 'flex' : 'none', backgroundColor: 'white', padding: 5, paddingLeft: 10, borderRadius: 50, width: 190, margin: 2, borderWidth: 1 }}
                        placeholder={'Party Name'}
                        onChangeText={this.handleNewName}
                        value={this.state.newPartyName}
                    />
                    < TextInput
                        style={{ display: this.state.addPartyShow ? 'flex' : 'none', backgroundColor: 'white', padding: 5, paddingLeft: 10, borderRadius: 50, width: 190, margin: 2, borderWidth: 1 }}
                        placeholder={'Party Date'}
                        onChangeText={this.handleNewDate}
                        value={this.state.newPartyDate}
                    />
                    < TextInput
                        style={{ display: this.state.addPartyShow ? 'flex' : 'none', backgroundColor: 'white', padding: 5, paddingLeft: 10, borderRadius: 50, width: 190, margin: 2, borderWidth: 1 }}
                        placeholder={'Party Time'}
                        onChangeText={this.handleNewTime}
                        value={this.state.newPartyTime}
                    />
                    < TextInput
                        style={{ display: this.state.addPartyShow ? 'flex' : 'none', backgroundColor: 'white', padding: 5, paddingLeft: 10, borderRadius: 50, width: 190, margin: 2, borderWidth: 1 }}
                        placeholder={'Party Location'}
                        onChangeText={this.handleNewLocation}
                        value={this.state.newPartyLocation}
                    />
                    <TouchableOpacity style={{ display: this.state.addPartyShow ? 'flex' : 'none', backgroundColor: 'grey', paddingLeft: 5, borderRadius: 50, width: 190, margin: 2, borderWidth: 1, marginBottom: 8 }}
                        onPress={this.handleSubmitParty}>
                        <Text
                            title="Create New Party"
                            style={styles.text}
                            accessibilityLabel="Create New Party"
                        >Create New Party
                    </Text>
                    </TouchableOpacity>

                    {/* hidden input fields EDIT PARTY */}
                    < TextInput
                        style={{ display: this.state.editPartyShow ? 'flex' : 'none', backgroundColor: 'white', padding: 5, paddingLeft: 10, borderRadius: 50, width: 190, margin: 2, borderWidth: 1 }}
                        placeholder='Party Name'
                        onChangeText={this.handleChangePartyName}
                        value={this.state.editPartyName}
                    />
                    <TextInput
                        style={{ display: this.state.editPartyShow ? 'flex' : 'none', backgroundColor: 'white', padding: 5, paddingLeft: 10, borderRadius: 50, width: 190, margin: 2, borderWidth: 1 }}
                        placeholder='Party Date'
                        onChangeText={this.handleChangePartyDate}
                        value={this.state.editPartyDate}
                    />
                    <TextInput
                        style={{ display: this.state.editPartyShow ? 'flex' : 'none', backgroundColor: 'white', padding: 5, paddingLeft: 10, borderRadius: 50, width: 190, margin: 2, borderWidth: 1 }}
                        placeholder='Party Time'
                        onChangeText={this.handleChangePartyTime}
                        value={this.state.editPartyTime}
                    />
                    <TextInput
                        style={{ display: this.state.editPartyShow ? 'flex' : 'none', backgroundColor: 'white', padding: 5, paddingLeft: 10, borderRadius: 50, width: 190, margin: 2, borderWidth: 1 }}
                        placeholder='Party Location'
                        onChangeText={this.handleChangePartyLocation}
                        value={this.state.editPartyLocation}
                    />

                    <TouchableOpacity style={{ display: this.state.editPartyShow ? 'flex' : 'none', backgroundColor: 'grey', paddingLeft: 5, borderRadius: 50, width: 190, margin: 2, borderWidth: 1, marginBottom: 8 }}
                        onPress={this.handleEditParty}>
                        <Text
                            title="Edit Party"
                            style={styles.text}
                            accessibilityLabel="Edit Party"
                        >Edit Party
                    </Text>
                    </TouchableOpacity>

                    {/* view parties */}
                    <Text style={styles.partyListHeader}>Parties I'm Hosting</Text>
                    <ScrollView style={{ height: 205 }}>
                        {
                            this.state.hostingParties ? this.state.hostingParties.map((party, index) => {
                                return <TouchableOpacity key={index} onPress={() => this.changeTabs(party, hostColorWheel[index % 4])} style={styles.partyButton}>
                                    <View style={{
                                        borderTopLeftRadius: 4, borderTopRightRadius: 4, backgroundColor: hostColorWheel[index % 4],
                                    }}><Text
                                        title={party.name}
                                        style={styles.text}
                                        accessibilityLabel={party.name}
                                    >{party.name}
                                        </Text>
                                        <TouchableOpacity style={{ marginLeft: 10 }}>
                                            <MaterialIcons name="edit" color='white' size={24} style={{ marginTop: -26, marginBottom: 2, width: 24 }} onPress={() => this.editParty(party)} />
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{ marginLeft: 270 }}>
                                            <MaterialIcons name="delete-forever" color='white' size={24} style={{ marginTop: -26, marginBottom: 2, width: 24 }} onPress={() => this.cancelParty(party)} />
                                        </TouchableOpacity>
                                    </View>
                                    <Text style={{ textAlign: "center", fontSize: 16 }}>{party.date}</Text>
                                    <Text style={{ textAlign: "center", fontSize: 10 }}>Click for more details...</Text>
                                </TouchableOpacity>
                            }) : null

                        }
                    </ScrollView>
                    <Text style={styles.partyListHeader}>Parties I'm Invited To</Text>
                    <ScrollView style={{ height: 205, marginBottom: 10 }}>
                        {
                            this.state.attendingParties ? this.state.attendingParties.map((party, index) => {
                                let partyRsvp = this.state.rsvps.find((rsvp) => {
                                    return rsvp.party_id === party.id
                                })
                                return <TouchableOpacity key={index} onPress={() => this.changeTabs(party, guestColorWheel[index % 4])} style={styles.partyButton}>
                                    <View style={{
                                        borderTopLeftRadius: 4, borderTopRightRadius: 4, backgroundColor: guestColorWheel[index % 4],
                                    }}>
                                        <Text
                                            title={party.name}
                                            style={styles.text}
                                            accessibilityLabel={party.name}
                                        >{party.name}
                                        </Text>
                                        <TouchableOpacity style={{ marginLeft: 10 }}>
                                            <Octicons name="mail-read" color='white' size={20} style={{ marginTop: -24, marginBottom: 2, width: 20 }} onPress={() => this.rsvp(party, partyRsvp)} />
                                        </TouchableOpacity>

                                        {(() => {
                                            if (partyRsvp.RSVP === 'yes') {
                                                return <Text style={{ textAlign: "center", fontSize: 14, fontWeight: 'bold', marginTop: -22, marginBottom: 4, marginLeft: 228, color: 'white' }}>RSVP: &#10003;</Text>
                                            } else if (partyRsvp.RSVP === 'no') {
                                                return <Text style={{ textAlign: "center", fontSize: 14, fontWeight: 'bold', marginTop: -22, marginBottom: 4, marginLeft: 228, color: 'white' }}>RSVP: X</Text>
                                            } else if (partyRsvp.RSVP === 'maybe') {
                                                return <Text style={{ textAlign: "center", fontSize: 14, fontWeight: 'bold', marginTop: -22, marginBottom: 4, marginLeft: 228, color: 'white' }}>RSVP: &#63;</Text>
                                            } else if (partyRsvp.RSVP === 'tbd') {
                                                return <Text style={{ textAlign: "center", fontSize: 14, fontWeight: 'bold', marginTop: -22, marginBottom: 4, marginLeft: 228, color: 'white' }}>RSVP: &#9675;</Text>
                                            }
                                        })()}
                                    </View>
                                    <Text style={{ textAlign: "center", fontSize: 16 }}>{party.date}</Text>
                                    <Text style={{ textAlign: "center", fontSize: 10 }}>Click for more details...</Text>
                                </TouchableOpacity>
                            }) : null
                        }
                    </ScrollView>
                </View>
            </ImageBackground >
        );
    }
}

const styles = StyleSheet.create({
    partyButton: {
        backgroundColor: 'white',
        opacity: 200,
        width: 300,
        height: 65,
        borderWidth: 1,
        textAlignVertical: "center",
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#4d5a63',
        margin: 2
    },
    cancel: {
        color: 'white',
        textAlign: 'center',
        fontSize: 10,
        backgroundColor: 'black'
    },
    text: {
        color: 'white',
        textAlign: 'center',
        padding: 3,
        fontSize: 18,
        textDecorationLine: 'underline',
        fontWeight: 'bold'
    },
    partyListHeader: {
        textDecorationLine: 'underline',
        fontSize: 20,
        fontWeight: "bold",
        color: 'white',
        marginBottom: 3,
    }
})