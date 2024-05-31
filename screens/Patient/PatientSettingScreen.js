// import { Component } from 'react'
// import * as React from 'react';
// import { Animated, Text, View, StyleSheet, StatusBar, TextInput, Image, TouchableOpacity, Button, Alert } from 'react-native';
// import Constants from 'expo-constants';
// // import { Button } from 'react-native-paper';
// import { useNavigation, NavigationContainer } from '@react-navigation/native';
// import {
//   createStackNavigator,
//   TransitionSpecs,
//   HeaderStyleInterpolators,
// } from '@react-navigation/stack';
// import SafeAreaFix from './SafeAreaFix';
// import * as Permissions from 'expo-permissions';
// import firebase from 'firebase'
// import { db } from '../../App';
// import * as ImagePicker from 'expo-image-picker';
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
// import { AntDesign } from '@expo/vector-icons'; 
// import * as Font from 'expo-font';
// let customFonts = {
//   'Light': require('../assets/fonts/ColabLig.otf'),
// };

// import {createAppContainer, createSwitchNavigator} from 'react-navigation'
// import ChangeHealthScreen from './settingButtons/ChangeHealthScreen'
// import ChangePasswordScreen from './settingButtons/ChangePasswordScreen'
// import DeleteAccountScreen from './settingButtons/DeleteAccountScreen'
// import SignOutScreen from './settingButtons/ChangePasswordScreen'



// const styles = StyleSheet.create({

//   containerSettings:{
//     flex: 1,
//     justifyContent: 'flex-start',
//     marginTop: 10,
//     padding: 10
//   },
//   container: {
//     flex: 1,
//     justifyContent: 'center',
    
//     padding: 10,
//     marginTop: 15,
//   },
//   myBtns: {
//     marginTop: 15,

//     borderRadius: 10,
    
//     backgroundColor: '#AAE2D1',
   
//     padding: 10,

//     flex: 1,

//     marginRight: 3
//   },
// })



// const MyTransition = {
//   gestureDirection: 'horizontal',
//   transitionSpec: {
//     open: TransitionSpecs.TransitionIOSSpec,
//     close: TransitionSpecs.TransitionIOSSpec,
//   },
//   headerStyleInterpolator: HeaderStyleInterpolators.forFade,
//   cardStyleInterpolator: ({ current, next, layouts }) => {
//     return {
//       cardStyle: {
//         transform: [
//           {
//             translateX: current.progress.interpolate({
//               inputRange: [0, 1],
//               outputRange: [layouts.screen.width, 0],
//             }),
//           },
//           {
//             rotate: current.progress.interpolate({
//               inputRange: [0, 1],
//               outputRange: [1, 0],
//             }),
//           },
//           {
//             scale: next
//               ? next.progress.interpolate({
//                   inputRange: [0, 1],
//                   outputRange: [1, 0.9],
//                 })
//               : 1,
//           },
//         ],
//       },
//       overlayStyle: {
//         opacity: current.progress.interpolate({
//           inputRange: [0, 1],
//           outputRange: [0, 0.5],
//         }),
//       },
//     };
//   },
// };


// function ChangeHealthButton({ screenName }) {
//   const navigation = useNavigation();


//   return (

//     <View style={{left: -5, top: 70, flexDirection: 'row', justifyContent: 'space-between', width: 180, height: 180}}>


		        
// 		<TouchableOpacity onPress={() => navigation.navigate(screenName)} style={styles1.button}>
// 		    <Text style = {{fontFamily: 'Light', fontSize: 20, fontWeight: 'bold', textAlign: 'center'}}>Change Health Information</Text>
// 		</TouchableOpacity>

//     </View>


//   );
// }



// function ChangePasswordButton({ screenName }) {
//   const navigation = useNavigation();

//   return (
//     <View style={{left: 180, top: -110, flexDirection: 'row', justifyContent: 'space-between', width: 180, height: 200}}>


		        
// 		<TouchableOpacity onPress={() => navigation.navigate(screenName)} style={styles1.button}>
// 		    <Text style = {{fontFamily: 'Light', fontSize: 20, fontWeight: 'bold', textAlign: 'center'}}>Change Password</Text>
// 		</TouchableOpacity>

//     </View>
  
//   );
// }

// function DeleteAccountButton({ screenName }) {
//   const navigation = useNavigation();

//   return (

//     <View style={{left: -10, top: -80, flexDirection: 'row', justifyContent: 'space-between', width: 190, height: 200}}>


		        
// 		<TouchableOpacity onPress={() => navigation.navigate(screenName)} style={styles1.button}>
// 		    <Text style = {{fontFamily: 'Light', fontSize: 20, fontWeight: 'bold', textAlign: 'center'}}>Delete Account</Text>
// 		</TouchableOpacity>

//     </View>

//   );
// }

// function signOut(){
//     firebase.auth().signOut().then(function() {
//       console.log('sign out!');
//       // Sign-out successful.
//     }).catch(function(error) {
//       // An error happened.
//     });
//   }

// function SignOutButton({ screenName }) {
//   const navigation = useNavigation();

//   return (

//     <View style={{left: 180, top: -280, flexDirection: 'row', justifyContent: 'space-between', width: 180, height: 200}}>


		        
// 		<TouchableOpacity 
// 		onPress={() => Alert.alert(
//           'Are you sure you want to log out?',
//           'Click cancel to stay logged in',
//           [
//             {text: 'Log out', onPress: signOut},
//             {text: 'Cancel', onPress: () => console.log('Cancel Pressed!')},
//           ],
//           { cancelable: false }
//         )}
// 		style={styles1.button}>
// 		    <Text style = {{fontFamily: 'Light', fontSize: 20, fontWeight: 'bold', textAlign: 'center'}}>Log Out</Text>
// 		</TouchableOpacity>

//     </View>
      


//   );
// }

// function TestScreen({ navigation }) {

//   return (
//     <View style={styles1.content}>

//             <ChangeHealthButton screenName="Change Health Information" />
//             <ChangePasswordButton screenName="Change Password" />
//             <DeleteAccountButton screenName="Delete Account" />
//             <SignOutButton screenName="Sign Out" />


//     </View>
//   );
// }

// const Stack = createStackNavigator();



// function MyStack() {


//   return (
//     <Stack.Navigator
//       headerMode="float"
//       screenOptions={{
//         cardOverlayEnabled: true,
//         gestureEnabled: true,
//         ...MyTransition,
//       }}>
//       <Stack.Screen
//         name="Test"
//         component={TestScreen}
//         options={{ title: 'Settings' }}
//       />
//         <Stack.Screen name="Change Health Information" component={ChangeHealthScreen} />
//         <Stack.Screen name="Change Password" component={ChangePasswordScreen} />
//         <Stack.Screen name="Delete Account" component={DeleteAccountScreen} />
//         <Stack.Screen name="Sign Out" component={SignOutScreen} />

//     </Stack.Navigator>
//   );
// }


// class PatientSettingScreen extends Component {

//  render() {
//       return (
//     <SafeAreaFix>
//       <NavigationContainer>
//         <MyStack />        
//       </NavigationContainer>         
//     </SafeAreaFix>

//         )
//   }
// }


// const styles1 = StyleSheet.create({
//   button: {
//     margin: 8,   
//     alignItems: "center",
//     backgroundColor: "#DDDDDD",
//     padding: 10, 

//     top: -50,
//     height: 200,

//     marginTop: 55,

//     borderRadius: 20,
    
//     flex: 1,

//     marginRight: 3

//   },
//   content: {
//     flex: 1,
//     padding: 8,
//   },

//   containerSettings:{
//     flex: 1,
//     justifyContent: 'flex-start',
//     marginTop: 10,
//     padding: 10
//   },
//   container: {
//     flex: 1,
//     justifyContent: 'center',
    
//     padding: 10,
//     marginTop: 15,
//   },
//   myBtns: {
//   	height: 50,
//   	width: 100,
//     marginTop: 55,

//     borderRadius: 10,
    
//     backgroundColor: '#AAE2D1',
   
//     padding: 80,

//     flex: 1,

//     marginRight: 3
//   },

// });



// const AppNavigator = createAppContainer(Stack)
// export default PatientSettingScreen;
