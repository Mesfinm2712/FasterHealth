import React, { Component } from 'react'
import {
  View,
  ActivityIndicator
} from 'react-native'

import firebase from 'firebase'

class LoadingScreen extends Component {

 componentDidMount(){
     this.checkedIfLoggedIn();
 }
 checkedIfLoggedIn = () => {
     firebase.auth().onAuthStateChanged(user => {
         // take user to dashboard screen if already logged in
         if(user){
            var self = this;
            var userId = firebase.auth().currentUser.uid;
            var userInformationRef = firebase.database().ref('users/' + userId);
            userInformationRef.on('value', function(snapshot) {
                if(snapshot.val() === null){
                  self.props.navigation.navigate('ClinicDashboardScreen');
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
 render() {

    return(  
      <View>
          <ActivityIndicator size= "large"/>
      </View>
    );
}

}

export default LoadingScreen;
