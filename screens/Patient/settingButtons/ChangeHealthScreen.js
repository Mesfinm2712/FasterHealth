import React, { Component } from 'react'
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity
} from 'react-native'
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import firebase from 'firebase'
import { db } from '../../../App';
import * as ImagePicker from 'expo-image-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { AntDesign } from '@expo/vector-icons'; 
import * as Font from 'expo-font';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation, NavigationContainer } from '@react-navigation/native';
import PatientDashboardScreen from '../PatientDashboardScreen'

let customFonts = {
  'Light': require('../../assets/fonts/ColabLig.otf'),
};

const styles = StyleSheet.create({

  containerSettings:{
    flex: 1,
    justifyContent: 'flex-start',
    marginTop: 10,
    padding: 10
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    
    padding: 10,
    marginTop: 15,
  },
  myBtns: {
    marginTop: 15,

    borderRadius: 10,
    
    backgroundColor: '#AAE2D1',
   
    padding: 10,

    flex: 1,

    marginRight: 3
  },
})
class ChangeHealthScreen extends Component {
  
  state = {
    passwordChange: false,
    healthInfoChange: false,
    password: '',
    firstName: '',
    lastName: '',
    dateBirth: '',
    sex: '',
    age: '',
    address: '',
    postalCode: '',
    healthCard: '',
    clinic: false,
    healthInfoPage: false,
    fontsLoaded: false,
  }
  constructor(props){
    super(props);

    this.changePasswordVal = this.changePasswordVal.bind(this);
    this.signOut = this.signOut.bind(this);
    this.deleteAccount = this.deleteAccount.bind(this);
    this.changeHealthInfo = this.changeHealthInfo.bind(this);
    this.goBack = this.goBack.bind(this);
    this.saveUpdate = this.saveUpdate.bind(this);
}
async _loadFontsAsync() {
      
  await Font.loadAsync(customFonts);
  this.setState({ fontsLoaded: true });
}
  componentDidMount(){
    var userId = firebase.auth().currentUser.uid;
    this._loadFontsAsync();
    
    // check if you are dealing with a clinic or a Patient
    var self = this;
    firebase.database().ref('/users/' + userId).on("value", function(snapshot) {

    self.setState({
      firstName: (snapshot.val() && snapshot.val().firstName) || '',
      lastName: (snapshot.val() && snapshot.val().lastName) || '',
      dateBirth: (snapshot.val() && snapshot.val().dateBirth) || '',
      sex: (snapshot.val() && snapshot.val().sex) || '',
      age: (snapshot.val() && snapshot.val().age) || '',
      address: (snapshot.val() && snapshot.val().address) || '',
      postalCode: (snapshot.val() && snapshot.val().postalCode) || '',
      healthCard: (snapshot.val() && snapshot.val().healthCard) || null,
      clinic: false
    });
  // ...
});

  this.getPermissionAsync();
  var userId = firebase.auth().currentUser.uid;

  var self = this;
  firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {

  self.setState({
    healthCard: (snapshot.val() && snapshot.val().healthCard) || ''
  });
  });
  
    
  }
  
  uploadImage = async (uri) => {
    var userId = firebase.auth().currentUser.uid;
    const response = await fetch(uri);
    const blob = await response.blob();
    var ref = firebase.storage().ref().child(userId);
    ref.put(blob);
  }

  _pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.cancelled) {
        this.setState({ healthCard: result.uri });
        this.uploadImage(result.uri).then(() =>{
          alert("Success!");
        }).catch((error) => {
          alert(error);
          
        });

      }

    } catch (E) {

    }
  };

  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    }
  };

  changePasswordVal = async() =>{
    var user = firebase.auth().currentUser;
    var auth = firebase.auth();
    var emailAddress = user.email;

    await auth.sendPasswordResetEmail(emailAddress).then(function() {
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

  goBack = async() => {
    // this.props.navigation.navigate('PatientDashboardScreen');
    // navigation.navigate('PatientDashboardScreen');
  }

  signOut(){
    firebase.auth().signOut().then(function() {
      // Sign-out successful.
    }).catch(function(error) {
      // An error happened.
    });
  }

  // save new account info
  saveUpdate = async () => {
        // Get a key for a new Post
    var userId = firebase.auth().currentUser.uid;

    var self = this;
    var message = self.state.healthCard;
    


    firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
    

    var postData = {
      firstName: self.state.firstName,
      lastName: self.state.lastName,
      dateBirth: self.state.dateBirth,
      sex: self.state.sex,
      age: self.state.age,
      address: self.state.address,
      postalCode: self.state.postalCode,
      healthCard: self.state.healthCard,
      clinic: self.state.clinic
    };
    // Get a key for a new Post.
    var user = firebase.auth().currentUser;
    var updates = {};
    updates[`users/${user.uid}`] = postData;
    db.ref().update(updates);
    

    self.props.navigation.goBack('PatientDashboardScreen'); 



  });

  }
  deleteAccount(){
    var user = firebase.auth().currentUser;
    //remove user details from database
    db.ref(`users/${user.uid}`).remove();
    user.delete().then(function() {
      // User deleted.
      alert('user account has been deleted');
    }).catch(function(error) {
      alert('please sign out and sign in again to delete account');
      // An error happened.
    });
  }


 render() {

      return(
        <KeyboardAwareScrollView
            resetScrollToCoords={{ x: 0, y: 0 }}   
            scrollEnabled={true}
            >

        <View style = {styles.container}>

        <Text style = {{fontFamily: 'Light' , fontSize: 24}}>Your Health Information</Text>
        <Text style = {{fontFamily: 'Light' , fontSize: 20}}>First Name</Text>
        <View style={{height: 40, margin: 5,borderBottomColor: 'black', borderBottomWidth: 1, marginBottom: 10,}}>
        <TextInput
            style={{height: 40, background: 'aliceblue', margin: 5}}
            placeholder={this.state.firstName}
            onChangeText={firstName => this.setState({firstName: firstName})}
            defaultValue={this.state.firstName}
            />
        </View>

        
        <Text style = {{fontFamily: 'Light' , fontSize: 20}}>Last Name</Text>
        <View style={{height: 40, margin: 5,borderBottomColor: 'black', borderBottomWidth: 1, marginBottom: 10,}}>
        <TextInput
            style={{height: 40, background: 'aliceblue', margin: 5}}
            placeholder={this.state.lastName}
            onChangeText={lastName => this.setState({lastName: lastName})}
            defaultValue={this.state.lastName}
            />
        </View>

        
        <Text style = {{fontFamily: 'Light' , fontSize: 20}}>Date of Birth</Text>
        <View style={{height: 40, margin: 5,borderBottomColor: 'black', borderBottomWidth: 1, marginBottom: 10,}}>
        <TextInput
            style={{height: 40, background: 'aliceblue', margin: 5}}
            placeholder={this.state.dateBirth}
            onChangeText={DOB => this.setState({dateBirth: DOB})}
            defaultValue={this.state.dateBirth}
            />
        </View>

        
        <Text style = {{fontFamily: 'Light' , fontSize: 20}}>Sex</Text>
        <View style={{height: 40, margin: 5,borderBottomColor: 'black', borderBottomWidth: 1, marginBottom: 10,}}>
        <TextInput
            style={{height: 40, background: 'aliceblue', margin: 5}}
            placeholder={this.state.sex}
            onChangeText={s => this.setState({sex: s})}
            defaultValue={this.state.sex}
            />
        </View>

        
        <Text style = {{fontFamily: 'Light' , fontSize: 20}}>Age</Text>
        <View style={{height: 40, margin: 5,borderBottomColor: 'black', borderBottomWidth: 1, marginBottom: 10,}}>
        <TextInput
            style={{height: 40, background: 'aliceblue', margin: 5}}
            placeholder={this.state.age}
            onChangeText={age => this.setState({age: age})}
            defaultValue={this.state.age}
            />
        </View>

        
        <Text style = {{fontFamily: 'Light' , fontSize: 20}}>Address</Text>
        <View style={{height: 40, margin: 5,borderBottomColor: 'black', borderBottomWidth: 1, marginBottom: 10,}}>
        <TextInput
            style={{height: 40, background: 'aliceblue', margin: 5}}
            placeholder={this.state.address}
            onChangeText={address => this.setState({address: address})}
            defaultValue={this.state.address}
            />
        </View>

        
        <Text style = {{fontFamily: 'Light' , fontSize: 20}}>Postal Code</Text>
        <View style={{height: 40, margin: 5,borderBottomColor: 'black', borderBottomWidth: 1, marginBottom: 10,}}>
        <TextInput
            style={{height: 40, background: 'aliceblue', margin: 5}}
            placeholder={this.state.postalCode}
            onChangeText={postalCode => this.setState({postalCode: postalCode})}
            defaultValue={this.state.postalCode}
            />
        </View>

        <View >
        <Text style = {{fontFamily: 'Light' , fontSize: 20}}>Health Card</Text>
        <View>
          <TouchableOpacity  style = {styles.myBtns} onPress={this._pickImage}>
          <Text style = {{fontFamily: 'Light'}}>Pick an image from camera roll</Text>
          </TouchableOpacity>
       
        <Text>
        {this.state.healthCard && <Image source={{ uri: this.state.healthCard }} style={{ width: 300, height: 300 }} />}
        </Text>
        </View>
        </View>
        <TouchableOpacity style= {styles.myBtns} onPress= {this.saveUpdate}>
          <Text style = {{fontFamily: 'Light'}}>
          Save Info
          </Text>
        </TouchableOpacity>

        

        </View>
        </KeyboardAwareScrollView>


      );

      return(
        <PatientDashboardScreen/>
      );




    }

 

}


export default ChangeHealthScreen;
