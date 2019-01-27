import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MainNav from './lib/MainNav.js';
import { createAppContainer } from 'react-navigation';


export default App = createAppContainer(MainNav);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
