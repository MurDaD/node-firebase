let admin = require("firebase-admin");

// Fetch the service account key JSON file contents
let serviceAccount = require("./config.json");

// Initialize the app with a service account, granting admin privileges
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://innovecs-b193f.firebaseio.com"
});

admin.database().ref('/messages').on('child_added', function(postSnapshot) {
    console.dir(postSnapshot);
});