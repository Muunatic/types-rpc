import RPC = require('discord-rpc');
import activeWin = require('active-win');
const client = new RPC.Client({transport: "ipc"});
import { clientID } from './data/config';

const browsers = [
    "chrome",
    "firefox",
    "safari"
];

var playback = null
var author = null

function getOccurrence(array, value) {
    return array.filter((v) => (v === value)).length;
}

function setActivity() {
    let window_capture = activeWin.sync();

    try {
        let windowowner = window_capture.owner.name;
        let windowname = window_capture.title;

        if (browsers.includes(windowowner.toLowerCase().split('.')[0])) {
            if (windowname.includes('YouTube')) {
                let title = windowname.split('YouTube');
                if (title[0] !== playback) {
                    playback = title[0].slice(0, -2)
                    var splitEachChar = playback.split('');
                    var count = getOccurrence(splitEachChar, '-');
                    if (count <= 1) {
                        author = playback.split('-')[1];
                        playback = playback.split('-')[0];
                    }
                    if (playback === null) {
                        playback = author;
                        author = null;
                    }
                    updateSetActivity(playback, author);
                } else {
                    if (playback !== 'Idling') {
                        playback = 'Idling';
                        updateSetActivity(playback, null);
                    }
                }
            }
        }
    } catch(error) {
        console.error(error);
    }
}

function updateSetActivity(playback, author) {

    client.setActivity({
        details: playback,
        state: author,
        largeImageKey: 'large_image',
        largeImageText: 'Watching YouTube',
        smallImageKey: 'small_image',
        smallImageText: 'Discord',
        startTimestamp: Date.now(),
        instance: true
    });
}

client.on('ready', () => {
    setActivity();

    setInterval(() => {
        setActivity();
    }, 5000);
});

client.login({ clientId: clientID }).catch(console.error);