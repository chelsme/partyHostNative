import React from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, TextInput, AlertIOS, ScrollView } from 'react-native';
import { Icon } from 'react-native-elements'
import GuestsScreen from './GuestsScreen';

export default class PlaylistScreen extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            partyPlaylist: null,
            addSongShow: false,
            addSongTitle: null,
            addSongArtist: null
        }
    }

    componentDidMount() {
        this.makeRemoteRequest()
    }

    componentDidUpdate(prevProps) {
        if (prevProps.selectedParty !== this.props.screenProps.selectedParty) {
            this.makeRemoteRequest()
        }
    }

    makeRemoteRequest = () => {
        fetch('http://localhost:3000/songs')
            .then(resp => resp.json())
            .then(data => {
                let partyPlaylist = data.filter((song) => {
                    return song.party_id === this.props.screenProps.selectedParty
                })
                this.props.screenProps.setSongCount(partyPlaylist.length)
                this.setState({
                    allSongs: data,
                    partyPlaylist: partyPlaylist,
                    song: '',
                    artist: ''
                })
            })
    }

    addSong = () => {
        this.setState((state) => {
            return { addSongShow: !state.addSongShow };
        });
    }

    handleChangeTextSong = (typedText) => {
        this.setState({
            song: typedText
        })
    }

    handleChangeTextArtist = (typedText) => {
        this.setState({
            artist: typedText
        })
    }

    handleSubmitSong = () => {
        {
            this.state.song !== '' && this.state.artist !== '' ?
                fetch('http://localhost:3000/songs', {
                    method: 'POST', // or 'PUT'
                    body: JSON.stringify({
                        name: this.state.song,
                        artist: this.state.artist,
                        party_id: this.props.screenProps.selectedParty
                    }), // data can be `string` or {object}!
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then(resp => resp.json())
                    .then(alert(`${this.state.song} by ${this.state.artist} added to playlist.`))
                :
                AlertIOS.alert('must fill out song details')
        }
        this.setState({
            addSongShow: false,
            song: '',
            artist: ''
        })
        setTimeout(() => this.makeRemoteRequest(), 200)
    }

    pressSong = (song) => {
        this.props.screenProps.hostID === this.props.screenProps.userID ?
            AlertIOS.alert(
                'Remove Song from Playlist',
                `Would you like to remove ${song.name} by ${song.artist} from the playlist?`,
                [
                    {
                        text: 'Remove', onPress: () => {
                            fetch(`http://localhost:3000/songs/${song.id}`, {
                                method: 'DELETE', // or 'PUT'
                            })
                                .then(setTimeout(() => this.makeRemoteRequest(), 200))
                                .then(alert(`${song.name} by ${song.artist} has been removed from the playlist`))
                        }
                    },
                    { text: 'Cancel', style: 'cancel' }
                ]
            )
            : AlertIOS.alert('Only the party host can delete songs from playlists.')
    }

    render() {
        return (
            <View style={{ display: "flex", alignItems: "center", padding: 10, backgroundColor: '#4d5a63' }} >
                <Text style={{ textAlign: "center", margin: 20, fontSize: 30, textDecorationLine: 'underline' }}>PLAYLIST</Text>

                {/* add song to playlist */}
                <TouchableOpacity style={styles.textButton}>
                    <Text
                        onPress={this.addSong}
                        title="Add Song"
                        style={styles.text}
                        accessibilityLabel="Add Song"
                    >Add Song
                    </Text>
                </TouchableOpacity>

                {/* hidden input fields */}
                <TextInput
                    style={{ display: this.state.addSongShow ? 'flex' : 'none', backgroundColor: 'white', padding: 5, paddingLeft: 10, borderRadius: 50, width: 190, margin: 2, borderWidth: 1 }}
                    placeholder='Song Title'
                    onChangeText={this.handleChangeTextSong}
                    value={this.state.song}
                />
                <TextInput
                    style={{ display: this.state.addSongShow ? 'flex' : 'none', backgroundColor: 'white', padding: 5, paddingLeft: 10, borderRadius: 50, width: 190, margin: 2, borderWidth: 1 }}
                    placeholder='Artist'
                    onChangeText={this.handleChangeTextArtist}
                    value={this.state.artist}
                />
                <TouchableOpacity style={{ display: this.state.addSongShow ? 'flex' : 'none', backgroundColor: 'grey', paddingLeft: 5, borderRadius: 50, width: 190, margin: 2, borderWidth: 1 }}
                    onPress={this.handleSubmitSong}>
                    <Text
                        title="Submit Song"
                        style={styles.text}
                        accessibilityLabel="Submit Song"
                    >Submit Song
                    </Text>
                </TouchableOpacity>

                <ScrollView style={{ padding: 0, height: 400, width: 280 }} >
                    {
                        this.state.partyPlaylist ? this.state.partyPlaylist.map((song, index) => {
                            return <View
                                key={index}
                                title={song.name}
                                style={{
                                    color: 'white',
                                    padding: 10,
                                    fontSize: 16,
                                    width: 280,
                                    backgroundColor: index % 2 == 0 ? '#B9CF1B' : '#2E7F8B',
                                    borderTopLeftRadius: index === 0 ? 4 : null,
                                    borderTopRightRadius: index === 0 ? 4 : null,
                                    borderBottomLeftRadius: index === this.state.partyPlaylist.length - 1 ? 4 : null,
                                    borderBottomRightRadius: index === this.state.partyPlaylist.length - 1 ? 4 : null
                                }}
                                accessibilityLabel={`${song.name} by ${song.artist}`}
                            >
                                <Text onPress={() => this.pressSong(song)}>&#127925;    {song.name} - {song.artist}</Text>
                            </View>
                        }) : null
                    }
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
    },
    song: {
        color: 'blue',
        textAlign: 'center',
        padding: 5,
        fontSize: 20
    },
    flatListItem: {
        color: 'white',
        padding: 10,
        fontSize: 16,
        width: 300
    }
})