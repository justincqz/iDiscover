import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Audio, FileSystem } from 'expo';
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
      isRecording: false
    };

    this.recording = null;
    this.FILE_SEND_LOC = null;

  }

  async componentWillMount() {
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

    if (this.state.isRecording) {
      this.recording = new Audio.Recording();

      await this.recording.prepareToRecordAsync(RECORDING_OPTIONS_PRESET_LOW_QUALITY);
      await this.recording.startAsync();

    } else {

      await this.recording.stopAndUnloadAsync();

      const details = await FileSystem.getInfoAsync(this.recording.getURI());
      
      const compileRecording = new FormData();
        compileRecording.append('file', {
          uri: details.uri,
          name: 'name-' + details.modificationTime,
          type: 'audio/m4a'
      });
      
      // POST request code
      // fetch(this.FILE_SEND_LOC, {
      //   headers: {
      //     // Put some place data, tour data
      //     'Content-Type': 'multipart/form-data'
      //   },
      //   method: 'POST',
      //   body: compileRecording
      // }).then(console.log("Record success.")).catch(console.log("Failed to send record."));

      await FileSystem.deleteAsync(this.recording.getURI());
    }

    this.setState((prev) => ({
      isRecording: !prev.isRecording
    }))
  };

  render() {

    if (this.state.loading) {
      return (<Text>Loading</Text>);
    } 

    return (
      <View style={{ flex: 1, justifyContent: "center", backgroundColor: colors.creator.clr_dark }}>
        <View style={{
          alignSelf:"center",
          marginTop: 20,
          fontSize: 50
        }}>
          <Text>Record new</Text>
        </View>
        <View style={{
          alignSelf: "center"
        }}>
          <TouchableOpacity onPress={this._toggleRecording}>
            <View style={{
              marginTop: 20,
              padding: 5,
              borderRadius: 500,
              borderStyle: 'solid',
              borderColor: colors.creator.clr_light,
              borderWidth: 10,
              backgroundColor: this.state.recording ? colors.creator.clr_dark : colors.creator.clr_primary,
            }}>
            <MaterialIcons name={this.state.recording ? 'mic' : 'mic-none'} size={200} color={colors.creator.clr_light} />
            </View>
          </TouchableOpacity>
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
    numberOfChannels: 1,
    bitRate: 96400,
    linearPCMBitDepth: 16,
    linearPCMIsBigEndian: false,
    linearPCMIsFloat: false,
  },
};
