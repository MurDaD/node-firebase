let admin = require("firebase-admin");

// Fetch the service account key JSON file contents
let serviceAccount = require("./config.json");

class FBClient {

    constructor() {
        this.words = [];
    }

    /**
     * Initialize the app with a service account, granting admin privileges
     */
    init() {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            databaseURL: "https://innovecs-b193f.firebaseio.com"
        });
        return Promise.resolve();
    }

    /**
     * Get "bad" words from the database
     */
    fetchWords() {
        admin.database().ref('/words').on('child_added', (snapshot) => {
            this.words.push(snapshot.val());
        });
    }

    /**
     * Returns "bad" words
     * @returns {Array}
     */
    getWords() {
        return this.words;
    }

    /**
     * Filtering bad words, returns message with stars instead of "bad" words
     * @param string
     * @param badWords
     * @returns {XML|*|void}
     */
    wordFilter(string, badWords) {
        // Regular expression for all bad words, non-case sensitive
        let regex = new RegExp('\\b(' + badWords.join('|') + ')\\b', 'gi');
        return string.replace(regex, function (match) {
            // Replace each letter with a star
            let stars = '';
            for (let i = 0; i < match.length; i++) {
                stars += '*';
            }
            return stars;
        });

    }
}

let messenger = new FBClient();
// Init app
messenger.init();
// Ask FB for words
messenger.fetchWords();
setTimeout(() => {
    console.dir(messenger.getWords());
    console.log();
    // Wait for the words to be fetched
    admin.database().ref('/messages').on('child_added', (snapshot) => {
        // Ask fro words (it could be updated?)
        let words = messenger.getWords();
        console.log(snapshot.val());
        let message = messenger.wordFilter(snapshot.val(), words);
        console.log(message);
        console.log();
    });
}, 3000);
