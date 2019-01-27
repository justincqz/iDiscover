import React from 'react';
import { StyleSheet, View, Text, ScrollView, Dimensions, TouchableWithoutFeedback } from 'react-native';
import colors from './colors.js';
import { Entypo } from '@expo/vector-icons';
import LoginPage from './LoginPage.js';

var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

const styles = StyleSheet.create({
  profile_pic: {
    padding: '20%',
    borderRadius: width,
    backgroundColor: 'white',
    margin: 60,
    marginLeft: 100,
    marginRight: 100
  },
  title: {
    fontWeight: "bold",
    color: 'white',
    fontSize: 35,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 7
  },
  content: {
    borderRadius: 15,
    width: width - 20,
    overflow: 'hidden'
  }, 

  content_header: {
    backgroundColor: colors.clr_dark,
    padding: 7,
    paddingLeft: 10,
    flexDirection: 'row'
  },

  content_header_text: {
    color: 'white',
    fontSize: 15,
    flex: 1,
    flexGrow: 2
  },

  content_container: {
    backgroundColor: 'white',
    padding: 5
  },

  header_title: {
    backgroundColor: colors.clr_dark,
    width: width - 20,
    padding: 5,
    paddingLeft: 7,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center'
  }
});


class ProfileScreen extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      loggedIn: false,
      recordedClips: [
        {
          ActualTitle: "Clip1",
          Description: "Description for clip 1"
        },
        {
          ActualTitle: "Clip1",
          Description: "Description for clip 1"
        },
        {
          ActualTitle: "Clip1",
          Description: "Description for clip 1"
        }
      ],
      firstName: "",
      lastName: "",
      nickName: ""
    }

  }

  _openLoginPage = () => {
    this.setState({
      loggedIn: false
    });
  };

  render() {

    if (!this.state.loggedIn) {
      return (<LoginPage loginSuccess={(user, clips) => {
        this.setState({
          loggedIn: true,
          firstName: user.FirstName,
          lastName: user.LastName,
          nickName: user.Nickname,
          recordedClips: clips
        });
      }} />);
    }

    return (
      
        <View style={{
          flex: 1,
          backgroundColor: colors.clr_primary
        }}>
          <View style={{paddingTop: 30, flexDirection: 'row', justifyContent: 'flex-end', padding: 9, paddingRight: 15}}>
          <TouchableWithoutFeedback onPress={this._openLoginPage}>
            <Entypo name='log-out' size={30} color={colors.clr_light} />
          </TouchableWithoutFeedback>
          </View>

          <View style={styles.profile_pic}>

          </View>
          <View style={{marginLeft:7}}>
            <View style={styles.header_title}>
              <Text style={styles.title}>{this.state.nickName}</Text>
            </View>
            <View style={styles.content}>
              <View style={styles.content_header}>
                <Text style={styles.content_header_text}>Your Recorded Clips:</Text>
              </View>
              <ScrollView style={styles.content_container}>
                {this.state.recordedClips.map((clip, i) => (
                  <View style={{
                    padding: 10,
                    borderTopColor: 'gray',
                    borderTopWidth: 1
                  }} key={i}>
                    <Text style={{fontWeight: 'bold'}}>{clip.ActualTitle}</Text>
                    <Text>{clip.Description}</Text>
                  </View>
                ))}
              </ScrollView>
            </View>
          </View>
        
      </View>
    );
  }

  
}

export default ProfileScreen;