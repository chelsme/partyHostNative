import React from 'react';
import { StyleSheet, Text, View, Button, LinearGradient } from 'react-native';
import GuestsScreen from './GuestsScreen';


export default class ProfileScreen extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            party: null
        }
    }

    componentDidMount() {
        fetch('http://localhost:3000/parties')
            .then(resp => resp.json())
            .then(data => {
                let setParty = data.find((party) => {
                    return party.id === this.props.selectedParty
                })
                this.setState({
                    party: setParty
                })
            })
    }

    // logout = () => {
    //     this.props.navigator.popToTop();
    // }

    // goToGuests = () => {
    //     this.props.navigator.push({
    //         title: 'Guests',
    //         component: GuestsScreen,
    //     });
    // }


    render() {
        return (
            <View style={{ display: "flex", alignItems: "center", margin: 20 }}>
                {this.state.party ?
                    <View>
                        <Text style={{ textAlign: "center", margin: 20, fontSize: 30, textDecorationLine: 'underline' }}>{this.state.party.name}</Text>
                        <Text style={{ textAlign: "center", margin: 20, fontSize: 25, textDecorationLine: 'underline' }}>{this.state.party.date} at {this.state.party.time}</Text>
                        <Text style={{ textAlign: "center", margin: 20, fontSize: 20 }}>Location: {this.state.party.location}</Text>
                        <Text style={{ textAlign: "center", margin: 12, fontSize: 18 }}>Guests Invited:
                        {this.props.guestCount ? this.props.guestCount : this.state.party.guests.length}</Text>
                        <Text style={{ textAlign: "center", margin: 12, fontSize: 18 }}>Songs on Playlist:
                        {this.props.songCount ? this.props.songCount : this.state.party.songs.length}</Text>
                        <Text style={{ textAlign: "center", margin: 12, fontSize: 18 }}>Tasks Assigned: {this.props.taskCount ? this.props.taskCount : this.state.party.tasks.length}</Text>
                    </View>
                    : null}
            </View>
        );
    }
}