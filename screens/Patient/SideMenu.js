import React, {Component} from 'react';
import * as Font from 'expo-font';
import {ScrollView, Text, View, TouchableOpacity} from 'react-native';

import { navigation } from 'react-navigation';

import firebase from 'firebase'

import {
  Button,
  TextInput,
  StyleSheet,
  Image
} from 'react-native'

let customFonts = {
    'Light': require('../assets/fonts/ColabLig.otf'),
  };
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
        fontFamily: 'Light',
       
        padding: 10
      },
  })


export default class SideMenu extends Component {
    state = {
        fontsLoaded: false,
    }
    constructor(props){
        super(props);      
        this.goToSetting = this.goToSetting.bind(this); 
        this.goToList = this.goToList.bind(this);
    }
    async _loadFontsAsync() {
      
        await Font.loadAsync(customFonts);
        this.setState({ fontsLoaded: true });
      }
    componentDidMount(){
        this._loadFontsAsync();
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

               this.props.navigation.navigation.navigate('PatientSettingScreen');
            }else{
               //take user to the log in screen
               this.props.navigation.navigation.navigate('LoginScreen');
            }
        })
      }

      
     goToList (){
        this.checkList();
 
    }

    checkList = () => {
       firebase.auth().onAuthStateChanged(user => {
           // take user to dashboard screen if already logged in
           if(user){
            this.props.navigation.navigation.navigate('ClinicListScreen');
           }else{
              //take user to the log in screen
              this.props.navigation.navigation.navigate('LoginScreen');
           }
       })
     }
    render(){
        if(this.state.fontsLoaded){
        return(
            <View style = {styles.container}>
                <View>
                <TouchableOpacity style={styles.myBtns} onPress= {this.goToSetting}>
                    <Text style = {{fontFamily: 'Light' , fontSize: 24}}>Settings</Text>
                </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.myBtns} onPress= {this.goToList}>
                    <Text style = {{fontFamily: 'Light', fontSize: 24}}>See Clinics</Text>
                </TouchableOpacity>
            </View>
        );
        }else{
            return(
            <View>

            </View>
            );
        }
    }

}