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
  ImageBackground
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

        borderRadius: 10,
        alignItems: "center",
        backgroundColor: '#AAE2D1',
        left: '20%',
        padding: 10
      },
  })

export default class PatientLoginScreen extends Component {
    state = {
        email: '',
        password: '',
        loading: true
    }
    constructor(props){
        super(props);
        this.loginPatient = this.loginPatient.bind(this); 
    }

    // this function checks if the user has been logged in previously
    checkedIfLoggedIn = () => {
        firebase.auth().onAuthStateChanged(user => {
            // take user to dashboard screen if already logged in
            if(user){
              var self = this;
              var userId = firebase.auth().currentUser.uid;
              var userInformationRef = firebase.database().ref('users/' + userId);
              userInformationRef.on('value', function(snapshot) {
                  if(snapshot.val() === null){
                    self.props.navigation.navigate('ClinicLoginScreen');
                    alert('you are not a patient, log in as a clinic');
                  }else{
                    self.props.navigation.navigate('PatientDashboardScreen');
                  }
              });

            }else{
               //take user to the log in screen
               this.props.navigation.navigate('PatientLoginScreen');
            }
        })
    }
    componentDidMount(){
        this.setState(
            {
                email: '',
                password: '',
                loading: false
            }
        );
    }
    loginAsClinic = () => {
        this.props.navigation.navigate('ClinicLoginScreen');
    }

    signUpPatient = () => {
      this.props.navigation.navigate('SignUpPatientScreen');
    }
    // log in the patient 
    loginPatient = () => {
        firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password).then(() =>{
          this.checkedIfLoggedIn();
        }).catch(function(error) {
          alert('incorrect credentials');
        });
    }

    // set the email value
    setEmail = (e) =>{
        this.setState({email: e});
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
                placeholder=" Email"
                onChangeText={email => this.setEmail(email)}
                defaultValue={this.state.email}
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
                  onPress={() => this.loginPatient()}
                >
                <Text>Login</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.myBtns}
                  onPress= {() => this.signUpPatient()}
                >
                <Text>Sign up as a Patient!</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.myBtns}
                  onPress= {() => this.loginAsClinic()}
                >
                <Text>I am a Clinic</Text>
                </TouchableOpacity>
                </View>
             

              <Image source={require('./images/doctorIcon.png')} style={{ width: 150, height: 200, right: '30%' }} />
             
              
              </View>
              </KeyboardAwareScrollView>
          );
    }
}