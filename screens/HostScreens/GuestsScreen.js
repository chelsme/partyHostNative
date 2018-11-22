import React from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity } from 'react-native';

export default class GuestsScreen extends React.Component {
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
    render() {
        // console.log(this.props)
        return (
            <View style={{ display: "flex", alignItems: "center" }} >
                <Text style={{ textAlign: "center", margin: 30, textDecorationLine: 'underline' }}>GUESTS SCREEN</Text>
                <Text style={{ textDecorationLine: 'underline' }}>Party Guests</Text>
                {this.state.party ? this.state.party.guests.map((guest, index) => {
                    return <TouchableOpacity key={index} style={styles.textButton}>
                        <Text
                            title={guest.name}
                            style={styles.text}
                            accessibilityLabel={guest.name}
                        >{guest.name}
                        </Text>
                    </TouchableOpacity>
                }) : null}

                {/* {this.props.selectedParty.guests.map((guest) => {
                    return <Text>{guest.name}</Text>
                })} */}

                {/* <Button
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