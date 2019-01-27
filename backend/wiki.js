const mongoose = require("mongoose");
const Client = require('node-rest-client').Client;
const client = new Client();
const rp = require('request-promise');
const textToSpeechAPI = 'd5537ddec597441e982b802e882dfc44';
const fs = require('fs');
const request = require('request');
const moment=require('moment');
const util = require('util');

const Audio = require('./schemas/audio')


'use strict';

function createIntroAudio(locationName, locationID) {
   
    let searchString = "https://en.wikipedia.org/w/api.php?format=json&action=query&redirects=true&prop=extracts&explaintext=1&titles=" + locationName;
    const audio = new Audio();
    audio.Date=moment().unix();
    audio.LocationID=locationID;
    audio.Artist="Wikipedia";
    audio.Title=locationName + " Introduction"

    client.get(searchString, '', async function (data, res) {
        var values = Object.values(data.query.pages);
        const extract = values[0].extract.split('\n')[0];
        convert(extract, audio).catch(console.error);
    });    
}

async function convert(text, audio) {
    process.env.GOOGLE_APPLICATION_CREDENTIALS = "./Text to Audio-9a003f9a486b.json"
    const textToSpeech = require('@google-cloud/text-to-speech');
    const clientta = new textToSpeech.TextToSpeechClient();
    const request = {
        input: {text: text},
        // Select the language and SSML Voice Gender (optional)
        voice: {languageCode: 'en-US', ssmlGender: 'NEUTRAL'},
        // Select the type of audio encoding
        audioConfig: {audioEncoding: 'MP3'},
    };
    const [response] = await clientta.synthesizeSpeech(request);
    // Write the binary audio content to a local file
    const writeFile = util.promisify(fs.writeFile);
    audio.save();
    await writeFile('output.mp3', response.audioContent, 'binary');
    console.log('Audio content written to file: output.mp3');
}

createIntroAudio("Obama");
