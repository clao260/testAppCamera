/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';

import CameraComponent from './src/camera/cameraComponent';

export default class App extends React.Component {
  render() {
    return (
      <CameraComponent />
    )
  }
}