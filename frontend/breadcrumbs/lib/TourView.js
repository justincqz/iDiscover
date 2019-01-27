import React from 'react';
import { StyleSheet, Text, View, TouchableWithoutFeedback, ScrollView, Button } from 'react-native';
import { Dimensions } from "react-native";
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import colors from './colors';
import AudioPlayer from './AudioPlayer.js';

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
  },
  activeAudioClip: {
    padding: 10,
    borderBottomWidth: 1,
    flexDirection: 'row',
    backgroundColor: colors.nearly_white,
    alignItems: 'center',
    backgroundColor: colors.clr_light
  },
  bufferAudioClip: {
    padding: 10,
    borderBottomWidth: 1,
    flexDirection: 'row',
    backgroundColor: colors.clr_light,
    alignItems: 'center',
    backgroundColor: colors.clr_primary
  }
});


export default class TourView extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      activeClip: -1,
      currentlyPlaying: null,
      loading: true,
      tour: {
        tour_id: '1312',
        tour_name: 'joe dart',
        author: 'joe',
        clips: [],
        location_pins: []
      }
    }
    this.player;
    this.place_names = [];
    console.log("COns: " + props.tourId);
  }

  _loadLocationInfo = async () => {

    fetch("http://hanneshertach.com:3001/api/getRoute", {
      method:'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        routeID: this.props.tourId
      })
    }).then(response => response.json())
      .then((data) => {
        this.setState({
          tour: data.data,
          clips: data.data.clips,
          loading: false
        }, () => {
          this.props.displayRoute(this.state.clips);
          for (let i = 0; i < this.state.clips.size; i++) {
            fetch("http://hanneshertach.com:3001/api/getLocationByID", {
              method:'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                id: this.state.clips[i].place_id,
              })
            })
            .then(response => response.json())
            .then((data) => {
              console.log(data);
              this.place_names.push(data.loc)
            });
          }
        });
      })
  }

  componentDidMount = () => {
    this._loadLocationInfo();
  };
  
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

  _togglePlayback = async (filename) => {

    console.log(filename);

    const playbackURL = "http://hanneshertach.com:3001/api/getAudioFile/" + filename;

    if (this.state.currentlyPlaying != null) {
      await this.state.currentlyPlaying.unload();
      this.setState({
        currentlyPlaying: null,
        activeClip: -1
      });
      
    } else {
      this.player = new AudioPlayer(playbackURL);
      await this.player.initialize();
      await this.player.startPlayingWithCallback(this._onPlaybackStatusUpdate);
      await this.setState({
        currentlyPlaying: this.player
      });
      console.log("Song started...");
    }

  };

  _onPlaybackStatusUpdate = playbackStatus => {
    if (playbackStatus.isLoaded) {

      if (playbackStatus.isBuffering) {
        this.setState({
          buffering: true,
        });
      } else if (this.state.buffering) {
        this.setState({
          buffering: false,
        });
      }
    
      if (playbackStatus.didJustFinish && !playbackStatus.isLooping) {
        this.setState({
          activeClip: -1,
          currentlyPlaying: null,
        });
      }
  
    }
  }

  render() {

    if (this.state.loading) {
      return (<Text>Loading...</Text>);
    }

    return (
      <View style={{flex: 1, flexDirection: 'column', width: width}}>
        {console.log("Names: "+ this.place_names)}
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
            <Text style={styles.title}>{this.state.tour.title}</Text>
            <Text style={styles.subtitle}>{this.state.tour.author}</Text>
          </View>

          <View style={styles.content}>
            <View style={styles.content_header}>
              <Text style={styles.content_header_text}>Attractions:</Text>
            </View>
            {this.state.clips.map((place, i) => (
              <TouchableWithoutFeedback onPress={() => {
                this.setState({
                  activeClip: i
                });
                this._togglePlayback(place.filename);
              }} key={i}>              
                <View style={ this.state.activeClip != i ?
                  styles.content_list : (this.state.buffering? styles.bufferAudioClip : styles.activeAudioClip)}>
                  {this._displayIcon(place.type)}
                  <View style={styles.content_two_layer_prio} key={i}>
                    <Text>{place.title}</Text>
                    <Text>{place.creator}</Text>
                  </View>
                  <View style={styles.content_two_layer }>
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