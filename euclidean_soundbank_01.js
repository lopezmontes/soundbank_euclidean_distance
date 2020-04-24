// EUCLIDEAN DISTANCES OF A BANK OF SOUNDFILES TO A GOAL

const path = require('path');
const MaxAPI = require('max-api');

// This will be printed directly to the Max console
MaxAPI.post(`Loaded the ${path.basename(__filename)} script`);


// conversion for parameter 1 (duration in milliseconds)
var milliseconds2normalized = n => (Math.log10(n) / Math.log10(2) + 1) / 24.25349652;
var normalized2milliseconds = p => Math.pow(2, 24.25349652 * p - 1);

// soundbank
var sound1 = "1000579p14456i78a54d45n13s48h68m53-multiphonic23B"
var sound2 = "0005035p06900i08a43d23n67s45h58m45-multiphonic2F"
var sound3 = "0030556p02350i95a78d78n02s86h35m93-electrobomb"
var sound4 = "0000024p24345i15a01d00n87s06h03m34-griiiitsch"

function getSoundfileParameters (filename) {
    return [
        milliseconds2normalized(parseInt(filename.substring(0, 7))),
        parseInt(filename.substring(8, 13))*0.00001,
        parseInt(filename.substring(14, 16))*0.01,
        parseInt(filename.substring(17, 19))*0.01,
        parseInt(filename.substring(20, 22))*0.01,
        parseInt(filename.substring(23, 25))*0.01,
        parseInt(filename.substring(26, 28))*0.01,
        parseInt(filename.substring(29, 31))*0.01,
        parseInt(filename.substring(32, 34))*0.01,
        filename.substring(35),
        filename
    ];
};

var soundbank = [
    getSoundfileParameters(sound1),
    getSoundfileParameters(sound2),
    getSoundfileParameters(sound3),
    getSoundfileParameters(sound4)
];

// default goal
var goal = [0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5];

// default weights
var weightsVector = [1,1,1,1,1,1,1,1,1]; 

function distanceFromGoal (arr, weights) {
    var euclideanDist = 0;
    for (var p = 0; p < 9; p++) {
        euclideanDist += Math.pow(arr[p]-goal[p],2)*Math.pow(weights[p],3)
    };
    MaxAPI.post("Distance of " + arr[9] + " is " + euclideanDist + ".");
    return euclideanDist;
}

var x = soundbank.sort(function(a,b){ return distanceFromGoal(a,weightsVector) > distanceFromGoal(b,weightsVector) ? 1 : -1; });
goal;
x;

// MAX COMMUNICATION

MaxAPI.addHandler('minVoices', (integ) => {
    phenMinPolyphony = integ;
    MaxAPI.post("Phenotype minimal polyphony: " + phenMinPolyphony + " voices");
});

// gets goal vector
MaxAPI.addHandler("goalVector", (...args) => {
    // make a string from params array
    var receivedGoal = [];
    for (var i = 0; i < args.length; i++) {
        receivedGoal.push(args[i]);
    }
    goal = receivedGoal;
    MaxAPI.post("Recibido en node:\n" + receivedGoal);
});

// gets weghts vector, with relative importance of features
MaxAPI.addHandler("weightsVector", (...args) => {
    // make a string from params array
    var receivedWeights = [];
    for (var i = 0; i < args.length; i++) {
        receivedWeights.push(args[i]);
    }
    weights = receivedWeights;
    MaxAPI.post("Recibido en node:\n" + receivedWeights);
    MaxAPI.outlet("clear");
    MaxAPI.outletBang;
    MaxAPI.outlet([
        "append", "1000579p14456i78a54d45n13s48h68m53-multiphonic23B.wav"]);
    MaxAPI.outlet([
        "append", "0030556p02350i95a78d78n02s86h35m93-multiphsdfkjgkldf3B.wav"]);
});

// calculates euclidean distances of available sounds and populate popup menu in Max
MaxAPI.addHandler("reorderSoundbank", () => {
    // make a string from params array
    var x = soundbank.sort(function(a,b){ return distanceFromGoal(a,weightsVector) > distanceFromGoal(b,weightsVector) ? 1 : -1; });

    
    MaxAPI.outlet("clear");
    MaxAPI.outletBang;
    MaxAPI.outlet([
        "append", "1000579p14456i78a54d45n13s48h68m53-multiphonic23B.wav"]);
    MaxAPI.outlet([
        "append", "0030556p02350i95a78d78n02s86h35m93-multiphsdfkjgkldf3B.wav"]);
});