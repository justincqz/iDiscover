import React from 'react';
import { StyleSheet, Text, View, TouchableWithoutFeedback, ScrollView, Button } from 'react-native';
import { Dimensions } from "react-native";
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
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
    marginLeft: 7,
    flexGrow: 2
  },
  subtitle: {
    color: colors.clr_light,
    fontSize: 15
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
    borderRadius: 10,
    marginBottom: 15,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end'
  },
  content_list: {
    padding: 10,
    borderBottomWidth: 1,
    flexDirection: 'row',
    backgroundColor: colors.nearly_white,
    alignItems: 'center'
  },
  content_two_layer: {
    marginLeft: 7, 
    padding: 1,
    flexDirection: 'column',
    alignItems:'flex-end',
    width: 40
  },
  content_two_layer_prio: {
    marginLeft: 7, 
    padding: 1,
    flexDirection: 'column',
    flexGrow: 3,
  }
});


export default class TourView extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      currentlyPlaying: null,
      tour: {
        tour_id: '1312',
        tour_name: 'joe dart',
        author: 'joe',
        clips: [
          {
            audio_id: "bla",
            title: "Clip 1",
            artist: "Jane Doe",
            type: "Museum",
            views: 500,
            upvotes: 11
          },
          {
            audio_id: "bla2",
            title: "Clip 2",
            artist: "The description",
            type: "Art_Gallery",
            views: 33,
            upvotes: 15
          }, 
          {
            audio_id: "bla3",
            title: "Clip 3",
            artist: "The description",
            type: "Museum",
            views: 1773,
            upvotes: 5
          },
          {
            audio_id: "bl4",
            title: "Clip 4",
            artist: "The description",
            type: "School",
            views: 48,
            upvotes: 16
          },
          {
            audio_id: "bl5",
            title: "Clip 5",
            artist: "The description",
            type: "Art_Gallery",
            views: 9993,
            upvotes: 902
          }
        ],
        location_pins: [
          {
            lon: '',
            lat: '',
          }
        ]
      }
    }
  }
  
  _displayIcon = (type) => {
    let iconName;
    let IconLib;
    let size;
    if (type=="Art_Gallery") {
      iconName = 'picture';
      IconLib = AntDesign;
      size = 20;
    } else if (type=='Museum') {
      iconName = 'bank';
      IconLib = MaterialCommunityIcons;
      size = 20;
    } else if (type=='School') {
      iconName = 'school';
      IconLib = MaterialCommunityIcons;
      size = 20;
    } else if (type=='View') {
      iconName = 'eye';
      IconLib = MaterialCommunityIcons;
      size = 10;
    } else if (type=='Upvote') {
      iconName = 'heart';
      IconLib = MaterialCommunityIcons;
      size = 10;
    }
    return (<IconLib name={iconName} size={size} color={colors.clr_dark} />);
  }

  _togglePlayback = (id) => {

    console.log("Playing toggled");

  };

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
            <Text style={styles.title}>Tour Title</Text>
            <Text style={styles.subtitle}>Johnny Johnson</Text>
          </View>

          <View style={styles.content}>
            <View style={styles.content_header}>
              <Text style={styles.content_header_text}>Attractions:</Text>
            </View>
            {this.state.clips.map((place, i) => (
              <TouchableWithoutFeedback onPress={() => {
                this.setState({
                  currentlyPlaying: place.audio_id
                });
                this._togglePlayback();
              }} key={i}>              
                <View style={styles.content_list}>
                  {this._displayIcon(place.type)}
                  <View style={styles.content_two_layer_prio} key={i}>
                    <Text>{place.title}</Text>
                    <Text>{place.artist}</Text>
                  </View>
                  <View style={styles.content_two_layer}>
                    <View style={{flexDirection: 'row'}}>
                      <Text>{place.views}</Text>
                      {this._displayIcon('View')}
                    </View>
                    <View style={{flexDirection: 'row'}}>
                      <Text>{place.upvotes}</Text>
                      {this._displayIcon('Upvote')}
                    </View>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            ))}
          </View>
        </ScrollView>


      </View>
    )
  }

}