import React, { Component } from 'react'
import {
  View,
  Text,
  Button,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native'
import { AntDesign } from '@expo/vector-icons'; 
import firebase from 'firebase'
import {db} from '../../App'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'flex-start',
      marginTop: 25    
    },
    signIn: {
        borderColor: 'black',
        backgroundColor: '#AAE2D1',
        borderRadius: 10,
        padding: 10,
        margin: 10,
    },
    
      myBtns: {
        marginTop: 15,
  
        borderRadius: 10,
        
        backgroundColor: "grey",
       
        padding: 10
      },
  })

export default class PatientDetailsScreen extends Component {

    goToDashboard = () => {
        this.props.navigation.navigate('ClinicDashboardScreen');
    }

    // patient has visited so they can be removed from list
    patientVisited = () => {
        var patientId = this.props.navigation.state.params.patientId;
        var user = firebase.auth().currentUser;
        var updates = {};
        updates[`users/${patientId}/notifications`] = 'Hope your doctor visit went well! :)';
        db.ref().update(updates);

        //remove patient from the list
        db.ref(`clinics/${user.uid}/currentPatients/${patientId}`).remove();

        updates = {};
        var count = 0;
        //calculate number of people ahead
        var userInformationRef = firebase.database().ref('clinics/' + user.uid);
        userInformationRef.on('value', function(snapshot) {
            if(snapshot.val().count == null){
                count = 0;
            }else{
                count = snapshot.val().count;
            }
        });
        count = count - 1;
        updates['clinics/' + user.uid + '/count'] = count;
        db.ref().update(updates);
        this.props.navigation.navigate('ClinicDashboardScreen');
    }

    tellPatientToChange = () => {
        var patientId = this.props.navigation.state.params.patientId;
        var user = firebase.auth().currentUser;
        var updates = {};
        updates[`users/${patientId}/notifications`] = 'you have submitted some incorrect information to the clinic, please fix and resubmit';
        db.ref().update(updates);

        //remove patient from the list
        db.ref(`clinics/${user.uid}/requestingPatients/${patientId}`).remove();
        this.props.navigation.navigate('ClinicDashboardScreen');
    }

    // calculates the people ahead and adds them to the currentPatients list and removes them from the 
    // requesting patient list
    tellPatientWaitTime = async() => {
        var patientId = this.props.navigation.state.params.patientId;
        var user = firebase.auth().currentUser;
        var userInfo = this.props.navigation.state.params.userInfo
    
        var updates = {};
        var count = 0;

        
        //calculate number of people ahead
        var userInformationRef = firebase.database().ref('clinics/' + user.uid);
        userInformationRef.on('value', function(snapshot) {
            if(snapshot.val().count == null){
                count = 0;
            }else{
                count = snapshot.val().count;
            }
        });
        count = count + 1;
        updates['clinics/' + user.uid + '/count'] = count;
        db.ref().update(updates);

        updates = {};
        updates[`users/${patientId}/notifications`] = 'you have been added to the wait list, you are the ' +count + 'th person in line.' ;
        db.ref().update(updates);
        updates = {};
        //add patient to the currentPatients list
        updates['clinics/' + user.uid + '/currentPatients/' + patientId] =  userInfo;
        db.ref().update(updates);

        //remove patient from the list
        db.ref(`clinics/${user.uid}/requestingPatients/${patientId}`).remove();
        this.props.navigation.navigate('ClinicDashboardScreen');  
    }

    render(){
        var userInfo = this.props.navigation.state.params.userInfo;
        var myBtn = this.props.navigation.state.params.needBtn;
        return(
            <KeyboardAwareScrollView
            resetScrollToCoords={{ x: 0, y: 0 }}   
            scrollEnabled={true}
            >
            <View style= {styles.container}>
                <TouchableOpacity onPress = {() => this.goToDashboard()}>
                <AntDesign name="back" size={24} color="black" />
                </TouchableOpacity>

                <Text>Health Information</Text>
                
                <Text >First Name</Text>
                <View style={{height: 40, margin: 5,borderBottomColor: 'black', borderBottomWidth: 1, marginBottom: 10,}}>
                <Text
                    style={{height: 40, background: 'aliceblue', margin: 5}}>
                    {userInfo.firstName}

                </Text>
                    
                </View>
        
                
                <Text >Last Name</Text>
                <View style={{height: 40, margin: 5,borderBottomColor: 'black', borderBottomWidth: 1, marginBottom: 10,}}>
                <Text
                    style={{height: 40, background: 'aliceblue', margin: 5}}>
                    {userInfo.lastName}

                </Text>
                </View>
        
                
                <Text >Date of Birth</Text>
                <View style={{height: 40, margin: 5,borderBottomColor: 'black', borderBottomWidth: 1, marginBottom: 10,}}>
                <Text
                    style={{height: 40, background: 'aliceblue', margin: 5}}>
                    {userInfo.dateBirth}

                </Text>
                </View>
        
               
                <Text >Sex</Text>
                <View style={{height: 40, margin: 5,borderBottomColor: 'black', borderBottomWidth: 1, marginBottom: 10,}}>
                <Text
                    style={{height: 40, background: 'aliceblue', margin: 5}}>
                    {userInfo.sex}

                </Text>
                </View>
        
            
                <Text >Age</Text>
                <View style={{height: 40, margin: 5,borderBottomColor: 'black', borderBottomWidth: 1, marginBottom: 10,}}>
                <Text
                    style={{height: 40, background: 'aliceblue', margin: 5}}>
                    {userInfo.age}

                </Text>
                </View>
        
                
                <Text >Address</Text>
                <View style={{height: 40, margin: 5,borderBottomColor: 'black', borderBottomWidth: 1, marginBottom: 10,}}>
                <Text
                    style={{height: 40, background: 'aliceblue', margin: 5}}>
                    {userInfo.address}

                </Text>
                </View>
        
                
                <Text >Postal Code</Text>
                <View style={{height: 40, margin: 5,borderBottomColor: 'black', borderBottomWidth: 1, marginBottom: 10,}}>
                <Text
                    style={{height: 40, background: 'aliceblue', margin: 5}}>
                    {userInfo.postalCode}

                </Text>
                </View>
        
                <View style={{padding: 10}}>
                <Text >Health Card</Text>
                <Image
                    style={{ width: 200, height: 200 }}
                    source={{ uri: userInfo.healthCard}}
                />
                </View>


                <TouchableOpacity style = {styles.myBtns} onPress ={() => this.patientVisited()}>
                    <Text>
                        Remove from list
                    </Text>
                </TouchableOpacity>
                
                {myBtn &&
                <View>
                <TouchableOpacity style = {styles.myBtns} onPress = {() => this.tellPatientToChange()}>
                    <Text>
                    Info is not correct
                    </Text>
                </TouchableOpacity>
            
                <TouchableOpacity style = {styles.myBtns} onPress = {() => this.tellPatientWaitTime()}>
                    <Text>
                    Info Correct: add to list
                    </Text>
                </TouchableOpacity>
                </View>
                }
                
            </View>
            </KeyboardAwareScrollView>
        );
    }
}