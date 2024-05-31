import React, { Component } from 'react'
import {
  View,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity
} from 'react-native'
import * as Font from 'expo-font';
import firebase from 'firebase'
let customFonts = {
    'Light': require('../assets/fonts/ColabLig.otf'),
  };
function distance(lat1, lon1, lat2, lon2, unit) {
	if ((lat1 == lat2) && (lon1 == lon2)) {
		return 0;
	}
	else {
        var radlat1 = Math.PI * lat1/180;
		var radlat2 = Math.PI * lat2/180;
		var theta = lon1-lon2;
        var radtheta = Math.PI * theta/180;
		var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		if (dist > 1) {
			dist = 1;
		}
		dist = Math.acos(dist);
		dist = dist * 180/Math.PI;
		dist = dist * 60 * 1.1515;
		if (unit=="K") { dist = dist * 1.609344 }
        if (unit=="N") { dist = dist * 0.8684 }
		return dist;
	}
}
import { AntDesign } from '@expo/vector-icons'; 
const styles = StyleSheet.create({

  containerSettings:{
    flex: 1,
    justifyContent: 'flex-start',
    marginTop: 10,
    padding: 10
  },

  myBtns: {
    marginTop: 15,

    borderRadius: 10,
    
    backgroundColor: '#AAE2D1',
   
    padding: 10
  },
})
export default class ClinicListScreen extends Component {
    state = {
        userLocation: null,
        listOfClinics: [],
        fontsLoaded: false,
    }
    constructor(props){
        super(props);  
        this.goBack = this.goBack.bind(this);    
    }
    async _loadFontsAsync() {
      
        await Font.loadAsync(customFonts);
        this.setState({ fontsLoaded: true });
      }
    componentDidMount(){
        this._loadFontsAsync();
        var self = this;
        var userId= firebase.auth().currentUser.uid;
        var userLoc = null;
        firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
            userLoc = (snapshot.val() && snapshot.val().location);
            self.setState({userLocation: (snapshot.val() && snapshot.val().location)});
        });
        firebase.database().ref('/clinics/').once('value').then(function(snapshot) {
            var arr = [];
            snapshot.forEach(function(item) {
                var itemVal = item.val();
                var clinicId = item.key;

                var lat1 = parseFloat(itemVal.location.coords.latitude);
                var lng1 = parseFloat(itemVal.location.coords.longitude);
                var lat2 = parseFloat(userLoc.coords.latitude);
                var lng2 = parseFloat(userLoc.coords.longitude);
                var info = new Object();
                info = {
                    clinicId: clinicId,
                    itemVal: itemVal
                }
                
                if (distance(lat1, lng1, lat2, lng2, "K") <= 0.3) { // if distance < 0.1 miles we take locations as equal
                    //do what you want to do...
                    arr.push(info);
                 }else{

                 }


            });
            self.setState({listOfClinics: arr});
        });
    }

    viewClinic = (id) => {
        this.props.navigation.navigate('DisplayClinicInfoScreen', {
                userId: id 
          });
    }
    goBack = async() => {
        
        this.props.navigation.navigate('PatientDashboardScreen');
    }

    render(){
        if(this.state.fontsLoaded){
        return(
            <View style = {styles.containerSettings}>
                <TouchableOpacity onPress = {this.goBack}>
                <AntDesign name="back" size={24} color="black" />
                </TouchableOpacity>
                <Text style = {{fontFamily: 'Light' , fontSize: 24, paddingBottom: 10}}>Available Clinics:</Text>
                {this.state.listOfClinics.length > 0 &&
                this.state.listOfClinics.map((data) => {
                return (
                    <View>
                    <Text style = {{fontFamily: 'Light' , fontSize: 20}}>{data.itemVal.clinicName}</Text>
                    <TouchableOpacity style = {styles.myBtns} onPress = {() => this.viewClinic(data.clinicId)} >
                        <Text style = {{fontFamily: 'Light' }}>Go to Clinic</Text>
                    </TouchableOpacity>
                    </View>
                )
                }) || <Text style = {{fontFamily: 'Light' , fontSize: 20}}>None available at this time :( </Text>}
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