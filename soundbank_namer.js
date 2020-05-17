function pad(number, length) {
    var my_string = '' + number;
    while (my_string.length < length) {
        my_string = '0' + my_string;
    }
    return my_string;
}

function list () {
    outlet (0, 
        pad(arguments[0],7) + 
        "p" + pad(arguments[1],5) +
        "i" + pad(arguments[2],2) +
        "a" + pad(arguments[3],2) +
        "d" + pad(arguments[4],2) +
        "n" + pad(arguments[5],2) +
        "s" + pad(arguments[6],2) +
        "h" + pad(arguments[7],2) +
        "m" + pad(arguments[8],2) +
        "_" + arguments[9]    
    );
}