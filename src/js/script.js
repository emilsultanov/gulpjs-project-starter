const log = (message) => {
  console.log(message)
}

class Person {
  constructor(name=''){
    this.name = name;
  }

  getName(){
    return this.name;
  }
}