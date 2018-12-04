import React from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, TextInput, AlertIOS, ScrollView } from 'react-native';

export default class GuestsScreen extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            party: null,
            addGuestShow: false,
            firstName: '',
            lastName: '',
            rsvps: []
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
        fetch(`http://localhost:3000/parties/${this.props.screenProps.selectedParty}`)
            .then(resp => resp.json())
            .then(data => {
                let rsvps = data.guests.filter((guest) => {
                    let guestList = guest.party_guests.filter((partyGuest) => {
                        // console.log('heyoooooo', partyGuest)
                        return partyGuest.party_id === this.props.screenProps.selectedParty
                    })
                    this.setState({
                        rsvps: [...this.state.rsvps, guestList]
                    })
                    return guestList
                })
                this.props.screenProps.getGuestList(data.guests)
                this.setState({
                    party: data,
                    guests: data.guests,
                    firstName: '',
                    lastName: ''
                })
            })
    }

    addGuest = () => {
        this.setState((state) => {
            return { addGuestShow: !state.addGuestShow };
        });
    }

    handleChangeFirstName = (typedText) => {
        let first = typedText.length > 0 ? typedText[0].toUpperCase() + typedText.slice(1) : null
        this.setState({
            firstName: first
        })
    }

    handleChangeLastName = (typedText) => {
        let last = typedText.length > 0 ? typedText[0].toUpperCase() + typedText.slice(1) : null
        this.setState({
            lastName: last
        })
    }

    handleSubmitGuest = () => {
        if (this.state.guests.find((guest) => {
            return guest.name === `${this.state.firstName} ${this.state.lastName}`
        })) {
            AlertIOS.alert(`${this.state.firstName} ${this.state.lastName} is already invited.`)
        } else if (this.state.firstName !== '' && this.state.lastName !== '') {
            this.state.firstName !== '' && this.state.lastName !== '' ?
                fetch('http://localhost:3000/guests', {
                    method: 'POST', // or 'PUT'
                    body: JSON.stringify({
                        name: `${this.state.firstName} ${this.state.lastName}`,
                        party_id: this.props.screenProps.selectedParty
                    }), // data can be `string` or {object}!
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then(resp => resp.json())
                    .then(alert(`${this.state.firstName} ${this.state.lastName} has been invited to your party.`))
                :
                AlertIOS.alert('must provide full name')
        }
        this.setState({
            addGuestShow: false,
            firstName: '',
            lastName: '',
        })
        setTimeout(() => this.makeRemoteRequest(), 200)
    }

    uninviteGuest = (guest) => {
        let partyGuest = guest.party_guests.filter((x) => {
            return x.party_id === this.props.screenProps.selectedParty
        })
        this.props.screenProps.hostID === this.props.screenProps.userID ?
            AlertIOS.alert(
                'Uninvite',
                `Would you like to remove ${guest.name} from your party guest list?`,
                [
                    { text: 'NO', style: 'cancel' },
                    {
                        text: 'YES', onPress: () => { this.uninviteFetch(partyGuest[0].id) }
                    },
                ]
            )
            : AlertIOS.alert('Only the party host can uninvite guests.')
    }

    uninviteFetch = (id) => {
        fetch(`http://localhost:3000/party_guests/${id}`, {
            method: 'DELETE', // or 'PUT'
        })
            .then(setTimeout(() => this.makeRemoteRequest(), 200))
    }

    render() {
        let colorWheel = ['#006F13', '#014E59', '#910B00', '#914500']
        let rsvpArray = [].concat(...this.state.rsvps)
        console.log('here it is......', rsvpArray)
        return (
            <View style={{ display: "flex", alignItems: "center", padding: 10, backgroundColor: '#4d5a63', height: 800 }} >
                <Text style={{ textAlign: "center", margin: 20, fontSize: 30, textDecorationLine: 'underline', color: 'white', fontWeight: "bold", fontFamily: "Verdana" }}>GUESTS</Text>


                {this.props.screenProps.userID === this.props.screenProps.hostID ?
                    <View style={{ display: "flex", alignItems: "center" }} >
                        {/* add guest to guest list */}
                        <TouchableOpacity style={styles.textButton}>
                            <Text
                                onPress={this.addGuest}
                                title="Add Guest"
                                style={{
                                    color: 'white',
                                    padding: 5,
                                    fontSize: 16,
                                    textAlign: 'center'
                                }}
                                accessibilityLabel="Add Guest"
                            >Add Guest
                            </Text>
                        </TouchableOpacity>

                        {/* hidden input fields */}
                        <TextInput
                            style={{ display: this.state.addGuestShow ? 'flex' : 'none', backgroundColor: 'white', padding: 5, paddingLeft: 10, borderRadius: 50, width: 190, margin: 2, borderWidth: 1 }}
                            placeholder='First Name'
                            onChangeText={this.handleChangeFirstName}
                            value={this.state.firstName}
                        />
                        <TextInput
                            style={{ display: this.state.addGuestShow ? 'flex' : 'none', backgroundColor: 'white', padding: 5, paddingLeft: 10, borderRadius: 50, width: 190, margin: 2, borderWidth: 1 }}
                            placeholder='Last Name'
                            onChangeText={this.handleChangeLastName}
                            value={this.state.lastName}
                        />
                        <TouchableOpacity style={{ display: this.state.addGuestShow ? 'flex' : 'none', backgroundColor: 'grey', paddingLeft: 5, borderRadius: 50, width: 190, margin: 2, borderWidth: 1 }}
                            onPress={this.handleSubmitGuest}>
                            <Text
                                title="Invite Guest"
                                style={styles.text}
                                accessibilityLabel="Invite Guest"
                            >Invite Guest
                            </Text>
                        </TouchableOpacity>
                    </View>
                    : null}
                <ScrollView style={{ height: 400 }}>
                    <Text style={styles.guestsHeader}>Accepted</Text>
                    {this.state.party ? this.state.party.guests.map((guest, index) => {
                        let partyRsvp = rsvpArray.find((rsvp) => {
                            return rsvp.guest_id === guest.id
                        })
                        if (partyRsvp.RSVP === 'yes' || guest.id === this.props.screenProps.hostID) {
                            return <TouchableOpacity key={index} style={[styles.guest, { backgroundColor: colorWheel[index % 4] }]} onPress={() => { this.uninviteGuest(guest) }}>
                                <Text
                                    title={guest.name}
                                    style={styles.text}
                                    accessibilityLabel={guest.name}
                                >{guest.name}
                                </Text>
                            </TouchableOpacity>
                        }
                    }) : null}
                    <Text style={styles.guestsHeader}>Maybe</Text>
                    {this.state.party ? this.state.party.guests.map((guest, index) => {
                        let partyRsvp = rsvpArray.find((rsvp) => {
                            return rsvp.guest_id === guest.id
                        })
                        if (partyRsvp.RSVP === 'maybe' && guest.id !== this.props.screenProps.hostID) {
                            return <TouchableOpacity key={index} style={[styles.guest, { backgroundColor: colorWheel[index % 4] }]} onPress={() => { this.uninviteGuest(guest) }}>
                                <Text
                                    title={guest.name}
                                    style={styles.text}
                                    accessibilityLabel={guest.name}
                                >{guest.name}
                                </Text>
                            </TouchableOpacity>
                        }
                    }) : null}
                    <Text style={styles.guestsHeader}>Awaiting Response</Text>
                    {this.state.party ? this.state.party.guests.map((guest, index) => {
                        let partyRsvp = rsvpArray.find((rsvp) => {
                            return rsvp.guest_id === guest.id
                        })
                        if (partyRsvp.RSVP === 'tbd' && guest.id !== this.props.screenProps.hostID) {
                            return <TouchableOpacity key={index} style={[styles.guest, { backgroundColor: colorWheel[index % 4] }]} onPress={() => { this.uninviteGuest(guest) }}>
                                <Text
                                    title={guest.name}
                                    style={styles.text}
                                    accessibilityLabel={guest.name}
                                >{guest.name}
                                </Text>
                            </TouchableOpacity>
                        }
                    }) : null}
                    <Text style={styles.guestsHeader}>Can't Make It</Text>
                    {this.state.party ? this.state.party.guests.map((guest, index) => {
                        let partyRsvp = rsvpArray.find((rsvp) => {
                            return rsvp.guest_id === guest.id
                        })
                        if (partyRsvp.RSVP === 'no' && guest.id !== this.props.screenProps.hostID) {
                            return <TouchableOpacity key={index} style={[styles.guest, { backgroundColor: colorWheel[index % 4] }]} onPress={() => { this.uninviteGuest(guest) }}>
                                <Text
                                    title={guest.name}
                                    style={styles.text}
                                    accessibilityLabel={guest.name}
                                >{guest.name}
                                </Text>
                            </TouchableOpacity>
                        }
                    }) : null}
                </ScrollView>
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
        marginBottom: 10
    },
    text: {
        color: 'white',
        padding: 5,
        fontSize: 16,
        alignSelf: 'center'
    },
    guest: {
        opacity: 200,
        width: 200,
        height: 30,
        borderWidth: 1,
        textAlignVertical: "center",
        borderRadius: 5,
        borderWidth: 1,
        borderColor: 'black',
        marginBottom: 4
    },
    guestsHeader: {
        textDecorationLine: 'underline',
        marginBottom: 10,
        textAlign: "center"
    }
})