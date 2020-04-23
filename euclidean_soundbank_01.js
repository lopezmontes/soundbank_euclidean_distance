// EUCLIDEAN DISTANCES OF A BANK OF SOUNDFILES TO A GOAL

const path = require('path');
const Max = require('max-api');

// This will be printed directly to the Max console
Max.post(`Loaded the ${path.basename(__filename)} script`);


// conversion for parameter 1 (duration in milliseconds)
var milliseconds2normalized = n => (Math.log10(n) / Math.log10(2) + 1) / 24.25349652;
var normalized2milliseconds = p => Math.pow(2, 24.25349652 * p - 1);

var sound1 = "1000579p14456i78a54d45n13s48h68m53-multiphonic23B"
var sound2 = "0005035p06900i08a43d23n67s45h58m45-multiphonic2F"
var sound3 = "0030556p02350i95a78d78n02s86h35m93-electrobomb"
var sound4 = "0000024p24345i15a01d00n87s06h03m34-griiiitsch"
function soundInfo (name) {
    return [
        milliseconds2normalized(parseInt(name.substring(0, 7))),
        parseInt(name.substring(8, 13))*0.00001,
        parseInt(name.substring(14, 16))*0.01,
        parseInt(name.substring(17, 19))*0.01,
        parseInt(name.substring(20, 22))*0.01,
        parseInt(name.substring(23, 25))*0.01,
        parseInt(name.substring(26, 28))*0.01,
        parseInt(name.substring(29, 31))*0.01,
        parseInt(name.substring(32, 34))*0.01,
        name.substring(35)    ];
};



var soundbankfoo = [
    ["sample0", 20,35,65,94,42],
    ["sample1", 2,3,5,43,24],
    ["sample2", 24,5,14,34,2],
    ["sample3", 1,15,13,34,23]    
];

var soundbank = [
    soundInfo(sound1),
    soundInfo(sound2),
    soundInfo(sound3),
    soundInfo(sound4)
];

soundbank;

goal = soundbank[2];
var goal = [0,0,0,0,0,0,0,0,0];
var goal = [0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5];
var goal = [0,0,0,.99,0,0,0,0,0];

var weightsVector = [1,1,1,1,1,1,1,1,1]; 
var weightsVector = [0,0,1,1,1,1,1,1,1]; 
var weightsVector = [0,0,1,1,0,0,0,0,0]; 


function distanceFromGoal (arr, weights) {
    var d = Math.sqrt(
        Math.pow(arr[0]-goal[0],2)*Math.pow(weights[0],3) + 
        Math.pow(arr[1]-goal[1],2)*Math.pow(weights[1],3) + 
        Math.pow(arr[2]-goal[2],2)*Math.pow(weights[2],3) + 
        Math.pow(arr[3]-goal[3],2)*Math.pow(weights[3],3) + 
        Math.pow(arr[4]-goal[4],2)*Math.pow(weights[4],3) + 
        Math.pow(arr[5]-goal[5],2)*Math.pow(weights[5],3) + 
        Math.pow(arr[6]-goal[6],2)*Math.pow(weights[6],3) + 
        Math.pow(arr[7]-goal[7],2)*Math.pow(weights[7],3) + 
        Math.pow(arr[8]-goal[8],2)*Math.pow(weights[8],3));
    console.log("Distance of " + arr[9] + " is " + d + ".");
    return d;
}

var x = soundbank.sort(function(a,b){ return distanceFromGoal(a,weightsVector) > distanceFromGoal(b,weightsVector) ? 1 : -1; });
goal;
x;

