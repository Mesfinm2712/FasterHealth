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

export default class SignUpClinicScreen extends Component {
    state = {
        clinicID: '',
        clinicName: '',
        password: '',
        loading: true
    }
    constructor(props){
        super(props);
        this.signUpClinic = this.signUpClinic.bind(this); 
    }

    // this function checks if the user has been logged in previously
    checkedIfLoggedIn = () => {
        firebase.auth().onAuthStateChanged(user => {
            // take user to dashboard screen if already logged in
            if(user){
               this.props.navigation.navigate('ClinicDashboardScreen');
            }else{
               //take user to the log in screen
               this.props.navigation.navigate('ClinicLoginScreen');
            }
        })
    }
    componentDidMount(){
        this.setState(
            {
                clinicID: '',
                password: '',
                clinicName: '',
                loading: false
            }
        );
    }
    loginAsPatient = () => {
        this.props.navigation.navigate('PatientLoginScreen');
    }
    
    // sign clinic up
    signUpClinic = () => {
        if(this.state.clinicID === '' || this.state.password === '' || this.state.clinicName === ''){
            alert('invalid ID or password');
        }else{
            var self = this;
            firebase.auth().createUserWithEmailAndPassword(this.state.clinicID, this.state.password).then(cred =>{
                db.ref(`clinics/${cred.user.uid}`).set({
                clinicName: self.state.clinicName,
            });
            self.props.navigation.navigate('ClinicDashboardScreen');
            });
        }
    }

    // set the clinicID value
    setclinicID = (e) =>{
        this.setState({clinicID: e});
     }
     // set the password value
     setPassword = (p) =>{
        this.setState({password: p});
     }

     setclinicName = (e) =>{
        this.setState({clinicName: e});
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
                placeholder="clinic name"
                onChangeText={clinicName => this.setclinicName(clinicName)}
                defaultValue={this.state.clinicName}
                />
            </View>
            <View style={{height: 40, margin: 5,borderBottomColor: 'black', borderBottomWidth: 1, marginBottom: 10, width: '90%'}}>
            <TextInput
                style={{height: 40, background: 'aliceblue', margin: 5}}
                placeholder="ID"
                onChangeText={clinicID => this.setclinicID(clinicID)}
                defaultValue={this.state.clinicID}
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
                  onPress={() => this.signUpClinic()}
                >
                <Text>Sign Up</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.myBtns}
                  onPress={() => this.loginAsPatient()} 
                >
                <Text>Login as a Patient</Text>
                </TouchableOpacity>
                </View>
            </View>
            </KeyboardAwareScrollView>
          );
    }
}