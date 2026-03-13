import { v4 as uuidv4 } from "uuid";

export class User {
  id; 
  username
  createdAt

  constructor(id, username, createdAt) {
    this.id = id;
    this.username = username;
    this.createdAt = createdAt;
  }

  static create(username) {
    return new User(uuidv4(), username, new Date().toISOString());
  }

  static fromJSON(data) {
    return new User(data.id, data.username, data.createdAt);
  }

  toJSON() {
    return {
      id: this.id,
      username: this.username,
      createdAt: this.createdAt,
    };
  }
}