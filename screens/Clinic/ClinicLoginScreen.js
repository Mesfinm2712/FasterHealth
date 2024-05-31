import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Text,
  Button,
  TextInput,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  ImageBackground,
} from 'react-native'
import firebase from 'firebase'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import * as Google from 'expo-google-app-auth';
import {db} from '../../App'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
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
      left: '20%',
      borderRadius: 10,
      alignItems: "center",
      backgroundColor: '#AAE2D1',
      padding: 10
    },
  })

export default class PatientLoginScreen extends Component {
    state = {
        clinicID: '',
        password: '',
        loading: true
    }
    constructor(props){
        super(props);
        this.loginClinic = this.loginClinic.bind(this); 
        this.signUpClinic = this.signUpClinic.bind(this);
    }

    // this function checks if the user has been logged in previously
    checkedIfLoggedIn = () => {
        firebase.auth().onAuthStateChanged(user => {
            // take user to dashboard screen if already logged in
            if(user){
              var self = this;
              var userId = firebase.auth().currentUser.uid;
              var userInformationRef = firebase.database().ref('clinics/' + userId);
              userInformationRef.on('value', function(snapshot) {
                  if(snapshot.val() === null){
                    self.props.navigation.navigate('PatientLoginScreen');
                    alert('you are not a clinic, log in as a patient');
                  }else{
                    self.props.navigation.navigate('ClinicDashboardScreen');
                  }
              });
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
                loading: false
            }
        );
    }
    signUpClinic = () => {
        this.props.navigation.navigate('SignUpClinicScreen');
    }
    loginAsPatient = () => {
        this.props.navigation.navigate('PatientLoginScreen');
    }

    // log in the clinic
    loginClinic = () => {
        firebase.auth().signInWithEmailAndPassword(this.state.clinicID, this.state.password).then(() =>{
          this.checkedIfLoggedIn();
        }).catch(function(error) {
          alert('incorrect credentials');
        });
    }

    // set the clinicID value
    setclinicID = (e) =>{
        this.setState({clinicID: e});
     }
     // set the password value
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

            <ImageBackground source={require('./images/doctorsOffice.jpg')}  style={{ width: '100%', height: 200}}>  
            <View style={styles.container}>
            <Text style={{color: 'black', fontSize: 50}}>FasterHealth</Text>
            </View>
            </ImageBackground>

            <View style={{padding: 10, width: '90%'}}>
          
            <View style={{height: 40, margin: 5,borderBottomColor: 'black', borderBottomWidth: 1, marginBottom: 10,}}>
            <TextInput
                placeholder=" Clinic ID"
                onChangeText={clinicID => this.setclinicID(clinicID)}
                defaultValue={this.state.clinicID}
                />
            </View>
            </View>
            <View style={{padding: 10, width: '90%'}}>
            <View style={{height: 40, margin: 5,borderBottomColor: 'black', borderBottomWidth: 1, marginBottom: 10,}}>
            <TextInput
                placeholder=" Password"
                onChangeText={password => this.setPassword(password)}
                defaultValue={this.state.password}
                />
            </View>
            </View>
      
              <View>
              <TouchableOpacity
                  style={styles.myBtns}
                  onPress={() => this.loginClinic()}
                >
                <Text>Login</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.myBtns}
                  onPress= {() => this.signUpClinic()}
                >
                <Text>Sign up as a Clinic</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.myBtns}
                  onPress= {() => this.loginAsPatient()}
                >
                <Text>I am a Patient</Text>
                </TouchableOpacity>
                </View>
              <Image source={require('./images/doctorIcon.png')} style={{ width: 150, height: 200, right: '30%' }} />
            </View>
            </KeyboardAwareScrollView>
          );
    }
}