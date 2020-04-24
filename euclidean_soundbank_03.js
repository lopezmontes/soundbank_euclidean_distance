// EUCLIDEAN DISTANCES OF A BANK OF SOUNDFILES TO A GOAL

const path = require('path');
const MaxAPI = require('max-api');

// This will be printed directly to the Max console
MaxAPI.post(`Loaded the ${path.basename(__filename)} script`);


// conversion for parameter 1 (duration in milliseconds - range [0.5, 9999999])
var milliseconds2normalized = n => (Math.log10(n) / Math.log10(2) + 1) / 24.25349652;
var normalized2milliseconds = p => Math.pow(2, 24.25349652 * p - 1);

// conversion for parameter 2 (main pitch in midicents (max) - range [15, 13700], limit: ca. 20 - 22050 Hz)
var midicents2normalized = n => (n - 15) / 13685;
var normalized2midicents = m => m * 13685 + 15;


// soundbank
var sound1 = "1000579p08456i78a54d45n13s48h68m53-multiphonic23B.wav"
var sound2 = "0005035p06900i08a43d23n67s45h58m45-multiphonic2F.wav"
var sound3 = "0030556p02350i95a78d78n02s86h35m93-electrobomb.wav"
var sound4 = "0000024p10345i15a01d00n87s06h03m34-griiiitsch.wav"
var sound5 = "0002500p06000i50a50d50n50s50h50m50.wav"

function getSoundfileParameters (filename) {
    return [
        parseInt(filename.substring(0, 7)),
        parseInt(filename.substring(8, 13)),
        parseInt(filename.substring(14, 16)),
        parseInt(filename.substring(17, 19)),
        parseInt(filename.substring(20, 22)),
        parseInt(filename.substring(23, 25)),
        parseInt(filename.substring(26, 28)),
        parseInt(filename.substring(29, 31)),
        parseInt(filename.substring(32, 34)),
        filename.substring(35),
        filename
    ];
};

var soundbank = [
    getSoundfileParameters(sound1),
    getSoundfileParameters(sound2),
    getSoundfileParameters(sound3),
    getSoundfileParameters(sound4),
    getSoundfileParameters(sound5)
];

MaxAPI.post(soundbank);

// default goal
var goal = [2500,6000,50,50,50,50,50,50,50];

// default weights
var weights = [1,1,1,1,1,1,1,1,1]; 

function distanceFromGoal (arr, weights) {
    var d = Math.sqrt(
        Math.pow(milliseconds2normalized(arr[0])-milliseconds2normalized(goal[0]),2) * Math.pow(weights[0], 3) + 
        Math.pow(midicents2normalized(arr[1]-goal[1]), 2) * Math.pow(weights[1], 3) + 
        Math.pow((arr[2]-goal[2]) * 0.01, 2) * Math.pow(weights[2], 3) + 
        Math.pow((arr[3]-goal[3]) * 0.01, 2) * Math.pow(weights[3], 3) + 
        Math.pow((arr[4]-goal[4]) * 0.01, 2) * Math.pow(weights[4], 3) + 
        Math.pow((arr[5]-goal[5]) * 0.01, 2) * Math.pow(weights[5], 3) + 
        Math.pow((arr[6]-goal[6]) * 0.01, 2) * Math.pow(weights[6], 3) + 
        Math.pow((arr[7]-goal[7]) * 0.01, 2) * Math.pow(weights[7], 3) + 
        Math.pow((arr[8]-goal[8]) * 0.01, 2) * Math.pow(weights[8], 3));
    MaxAPI.post("Distance of " + arr[9] + " is " + d + ".");
    return d;
}

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
    MaxAPI.post("New goal vector:\n" + goal);
});

// gets weghts vector, with relative importance of features
MaxAPI.addHandler("weightsVector", (...args) => {
    // make a string from params array
    var receivedWeights = [];
    for (var i = 0; i < args.length; i++) {
        receivedWeights.push(args[i]);
    }
    weights = receivedWeights;
    MaxAPI.post("New weights vector:\n" + weights);
});

// calculates euclidean distances of available sounds and populate popup menu in Max
MaxAPI.addHandler("reorderSoundbank", () => {
    // make a string from params array
    MaxAPI.outlet("clear");
    var orderedSoundbank = soundbank.sort(function(a,b){ return distanceFromGoal(a,weights) > distanceFromGoal(b,weights) ? 1 : -1; });
    var orderedSoundBankLength = orderedSoundbank.length;
    for (var i = 0; i < orderedSoundBankLength; i++) {
        MaxAPI.outlet([
            "append", orderedSoundbank[i][10]]);
    } 
});