import React from 'react';
import { StyleSheet, Text, View, TouchableWithoutFeedback, ScrollView, Button, TouchableOpacity, TextInput } from 'react-native';
import { Dimensions } from "react-native";
import { AntDesign } from '@expo/vector-icons';
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
    marginLeft: 7
  },
  content: {
    borderRadius: 15,
    width: width - 20,
    overflow: 'hidden',
    marginBottom: 15
  }, 

  content_header: {
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
  }
});

export default class DetailsView extends React.Component {

  constructor(props) {
    super(props);
    
    this.state = {
      loading: true,
      creatingRoute: this.props.creatingRoute,
      playingAudio: null,
      currentlyPlaying: null,
      currentLocation: null,
      activeClip: -1,
      routeList: this.props.routeList,
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
      ],
    }
    this.detailsURL = "http://hanneshertach.com:3001/api/getInfoLocationID";
    this._togglePlayback = this._togglePlayback.bind(this);
    this._toggleCreatorColor = this._toggleCreatorColor.bind(this);
    this._toggleCreatorFooter = this._toggleCreatorFooter.bind(this);

  }

  _loadLocationInfo = async () => {

    fetch("http://hanneshertach.com:3001/api/getInfoLocationID", {
      method:'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: this.props.location
      })
    }).then(response => response.json())
      .then((data) => {
        console.log(data);
        this.setState({
          currentLocation: data,
          clips: data.audios,
          tours: data.routes,
          loading: false
        });
      }).catch(err => {
        console.log(err);
      });
  }

  componentWillMount = () => {
    this._loadLocationInfo();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.creatingRoute) {
      return;
    }
    if (prevProps.location != this.props.location) {
      this._loadLocationInfo();
    }
  }

  _togglePlayback = async (filename) => {

    const playbackURL = "http://hanneshertach.com:3001/api/getAudioFile/" + filename;

    if (this.state.currentlyPlaying != null) {
      await this.state.currentlyPlaying.unload();
      this.setState({
        currentlyPlaying: null,
        activeClip: -1
      });
      
    } else {
      let player = new AudioPlayer(playbackURL);
      await player.initialize();
      await player.startPlaying();
      await this.setState({
        currentlyPlaying: player
      });
      console.log("Song started...");
    }

  };

  _toggleCreatorHeader = () => {
    if (this.state.creatingRoute) {
      return (<View style={{padding: 5, paddingTop: 15, paddingBottom: 15, backgroundColor:colors.creator.clr_primary, width:width, flexDirection:'row', alignContent:'center'}}>
        <TouchableOpacity onPress={this._toggleCreatorState}>
        <AntDesign name='closecircleo' size={25} color={colors.nearly_white}  />
        </TouchableOpacity>
        <Text style={{color: colors.nearly_white, fontSize: 18, paddingLeft: 10, flexGrow: 2, fontWeight: 'bold'}}> Route Creator</Text>
        <TouchableOpacity onPress={this.props.viewRouteList}><AntDesign name='menu-unfold' size={25} color={colors.nearly_white} /></TouchableOpacity>
      </View>)
    }
  }

  _toggleCreatorState = () => {
    this.props.toggleCreatingRoute();
    this.setState({
      creatingRoute: !this.state.creatingRoute,
    });
  }

  _toggleCreatorFooter = () => {
    if (!this.state.creatingRoute) {
      return (<View style={styles.content}>
        <View style={{
            backgroundColor: this._toggleCreatorColor('dark'),
            padding: 7,
            paddingLeft: 10,
            flexDirection: 'row'
            }}> 
          <Text style={styles.content_header_text}>Top tours:</Text>
        </View>
        {this.state.tours.map((tour, i) => (
          <TouchableWithoutFeedback onPress={() => {
            this.props.viewTour(tour._id);
          }} key={i}>
            <View style={styles.content_container}>
              <Text>{tour.Title}</Text>
              <Text>{tour.Artist}</Text>
            </View>
          </TouchableWithoutFeedback>
        ))}
        <TouchableOpacity onPress={this._toggleCreatorState}>
          <View style={styles.content_container}>
          <View style={{alignItems:'center', paddingTop:5, paddingBottom:5}}>
          <AntDesign name='pluscircleo' size={20} color={this._toggleCreatorColor('dark')} />
          </View>
          </View>
        </TouchableOpacity>

      </View>)
    } else {
      return (
        <TouchableOpacity onPress={this.props.uploadTour} style={{justifyContent: 'center', borderRadius:300, borderWidth: 1, borderColor: this._toggleCreatorColor('light')
        , alignItems: 'center', flexGrow:1, marginTop: 10}}>
          <AntDesign name='cloudupload' size={60} color={this._toggleCreatorColor('light')} />
        </TouchableOpacity>
      );

    }
  }

  _toggleCreatorColor = (color) => {
    if (color == 'dark') {
      return this.state.creatingRoute ? colors.creator.clr_primary : colors.clr_dark;
    } else if (color == 'primary') {
      return this.state.creatingRoute ? colors.creator.clr_light : colors.clr_primary;
    } else {
      return this.state.creatingRoute ? colors.nearly_white : colors.clr_light;
    }  
  }

  _renderTitle = () => {
    if (this.props.location != null) {
      return (<Text style={
        styles.title
      }>{
          this.props.location.name
        }</Text>);
    } else {
      return (
        <TextInput
        style={{height: 30, width:width/1.5, color: this._toggleCreatorColor('light')}}
        onChangeText={(title) => this.props.updateTourTitle(title)}
        placeholder='Tour Title'
        placeholderTextColor={this._toggleCreatorColor('light')}
        />
      );
    }
  }

  _generateClips = () => {
    let list_data = this.props.location == null ? this.props.routeList : this.state.clips;
    console.log("Data list: " + list_data);
    return (
      list_data.map((clip, i) => (
        <View style={{flexDirection: 'row'}} key={i}>
        <TouchableOpacity style={
          this.state.activeClip == i ?
          {padding: 10, borderColor: this._toggleCreatorColor('dark'), borderRightWidth: this.state.creatingRoute? 0: 1, 
            backgroundColor: this._toggleCreatorColor('light'), borderRadius: 5} :
          {padding: 10, borderColor: this._toggleCreatorColor('dark'), borderRightWidth: this.state.creatingRoute? 0: 1}
        } key={i} 
        onPress={() => {
          if (this.state.creatingRoute) {
            this.props.addToRouteList(clip);
          } else {
            this.setState({
              activeClip: i
            });                  
            this._togglePlayback(clip.FileName);
          }
        }}>
          <View style={{flexGrow: 1}}>
          <Text style={this.state.activeClip == i ? 
            {color: colors.nearly_white} : {}}>{clip.Title}</Text>
          <Text style={this.state.activeClip == i ? 
            {color: colors.nearly_white} : {}}>{clip.Artist}</Text>
          </View>
        </TouchableOpacity>
        </View>
      ))
    );
  }

  render() {

    if (this.state.loading) {
      return <Text>Loading...</Text>
    }

    return (
      <View style={{flex: 1, flexDirection: 'column', width: width}}>
        <TouchableWithoutFeedback onPress={this.props.closeFunc}>
          <View style={{backgroundColor: this._toggleCreatorColor('primary'), height: 17, alignSelf: 'stretch', alignItems: 'center'}}>
            <AntDesign name="caretdown" size={15} color={this._toggleCreatorColor('light')} />
          </View>
        </TouchableWithoutFeedback>

        {this._toggleCreatorHeader()}         

        <ScrollView style={{
            backgroundColor: this._toggleCreatorColor('primary'),
            paddingLeft: 10,
            paddingTop: 10
          }}>

          <View style={{
            backgroundColor: this._toggleCreatorColor('dark'),
            width: width - 20,
            padding: 5,
            paddingLeft: 7,
            borderRadius: 10,
            marginBottom: 15
          }}>

            {this._renderTitle()}
          </View>

          <View style={styles.content}>
            <View style={{
              backgroundColor: this._toggleCreatorColor('dark'),
              padding: 7,
              paddingLeft: 10,
              flexDirection: 'row'
              }}> 
              <Text style={styles.content_header_text}>Audio Clips</Text>
              <View style={{flex: 1, width: 1}}>
                {/* <AntDesign name="right" color={colors.clr_light} size={15} /> */}
              </View>
            </View>
            <ScrollView style={styles.content_container} horizontal={!this.state.creatingRoute}>
              {this._generateClips()}
              <TouchableOpacity onPress={() => this.props.openRecordView(this.props.location)} >
              <View style={{padding: 20, borderColor: this._toggleCreatorColor('dark'), borderRightWidth: this.state.creatingRoute? 0: 1,}}>
              <AntDesign name='pluscircleo' size={20} color={this._toggleCreatorColor('dark')} />
              </View>
              </TouchableOpacity>
            </ScrollView>
          </View>


          {this._toggleCreatorFooter()}
          
        </ScrollView>

      </View>
    )
  }

}