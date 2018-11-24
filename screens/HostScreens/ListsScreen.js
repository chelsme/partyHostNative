import React from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, ScrollView } from 'react-native';

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
            <View style={{ display: "flex", alignItems: "center", margin: 20 }}>
                <Text style={{ textAlign: "center", margin: 20, fontSize: 30, textDecorationLine: 'underline' }}>LISTS</Text>

                <ScrollView
                    style={{ padding: 0, height: 400 }}
                >
                    {
                        this.state.partyTasks ? this.state.partyTasks.map((task, index) => {
                            return <Text key={index}
                                title={task.action}
                                style={{
                                    color: 'white',
                                    padding: 10,
                                    fontSize: 16,
                                    width: 300,
                                    backgroundColor: index % 2 == 0 ? '#666666' : 'grey',
                                }}
                                accessibilityLabel={`${task.action} assigned to ${task.guest.name}`}
                            >
                                {task.guest.name ? <Text>&#10003;  </Text> : <Text>&#9675;  </Text>}
                                {task.action} - {task.guest.name}
                            </Text>
                        }) : null
                    }
                </ScrollView>


                {/* {this.state.partyTasks ? this.state.partyTasks.map((task, index) => {
                    // console.log(task.guest.name)
                    return <TouchableOpacity key={index} style={styles.textButton}>
                        <Text
                            title={task.action}
                            style={styles.text}
                            accessibilityLabel={task.action}
                        >{task.action} - {task.guest.name}
                        </Text>
                    </TouchableOpacity>
                }) : null} */}
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