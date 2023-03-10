const { spawn } = require('child_process');
const { Client } = require('node-osc');
const fetch = require('node-fetch');

spawn('C:/Program Files/VideoLAN/VLC/vlc.exe', [ '--http-password', 'f' ]);
const client = new Client('127.0.0.1', 9000);

let text = '';
let prevText = '';
let timeout;

setInterval(() => {
    fetch('http://:f@127.0.0.1:8080/requests/status.json').then(data => data.json()).then(data => {
        if(!data.information){
            text = '';
        } else if(data.state === 'playing'){
            if(data.information.category.meta.title){
                text = '♫ ' + data.information.category.meta.title + ' - ' + data.information.category.meta.artist;
            } else if(data.information.category.meta.filename){
                let name = data.information.category.meta.filename.split('.');
                name.pop();
                name = name.join('.');

                text = '♫ ' + name;
            } else{
                text = '';
            }
        } else if(data.state === 'paused'){
            if(data.information.category.meta.title){
                text = '♫ ' + data.information.category.meta.title + ' - ' + data.information.category.meta.artist;
            } else if(data.information.category.meta.filename){
                let name = data.information.category.meta.filename.split('.');
                name.pop();
                name = name.join('.');

                text = '♫ ' + name;
            } else{
                text = '';
            }
        } else{
            text = '';
        }

        if(text !== prevText){
            clearInterval(timeout);
            prevText = text;

            console.log(text);
            client.send('/chatbox/input', [ text, true ], () => {});

            timeout = setInterval(() => {
                console.log('Refreshing VRChat ChatBox');
                client.send('/chatbox/input', [ text, true ], () => {});
            }, 10000);

            if(!data.information.category.meta.title)
                console.log('VLC Cannot find files metadata, we will just display the filename.')
        }
    })
}, 1000);
