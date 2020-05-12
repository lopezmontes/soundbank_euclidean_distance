// EUCLIDEAN DISTANCES OF A BANK OF SOUNDFILES TO A GOAL

const path = require('path');
// Max interface
const MaxAPI = require('max-api');
// files handling
const fs = require('fs');


// This will be printed directly to the Max console
MaxAPI.post(`Loaded the ${path.basename(__filename)} script`);

// conversion for parameter 1 (duration in milliseconds - range [0.5, 9999999])
var milliseconds2normalized = n => (Math.log10(n) / Math.log10(2) + 1) / 24.25349652;
var normalized2milliseconds = p => Math.pow(2, 24.25349652 * p - 1);

// conversion for parameter 2 (main pitch in midicents (max) - range [15, 13700], limit: ca. 20 - 22050 Hz)
var midicents2normalized = n => (n - 15) / 13685;
var normalized2midicents = m => m * 13685 + 15;

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

var eligibleSounds = [];
var parametrizedEligibleSounds = [];

function extractSoundbankParameters (soundfilenames) {
    var parametrizedSoundfiles = [];
    var totalSounds = soundfilenames.length;
    for (var i = 0; i < totalSounds; i++) {
        parametrizedSoundfiles[i] = getSoundfileParameters(soundfilenames[i]);
    }
    return parametrizedSoundfiles;
}

MaxAPI.addHandler("printActiveSoundbank", () => {
    MaxAPI.post(parametrizedEligibleSounds);
});

// SOUNDBANK containing all sounds organized in tag folders
var soundbank_all_data = JSON.parse(fs.readFileSync('soundbank_data.json'));


/// AUS FUNCTIONS

// returns the intersection of an array of sets
function intersectSets (soundSubsetsArray) {
    if (soundSubsetsArray.length == 1) {
        return soundSubsetsArray[0];
    } else {
        var intersectionSet = soundSubsetsArray[0].filter(value => soundSubsetsArray[1].includes(value));
        var numberOfPairs = soundSubsetsArray.length - 1;
        for (var i = 1; i < numberOfPairs; i++) {
            intersectionSet = intersectionSet.filter(value => soundSubsetsArray[i+1].includes(value))
        }
        return intersectionSet;
    }
};

// aux func to remove duplicates
Array.prototype.unique = function() {
    var a = this.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(a[i] === a[j])
                a.splice(j--, 1);
        }
    }

    return a;
};

// returns the union of an array of sets
function unionOfSets (soundSubsetsArray) {
    if (soundSubsetsArray.length == 1) {
        return soundSubsetsArray[0];
    } else {
        var unionSet = soundSubsetsArray[0].concat(soundSubsetsArray[1]).unique();
        var numberOfPairs = soundSubsetsArray.length - 1;
        for (var i = 1; i < numberOfPairs; i++) {
            unionSet = unionSet.concat(soundSubsetsArray[i+1]).unique();
        }
        return unionSet;
    }
};

/* 
var setA = ["a", "f", "g", "h"];
var setB = ["b", "f", "a", "h"];
var setC = ["a", "b", "k", "f"];
var setD = ["a", "b", "k", "g"]; 
*/
// intersectSets([setA, setB, setC, setD]);
// unionOfSets([setA, setB, setC, setD]);

// MaxAPI.post(soundbank);

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

// gets goal vector
MaxAPI.addHandler("goalVector", (...args) => {
    // make a string from params array
    var receivedGoal = [];
    for (var i = 0; i < args.length; i++) {
        receivedGoal.push(args[i]);
    }
    goal = receivedGoal;
    // MaxAPI.post("New goal vector:\n" + goal);
});

// gets weghts vector, with relative importance of features
MaxAPI.addHandler("weightsVector", (...args) => {
    // make a string from params array
    var receivedWeights = [];
    for (var i = 0; i < args.length; i++) {
        receivedWeights.push(args[i]);
    }
    weights = receivedWeights;
    // MaxAPI.post("New weights vector:\n" + weights);
});


var soundbank = [
    getSoundfileParameters("1000579p08456i78a54d45n13s48h68m53-multiphonic23B.wav"),
    getSoundfileParameters("0005035p06900i08a43d23n67s45h58m45-multiphonic2F.wav"),
    getSoundfileParameters("0030556p02350i95a78d78n02s86h35m93-electrobomb.wav"),
    getSoundfileParameters("0000024p10345i15a01d00n87s06h03m34-griiiitsch.wav"),
    getSoundfileParameters("0002500p06000i50a50d50n50s50h50m50.wav"),
    getSoundfileParameters("0007135p06389i33a13d04n82s27h09m67-noisygliss.wav"),
    getSoundfileParameters("0017934p12200i52a83d09n74s87h62m38-quasiclassicgranucliks.wav"),
    getSoundfileParameters("0001232p06911i55a33d63n53s72h39m60-foofile1"),
    getSoundfileParameters("0000005p04325i68a40d77n84s65h41m24-foofile2"),
    getSoundfileParameters("0022674p11760i88a76d88n92s94h89m90-foofile3"),
    getSoundfileParameters("0000006p02493i16a10d10n08s07h06m03-foofile4"),
    getSoundfileParameters("1053650p09928i61a53d42n31s22h12m03-foofile5"),
    getSoundfileParameters("0000001p01631i19a33d42n56s67h76m84-foofile6"),
    getSoundfileParameters("0011697p03355i42a76d59n38s53h63m70-foofile7"),
    getSoundfileParameters("1053650p07665i18a85d45n84s49h12m35-foofile8"),
    getSoundfileParameters("0000812p07250i11a69d09n12s36h07m40-tabuenca-peqgliss.wav")
];

MaxAPI.post(soundbank);

// calculates euclidean distances of available sounds and populate popup menu in Max
MaxAPI.addHandler("reorderSoundbank", () => {
    // make a string from params array
    MaxAPI.outlet("clear");
    var orderedSoundbank = parametrizedEligibleSounds.sort(function(a,b){ return distanceFromGoal(a,weights) > distanceFromGoal(b,weights) ? 1 : -1; });
    var orderedSoundBankLength = orderedSoundbank.length;
    for (var i = 0; i < orderedSoundBankLength; i++) {
        MaxAPI.outlet([
            "append", orderedSoundbank[i][10] + ".wav"]);
    } 
});

// gets an array selecting which soundbanks will be used
// Warning: limited to 30 items in Max due to conversion into integers. It will need more of this to expand the library to more than 30 soundbanks
MaxAPI.addHandler("chosenSoundbanks", (encodedBinaryList) => {
    var totalEligibleSubsets = soundbank_all_data.soundbankStructure.length;
    var activeSubsets = (encodedBinaryList).toString(2).split('').reverse().join('');
    // truncate the binary flags to adjust to the maximum of subsets
    activeSubsets = activeSubsets.slice(0, totalEligibleSubsets);
    if (parseInt(activeSubsets) == 0 || encodedBinaryList == 0) {
        eligibleSounds = [];
        parametrizedEligibleSounds = extractSoundbankParameters(eligibleSounds);
        return;
    }
    MaxAPI.post("Chosen subsets:" + activeSubsets);
    var i = 0;
    var namesOfActiveSubsets = [];
    MaxAPI.post("folders eligible are " + totalEligibleSubsets);
    while (i < totalEligibleSubsets && (activeSubsets[i] == 1 || activeSubsets[i] == 0)) {
        if (activeSubsets[i] == 1) {
            // MaxAPI.post(soundbank_all_data.indexedSubsets[soundbank_all_data.soundbankStructure[i]]);
            MaxAPI.post(soundbank_all_data.soundbankStructure[i]);
            namesOfActiveSubsets.push(soundbank_all_data.indexedSubsets[soundbank_all_data.soundbankStructure[i]]);
        }
        i++;
    }
    MaxAPI.post(namesOfActiveSubsets);
    eligibleSounds = unionOfSets(namesOfActiveSubsets);
    parametrizedEligibleSounds = extractSoundbankParameters(eligibleSounds);
    MaxAPI.post("ready: " + parametrizedEligibleSounds);
});

/* MaxAPI.addHandler("collectSubsets", () =>  {
    var i = 0;
    var namesOfActiveSubsets = [];
    while (activeSubsets[i] == 1 || activeSubsets[i] == 0) {
        if (activeSubsets[i] == 1) {
            // MaxAPI.post(soundbank_all_data.indexedSubsets[soundbank_all_data.soundbankStructure[i]]);
            MaxAPI.post(soundbank_all_data.soundbankStructure[i]);
            namesOfActiveSubsets.push(soundbank_all_data.soundbankStructure[i]);
        }
        i++;
    }
    MaxAPI.post(namesOfActiveSubsets);
}); */