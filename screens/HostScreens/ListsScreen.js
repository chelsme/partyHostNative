import React from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, ScrollView, TextInput } from 'react-native';

export default class ListsScreen extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            allTasks: null,
            partyTasks: null,
            addTaskShow: false,
            task: '',
            taskGuest: ''
        }
    }

    componentDidMount() {
        this.makeRemoteRequest()
    }

    makeRemoteRequest = () => {
        fetch('http://localhost:3000/tasks')
            .then(resp => resp.json())
            .then(data => {
                let partyTasks = data.filter((task) => {
                    return task.party_id === this.props.selectedParty
                })
                this.props.setTaskCount(partyTasks.length)
                this.setState({
                    alltasks: data,
                    partyTasks: partyTasks,
                    task: '',
                    taskGuest: '',
                    addTaskShow: false
                })
            })
    }

    addTask = () => {
        this.setState((state) => {
            return { addTaskShow: !state.addTaskShow };
        });
    }

    handleChangeTextTask = (typedText) => {
        this.setState({
            task: typedText
        })
    }

    handleChangeTextTaskGuest = (typedText) => {
        this.setState({
            taskGuest: typedText
        })
    }

    handleSubmitTask = () => {
        {
            this.state.task !== '' && (this.props.guests.find((guest) => { return guest.name === this.state.taskGuest }) || this.state.taskGuest === '') ?
                fetch('http://localhost:3000/tasks', {
                    method: 'POST', // or 'PUT'
                    body: JSON.stringify({
                        action: this.state.task,
                        party_id: this.props.selectedParty,
                        guest_name: this.state.taskGuest
                    }), // data can be `string` or {object}!
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then(resp => resp.json())
                    .then(
                        this.state.taskGuest === '' ? alert(`${this.state.task} added but not assigned`) :
                            alert(`${this.state.task} assigned to ${this.state.taskGuest}.`))
                :
                alert('must provide a task and guest must be invited')
        }
        this.setState({
            addTaskShow: false,
            task: '',
            taskGuest: '',
        })
        setTimeout(() => this.makeRemoteRequest(), 200)
    }

    render() {
        return (
            <View style={{ display: "flex", alignItems: "center", margin: 20 }}>
                <Text style={{ textAlign: "center", margin: 20, fontSize: 30, textDecorationLine: 'underline' }}>LISTS</Text>


                {/* add task to task list */}
                <TouchableOpacity style={styles.textButton}>
                    <Text
                        onPress={this.addTask}
                        title="Add Task"
                        style={styles.text}
                        accessibilityLabel="Add Task"
                    >Add Task
                    </Text>
                </TouchableOpacity>

                {/* hidden input fields */}
                <TextInput
                    style={{ display: this.state.addTaskShow ? 'flex' : 'none', backgroundColor: 'white', padding: 5, paddingLeft: 10, borderRadius: 50, width: 190, margin: 2, borderWidth: 1 }}
                    placeholder='Task'
                    onChangeText={this.handleChangeTextTask}
                    value={this.state.task}
                />
                <TextInput
                    style={{ display: this.state.addTaskShow ? 'flex' : 'none', backgroundColor: 'white', padding: 5, paddingLeft: 10, borderRadius: 50, width: 190, margin: 2, borderWidth: 1 }}
                    placeholder='Assign To...'
                    onChangeText={this.handleChangeTextTaskGuest}
                    value={this.state.taskGuest}
                />
                <TouchableOpacity style={{ display: this.state.addTaskShow ? 'flex' : 'none', backgroundColor: 'grey', paddingLeft: 5, borderRadius: 50, width: 190, margin: 2, borderWidth: 1 }}
                    onPress={this.handleSubmitTask}>
                    <Text
                        title="Submit Task"
                        style={styles.text}
                        accessibilityLabel="Submit Task"
                    >Submit Task
                    </Text>
                </TouchableOpacity>


                <ScrollView
                    style={{ padding: 0, height: 400 }}
                >
                    {
                        this.state.partyTasks ? this.state.partyTasks.map((task, index) => {
                            return <View key={index}
                                title={task.action}
                                style={{
                                    color: 'white',
                                    padding: 6,
                                    fontSize: 16,
                                    width: 300,
                                    backgroundColor: index % 2 == 0 ? '#666666' : 'grey',
                                }}
                                accessibilityLabel={task.guest.name !== '' ? `${task.action} assigned to ${task.guest.name}` : `${task.action} is unassigned`}
                            >
                                <Text>
                                    {task.guest.name !== '' ? <Text>&#10003;  </Text> : <Text>&#9675;  </Text>}
                                    <Text>{task.action}</Text>
                                    {/* <Text>Assign/Reassign</Text> */}
                                </Text>
                                {task.guest.name !== '' ? <Text style={styles.subtext}>        {task.guest.name}</Text> : <Text style={styles.subtext}>        unassigned</Text>}

                            </View>
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
    },
    subtext: {
        color: 'white',
        marginTop: 3,
        fontSize: 11
    }
})