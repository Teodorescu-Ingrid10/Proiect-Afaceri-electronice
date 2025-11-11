const arr = [1,2,3,4,5];

// console.log(arr);

// arr.push(6);
// console.log(arr);

// const popval = arr.pop()
// console.log(popval);
// console.log(arr);

console.log("FOR");
for (let i = 0; i<arr.length; i++){
    console.log(arr[i]);
}

console.log("FOREACH");
arr.forEach((el,index) =>{
    console.log(el);
})

console.log("MAP");
const mappedValues = arr.map((el, index) => {
    return el * 2;
})
console.log(mappedValues);

console.log("OF ARRAY");
for(el of arr){
    console.log(el);
}
