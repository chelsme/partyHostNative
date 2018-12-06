import React from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, TextInput, AlertIOS, ScrollView, ImageBackground } from 'react-native';
import { withTheme } from 'react-native-paper';
import { Ionicons, FontAwesome, MaterialCommunityIcons, Octicons, MaterialIcons } from '@expo/vector-icons';


export default class GuestsScreen extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            party: null,
            addGuestShow: false,
            firstName: '',
            lastName: '',
            guests: [],
            yes: [],
            no: [],
            maybe: [],
            tbd: [],
            hostName: null
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
        fetch(`http://10.185.7.174:3000/parties/${this.props.screenProps.selectedParty}`)
            .then(resp => resp.json())
            .then(data => {
                this.props.screenProps.getGuestList(data.guests)
                let host = data.guests.find((guest) => {
                    return guest.id === this.props.screenProps.hostID
                })
                this.setState({
                    party: data,
                    guests: data.guests,
                    firstName: '',
                    lastName: '',
                    hostName: host.name
                })
            })
            .then(fetch('http://10.185.7.174:3000/party_guests')
                .then(resp => resp.json())
                .then(data => {
                    let guests = data.filter((guest) => {
                        return guest.party_id === this.props.screenProps.selectedParty
                    })
                    let yes = guests.filter((rsvp) => {
                        return rsvp.RSVP === 'yes'
                    })
                    let no = guests.filter((rsvp) => {
                        return rsvp.RSVP === 'no'
                    })
                    let maybe = guests.filter((rsvp) => {
                        return rsvp.RSVP === 'maybe'
                    })
                    let tbd = guests.filter((rsvp) => {
                        return rsvp.RSVP === 'tbd' && rsvp.guest_id !== this.props.screenProps.hostID
                    })
                    this.setState({
                        yes: yes,
                        no: no,
                        maybe: maybe,
                        tbd: tbd,
                    })
                })
            )
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
        }
        if (this.state.firstName.split(' ').join('') !== '' && this.state.lastName.split(' ').join('') !== '') {
            this.state.firstName.split(' ').join('') !== '' && this.state.lastName.split(' ').join('') !== '' ?
                fetch('http://10.185.7.174:3000/guests', {
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
        } else {
            this.setState({
                addGuestShow: false,
                firstName: '',
                lastName: '',
            })
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
        this.props.screenProps.hostID === this.props.screenProps.userID ?
            AlertIOS.alert(
                'Uninvite',
                `Would you like to remove ${guest.guest.name} from your party guest list?`,
                [
                    { text: 'NO', style: 'cancel' },
                    {
                        text: 'YES', onPress: () => { this.uninviteFetch(guest.id) }
                    },
                ]
            )
            : AlertIOS.alert('Only the party host can uninvite guests.')
    }

    uninviteFetch = (id) => {
        fetch(`http://10.185.7.174:3000/party_guests/${id}`, {
            method: 'DELETE', // or 'PUT'
        })
            .then(setTimeout(() => this.makeRemoteRequest(), 200))
    }

    render() {
        return (
            <ImageBackground source={require('../../assets/images/background.jpg')} style={{ display: "flex", alignItems: "center", padding: 10, backgroundColor: '#4d5a63', height: 800 }} >
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
                {/* *************** guest sections *************** */}
                <ScrollView style={{ height: 400, width: 300 }}>
                    <View style={styles.section} >
                        <View style={[styles.header, { backgroundColor: this.props.screenProps.color }]}>
                            <Text style={styles.boldText}>Accepted</Text>
                        </View>
                        <TouchableOpacity style={styles.guestButton}>
                            <Text style={styles.guestText}>{this.state.hostName}</Text>
                            <MaterialCommunityIcons name="crown" color={'gold'} style={{ marginTop: -22, marginLeft: 30, width: 24, marginBottom: -4 }} size={24} />
                        </TouchableOpacity>
                        {this.state.party ? this.state.yes.map((guest, index) => {
                            return <TouchableOpacity key={index} style={styles.guestButton} onPress={() => { this.uninviteGuest(guest) }}>
                                <Text style={styles.guestText}>{guest.guest.name}</Text>
                            </TouchableOpacity>
                        })
                            : null}
                    </View>
                    <View style={styles.section} >
                        <View style={[styles.header, { backgroundColor: this.props.screenProps.color }]}>
                            <Text style={styles.boldText}>Maybe</Text>
                        </View>
                        {this.state.party ? this.state.maybe.map((guest, index) => {
                            return <TouchableOpacity key={index} style={styles.guestButton} onPress={() => { this.uninviteGuest(guest) }}>
                                <Text style={styles.guestText}>{guest.guest.name}</Text>
                            </TouchableOpacity>
                        })
                            : null}
                        {this.state.maybe.length === 0 ? <TouchableOpacity style={styles.guestButton}>
                            <Text style={styles.guestText}></Text>
                        </TouchableOpacity> : null}
                    </View>
                    <View style={styles.section} >
                        <View style={[styles.header, { backgroundColor: this.props.screenProps.color }]}>
                            <Text style={styles.boldText}>Awaiting Response</Text>
                        </View>
                        {this.state.party ? this.state.tbd.map((guest, index) => {
                            return <TouchableOpacity key={index} style={styles.guestButton} onPress={() => { this.uninviteGuest(guest) }}>
                                <Text style={styles.guestText}>{guest.guest.name}</Text>
                            </TouchableOpacity>
                        })
                            : null}
                        {this.state.tbd.length === 0 ? <TouchableOpacity style={styles.guestButton}>
                            <Text style={styles.guestText}></Text>
                        </TouchableOpacity> : null}
                    </View>
                    <View style={styles.section} >
                        <View style={[styles.header, { backgroundColor: this.props.screenProps.color }]}>
                            <Text style={styles.boldText}>Can't Make It</Text>
                        </View>
                        {this.state.party ? this.state.no.map((guest, index) => {
                            return <TouchableOpacity key={index} style={styles.guestButton} onPress={() => { this.uninviteGuest(guest) }}>
                                <Text style={styles.guestText}>{guest.guest.name}</Text>
                            </TouchableOpacity>
                        })
                            : null}
                        {this.state.no.length === 0 ? <TouchableOpacity style={styles.guestButton}>
                            <Text style={styles.guestText}></Text>
                        </TouchableOpacity> : null}
                    </View>
                </ScrollView>
                {/* *************** end guest sections *************** */}
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
        marginBottom: 10
    },
    text: {
        color: 'white',
        padding: 5,
        fontSize: 16,
        alignSelf: 'center'
    },
    guestButton: {
        opacity: 200,
        width: 300,
        textAlignVertical: "center",
        textAlign: 'center',
        borderColor: 'white',
        borderTopColor: 'grey',
        borderWidth: 1,
        padding: 4,
        borderBottomLeftRadius: 4,
        borderBottomRightRadius: 4,
    },
    guestText: {
        fontSize: 16,
        textAlign: 'center'
    },
    guestsHeader: {
        textDecorationLine: 'underline',
        marginBottom: 10,
        textAlign: "center"
    },
    boldText: {
        textAlign: "center",
        fontSize: 18,
        fontWeight: 'bold'
    },
    header: {
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
        width: 300,
        padding: 3
    },
    section: {
        borderRadius: 5,
        backgroundColor: 'white',
        marginTop: 10
    }
})