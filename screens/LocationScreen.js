import React, { useState, useEffect } from 'react';
import { Platform, Text, View, StyleSheet, Dimensions } from 'react-native';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import firebase from 'firebase';
import { db } from '../App';


export default function LocationScreen(props) {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      setErrorMsg(
        'Oops, this will not work on Sketch in an Android emulator. Try it on your device!'
      );
    } else {
      (async () => {
        let { status } = await Location.requestPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
        }

        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
      })();
    }
  });

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
    alert(errorMsg);
  } else if (location) {
    text = location;
    //add location to the patient

    if(props.clinic){            
            // Get a key for a new Post.
            var user = firebase.auth().currentUser;
            //var newPostKey = db.ref().child(`users/${user.uid}`).push().key;
            var updates = {};
            updates[`clinics/${user.uid}/location`] = text;
            db.ref().update(updates);

    }else{
            // Get a key for a new Post.
            var user = firebase.auth().currentUser;
            //var newPostKey = db.ref().child(`users/${user.uid}`).push().key;
            var updates = {};
            updates[`users/${user.uid}/location`] = text;
            db.ref().update(updates);
    }


  }
 
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});
