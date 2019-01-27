import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { Text, View } from 'react-native';
import { createBottomTabNavigator } from 'react-navigation';
import MapStackNavigator from './MapStackNavigator.js';
import ProfileScreen from './ProfileScreen';
import colors from './colors.js';

export default MainNav = createBottomTabNavigator({
    Listen: MapStackNavigator,
    Profile: ProfileScreen,
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        let IconSource;
        

        if (routeName === 'Profile') {
          IconSource = Feather;
          iconName = 'user';
        } else if (routeName === 'Listen') {
          IconSource = focused ? Ionicons : Feather;
          iconName = focused ? 'md-headset' : 'headphones';
        }

        return <IconSource name={iconName} size={25} color={tintColor} />;
      },
    }),
    tabBarOptions: {
        activeTintColor: 'white',
        inactiveTintColor: colors.clr_dark,
        activeBackgroundColor: colors.clr_primary,
        inactiveBackgroundColor: colors.clr_primary
    }
  }
  );