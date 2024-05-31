import React, {Component} from 'react';

import {ScrollView, Text, View, TouchableOpacity} from 'react-native';

import firebase from 'firebase'

import {
  Button,
  TextInput,
  StyleSheet,
  Image
} from 'react-native'


const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'flex-start',
      padding: 10,      
      backgroundColor: '#AAE2D1'
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


export default class SideMenuClinic extends Component {
    constructor(props){
        super(props);      
        this.goToSetting = this.goToSetting.bind(this); 
        this.checkedIfLoggedIn = this.checkedIfLoggedIn.bind(this);
    }

    componentDidMount(){

    }
    
    // takes the user to the setting screen
    goToSetting () {
            this.checkedIfLoggedIn();
    };

    // check if user is logged in
    checkedIfLoggedIn = () => {
        firebase.auth().onAuthStateChanged(user => {
            // take user to dashboard screen if already logged in
            if(user){
              
               this.props.navigation.navigation.navigate('ClinicSettingScreen');
            }else{
               //take user to the log in screen
               this.props.navigation.navigation.navigate('LoginScreen');
            }
        })
      }

      

    render(){
        return(
            <View style = {styles.container}>
                <View>
                <TouchableOpacity style={styles.myBtns} onPress= {this.goToSetting}>
                    <Text>Settings</Text>
                </TouchableOpacity>
                </View>
            </View>
        );
    }

}