var soundbank = [
    ["sample0", 20,35,65,94,42],
    ["sample1", 2,3,5,43,24],
    ["sample2", 24,5,14,34,2],
    ["sample3", 1,15,13,34,23]    
]

var goal = ["goal", 24,6,20,34,24];
goal = soundbank[2];

var weightsVector = ["weights",1,1,1,1,1]; 

function distanceFrom0 (arr, weights) {
    var d = Math.sqrt(
        Math.pow(arr[1]-goal[1],2)*Math.pow(2,weights[1]) + 
        Math.pow(arr[2]-goal[2],2)*Math.pow(2,weights[2]) + 
        Math.pow(arr[3]-goal[3],2)*Math.pow(2,weights[3]) + 
        Math.pow(arr[4]-goal[4],2)*Math.pow(2,weights[4]) + 
        Math.pow(arr[5]-goal[5],2)*Math.pow(2,weights[5]));
    console.log("Distance to 0 from " + arr[0] + " is " + d + ".");
    return d;
}

var x = soundbank.sort(function(a,b){ return distanceFrom0(a,weightsVector) > distanceFrom0(b,weightsVector) ? 1 : -1; });
goal;
x;

distanceFrom0(soundbank[1],weightsVector);