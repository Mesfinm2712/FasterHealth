import React, { Component } from 'react'
import {
  View,
  Text,
  Button,
  ActivityIndicator,
  Platform,
  StyleSheet

} from 'react-native'

import firebase from 'firebase'
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import { db } from '../../App';
import { TouchableOpacity } from 'react-native-gesture-handler';
import SideMenuClinic from './SideMenuClinic';
import Drawer from 'react-native-drawer'
import { FontAwesome } from '@expo/vector-icons'; 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    marginTop: 25    
  },
  myBtns: {
      marginTop: 15,
  
      borderRadius: 10,
      
      backgroundColor: "grey",
     
      padding: 10
    },
})

export default class ClinicDashboardScreen extends Component {
    state = {
        clinicName: '',

        loading: true,
        listOfPatients: [],
        listOfCurrPatients: []
    }
    constructor(props){
        super(props); 
        this.closeDrawer = this.closeDrawer.bind(this);
        this.toggleDrawer = this.toggleDrawer.bind(this);
        this.onHamburgerClick = this.onHamburgerClick.bind(this);       
    }
    onHamburgerClick(){
      this.toggleDrawer();
    }

    closeDrawer(){
      this.setState({drawerOpen: false});
    }

    toggleDrawer (){
      this.setState({drawerOpen: ! this.state.drawerOpen});
    }

    componentDidMount(){
        this.setState({loading: true});
        var self = this;
        var userId = firebase.auth().currentUser.uid;
        // we want to retrieve the info about the specific patient we have
        var userInformationRef = firebase.database().ref('clinics/' + userId);
        userInformationRef.on('value', function(snapshot) {
            self.setState({clinicName: snapshot.val().clinicName});
        });

        firebase.database().ref('/clinics/' + userId + '/requestingPatients').on('value', function(snapshot) {
            var arr = [];
            snapshot.forEach(function(item) {
                var itemVal = item.val();
                var patientId = item.key;
                var info = {
                    patientId: patientId,
                    itemVal: itemVal
                }
                arr.push(info);
            });
            self.setState({listOfPatients: arr});
        });

        firebase.database().ref('/clinics/' + userId + '/currentPatients').on('value', function(snapshot) {
            var arr = [];
            snapshot.forEach(function(item) {
                var itemVal = item.val();
                var patientId = item.key;
                var info = {
                    patientId: patientId,
                    itemVal: itemVal
                }
                arr.push(info);
            });
            self.setState({listOfCurrPatients: arr});
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
                        updates[`clinics/${user.uid}/location`] = text;
                        db.ref().update(updates);
                        
                         
              }
              
            })();
          }
        
      


        this.setState({loading: false});
    }

    viewPatient = (userInfo, myBtn) => {
        this.props.navigation.navigate('PatientDetailsScreen', {
                userInfo: userInfo.itemVal,
                patientId: userInfo.patientId,
                needBtn: myBtn
          });
    }

    render(){
        if(!this.state.loading || this.state.loading !== null){
            return(
              <Drawer
                      open = {this.state.drawerOpen}
                      tapToClose = {true}
                      type = "displace"
                      openDrawerOffset = {0.5}
                      closedDrawerOffset = {0}
                      content = {<SideMenuClinic navigation = 
                        {this.props}/>}
                      
                      
                      onClose = {this.closeDrawer}
                      
                     >
                       <View style= {styles.container}>
                        <TouchableOpacity  onPress = {this.onHamburgerClick} >   
                        <FontAwesome name="bars" size={24} color="black" />
                        </TouchableOpacity>
                        
                    <Text>Hello {this.state.clinicName}!</Text>

                    
                    <View>
                    <Text>The list of requesting patients</Text>
                    {
                    this.state.listOfPatients.map((data) => {
                    return (
                        <View><Text>{data.itemVal.firstName}</Text>
                        <TouchableOpacity style = {styles.myBtns} onPress = {() => this.viewPatient(data, true)}>
                          <Text>Go to patient Info</Text>
                        </TouchableOpacity>
                        
                        </View>
                    )
                    })}
                    </View>

                    <View>
                    <Text>The list of current patients</Text>
                    {
                    this.state.listOfCurrPatients.map((data) => {
                    return (
                        <View><Text>{data.itemVal.firstName}</Text>
                        <TouchableOpacity style = {styles.myBtns} onPress = {() => this.viewPatient(data, false)}>
                          <Text>Go to patient Info</Text>
                        </TouchableOpacity>
                        </View>
                    )
                    })}
                    </View>

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