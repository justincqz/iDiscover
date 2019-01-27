import React from 'react';
import { StyleSheet, Text, View, TouchableWithoutFeedback, ScrollView, Button } from 'react-native';
import { Dimensions } from "react-native";
import { AntDesign } from '@expo/vector-icons';
import colors from './colors';

var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

const styles = StyleSheet.create({
  title: {
    fontWeight: "bold",
    color: 'white',
    fontSize: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 7
  },
  content: {
    borderRadius: 15,
    width: width - 20,
    overflow: 'hidden',
    marginBottom: 15
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
    borderRadius: 10
  }
});

export default class DetailsView extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      clips: [
        {
          title: "Clip 1",
          description: "The description"
        },
        {
          title: "Clip 2",
          description: "The description"
        }, 
        {
          title: "Clip 3",
          description: "The description"
        },
        {
          title: "Clip 4",
          description: "The description"
        },
        {
          title: "Clip 5",
          description: "The description"
        }
      ],
      tours: [
        {
          title: "Tour 1",
          description: "The description"
        },
        {
          title: "Tour 2",
          description: "The description"
        },
        {
          title: "Tour 2",
          description: "The description"
        },
        {
          title: "Tour 2",
          description: "The description"
        },
        {
          title: "Tour 2",
          description: "The description"
        }
      ]
    }

    this.detailsURL = "http://hanneshertach.com:3001/";

  }

  componentWillMount = async () => {
    fetch(this.detailsURL + 'api/getInfoLocationID', {
      method: 'POST',
      data: {
        id: this.props.location
      }
    })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      this.setState({
        clips: data.audios,
        tours: data.routes
      });
    });
  }

  render() {
    return (
      <View style={{flex: 1, flexDirection: 'column', width: width}}>
        <TouchableWithoutFeedback onPress={this.props.closeFunc}>
          <View style={{backgroundColor: colors.clr_dark, height: 17, alignSelf: 'stretch', alignItems: 'center'}}>
            <AntDesign name="caretdown" size={15} color={colors.clr_light} />
          </View>
        </TouchableWithoutFeedback>


        <ScrollView style={{
            backgroundColor: colors.clr_primary,
            paddingLeft: 10,
            paddingTop: 10
          }}>

          <View style={styles.header_title}>
            <Text style={
              styles.title
            }>{this.props.location.name}</Text>
          </View>

          <Button
            title="Record Something..."
            onPress={() => this.props.openRecordView()}
            style={{
              margin: 20
            }}
          />

          <View style={styles.content}>
            <View style={styles.content_header}> 
              <Text style={styles.content_header_text}>Audio Clips</Text>
              <View style={{flex: 1, width: 1}}>
                <AntDesign name="right" color={colors.clr_light} size={15} />
              </View>
            </View>
            <ScrollView style={styles.content_container} horizontal={true}>
              {this.state.clips.map((clip, i) => (
                <View style={{padding: 10, borderColor: colors.clr_dark, borderRightWidth: 1}} key={i}>
                  <Text>{clip.title}</Text>
                  <Text>{clip.description}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
          
          <View style={styles.content}>
            <View style={styles.content_header}>
              <Text style={styles.content_header_text}>Top tours:</Text>
            </View>
            {this.state.tours.map((tour, i) => (
              <TouchableWithoutFeedback onPress={() => {
                this.props.viewTour(tour._id);
              }} style={styles.content_container} key={i}>
                <View>
                  <Text>{tour.title}</Text>
                  <Text>{tour.description}</Text>
                </View>
              </TouchableWithoutFeedback>
            ))}
          </View>
        </ScrollView>


      </View>
    )
  }

}