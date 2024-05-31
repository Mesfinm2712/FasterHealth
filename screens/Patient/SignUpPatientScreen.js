import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Text,
  Button,
  TextInput,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native'
import firebase from 'firebase'
import * as Google from 'expo-google-app-auth';
import {db} from '../../App'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#e6f2ff',
      margin:'10%',
      
      borderRadius: 10,
      padding: 5
    },
      signIn: {
        borderColor: 'black',
        backgroundColor: '#AAE2D1',
        borderRadius: 10,
        padding: 10,
        margin: 10,
      },
    
      myBtns: {
        margin: 5,
        borderRadius: 10,
        alignItems: "center",
        backgroundColor: '#AAE2D1',
        padding: 10,
        
      },
  })

export default class SignUpPatientScreen extends Component {
    state = {
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        loading: true
    }
    constructor(props){
        super(props);
        this.signUpPatient = this.signUpPatient.bind(this); 
    }
    componentDidMount(){
        this.setState(
            {
                email: '',
                password: '',
                firstName: '',
                lastName: '',
                loading: false
            }
        );
    }
    loginAsClinic = () => {
        this.props.navigation.navigate('ClinicLoginScreen');
    }
    
    // sign patient up
    signUpPatient = () => {
        var self = this;
        firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password).then(cred =>{
            db.ref(`users/${cred.user.uid}`).set({
                firstName: self.state.firstName,
                lastName: self.state.lastName
          });
          self.props.navigation.navigate('PatientDashboardScreen');
          });
    }

    setFirstName = (name) =>{
        this.setState({firstName: name});
     }
     setLastName = (name) =>{
        this.setState({lastName: name});
     }
     setEmail = (e) =>{
        this.setState({email: e});
     }
     setPassword = (p) =>{
        this.setState({password: p});
     }

     render() {
        if(this.state.loading){
          return(
           <View>
           <ActivityIndicator size= "large"/>
         </View>
          );
        }

        return(
            <KeyboardAwareScrollView
            resetScrollToCoords={{ x: 0, y: 0 }}   
            scrollEnabled={true}
            >
        <View style={styles.container}>
            <Text style={{color: 'black', fontSize: 50}}>Sign Up</Text>
            <View style={{height: 40, margin: 5,borderBottomColor: 'black', borderBottomWidth: 1, marginBottom: 10, width: '90%'}}>
            <TextInput
                style={{height: 40, background: 'aliceblue', margin: 5}}
                placeholder="First Name"
                onChangeText={firstName => this.setFirstName(firstName)}
                defaultValue={this.state.firstName}
                />
            </View>
            <View style={{height: 40, margin: 5,borderBottomColor: 'black', borderBottomWidth: 1, marginBottom: 10, width: '90%'}}>
            
            <TextInput
                style={{height: 40, background: 'aliceblue', margin: 5}}
                placeholder="Last Name"
                onChangeText={lastName => this.setLastName(lastName)}
                defaultValue={this.state.lastName}
                />
            </View>
            <View style={{height: 40, margin: 5,borderBottomColor: 'black', borderBottomWidth: 1, marginBottom: 10, width: '90%'}}>
            <TextInput
                style={{height: 40, background: 'aliceblue', margin: 5}}
                placeholder="Email"
                onChangeText={email => this.setEmail(email)}
                defaultValue={this.state.email}
                />
            </View>
            <View style={{height: 40, margin: 5,borderBottomColor: 'black', borderBottomWidth: 1, marginBottom: 10, width: '90%'}}>
            <TextInput
                style={{height: 40, background: 'aliceblue', margin: 5}}
                placeholder="Password"
                onChangeText={password => this.setPassword(password)}
                defaultValue={this.state.password}
                />
            </View>
                <View>
                <TouchableOpacity
                  style={styles.myBtns}
                  onPress={() => this.signUpPatient()}
                >
                <Text>Sign Up</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.myBtns}
                  onPress={() => this.loginAsClinic()}
                >
                <Text>Login as a Clinic</Text>
                </TouchableOpacity>
                </View>
            </View>
            </KeyboardAwareScrollView>
          );
    }
}