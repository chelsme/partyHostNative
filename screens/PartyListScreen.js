import React from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, TextInput, AlertIOS, Image, ScrollView } from 'react-native';
import GuestsScreen from './HostScreens/GuestsScreen';
import { Ionicons, FontAwesome } from '@expo/vector-icons';



export default class PartyListScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            host_id: this.props.screenProps.userID,
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
        fetch(`http://localhost:3000/guests/${this.props.screenProps.userID}`)
            .then(resp => resp.json())
            .then(data => {
                let hostingParties = data.parties.filter((party) => {
                    return party.host_id === this.props.screenProps.userID
                })
                let attendingParties = data.parties.filter((party) => {
                    return party.host_id !== this.props.screenProps.userID
                })
                this.setState({
                    hostingParties: hostingParties,
                    attendingParties: attendingParties
                })
            })
    }

    sendGuestList = (guests) => {
        this.props.screenProps.getGuestList(guests)
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
                        host_id: this.props.screenProps.userID
                    }), // data can be `string` or {object}!
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then(resp => resp.json())
                    .then(alert(`New Party Created`))
                :
                AlertIOS.alert('must fill out party details')
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
        this.props.screenProps.setHostID(party.host_id)
        this.props.screenProps.changeTabs('profile', partyID, partyName)
        this.getGuestList(party.id)
    }

    getGuestList = (id) => {
        fetch(`http://localhost:3000/parties/${id}`)
            .then(resp => resp.json())
            .then(data => {
                let partyGuests = data.guests.map((guest) => {
                    return guest
                })
                this.sendGuestList(partyGuests)
            })
    }

    cancelParty = (party) => {
        AlertIOS.alert(
            'Cancel Party',
            `Would you like to cancel ${party.name}?`,
            [
                { text: 'NO', style: 'cancel' },
                {
                    text: 'YES', onPress: () => {
                        fetch(`http://localhost:3000/parties/${party.id}`, {
                            method: 'DELETE', // or 'PUT'
                        })
                            .then(setTimeout(() => this.makeRemoteRequest(), 200))
                    }
                },
            ]
        )
    }

    render() {
        let hostColorWheel = ['#FF7400', '#FFAA00', '#009999', '#1240AB']
        let guestColorWheel = ['#092871', '#A84C00', '#A87000', '#006565']
        console.log(this.props.screenProps)
        return (
            <View style={{ display: "flex", paddingTop: 20, backgroundColor: '#4d5a63' }} >
                <Text style={{ textAlign: "right", marginBottom: 5, fontSize: 10, textDecorationLine: 'underline', paddingRight: 20 }}
                    onPress={this.props.screenProps.logOut}
                >Logout</Text>
                <View style={{ alignItems: "center" }} >
                    <Text style={{ textAlign: "center", margin: 5, fontSize: 24, textDecorationLine: 'underline' }}>PARTIES</Text>

                    {/* create new party */}
                    < TouchableOpacity onPress={this.addParty}>
                        <Image
                            style={{ width: 50, height: 50, marginBottom: 12 }}
                            source={require('../assets/cupcakeadd.png')}
                            onPress={this.addParty}
                        />
                    </TouchableOpacity >
                    <Ionicons name="md-checkmark-circle" size={32} color="green" />


                    {/* hidden input fields CREATE PARTY */}
                    < TextInput
                        style={{ display: this.state.addPartyShow ? 'flex' : 'none', backgroundColor: 'white', padding: 5, paddingLeft: 10, borderRadius: 50, width: 190, margin: 2, borderWidth: 1 }}
                        placeholder='Party Name'
                        onChangeText={this.handleChangePartyName}
                        value={this.state.newPartyName}
                    />
                    <TextInput
                        style={{ display: this.state.addPartyShow ? 'flex' : 'none', backgroundColor: 'white', padding: 5, paddingLeft: 10, borderRadius: 50, width: 190, margin: 2, borderWidth: 1 }}
                        placeholder='Party Date'
                        onChangeText={this.handleChangePartyDate}
                        value={this.state.newPartyDate}
                    />
                    <TextInput
                        style={{ display: this.state.addPartyShow ? 'flex' : 'none', backgroundColor: 'white', padding: 5, paddingLeft: 10, borderRadius: 50, width: 190, margin: 2, borderWidth: 1 }}
                        placeholder='Party Time'
                        onChangeText={this.handleChangePartyTime}
                        value={this.state.newPartyTime}
                    />
                    <TextInput
                        style={{ display: this.state.addPartyShow ? 'flex' : 'none', backgroundColor: 'white', padding: 5, paddingLeft: 10, borderRadius: 50, width: 190, margin: 2, borderWidth: 1 }}
                        placeholder='Party Location'
                        onChangeText={this.handleChangePartyLocation}
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

                    {/* view parties */}
                    <Text style={{ textDecorationLine: 'underline', fontSize: 16, fontWeight: "bold" }}>Parties I'm Hosting</Text>
                    <ScrollView style={{ height: 200 }}>
                        {
                            this.state.hostingParties ? this.state.hostingParties.map((party, index) => {
                                return <TouchableOpacity key={index} onPress={() => this.changeTabs(party)} style={styles.partyButton}>
                                    <View style={{
                                        borderTopLeftRadius: 4, borderTopRightRadius: 4, backgroundColor: hostColorWheel[index % 4],
                                    }}><Text
                                        title={party.name}
                                        style={styles.text}
                                        accessibilityLabel={party.name}
                                    >{party.name}
                                        </Text>
                                        <Text style={styles.cancel} onPress={() => this.cancelParty(party)} >Cancel Party</Text>
                                    </View>
                                </TouchableOpacity>
                            }) : null
                        }
                    </ScrollView>
                    <Text style={{ textDecorationLine: 'underline', fontSize: 16, fontWeight: "bold", marginTop: 3 }}>Parties I'm Invited To</Text>
                    <ScrollView style={{ height: 200 }}>
                        {
                            this.state.attendingParties ? this.state.attendingParties.map((party, index) => {
                                return <TouchableOpacity key={index} onPress={() => this.changeTabs(party)} style={styles.partyButton}>
                                    <View style={{
                                        borderTopLeftRadius: 4, borderTopRightRadius: 4, backgroundColor: guestColorWheel[index % 4],
                                    }}>
                                        <Text
                                            title={party.name}
                                            style={styles.text}
                                            accessibilityLabel={party.name}
                                        >{party.name}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            }) : null
                        }
                    </ScrollView>
                </View>
            </View >
        );
    }
}

const styles = StyleSheet.create({
    partyButton: {
        backgroundColor: 'white',
        opacity: 200,
        width: 200,
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
        color: 'black',
        textAlign: 'center',
        padding: 3,
        fontSize: 14,
        textDecorationLine: 'underline',
        // borderTopLeftRadius: 45,
        // borderTopRightRadius: 45
    }
})