const obj = {
    name: "Adrian",
    greet: function(){
        // console.log("Hello, "+this.name);
        console.log(`Hello, ${this.name}`)
    },
    greet2: () => {
        // can not access this.name
        console.log("Hello, "+this.name);
    }
}

// obj.greet();
obj.name = "Mihai";
obj.greet();

obj.greet = function() {
    console.log(`My name is not Adrian`)
}
obj.greet();