import React from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, TextInput } from 'react-native';
import GuestsScreen from './HostScreens/GuestsScreen';


export default class PartyListScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            host_id: this.props.userID,
            allParties: null,
            hostingParties: null,
            attendingParties: null,
            selectedParty: null,
            addPartyShow: false,
            newPartyName: '',
            newPartyDate: '',
            newPartyTime: '',
            newPartyLocation: '',
            guests: ''
        }
    }

    componentDidMount() {
        this.makeRemoteRequest()
    }

    makeRemoteRequest() {
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


    sendGuestList = (guests) => {
        this.props.getGuestList(guests)
    }

    // create new party
    addParty = () => {
        this.setState((state) => {
            return { addPartyShow: !state.addPartyShow };
        });
    }

    handleChangePartyName = (typedText) => {
        this.setState({
            newPartyName: typedText
        })
    }

    handleChangePartyDate = (typedText) => {
        this.setState({
            newPartyDate: typedText
        })
    }

    handleChangePartyTime = (typedText) => {
        this.setState({
            newPartyTime: typedText
        })
    }

    handleChangePartyLocation = (typedText) => {
        this.setState({
            newPartyLocation: typedText
        })
    }

    handleSubmitParty = () => {
        {
            this.state.newPartyName !== '' && this.state.newPartyDate !== '' && this.state.newPartyTime !== '' && this.state.newPartyLocation !== '' ?
                fetch('http://localhost:3000/parties', {
                    method: 'POST', // or 'PUT'
                    body: JSON.stringify({
                        name: this.state.newPartyName,
                        date: this.state.newPartyDate,
                        time: this.state.newPartyTime,
                        location: this.state.newPartyLocation,
                        host_id: this.props.userID
                    }), // data can be `string` or {object}!
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then(resp => resp.json())
                    .then(alert(`New Party Created`))
                :
                alert('must fill out party details')
        }
        this.setState({
            addPartyShow: false,
            newPartyName: '',
            newPartyDate: '',
            newPartyTime: '',
            newPartyLocation: ''
        })
        setTimeout(() => this.makeRemoteRequest(), 200)
    }
    // end create new party

    changeTabs = (party) => {
        let partyID = party.id
        let partyName = party.name
        this.props.changeTabs('profile', partyID, partyName)
        this.sendGuestList(party.guests)
    }

    render() {
        return (
            <View style={{ display: "flex", alignItems: "center", margin: 20 }}>
                <Text style={{ textAlign: "center", margin: 20, fontSize: 30, textDecorationLine: 'underline' }}>PARTIES</Text>

                {/* create new party */}
                <TouchableOpacity style={styles.textButton}>
                    <Text
                        onPress={this.addParty}
                        title="Add Party"
                        style={styles.text}
                        accessibilityLabel="Add Party"
                    >+
                    </Text>
                </TouchableOpacity>

                {/* hidden input fields */}
                <TextInput
                    style={{ display: this.state.addPartyShow ? 'flex' : 'none', backgroundColor: 'white', padding: 5, paddingLeft: 10, borderRadius: 50, width: 190, margin: 2, borderWidth: 1 }}
                    placeholder='Party Name'
                    onChangeText={this.handleChangePartyName}
                    value={this.state.Party}
                />
                <TextInput
                    style={{ display: this.state.addPartyShow ? 'flex' : 'none', backgroundColor: 'white', padding: 5, paddingLeft: 10, borderRadius: 50, width: 190, margin: 2, borderWidth: 1 }}
                    placeholder='Party Date'
                    onChangeText={this.handleChangePartyDate}
                    value={this.state.Party}
                />
                <TextInput
                    style={{ display: this.state.addPartyShow ? 'flex' : 'none', backgroundColor: 'white', padding: 5, paddingLeft: 10, borderRadius: 50, width: 190, margin: 2, borderWidth: 1 }}
                    placeholder='Party Time'
                    onChangeText={this.handleChangePartyTime}
                    value={this.state.Party}
                />
                <TextInput
                    style={{ display: this.state.addPartyShow ? 'flex' : 'none', backgroundColor: 'white', padding: 5, paddingLeft: 10, borderRadius: 50, width: 190, margin: 2, borderWidth: 1 }}
                    placeholder='Party Location'
                    onChangeText={this.handleChangePartyLocation}
                    value={this.state.Party}
                />

                <TouchableOpacity style={{ display: this.state.addPartyShow ? 'flex' : 'none', backgroundColor: 'grey', paddingLeft: 5, borderRadius: 50, width: 190, margin: 2, borderWidth: 1 }}
                    onPress={this.handleSubmitParty}>
                    <Text
                        title="Create New Party"
                        style={styles.text}
                        accessibilityLabel="Create New Party"
                    >Create New Party
                    </Text>
                </TouchableOpacity>

                {/* view parties */}
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