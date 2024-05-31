import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import MapView from 'react-native-maps';
import Constants from 'expo-constants';
import * as Location from 'expo-location';

const Marker = MapView.Marker;
// currently there is a react-native error that does not allow the map to correctly render on web
export default class MapScreen extends Component {
  state = {
    mapRegion: null,
    hasLocationPermissions: false,
    locationResult: null,
    coords: null
  };

  componentDidMount() {
    this.getLocationAsync();
  }

    handleMapRegionChange (mapRegion){

      this.setState({ mapRegion });
    }

  async getLocationAsync (){
   let { status } = await Location.requestPermissionsAsync();
   if (status !== 'granted') {
     this.setState({
       locationResult: 'Permission to access location was denied',
     });
   } else {
     this.setState({ hasLocationPermissions: true });
   }

   let location = await Location.getCurrentPositionAsync({});
   this.setState({ locationResult: JSON.stringify(location) });
   
   // Center the map on the location we just fetched.
    this.setState({mapRegion: { latitude: location.coords.latitude, longitude: location.coords.longitude, latitudeDelta: 0.0922, longitudeDelta: 0.0421 }, coords: location.coords});
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.paragraph}>
          Pan, zoom, and tap on the map!
        </Text>
        
        {
          this.state.locationResult === null ?
          <Text>Finding your current location...</Text> :
          this.state.hasLocationPermissions === false ?
            <Text>Location permissions are not granted.</Text> :
            this.state.mapRegion === null ?
            <Text>Map region doesn't exist.</Text> :
            <MapView
              style={{ alignSelf: 'stretch', height: 400 }}
              region={this.state.mapRegion}
              showsUserLocation
              showsMyLocationButton
            >
            <Marker title={"a clinic"} coordinate={this.state.coords} />
            </MapView>
        }
        
        <Text>
          Location: {this.state.locationResult}
        </Text>
      </View>
        
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
    paddingTop: Constants.statusBarHeight,
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#34495e',
  },
});

