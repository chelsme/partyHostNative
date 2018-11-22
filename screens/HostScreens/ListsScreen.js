import React from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity } from 'react-native';

export default class ListsScreen extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            partyTasks: null
        }
    }

    componentDidMount() {
        fetch('http://localhost:3000/tasks')
            .then(resp => resp.json())
            .then(data => {
                console.log(data[0].name)
                let partyTasks = data.filter((task) => {
                    return task.party_id === this.props.selectedParty
                })
                this.setState({
                    alltasks: data,
                    partyTasks: partyTasks
                })
            })
    }

    render() {
        return (
            <View style={{ display: "flex", alignItems: "center" }}>
                <Text style={{ textAlign: "center", margin: 30, textDecorationLine: 'underline' }}>LISTS SCREEN</Text>
                <Text style={{ textDecorationLine: 'underline' }}>Party Playlist</Text>
                {this.state.partyTasks ? this.state.partyTasks.map((task, index) => {
                    console.log(task.guest.name)
                    return <TouchableOpacity key={index} style={styles.textButton}>
                        <Text
                            title={task.task}
                            style={styles.text}
                            accessibilityLabel={task.task}
                        >{task.task} - {task.guest.name}
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
        fontSize: 14
    }
})