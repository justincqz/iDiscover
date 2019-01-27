import React from 'react';
import { View, Button, TextInput } from 'react-native';

export default class LoginPage extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: ""
    }

  }

  _submitLogin = () => {
    console.log("Login");
    this.props.loginSuccess();
  };

  render() {
    return (
      <View style={{
        padding: 40
      }}>
        <TextInput
          style={{height: 40, borderColor: 'gray', borderWidth: 1}}
          onChangeText={(username) => this.setState({username})}
          value={this.state.username} />
        <TextInput
          style={{height: 40, borderColor: 'gray', borderWidth: 1}}
          onChangeText={(password) => this.setState({password})}
          secureTextEntry={true}
          value={this.state.password} />
        <Button title="Login" onPress={this._submitLogin} />
      </View>
    )
  }

}