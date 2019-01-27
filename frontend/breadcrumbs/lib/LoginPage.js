import React from 'react';
import { View, Button, TextInput, Text, TouchableOpacity } from 'react-native';
import colors from './colors.js';
import { Dimensions } from "react-native";
import { FontAwesome } from '@expo/vector-icons';

var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

export default class LoginPage extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: "",
      enteredIncorrect: false
    }

    this.pinsUrl = "http://hanneshertach.com:3001/api";

  }

  _submitLogin = async () => {
    fetch(this.pinsUrl + "/getUser", {
      method:'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: this.state.username,
        password: this.state.password
      })
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          const user = data.user;
          fetch(this.pinsUrl + "/getAudioInfoUser", {
            method:'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              titles : data.user.AudioNames
            })
          })
          .then (response => response.json())
          .then(aud => {
            console.log(user);
            console.log(data);
            console.log(aud.audios);
            console.log(data.user);
            this.props.loginSuccess(user, aud.audios);
          })
        } else {
          this.setState({username: "", password: "", enteredIncorrect: true});
        }
      });
  }

  render() {
    // if (!this.state.enteredIncorrect) {
      return (
        <View style={{backgroundColor: colors.clr_dark, height:height, flexDirection: 'column', alignItems:'center', justifyContent: 'center'}}>
          <View style={{
            padding: 40
          }}>
          <View style={{flexDirection: 'row', alignItems:'center', justifyContent:'center', marginBottom: 20}}>
            <Text style={{color: colors.clr_light, fontSize: 65}}>
            i</Text>
            <Text style={{color: colors.nearly_white, fontSize:60}}>
            Discover</Text>
          </View>
          <View style={{borderRadius: 100, padding:10, backgroundColor: colors.nearly_white, overflow:'hidden', marginBottom: 15, borderColor:'red',
                        borderWidth: this.state.enteredIncorrect ? 3 : 0}}>
            <TextInput
              style={{height: 40, width:width/1.5}}
              onChangeText={(username) => this.setState({username})}
              placeholder='Username'
              value={this.state.username} />
          </View>
          <View style={{borderRadius: 100, padding:10, backgroundColor: colors.nearly_white, overflow:'hidden', marginBottom: 15, borderColor:'red',
                        borderWidth: this.state.enteredIncorrect ? 3 : 0}}>
            <TextInput
              style={{height: 40, width:width/1.5}}
              onChangeText={(password) => this.setState({password})}
              placeholder='Password'
              secureTextEntry={true}
              value={this.state.password} />
            </View>
            {/* <Button title="Login" onPress={this._submitLogin} color={colors.clr_primary} buttonStyle={{borderRadius:200, overflow:'hidden'}} /> */}
            <TouchableOpacity onPress={this._submitLogin} >
          <View style={{flexDirection:'row', marginTop: width/15, marginBottom: width/20, backgroundColor:
          this.state.enteredIncorrect ? colors.creator.clr_primary : colors.clr_primary, padding:5, borderRadius: 60}}>
            <FontAwesome name='user-circle' size={width/4} color={colors.clr_dark} />
            <View style={{textAlign:'right', flexGrow:2, alignContent:'flex-end', justifyContent:'flex-start', flexDirection:'column', paddingTop: 7, paddingRight: 15}}>
            <Text style={{fontSize: 40, textAlign: 'right', color: colors.nearly_white, paddingRight: 7}}> Login</Text>
            <Text style={{fontSize: 15, textAlign: 'right', color: colors.clr_dark, paddingRight: 7}}> powered by OAuth</Text>
            </View>
          </View>
          </TouchableOpacity>
          </View>
        </View>
      )
    // } else {
      return (
        <View style={{backgroundColor: colors.clr_dark, height:height, flexDirection: 'column', alignItems:'center'}}>
          <View style={{padding: 40}}>
            <View style={{flexDirection:'row', marginTop: width/2, marginBottom: width/20, backgroundColor:colors.nearly_white, padding:5, borderRadius: 60}}>
              <Text style={{fontSize: 20, textAlign: 'center', color: colors.nearly_white, paddingRight: 7, color: colors.clr_dark }}> This password / username pair is not recognized!</Text>
            </View>

          </View>

          <Button title="Try Again" onPress={() => this.setState({enteredIncorrect : false})} />

        </View>
      )
    // }
  }

}