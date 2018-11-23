import React from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
import GuestsScreen from './GuestsScreen';
import { FlatList, ListItem } from 'react-native-gesture-handler';

export default class PlaylistScreen extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            partyPlaylist: null,
            addSongShow: false,
            addSongTitle: null,
            addSongArtist: null,
            refreshing: false,
            seed: 1
        }
    }

    componentDidMount() {
        this.makeRemoteRequest()
    }

    makeRemoteRequest = () => {
        fetch('http://localhost:3000/songs')
            .then(resp => resp.json())
            .then(data => {
                let partyPlaylist = data.filter((song) => {
                    return song.party_id === this.props.selectedParty
                })
                this.setState({
                    allSongs: data,
                    partyPlaylist: partyPlaylist,
                    song: '',
                    artist: '',
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
                        party_id: this.props.selectedParty
                    }), // data can be `string` or {object}!
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then(resp => resp.json())
                    .then(this.makeRemoteRequest())
                :
                null
        }
        this.setState({
            addSongShow: false,
            song: '',
            artist: '',
        })
    }

    render() {
        return (
            <View style={{ display: "flex", alignItems: "center" }} key={this.state.key}>
                <Text style={{ textAlign: "center", margin: 30, textDecorationLine: 'underline' }}>PLAYLIST SCREEN</Text>

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
                <Text style={{ textDecorationLine: 'underline', padding: 5 }}>Party Playlist</Text>

                <ScrollView
                    style={{ padding: 0, height: 400 }}
                >
                    {
                        this.state.partyPlaylist ? this.state.partyPlaylist.map((song, index) => {
                            return <Text key={index}
                                title={song.name}
                                style={{
                                    color: 'white',
                                    padding: 10,
                                    fontSize: 16,
                                    width: 300,
                                    backgroundColor: index % 2 == 0 ? 'lightgrey' : 'grey',
                                }}
                                accessibilityLabel={song.name}
                            >{song.name} - {song.artist}
                            </Text>
                        }) : null
                    }
                </ScrollView>

                {/* {this.state.partyPlaylist ?
                    <FlatList
                        keyExtractor={(item, index) => index.toString()}
                        data={this.state.partyPlaylist}
                        scrollsToTop={false}
                        renderItem={({ item, index }) => (
                            <View key={index} style={{
                                backgroundColor: index % 2 == 0 ? 'lightgrey' : 'grey'
                            }}>
                                <Text key={index} style={styles.flatListItem}>{item.name} by {item.artist}</Text>
                            </View>
                        )}
                    />
                    : null} */}
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