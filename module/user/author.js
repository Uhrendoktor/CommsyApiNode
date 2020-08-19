module.exports = class User{
  constructor(Room, id, name){
    this.id = id;
    this.name = name;
    this.path = '/user';
  }
}
