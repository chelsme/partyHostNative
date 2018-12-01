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
            <View style={{ display: "flex", alignItems: "center", padding: 10, backgroundColor: '#4d5a63', height: 800 }} >
                {this.state.party ?
                    <View>
                        <View style={{ borderRadius: 5, backgroundColor: 'white', width: 300, padding: 20, margin: 5, marginTop: 20 }} >
                            <Text style={{ textAlign: "center", fontSize: 20, textDecorationLine: 'underline', fontWeight: "bold" }}>{this.state.party.name}</Text>
                        </View>
                        <View style={{ borderRadius: 5, backgroundColor: 'white', width: 300, padding: 10, margin: 5 }} >
                            <Text style={{ textAlign: "center", margin: 10, fontSize: 22 }}>Date: {this.state.party.date}</Text>
                            <Text style={{ textAlign: "center", margin: 10, fontSize: 22 }}>Time: {this.state.party.time}</Text>
                            <Text style={{ textAlign: "center", margin: 10, fontSize: 20 }}>Location:&nbsp;{this.state.party.location}</Text>
                        </View>
                        <View style={{ borderRadius: 5, backgroundColor: 'white', width: 300, padding: 10, margin: 5 }} >
                            <Text style={{ textAlign: "center", margin: 8, fontSize: 18 }}>Guests Invited:&nbsp;
                            {this.props.guests.length ? this.props.guests.length - 1 : this.state.party.guests.length - 1}</Text>
                            <Text style={{ textAlign: "center", margin: 8, fontSize: 18 }}>Songs on Playlist:&nbsp;
                            {this.props.songCount ? this.props.songCount : this.state.party.songs.length}</Text>
                            <Text style={{ textAlign: "center", margin: 8, fontSize: 18 }}>Tasks Assigned:&nbsp;{this.props.taskCount ? this.props.taskCount : this.state.party.tasks.length}</Text>
                        </View>
                    </View>
                    : null}
            </View>
        );
    }
}