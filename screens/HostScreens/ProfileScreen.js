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

    render() {
        return (
            <View style={{ display: "flex", alignItems: "center", padding: 10, backgroundColor: '#4d5a63' }} >
                {this.state.party ?
                    <View>
                        <Text style={{ textAlign: "center", margin: 20, fontSize: 30, textDecorationLine: 'underline' }}>{this.state.party.name}</Text>
                        <Text style={{ textAlign: "center", margin: 20, fontSize: 25, textDecorationLine: 'underline' }}>{this.state.party.date} at {this.state.party.time}</Text>
                        <Text style={{ textAlign: "center", margin: 20, fontSize: 20 }}>Location:&nbsp;{this.state.party.location}</Text>
                        <Text style={{ textAlign: "center", margin: 12, fontSize: 18 }}>Guests Invited:&nbsp;
                        {this.props.guests.length ? this.props.guests.length - 1 : this.state.party.guests.length - 1}</Text>
                        <Text style={{ textAlign: "center", margin: 12, fontSize: 18 }}>Songs on Playlist:&nbsp;
                        {this.props.songCount ? this.props.songCount : this.state.party.songs.length}</Text>
                        <Text style={{ textAlign: "center", margin: 12, fontSize: 18 }}>Tasks Assigned:&nbsp;{this.props.taskCount ? this.props.taskCount : this.state.party.tasks.length}</Text>
                    </View>
                    : null}
            </View>
        );
    }
}