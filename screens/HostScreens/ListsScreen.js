import React from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, ScrollView, TextInput, AlertIOS } from 'react-native';

export default class ListsScreen extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            allTasks: null,
            partyTasks: null,
            addTaskShow: false,
            task: '',
            taskGuest: '',
            guestNames: [],
            self: {},
            guestCount: 0
        }
    }

    componentDidMount() {
        this.makeRemoteRequest()
    }

    makeRemoteRequest = () => {
        fetch(`http://localhost:3000/parties/${this.props.selectedParty}`)
            .then(resp => resp.json())
            .then(data => {
                let partyTasks = data.tasks.filter((task) => {
                    return task.party_id === this.props.selectedParty
                })
                let guestNames = this.props.guests.map((guest) => {
                    return guest.name
                })
                let self = this.props.guests.find((guest) => {
                    return guest.id === this.props.userID
                })
                this.props.setTaskCount(partyTasks.length)
                this.setState({
                    partyTasks: partyTasks,
                    task: '',
                    taskGuest: '',
                    addTaskShow: false,
                    guestNames: guestNames,
                    self: self,
                    guestCount: guestNames.length
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
                        this.state.taskGuest === '' ? AlertIOS.alert(`${this.state.task} added but not assigned`) :
                            AlertIOS.alert(`${this.state.task} assigned to ${this.state.taskGuest}.`))
                :
                AlertIOS.alert('must provide a task and guest must be invited')
        }
        this.setState({
            addTaskShow: false,
            task: '',
            taskGuest: '',
        })
        setTimeout(() => this.makeRemoteRequest(), 200)
    }

    guestSubmitTask = () => {
        fetch('http://localhost:3000/tasks', {
            method: 'POST', // or 'PUT'
            body: JSON.stringify({
                action: this.state.task,
                party_id: this.props.selectedParty,
                guest_name: this.state.self.name
            }), // data can be `string` or {object}!
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(resp => resp.json())
            .then(AlertIOS.alert(`${this.state.task} assigned to you.`))
        setTimeout(() => this.makeRemoteRequest(), 200)
    }

    pressTask = (task) => {
        this.props.userID === this.props.hostID ?
            this.hostTaskUpdate(task)
            : this.guestTaskUpdate(task)
    }

    hostTaskUpdate = (task) => {
        AlertIOS.alert(
            'Task Options',
            `${task.action}`,
            [
                {
                    text: 'Edit', onPress: () => {
                        AlertIOS.prompt(
                            'Update Task',
                            `${task.action}`,
                            [
                                { text: 'Cancel', style: 'cancel' },
                                {
                                    text: 'OK',
                                    onPress: (newAction) => { this.editTask(newAction, task) },
                                },
                            ],
                        );
                    }
                },
                {
                    text: 'Reassign', onPress: () => {
                        AlertIOS.prompt(
                            'Assign/Reassign Task',
                            `Assign ${task.action} to...`,
                            [
                                { text: 'Cancel', style: 'cancel' },
                                {
                                    text: 'OK',
                                    onPress: (taskGuest) => { this.reassignTask(taskGuest, task) },
                                },
                            ],
                        );
                    }
                },
                {
                    text: 'Remove', onPress: () => {
                        fetch(`http://localhost:3000/tasks/${task.id}`, {
                            method: 'DELETE', // or 'PUT'
                        })
                            .then(setTimeout(() => this.makeRemoteRequest(), 200))
                            .then(AlertIOS.alert(`${task.name} has been removed from the task list`))
                    }
                },
                { text: 'Cancel', style: 'cancel' }
            ]
        )
    }

    guestTaskUpdate = (task) => {
        console.log(task.guest.name)
        AlertIOS.alert(
            'some words',
            `other words ${task.action}?`,
            [{
                text: 'Accept Task', onPress: () => {

                    // console.log(`user: ${self.name}, task: ${task}`)
                    task.guest.name === "" ?
                        this.reassignTask(this.state.self.name, task)
                        : AlertIOS.alert("you can't steal an already assigned task!")
                },
            },
            { text: 'Cancel', style: 'cancel' }]
        )
    }

    editTask = (newAction, task) => {
        fetch(`http://localhost:3000/tasks/${task.id}`, {
            method: 'PATCH', // or 'PUT'
            body: JSON.stringify({
                action: newAction,
            }), // data can be `string` or {object}!
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(resp => resp.json())
            .then(console.log('it is done'))
            // .then(alert(`${this.state.firstName} ${this.state.lastName} has been invited to your party.`))
            .then(setTimeout(() => this.makeRemoteRequest(), 200))
    }

    reassignTask = (taskGuest, task) => {
        let newTaskGuest = this.props.guests.find((guest) => {
            return guest.name === taskGuest
        })
        newTaskGuest ? fetch(`http://localhost:3000/tasks/${task.id}`, {
            method: 'PATCH', // or 'PUT'
            body: JSON.stringify({
                guest_id: newTaskGuest.id,
            }), // data can be `string` or {object}!
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(resp => resp.json())
            .then(console.log('it is done'))
            .then(setTimeout(() => this.makeRemoteRequest(), 200))
            : AlertIOS.alert('Tasks can only be assigned to invited guests.')
    }



    render() {
        return (
            <View style={{ display: "flex", alignItems: "center", padding: 10, backgroundColor: '#4d5a63' }} >
                <Text style={{ textAlign: "center", margin: 20, fontSize: 30, textDecorationLine: 'underline' }}>LISTS</Text>

                {this.props.userID === this.props.hostID ?
                    /* host add task */
                    /* add task to task list */
                    <View>
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
                            autoCapitalize='words'
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
                    </View>
                    /* end host add task */

                    :
                    /* guest add task */
                    /* add task to task list */
                    <View>
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
                        <TouchableOpacity style={{ display: this.state.addTaskShow ? 'flex' : 'none', backgroundColor: 'grey', paddingLeft: 5, borderRadius: 50, width: 190, margin: 2, borderWidth: 1 }}
                            onPress={this.guestSubmitTask}>
                            <Text
                                title="Submit Task"
                                style={styles.text}
                                accessibilityLabel="Submit Task"
                            >Submit Task
                    </Text>
                        </TouchableOpacity>
                    </View>
                    /* end guest add task */
                }

                <ScrollView

                    style={{ padding: 0, height: 400, width: 280 }}
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
                                <Text
                                    onPress={() => this.pressTask(task)}>
                                    {task.guest.name !== '' && this.props.guests.find((guest) => {
                                        return task.guest.name === guest.name
                                    })
                                        ? <Text>&#10003;  </Text>
                                        : <Text>&#9675;  </Text>
                                    }
                                    <Text>{task.action}</Text>
                                </Text>
                                {task.guest.name !== '' && this.props.guests.find((guest) => {
                                    return task.guest.name === guest.name
                                })
                                    ? <Text style={styles.subtext}>        {task.guest.name}</Text>
                                    : <Text style={styles.subtext}>        unassigned</Text>
                                }

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