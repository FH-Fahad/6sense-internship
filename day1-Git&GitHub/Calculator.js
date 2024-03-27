
const add = (a, b) => {
    console.log('Adding', a, 'and', b);
    // Returning the addition
    return a + b;
}

const subtract = (a, b) => {
    console.log('Subtracting', b, 'from', a);
    // Returning the subtraction
    return a - b;
}

// Exporting the functions
module.exports = {
    add,
    subtract
}