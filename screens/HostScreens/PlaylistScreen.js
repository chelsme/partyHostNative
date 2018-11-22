import React from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity } from 'react-native';
import GuestsScreen from './GuestsScreen';

export default class PlaylistScreen extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            partyPlaylist: null
        }
    }

    componentDidMount() {
        fetch('http://localhost:3000/songs')
            .then(resp => resp.json())
            .then(data => {
                console.log(data[0].name)
                let partyPlaylist = data.filter((song) => {
                    return song.party_id === this.props.selectedParty
                })
                this.setState({
                    allSongs: data,
                    partyPlaylist: partyPlaylist
                })
            })
    }

    logout = () => {
        this.props.navigator.popToTop();
    }

    goToGuests = () => {
        this.props.navigator.push({
            title: 'Guests',
            component: GuestsScreen,
        });
    }


    render() {
        return (
            <View style={{ display: "flex", alignItems: "center" }}>
                <Text style={{ textAlign: "center", margin: 30, textDecorationLine: 'underline' }}>PLAYLIST SCREEN</Text>
                <Text style={{ textDecorationLine: 'underline' }}>Party Playlist</Text>
                {this.state.partyPlaylist ? this.state.partyPlaylist.map((song, index) => {
                    return <TouchableOpacity key={index} style={styles.textButton}>
                        <Text
                            title={song.name}
                            style={styles.text}
                            accessibilityLabel={song.name}
                        >{song.name} - {song.artist}
                        </Text>
                    </TouchableOpacity>
                }) : null}

                {/* <Button
                    onPress={this.goToGuests}
                    title="Go To Guests"
                    color="#841584"
                    accessibilityLabel="Go To Guests"
                />
                <Button
                    onPress={this.logout}
                    title="Logout"
                    color="#841584"
                    accessibilityLabel="Logout"
                /> */}
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