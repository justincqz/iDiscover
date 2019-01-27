import { Audio } from 'expo';

export default class AudioPlayer {

  constructor(url) {
    this.url = url;
    this.audio = null;
    
  }

  initialize = () => new Promise(async (resolve, reject) => {

    this.audio = new Audio.Sound();
    try {
      await this.audio.loadAsync({uri: this.url});
    } catch (err) {
      reject(err);
    }

    resolve();

  });

  startPlaying = () => new Promise(async (resolve, reject) => {

    try {
      await this.audio.playAsync();
    } catch(err) {
      reject(err);
    }

    resolve();

  });

  startPlayingWithCallback = (callback) => new Promise(async (resolve, reject) => {
    try {
      await this.audio.setOnPlaybackStatusUpdate(callback);
      await this.audio.playAsync();
    } catch(err) {
      reject(err);
    }

    resolve();
  });

  stopPlaying = () => new Promise(async (resolve, reject) => {
    try {
      await this.audio.pauseAsync();
    } catch(err) {
      reject(err);
    }

    resolve();

  });

  unload = () => new Promise(async (resolve, reject) => {

    try {
      await this.audio.stopAsync();
      await this.audio.unloadAsync();
    } catch (err) {
      reject(err);
    }

    resolve();

  });



}