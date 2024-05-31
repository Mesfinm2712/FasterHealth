import React, { Component } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from 'react-native'
import * as Font from 'expo-font';
import MapView from 'react-native-maps';
import firebase from 'firebase'
import { AntDesign } from '@expo/vector-icons'; 
let customFonts = {
  'Light': require('../assets/fonts/ColabLig.otf'),
};
const Marker = MapView.Marker;
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
     
      padding: 10
    },
  })

export default class DisplayClinicInfoScreen extends Component {
    state = {
        clinicName: null,
        addr: null,
        fontsLoaded: false,
        loc: null
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
        
        var self = this;
        firebase.database().ref('/clinics/' + self.props.navigation.state.params.userId).once('value').then(function(snapshot) {
           
            const name = (snapshot.val() && snapshot.val().clinicName);
            const addr = (snapshot.val() && snapshot.val().address);
            const loc = (snapshot.val() && snapshot.val().location);
            self.setState({clinicName: name, addr: addr, loc: loc});
            self._loadFontsAsync();
        });

    }
    goBack = () => {
      this.props.navigation.navigate('PatientDashboardScreen');
    }
    goToUserInfo = () => {
        this.props.navigation.navigate('PatientReviewInfoScreen', {
            userId: this.props.navigation.state.params.userId
      });
    }

    render(){
      if(this.state.fontsLoaded){
        return(
            <View style = {styles.containerSettings}>
                <TouchableOpacity onPress = {this.goBack}>
                <AntDesign name="back" size={24} color="black" />
                </TouchableOpacity>
                <Text style = {{fontFamily: 'Light' , fontSize: 24}}>{this.state.clinicName}</Text>
                
                <Text style = {{fontFamily: 'Light' , fontSize: 20}}>Location: {this.state.addr}</Text>
                <MapView
                  style={{ alignSelf: 'stretch', height: 200 }}
                  region={{ latitude: this.state.loc.coords.latitude, longitude: this.state.loc.coords.longitude, latitudeDelta: 0.0922, longitudeDelta: 0.0421 }}
                  showsUserLocation
                  showsMyLocationButton
                >
                  <Marker title={"a clinic"} coordinate={this.state.loc.coords} />
                </MapView>
                  
                <TouchableOpacity style = {styles.myBtns} onPress= {() => this.goToUserInfo()}>
                    <Text style = {{fontFamily: 'Light'}}>
                    Add me to the wait line
                    </Text>
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