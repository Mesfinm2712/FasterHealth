import React, { Component } from 'react'
import {
  View,
  Text,
  Button,
  StyleSheet,
  Image,
  TouchableOpacity
} from 'react-native'

import firebase from 'firebase'
import { db } from '../../App';
import { AntDesign } from '@expo/vector-icons'; 
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import * as Font from 'expo-font';

let customFonts = {
    'Light': require('../assets/fonts/ColabLig.otf'),
  };

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      padding: 10,
      margin: 10
    },
    myBtns: {
        marginTop: 15,
    
        borderRadius: 10,
        
        backgroundColor:'#AAE2D1',
       
        padding: 10
      },
  })

export default class PatientReviewInfoScreen extends Component {
    state = {
        firstName: '',
        lastName: '',
        dateBirth: '',
        sex: '',
        age: '',
        address: '',
        postalCode: '',
        healthCard: '',
        userPortfolio: null,
        clinicID: null,
        fontsLoaded: false,
    }
    constructor(props){
        super(props);    
        this.sendToClinic = this.sendToClinic.bind(this);  
        this.goBack = this.goBack.bind(this); 
    }
    goToSettings = () =>{
        this.props.navigation.navigate('PatientSettingScreen');
    }
    goBack = () => {
        this.props.navigation.navigate('PatientDashboardScreen');
    }
    async _loadFontsAsync() {
      
        await Font.loadAsync(customFonts);
        this.setState({ fontsLoaded: true });
      }
    sendToClinic(){
        var self = this;
        var numberInLine = 0;
        var user = firebase.auth().currentUser.uid;
        var clinic = this.props.navigation.state.params.userId;
        //fix how we decide to store requesting patients
        firebase.database().ref('/clinics/' + this.props.navigation.state.params.userId).on('value', function(snapshot) {
           
            var updates = {};
            updates[`clinics/${clinic}/requestingPatients/${user}`] = self.state.userPortfolio;
            db.ref().update(updates);

        });
        alert('Request Sent, there are will give you an estimation for time soon!');
        this.props.navigation.navigate('PatientDashboardScreen');
    }

    componentDidMount(){
        this._loadFontsAsync();
        var self = this;
        var userId= firebase.auth().currentUser.uid;
        var userLoc = null;
        const image = firebase.storage().ref().child(userId);
        this.setState({clinicID: this.props.navigation.state.params.userId});
        image.getDownloadURL().then((url) => { this.setState({ healthCard: url })});

        firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
            userLoc = (snapshot.val() && snapshot.val().location);
            self.setState({firstName: (snapshot.val() && snapshot.val().firstName) || '',
            lastName: (snapshot.val() && snapshot.val().lastName) || '',
            dateBirth: (snapshot.val() && snapshot.val().dateBirth) || '',
            sex: (snapshot.val() && snapshot.val().sex) || '',
            age: (snapshot.val() && snapshot.val().age) || '',
            address: (snapshot.val() && snapshot.val().address) || '',
            postalCode: (snapshot.val() && snapshot.val().postalCode) || '',
            userPortfolio: snapshot.val()});
        });
    }

    render(){
        if(this.state.fontsLoaded){
        return(
                <KeyboardAwareScrollView
            resetScrollToCoords={{ x: 0, y: 0 }}   
            scrollEnabled={true}
            >

        <View style = {styles.container}>
         <TouchableOpacity onPress = {this.goBack}>
        <AntDesign name="back" size={24} color="black" />
        </TouchableOpacity>
        <Text style = {{fontFamily: 'Light' , fontSize: 24}}>Your Health Information</Text>
        <Text style = {{fontFamily: 'Light' , fontSize: 20}}>First Name</Text>
        <View style={{height: 40, margin: 5,borderBottomColor: 'black', borderBottomWidth: 1, marginBottom: 10,}}>
        <Text>{this.state.firstName}</Text>
            
        </View>

        
        <Text style = {{fontFamily: 'Light' , fontSize: 20}}>Last Name</Text>
        <View style={{height: 40, margin: 5,borderBottomColor: 'black', borderBottomWidth: 1, marginBottom: 10,}}>

            <Text>{this.state.lastName}</Text>
        </View>

        
        <Text style = {{fontFamily: 'Light' , fontSize: 20}}>Date of Birth</Text>
        <View style={{height: 40, margin: 5,borderBottomColor: 'black', borderBottomWidth: 1, marginBottom: 10,}}>

            <Text>{this.state.dateBirth}</Text>
        </View>

        
        <Text style = {{fontFamily: 'Light' , fontSize: 20}}>Sex</Text>
        <View style={{height: 40, margin: 5,borderBottomColor: 'black', borderBottomWidth: 1, marginBottom: 10,}}>

            <Text>{this.state.sex}</Text>
        </View>

        
        <Text style = {{fontFamily: 'Light' , fontSize: 20}}>Age</Text>
        <View style={{height: 40, margin: 5,borderBottomColor: 'black', borderBottomWidth: 1, marginBottom: 10,}}>

            <Text>{this.state.age}</Text>
        </View>

        
        <Text style = {{fontFamily: 'Light' , fontSize: 20}}>Address</Text>
        <View style={{height: 40, margin: 5,borderBottomColor: 'black', borderBottomWidth: 1, marginBottom: 10,}}>

            <Text>{this.state.address}</Text>
        </View>

        
        <Text style = {{fontFamily: 'Light' , fontSize: 20}}>Postal Code</Text>
        <View style={{height: 40, margin: 5,borderBottomColor: 'black', borderBottomWidth: 1, marginBottom: 10,}}>

            <Text>{this.state.postalCode}</Text>
        </View>

        <View >
        <Text style = {{fontFamily: 'Light' , fontSize: 20}}>Health Card</Text>
        <View>

        <Text>
        {this.state.healthCard && <Image source={{ uri: this.state.healthCard }} style={{ width: 300, height: 300 }} />}
        </Text>
        </View>
        </View>

        <TouchableOpacity style = {styles.myBtns} onPress={() => this.sendToClinic()} >
            <Text style = {{fontFamily: 'Light' }}>
            Info Correct: Submit
            </Text>
        </TouchableOpacity>
        <TouchableOpacity style = {styles.myBtns} onPress={() => this.goToSettings()}>
            <Text style = {{fontFamily: 'Light'}}>
            Change Info
            </Text>
        </TouchableOpacity>


        </View>
        </KeyboardAwareScrollView>

        );
        }else{
            return(
                <View>

                </View>
            );
        }
    }
}