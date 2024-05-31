import React, { Component, useState, useEffect } from 'react'
import {
  View,
  Text,
  Button,
  Platform,
  ActivityIndicator,
  StyleSheet,
} from 'react-native'

import firebase from 'firebase'
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import { TouchableOpacity } from 'react-native-gesture-handler';
import SideMenu from './SideMenu';
import Drawer from 'react-native-drawer'
import { FontAwesome } from '@expo/vector-icons'; 
import { AntDesign } from '@expo/vector-icons'; 
import { db } from '../../App';
import * as Font from 'expo-font';
import { MaterialIcons } from '@expo/vector-icons';

const styles = StyleSheet.create({
  container: {
    padding: 10,
    marginTop: 15,
    alignItems: 'center',
    backgroundColor:'#AAE2D1',
    fontFamily: 'Light'
  },
  hourglass: {
    padding: 10,
    marginTop: 15,
    alignItems: 'center',

  },
 
    myBtns: {
      margin: 5,
      borderRadius: 10,
      backgroundColor: "grey",
      padding: 10
    },

    drawerStyles: {

    },
})
let customFonts = {
  'Light': require('../assets/fonts/ColabLig.otf'),
};
export default class PatientDashboardScreen extends Component {
    state = {
        firstName: '',
        lastName: '',
        loading: true,
        notifications: null,
        drawerOpen: false,
        fontsLoaded: false
    }
    
    constructor(props){
        super(props);      
        this.goToSetting = this.goToSetting.bind(this); 
        this.goToList = this.goToList.bind(this);
        this.closeNotif = this.closeNotif.bind(this);
        this.closeDrawer = this.closeDrawer.bind(this);
        this.toggleDrawer = this.toggleDrawer.bind(this);
        this.onHamburgerClick = this.onHamburgerClick.bind(this);
    }
    
    // takes the user to the setting screen
    goToSetting () {
        this.checkedIfLoggedIn();
     };

     goToList (){
         this.checkList();
  
     }
    
     closeNotif (){
         this.setState({notifications: null});
     }
     checkList = () => {
        firebase.auth().onAuthStateChanged(user => {
            // take user to dashboard screen if already logged in
            if(user){
               this.props.navigation.navigate('ClinicListScreen');
            }else{
               //take user to the log in screen
               this.props.navigation.navigate('LoginScreen');
            }
        })
      }
    // check if user is logged in
    checkedIfLoggedIn = () => {
      firebase.auth().onAuthStateChanged(user => {
          // take user to dashboard screen if already logged in
          if(user){
             this.props.navigation.navigate('PatientSettingScreen');
          }else{
             //take user to the log in screen
             this.props.navigation.navigate('LoginScreen');
          }
      })
    }
    async _loadFontsAsync() {
      
      await Font.loadAsync(customFonts);
      this.setState({ fontsLoaded: true });
    }
    componentDidMount(){

        this.setState({loading: true, drawerOpen: false, fontsLoaded: false});
        
        this._loadFontsAsync();
        var self = this;
        var userId = firebase.auth().currentUser.uid;
        // we want to retrieve the info about the specific patient we have
        var userInformationRef = firebase.database().ref('users/' + userId);
        userInformationRef.on('value', function(snapshot) {
            var notif = (snapshot.val() && snapshot.val().notifications) || null;
            
            self.setState({firstName: snapshot.val().firstName, 
                lastName: snapshot.val().lastName,notifications: notif, drawerOpen: false});
        });

        var errorMsg = null;
        var location = null;

          if (Platform.OS === 'android' && !Constants.isDevice) {
            errorMsg = 
              'Oops, this will not work on Sketch in an Android emulator. Try it on your device!';
          } else {
            (async () => {
              let { status } = await Location.requestPermissionsAsync();
              if (status !== 'granted') {
                errorMsg = 'Permission to access location was denied';
              }
      
              location = await Location.getCurrentPositionAsync({});
              let text = 'Waiting..';
              if (errorMsg) {
                text = errorMsg;
                alert(errorMsg);
              } else {
                text = location;
                //add location to the patient   
                        // Get a key for a new Post.
                        var user = firebase.auth().currentUser;
                        //var newPostKey = db.ref().child(`users/${user.uid}`).push().key;
                        var updates = {};
                        updates[`users/${user.uid}/location`] = text;
                        db.ref().update(updates);
              }
        
            })();
          }
      

        this.setState({loading: false});
    }

    onHamburgerClick(){

      setTimeout(()=>{
        this.toggleDrawer();
    }, 500);
      
    }

    closeDrawer(){
      this.setState({drawerOpen: false});
    }

    toggleDrawer (){
      this.setState({drawerOpen: ! this.state.drawerOpen});
    }

    render(){


        if((!this.state.loading || this.state.loading !== null) && this.state.fontsLoaded){
            return(            
                    
                    <Drawer
                      open = {this.state.drawerOpen}
                      tapToClose = {true}
                      type = "displace"
                      openDrawerOffset = {0.5}
                      closedDrawerOffset = {0}
                      content = {<SideMenu navigation = 
                        {this.props}/>}
                      
                      
                      onClose = {this.closeDrawer}
                      
                     >
                       
                        <TouchableOpacity  style = {{padding: 10, marginTop: 15}} onPress = {this.onHamburgerClick} >   
                        <FontAwesome name="bars" size={24} color="black" />
                        </TouchableOpacity>
                    <View style={styles.container}>
                    <Text style={{ fontFamily: 'Light', fontSize: 40 }}>
                      Dashboard
                    </Text> 
                    
                    <TouchableOpacity onPress= {this.closeNotif}>
                    <AntDesign name="user" size={48} color="black" />
                    </TouchableOpacity>     
                
                    <Text style={{ fontFamily: 'Light', fontSize: 24 }}>{this.state.firstName} </Text>
                    <View style={{flexDirection:"row"}}>
                    <View style = {{flex: 0.5}}> 
                    <Text style={{ fontFamily: 'Light'}}>0</Text>
                    <Text style={{ fontFamily: 'Light'}}>Previous Visits</Text>
                    </View>
                    
                    <View style = {{flex: 0}}> 
                    <Text style={{ fontFamily: 'Light'}} >0</Text>
                    <Text style={{ fontFamily: 'Light'}}>Upcoming Visits</Text>
                    </View>
                    </View>
                    </View>
                    <View style = {styles.hourglass}>
                    <Text style={{ fontFamily: 'Light', fontSize: 40 }}>
                      Current Updates
                    </Text> 
                    {(this.state.notifications !== null  && 
                    <View style={{flexDirection:"row", padding: 10}}>
                    
                    <Text style={{ fontFamily: 'Light', fontSize: 24}}>{this.state.notifications}</Text>
                    <TouchableOpacity onPress= {this.closeNotif}>
                    <AntDesign name="closecircleo" size={24} color="black" />
                    </TouchableOpacity>
                    </View>
                    ) ||
                    <View style ={{alignItems: 'center',}}>
                    <Text style={{ fontFamily: 'Light', fontSize: 24}}>All Updates Viewed</Text>
                    <MaterialIcons name="done" size={100} color="black" />
                    </View>
                    }
                    
                    
                    </View>  

                    
                  </Drawer>


                
            );

        }
        return(
            <View>
            <ActivityIndicator size= "large"/>
            
          </View>
        );

    }
}



