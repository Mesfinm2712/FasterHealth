import React, { Component } from 'react'
import {
  View,
  Text,
  Button,
  TextInput,
  StyleSheet,
  TouchableOpacity
} from 'react-native'
import { AntDesign } from '@expo/vector-icons'; 
import firebase from 'firebase'
import { db } from '../../App';

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
class ClinicSettingScreen extends Component {
  
  state = {
    passwordChange: false,
    healthInfoChange: false,
    password: '',
    healthInfoPage: false,
    clinicName: '',
    address: '',
    postalCode: '',
  }
  constructor(props){
    super(props);

    this.changePasswordVal = this.changePasswordVal.bind(this);
    this.signOut = this.signOut.bind(this);
    this.deleteAccount = this.deleteAccount.bind(this);
    this.changeHealthInfo = this.changeHealthInfo.bind(this);
    this.saveUpdate = this.saveUpdate.bind(this);
    this.goBack = this.goBack.bind(this);
}
  componentDidMount(){
    var userId = firebase.auth().currentUser.uid;

    // check if you are dealing with a clinic or a Patient
    var self = this;
    firebase.database().ref('/clinics/' + userId).on("value", function(snapshot) {

    self.setState({
      clinicName: (snapshot.val() && snapshot.val().clinicName) || '',
      address: (snapshot.val() && snapshot.val().address) || '',
      postalCode: (snapshot.val() && snapshot.val().postalCode) || '',
    });
  // ...
});
    
  }

  changePasswordVal = async() =>{
    var user = firebase.auth().currentUser;
    var auth = firebase.auth();
    var emailAddress = user.email;

    await auth.sendPasswordResetEmail(emailAddress).then(function() {
        alert('Email was sent. Check your inbox');
      // Email sent.
    }).catch(function(error) {
      // An error happened.
    });
    this.setState({passwordChange: true});
  }
  setPassword = (p) =>{
    this.setState({password: p});
 }
  changeHealthInfo = () =>{
    this.setState({healthInfoPage: true});
  }

  signOut(){
    firebase.auth().signOut().then(function() {
      // Sign-out successful.
    }).catch(function(error) {
      // An error happened.
    });
  }

  // save new account info
  saveUpdate(){

    var self = this;

    var postData = {
      clinicName: self.state.clinicName,
      address: self.state.address,
      postalCode: self.state.postalCode,
    };
    // Get a key for a new Post.
    var user = firebase.auth().currentUser;
    var updates = {};

    updates[`clinics/${user.uid}/clinicName`] = self.state.clinicName;
    db.ref().update(updates);
    updates[`clinics/${user.uid}/address`] = self.state.address;
    db.ref().update(updates);
    updates[`clinics/${user.uid}/postalCode`] = self.state.postalCode;
    db.ref().update(updates);
    self.props.navigation.navigate('ClinicDashboardScreen');
  }

  deleteAccount(){
    var user = firebase.auth().currentUser;
    //remove user details from database
    db.ref(`clinics/${user.uid}`).remove();
    user.delete().then(function() {
      // User deleted.
      alert('clinic account has been deleted');
    }).catch(function(error) {
      alert('please sign out and sign in again to delete account');
      // An error happened.
    });
  }

  goBack = () => {
    this.props.navigation.navigate('ClinicDashboardScreen');
  }

 render() {
    if(this.state.healthInfoPage){
      return(
        <View style =  {styles.container}>
        <TouchableOpacity onPress = {this.goBack}>
        <AntDesign name="back" size={24} color="black" />
        </TouchableOpacity>
        
        <Text >Clinic Name</Text>
        <View style={{height: 40, margin: 5,borderBottomColor: 'black', borderBottomWidth: 1, marginBottom: 10,}}>
        <TextInput
            style={{height: 40, background: 'aliceblue', margin: 5}}
            placeholder={this.state.clinicName}
            onChangeText={clinicName => this.setState({clinicName: clinicName})}
            defaultValue={this.state.clinicName}
            />
        </View>

        
        <Text >Address</Text>
        <View style={{height: 40, margin: 5,borderBottomColor: 'black', borderBottomWidth: 1, marginBottom: 10,}}>
        <TextInput
            style={{height: 40, background: 'aliceblue', margin: 5}}
            placeholder={this.state.address}
            onChangeText={address => this.setState({address: address})}
            defaultValue={this.state.address}
            />
        </View>

        <Text >Postal Code</Text>
        <View style={{height: 40, margin: 5,borderBottomColor: 'black', borderBottomWidth: 1, marginBottom: 10,}}>
        <TextInput
            style={{height: 40, background: 'aliceblue', margin: 5}}
            placeholder={this.state.postalCode}
            onChangeText={postalCode => this.setState({postalCode: postalCode})}
            defaultValue={this.state.postalCode}
            />
        </View>

        <TouchableOpacity style= {styles.myBtns} onPress= {this.saveUpdate}>
          <Text>
            Save Info
          </Text>
        </TouchableOpacity>

        </View>
      );
    }
    //user needs to recently log in 
    if(this.state.passwordChange){
      return(
        <View>
        <Text >Email Sent to reset password</Text>
      </View>
      );
    }
    return(  
      <View style = {styles.container}>
        <TouchableOpacity onPress = {this.goBack}>
        <AntDesign name="back" size={24} color="black" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.myBtns} onPress= {this.changeHealthInfo}>
          <Text>
          Change Clinic Info
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style= {styles.myBtns} onPress= {this.changePasswordVal}>
          <Text>
          Change Password
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style = {styles.myBtns} onPress= {this.deleteAccount}>
          <Text>
          Delete Account
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style= {styles.myBtns} onPress= {this.signOut}>
          <Text>
          Sign Out
          </Text>
        </TouchableOpacity>
      
      </View>
    );
}

}

export default ClinicSettingScreen;
