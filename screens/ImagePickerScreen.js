import * as React from 'react';
import { Button, Image, View, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import firebase from 'firebase'
import {db} from '../App'

export default class ImagePickerScreen extends React.Component {
  state = {
    image: null,
  };

  render() {
    let { image } = this.state;

    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Button title="Pick an image from camera roll" onPress={this._pickImage} />
        <Text>
        {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
        </Text>
      </View>
    );
  }

  componentDidMount() {
    this.getPermissionAsync();
    var userId = firebase.auth().currentUser.uid;

    var self = this;
    firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {

    self.setState({
      image: (snapshot.val() && snapshot.val().healthCard) || ''
    });
  });
  }

  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    }
  };
  // save new account info
  saveUpdate(image){
    // Get a key for a new Post.
    var user = firebase.auth().currentUser;
    //var newPostKey = db.ref().child(`users/${user.uid}`).push().key;
    var updates = {};
    updates[`users/${user.uid}/healthCard`] = image;
    db.ref().update(updates);

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
        this.saveUpdate(result.uri);
        this.setState({ image: result.uri });

      }


    } catch (E) {

    }
  };
}