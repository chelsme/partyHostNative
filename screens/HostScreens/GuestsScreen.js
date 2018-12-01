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
        }
    }

    componentDidMount() {
        this.makeRemoteRequest()
    }

    makeRemoteRequest = () => {
        fetch('http://localhost:3000/parties')
            .then(resp => resp.json())
            .then(data => {
                let setParty = data.find((party) => {
                    return party.id === this.props.screenProps.selectedParty
                })
                this.props.screenProps.getGuestList(setParty.guests)
                this.setState({
                    party: setParty,
                    guests: setParty.guests,
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
        console.log(this.props.screenProps.selectedParty)
        return (
            <View style={{ display: "flex", alignItems: "center", padding: 10, backgroundColor: '#4d5a63' }} >
                <Text style={{ textAlign: "center", margin: 20, fontSize: 30, textDecorationLine: 'underline' }}>GUESTS</Text>


                {this.props.screenProps.userID === this.props.screenProps.hostID ?
                    <View style={{ display: "flex", alignItems: "center" }} >
                        {/* add guest to guest list */}
                        <TouchableOpacity style={styles.textButton}>
                            <Text
                                onPress={this.addGuest}
                                title="Add Guest"
                                style={styles.text}
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



                        <Text style={{ textDecorationLine: 'underline' }}>Invited Guests</Text>
                    </View>
                    : null}
                <ScrollView style={{ height: 400 }}>
                    {this.state.party ? this.state.party.guests.map((guest, index) => {
                        if (guest.id !== this.props.screenProps.userID) {
                            return <TouchableOpacity key={index} style={{
                                opacity: 200,
                                width: 200,
                                height: 30,
                                borderWidth: 1,
                                textAlignVertical: "center",
                                borderRadius: 5,
                                borderWidth: 1,
                                borderColor: 'black',
                                marginBottom: 4,
                                backgroundColor: colorWheel[index % 4]
                            }} onPress={() => { this.uninviteGuest(guest) }}>
                                <Text
                                    title={guest.name}
                                    style={styles.text}
                                    accessibilityLabel={guest.name}
                                >{guest.name}
                                </Text>
                            </TouchableOpacity>
                        }
                        else { return null }
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
        marginBottom: 4
    },
    text: {
        color: 'white',
        textAlign: 'center',
        padding: 5,
        fontSize: 16
    }
})