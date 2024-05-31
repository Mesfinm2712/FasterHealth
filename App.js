import React, { Component } from 'react'
import {
  View,
  Text
} from 'react-native'

import * as Font from 'expo-font';
import {createAppContainer, createSwitchNavigator} from 'react-navigation'
import LoadingScreen from './screens/LoadingScreen'
import PatientLoginScreen from './screens/Patient/PatientLoginScreen'
import ClinicLoginScreen from './screens/Clinic/ClinicLoginScreen'
import SignUpClinicScreen from './screens/Clinic/SignUpClinicScreen'
import SignUpPatientScreen from './screens/Patient/SignUpPatientScreen'
import firebase from 'firebase'
import { firebaseConfig } from './config.js';
import ClinicDashboardScreen from './screens/Clinic/ClinicDashboardScreen';
import PatientDashboardScreen from './screens/Patient/PatientDashboardScreen';
import ClinicSettingScreen from './screens/Clinic/ClinicSettingScreen';
import PatientSettingScreen from './screens/Patient/PatientSettingScreen';
import ClinicListScreen from './screens/Patient/ClinicListScreen';
import DisplayClinicInfoScreen from './screens/Patient/DisplayClinicInfoScreen';
import PatientReviewInfoScreen from './screens/Patient/PatientReviewInfoScreen';
import PatientDetailsScreen from './screens/Clinic/PatientDetailsScreen';
import SideMenu from './screens/Patient/SideMenu';
import SideMenuClinic from './screens/Clinic/SideMenuClinic'
import { createStackNavigator } from 'react-navigation-stack';
let app = firebase.initializeApp(firebaseConfig);
export const db = app.database();

class App extends Component {
 render() {
      return (
          <AppNavigator/>
        )
  }
}

const AppSwitchNavigator = createStackNavigator({
  LoadingScreen: { screen: LoadingScreen},
  PatientLoginScreen:{ screen:  PatientLoginScreen},
  ClinicLoginScreen:{ screen:  ClinicLoginScreen},
  SignUpClinicScreen:{ screen:  SignUpClinicScreen},
  SignUpPatientScreen:{ screen:  SignUpPatientScreen},
  ClinicDashboardScreen:{ screen:  ClinicDashboardScreen},
  PatientDashboardScreen:{ screen:  PatientDashboardScreen},
  ClinicSettingScreen:{ screen:  ClinicSettingScreen},
  PatientSettingScreen:{ screen:  PatientSettingScreen},
  ClinicListScreen:{ screen:  ClinicListScreen},
  DisplayClinicInfoScreen:{ screen:  DisplayClinicInfoScreen},
  PatientReviewInfoScreen: { screen: PatientReviewInfoScreen},
  PatientDetailsScreen:{ screen:  PatientDetailsScreen},
  SideMenu:{ screen:  SideMenu},
  SideMenuClinic:{ screen:  SideMenuClinic},
},
{
  initialRouteName: 'PatientLoginScreen',
  headerMode: 'none',
  mode: 'modal',
}
)

const AppNavigator = createAppContainer(AppSwitchNavigator)
export default App;
