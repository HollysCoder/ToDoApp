import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  Dimensions, 
  Platform, 
  ScrollView }
from 'react-native';
import { nanoid } from 'nanoid/async';
import ToDo from './ToDo';
import * as Random from 'expo-random';
import { AppLoading } from "expo";
import 'react-native-get-random-values';


const {height, width} = Dimensions.get("window");

export default class App extends React.Component {
  state = {
    newToDo: "",
    loadedToDos: false,
    toDos: {}
  };
  componentDidMount = () => {
    this._loadToDos();
  }

  render() {
    const { newToDo, loadedToDos, toDos } =this.state;
    console.log(toDos);
    if(!loadedToDos) {
      return <AppLoading />
    }
    return(
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <Text style={styles.title}>You know what to do</Text>
        <View style={styles.card}>
          <TextInput 
            style={styles.input} 
            placeholder={"New to do"} 
            value={newToDo}
            onChangeText={this._controlNewToDo}
            placeholderTextColor={"#999"}
            returnKeyType={"done"}
            autoCorrect={false}
            onSubmitEditing={this._addToDo}
          />
          <ScrollView contentContainerStyle={styles.toDos}>
            {Object.values(toDos).map(toDo => <ToDo key={toDo.id} {...toDo} />)}
          </ScrollView>
        </View>
      </View>
    );
  };
  _controlNewToDo = text => {
    this.setState({
      newToDo: text
    })
  };
  _loadToDos = () => {
    this.setState({
      loadedToDos: true
    });
  };

  _addToDo = () => {
    const { newToDo } = this.state;
    if (newToDo !== "") {
      this.setState(prevState => {
        const ID = async function() {
          return await Random.getRandomBytesAsync(16);
        }
        console.log("Id is "+ID)

        const newToDoObject= {
          [ID]: {
            id: ID,
            isCompleted: false,
            text: newToDo,
            createdAt: Date.now()
          }
        };

        const newState = {
          ...prevState,
          newToDo: "",
          toDos: {
            ...prevState.toDos,
            ...newToDoObject
          }
        }
        return {...newState};
      });
    }
  };
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f23657',
    alignItems: 'center'
  },
  title: {
    color: "white",
    fontSize: 30,
    marginTop: 40,
    fontWeight: "200"
  },
  card :{
    backgroundColor:"white",
    flex: 1,
    width: width - 25,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    ...Platform.select({
      ios: {
        shadowColor:"rgb(50, 50, 50)",
        shadowOpacity: 0.5,
        shadowRadius: 5,
        shadowOffset: {
          height:-1,
          width: 0
        }
      },
      android: {
        elevation: 3
      }
    })


  },
  input : {
    padding: 20,
    borderBottomColor: "#bbb",
    borderBottomWidth: 1,
    fontSize: 25
  },
  toDos: {
    alignItems: "flex-start"
  }
});
