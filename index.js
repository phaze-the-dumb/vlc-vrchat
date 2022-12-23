const { spawn } = require('child_process');
const { Client } = require('node-osc');
const fetch = require('node-fetch');

spawn('vlc', [ '--http-password', 'f' ]);
const client = new Client('127.0.0.1', 9000);

setInterval(() => {
    fetch('http://:f@127.0.0.1:8080/requests/status.json').then(data => data.json()).then(data => {
        if(data.state === 'playing'){
            client.send('/chatbox/input', [ '♫ ' + data.information.category.meta.title + ' - ' + data.information.category.meta.artist, true ], () => {});
        } else if(data.state === 'paused'){
            client.send('/chatbox/input', [ '♫ ' + data.information.category.meta.title + ' - ' + data.information.category.meta.artist, true ], () => {});
        } else{
            client.send('/chatbox/input', [ '', true ], () => {});
        }
    })
}, 10000);