import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { Header } from 'react-native-elements';
import {createStackNavigator, createAppNavigator} from 'react-navigation';
import ListenMap from './ListenMap.js';
import CreateView from './CreateView.js';
import colors from './colors.js';

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
      headerTintColor: colors.creator.clr_dark,
      headerStyle: {
        backgroundColor: colors.creator.clr_light
      },
    })
  }
});