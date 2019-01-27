import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { Header } from 'react-native-elements';
import {createStackNavigator, createAppNavigator} from 'react-navigation';
import ListenMap from './ListenMap.js';
import CreateView from './CreateView.js';

const creator_light = '#9d46ff';
const creator_primary = '#6200ea';
const creator_dark = '#0a00b6';

class BackButton extends React.Component {

  _navigateBack = () => {
    const { navigate } = this.props.navigation;
    navigate("ListenMap");
  }

  render() {
    return (
      <TouchableOpacity onPress={this._navigateBack()}>
        <Text>Back</Text>
      </TouchableOpacity>
    );
  }

}

export default MapStackNavigator = createStackNavigator({
  Map: {
    screen: ListenMap,
    navigationOptions: () => ({
      header: null,
      headerBackTitle: null
    })
  },
  CreateView: {
    screen: CreateView,
    navigationOptions: () => ({
      title: "Record",
      headerTintColor: creator_dark,
      headerStyle: {
        backgroundColor: creator_light
      },
    })
  }
});