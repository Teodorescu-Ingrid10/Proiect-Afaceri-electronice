// var x = '5';
// let y = 6;
// const z = 7

// console.log(x, y, z)

// x = 6;
// console.log(x)
// y = 7;
// console.log(y)
// z = 8;
// console.log(z)

function testVariables(param){
    console.log(x)
    if (param == true){
        var x = 5;
        let y = 6;
        const z = 7;
    }
    console.log(x)
    console.log(y)
    console.log(z)
}

const testVariables2 = (param) => {
    console.log(x)
    if (param == true){
        var x = 5;
        let y = 6;
        const z = 7;
    }
    console.log(x)
    console.log(y)
    console.log(z)
}

testVariables2(true)