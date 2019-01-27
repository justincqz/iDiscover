import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { Audio, FileSystem, Permissions } from 'expo';
import {MaterialIcons} from '@expo/vector-icons'; 

const styles = StyleSheet.create({
  record_icon: {

  },
});
export default class CreateView extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      isRecording: false,
      title: '',
    };

    this.recording;
    this.FILE_SEND_LOC = 'http://hanneshertach.com:3001/api/uploadAudioFile';
    this.details;

    this.location = this.props.navigation.getParam("location");

  }

  async componentWillMount() {
    let { status } = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
    if (status !== 'granted') {
      this.setState({
        error: 'Permission to access location was denied',
      });
      return;
    }
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      allowsRecordingIOS: true,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_MIX_WITH_OTHERS,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
    });
    this.setState({
      loading: false
    });
  }

  _toggleRecording = async () => {
    console.log("Button clicked!");
    if (!this.state.isRecording) {
      console.log("started recording");
      this.recording = new Audio.Recording();

      await this.recording.prepareToRecordAsync(RECORDING_OPTIONS_PRESET_LOW_QUALITY);
      await this.recording.startAsync();

    } else {
      console.log("stopped recording");
      await this.recording.stopAndUnloadAsync();
      this.details = await FileSystem.getInfoAsync(this.recording.getURI());
      console.log("Justins uri: " + this.recording.getURI());
    }

    this.setState((prev) => ({
      isRecording: !prev.isRecording
    }));
  };

  _playback = async () => {
    console.log(this.location);
  }

  _uploadRecording = async () => {
    console.log("attepting upload");
    console.log(this.details);
    if(this.details != null) {
      const compileRecording = new FormData();
        compileRecording.append('track', {
          uri: this.details.uri,
          name: 'name-' + this.details.modificationTime,
          type: 'audio/m4a'
        });
        
        // POST request code
        fetch('http://hanneshertach.com:3001/api/uploadAudioFile', {
          headers: {
            artist: 'Hitachi',
            email: 'hitachi@email.com',
            placeid: this.location.placeID,
            title: this.state.title,
            'Content-Type': 'multipart/form-data'
          },
          method: 'POST',
          body: compileRecording,
          
        }).then(res => console.log("Record success, \n" + this.details + "\n Reponse: " + res))
        .catch(err => console.log("Failed to send record, error: " + err));
    
        await FileSystem.deleteAsync(this.recording.getURI());
    } else {
      console.log("no details found, upload failed");
    }
  }


  render() {

    if (this.state.loading) {
      return (<Text>Loading</Text>);
    } 

    return (
      <View style={{ flex: 1, flexDirection: 'column', backgroundColor: colors.creator.clr_primary, justifyContent: 'flex-start' }}>
        <View style={{
          alignSelf: "center"
        }}>
          <TouchableOpacity onPress={this._toggleRecording}>
            <View style={{
              marginTop: 90,
              padding: 5,
              borderRadius: 500,
              borderStyle: 'solid',
              borderColor: this.state.isRecording ? colors.creator.clr_light : colors.creator.clr_dark,
              borderWidth: 10,
              backgroundColor: this.state.isRecording ? colors.creator.clr_light : colors.creator.clr_dark,
            }}>
            <MaterialIcons name={this.state.isRecording ? 'mic' : 'mic-none'} size={200} color={this.state.isRecording ? colors.creator.clr_dark :colors.creator.clr_light} />
            </View>
          </TouchableOpacity>
          <View style={{borderRadius: 15, backgroundColor: colors.creator.clr_light, marginTop: 30, padding:5,}}>
            <TextInput
              style={{height: 40, fontSize: 20, color:colors.nearly_white, textAlign: 'center'}}
              placeholder='Enter Title'
              placeholderTextColor={colors.creator.clr_primary}
              onChangeText={(text) => this.setState({title:text})}
              value={this.state.title}
            />
          </View>

          <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
          <TouchableOpacity style={{borderRadius:100, padding: 5, backgroundColor:colors.creator.clr_light}} onPress={this._playback}>
          <MaterialIcons name='play-arrow' size={80} color={colors.nearly_white} />
          </TouchableOpacity>
          <TouchableOpacity style={{borderRadius:100, padding: 5, backgroundColor:colors.creator.clr_light}} onPress={this._uploadRecording}>
          <MaterialIcons name='file-upload' size={80} color={colors.nearly_white} />
          </TouchableOpacity>
          </View>

        </View>
      </View>
    );
  }

}

const RECORDING_OPTIONS_PRESET_LOW_QUALITY = {
  android: {
    extension: '.m4a',
    outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
    audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_HE_AAC,
    sampleRate: 44100,
    numberOfChannels: 2,
    bitRate: 128000,
  },
  ios: {
    extension: '.m4a',
    outputFormat: Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_MPEG4AAC,
    audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_MEDIUM,
    sampleRate: 44100,
    numberOfChannels: 2,
    bitRate: 128000,
    linearPCMBitDepth: 16,
    linearPCMIsBigEndian: false,
    linearPCMIsFloat: false,
  },
};
