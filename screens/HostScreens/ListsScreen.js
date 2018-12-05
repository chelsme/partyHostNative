import React from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, ScrollView, TextInput, AlertIOS, Picker, ImageBackground } from 'react-native';
import SearchBar from 'react-native-searchbar'
import SearchableDropdown from 'react-native-searchable-dropdown';
import { Ionicons, FontAwesome, Octicons, MaterialIcons } from '@expo/vector-icons';



export default class ListsScreen extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            allTasks: null,
            partyTasks: null,
            addTaskShow: false,
            task: '',
            taskGuest: '',
            guestNames: null,
            self: {},
            guestCount: 0,
            results: null
        }
    }

    componentDidMount() {
        this.makeRemoteRequest()
    }

    componentDidUpdate(prevProps) {
        if (prevProps.screenProps.selectedParty !== this.props.screenProps.selectedParty) {
            this.makeRemoteRequest()
        }
    }

    makeRemoteRequest = () => {
        fetch(`http://10.185.4.126:3000/parties/${this.props.screenProps.selectedParty}`)
            .then(resp => resp.json())
            .then(data => {
                let partyTasks = data.tasks.filter((task) => {
                    return task.party_id === this.props.screenProps.selectedParty
                })
                let guestNames = this.props.screenProps.guests.map((guest) => {
                    return guest.name
                })
                let self = this.props.screenProps.guests.find((guest) => {
                    return guest.id === this.props.screenProps.userID
                })
                this.props.screenProps.setTaskCount(partyTasks.length)
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

    handleChangeTextTaskGuest = (name) => {
        this.setState({
            taskGuest: name
        })
    }

    handleSubmitTask = () => {
        {
            this.state.task !== '' && (this.props.screenProps.guests.find((guest) => { return guest.name === this.state.taskGuest }) || this.state.taskGuest === '') ?
                fetch('http://10.185.4.126:3000/tasks', {
                    method: 'POST', // or 'PUT'
                    body: JSON.stringify({
                        action: this.state.task,
                        party_id: this.props.screenProps.selectedParty,
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
        fetch('http://10.185.4.126:3000/tasks', {
            method: 'POST', // or 'PUT'
            body: JSON.stringify({
                action: this.state.task,
                party_id: this.props.screenProps.selectedParty,
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
        this.props.screenProps.userID === this.props.screenProps.hostID ?
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
                        fetch(`http://10.185.4.126:3000/tasks/${task.id}`, {
                            method: 'DELETE', // or 'PUT'
                        })
                            .then(setTimeout(() => this.makeRemoteRequest(), 200))
                            .then(AlertIOS.alert(`${task.action} has been removed from the task list`))
                    }
                },
                { text: 'Cancel', style: 'cancel' }
            ]
        )
    }

    guestTaskUpdate = (task) => {
        AlertIOS.alert(
            'Task Options',
            `${task.action}`,
            [{
                text: 'Accept Task', onPress: () => {
                    task.guest.name === "" ?
                        this.reassignTask(this.state.self.name, task)
                        : AlertIOS.alert("you can't steal an already assigned task!")
                },
            },
            { text: 'Cancel', style: 'cancel' }]
        )
    }

    editTask = (newAction, task) => {
        fetch(`http://10.185.4.126:3000/tasks/${task.id}`, {
            method: 'PATCH', // or 'PUT'
            body: JSON.stringify({
                action: newAction,
            }), // data can be `string` or {object}!
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(resp => resp.json())
            .then(setTimeout(() => this.makeRemoteRequest(), 200))
    }

    reassignTask = (taskGuest, task) => {
        let newTaskGuest = this.props.screenProps.guests.find((guest) => {
            return guest.name === taskGuest
        })
        newTaskGuest ? fetch(`http://10.185.4.126:3000/tasks/${task.id}`, {
            method: 'PATCH', // or 'PUT'
            body: JSON.stringify({
                guest_id: newTaskGuest.id,
            }), // data can be `string` or {object}!
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(resp => resp.json())
            .then(setTimeout(() => this.makeRemoteRequest(), 200))
            : AlertIOS.alert('Tasks can only be assigned to invited guests.')
    }



    render() {
        console.log(this.props.screenProps.color)
        return (
            <ImageBackground source={require('../../assets/images/background.jpg')} style={{ display: "flex", alignItems: "center", padding: 10, backgroundColor: '#4d5a63' }} >
                <Text style={{ textAlign: "center", margin: 20, fontSize: 30, textDecorationLine: 'underline', color: 'white', fontWeight: "bold", fontFamily: "Verdana" }}>TASKS</Text>

                {this.props.screenProps.userID === this.props.screenProps.hostID ?
                    /* host add task */
                    /* add task to task list */
                    <View style={{ display: "flex", alignItems: "center" }} >
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

                        {/* ********************** searchable dropdown ********************** */}
                        <SearchableDropdown
                            onTextChange={(text) => console.log(text)}
                            onItemSelect={(item) => this.handleChangeTextTaskGuest(item.name)}
                            containerStyle={{
                                padding: 5,
                                display: this.state.addTaskShow ? 'flex' : 'none',
                            }}
                            textInputStyle={{ display: this.state.addTaskShow ? 'flex' : 'none', backgroundColor: 'white', padding: 5, paddingLeft: 10, borderRadius: 50, width: 190, margin: 2, borderWidth: 1 }}
                            itemStyle={{
                                padding: 10,
                                marginTop: 2,
                                backgroundColor: '#ddd',
                                borderColor: '#bbb',
                                borderWidth: 1,
                                borderRadius: 5
                            }}
                            itemTextStyle={{
                                color: '#222'
                            }}
                            itemsContainerStyle={{
                                maxHeight: 140
                            }}
                            items={this.props.screenProps.guests}
                            placeholder="Guest Names"
                            resetValue={false}
                            underlineColorAndroid='transparent' />
                        {/* ********************** end searchable dropdown ********************** */}

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

                    style={{ padding: 0, height: 385, width: 280, marginTop: 10 }}
                >
                    {
                        this.state.partyTasks ? this.state.partyTasks.map((task, index) => {
                            return <View key={index}
                                title={task.action}
                                style={{
                                    color: 'white',
                                    padding: 6,
                                    fontSize: 16,
                                    width: 280,
                                    backgroundColor: index % 2 == 0 ? '#E97E25' : '#FFC34C',
                                    borderTopLeftRadius: index === 0 ? 4 : null,
                                    borderTopRightRadius: index === 0 ? 4 : null,
                                    borderBottomLeftRadius: index === this.state.partyTasks.length - 1 ? 4 : null,
                                    borderBottomRightRadius: index === this.state.partyTasks.length - 1 ? 4 : null
                                }}
                                accessibilityLabel={task.guest.name !== '' ? `${task.action} assigned to ${task.guest.name}` : `${task.action} is unassigned`}
                            >
                                <Text>
                                    {task.guest.name !== '' && this.props.screenProps.guests.find((guest) => {
                                        return task.guest.name === guest.name
                                    })
                                        ? <Text>&#10003;  </Text>
                                        : <Text>&#9675;   </Text>
                                    }
                                    <Text>{task.action}</Text>
                                </Text>


                                {task.guest.name !== '' && this.props.screenProps.guests.find((guest) => {
                                    return task.guest.name === guest.name
                                })
                                    ? <Text style={styles.subtext}>          {task.guest.name}</Text>
                                    : <Text style={styles.subtext}>          unassigned</Text>
                                }

                                <MaterialIcons name="edit" color='white' size={18} style={{ marginTop: -28, marginLeft: 240, marginBottom: 8, width: 18 }} onPress={() => this.pressTask(task)} />
                            </View>
                        }) : null
                    }
                </ScrollView>
            </ImageBackground>
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
    },
    text: {
        color: 'white',
        textAlign: 'center',
        padding: 5,
        fontSize: 16
    },
    subtext: {
        color: 'white',
        marginTop: 3,
        fontSize: 11
    },
    textInputStyle: {
        padding: 5,
        borderWidth: 1,
        borderColor: '#ccc',
        backgroundColor: 'white',
        borderRadius: 5
    }
})