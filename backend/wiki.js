const Client = require('node-rest-client').Client;
const client = new Client();
const rp = require('request-promise');
const textToSpeechAPI = 'd5537ddec597441e982b802e882dfc44';
const fs = require('fs');


function createIntroAudio(loc) {
    let searchString = "https://en.wikipedia.org/wiki/" + loc;
    client.get(searchString,'', (data, res)=> {
        console.log(res);
        let searchString = "https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&explaintext=1&titles=" + loc;
        client.get(searchString, '', function (data, response) {
            var values = Object.values(data.query.pages);
            const extract = values[0].extract;
            console.log(extract.split('\n')[0]);
            var searchString = 'http://api.voicerss.org/?key=' + textToSpeechAPI + '&hl=en-us&src=' + extract;
            /*
            request.get(searchString).on('error', function(err) {
              console.log("Couldn't create intro file");
            }).pipe(fs.createWriteStream('./data/landmarks/' + place_id + '/intro.mp3'));
            */
       });
    })
    
}

createIntroAudio("Obama");