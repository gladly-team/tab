import db from '../database';

class User {
  constructor(id, name, username, website) {
    this.id = id;
    this.name = name;
    this.username = username;
    this.website = website;
  }
}

const lvarayut = new User(1, 'Varayut Lerdkanlayanawat', 'lvarayut', 'https://github.com/lvarayut/relay-fullstack');

function getUser(id) {
  return id === lvarayut.id ? lvarayut : null;
}

export {
  User,
  getUser
};
