// src/models/ShowcasePostModel.mjs
let posts = [];

export class ShowcasePostModel {
  static getAll() { //Returns the entire list of showcase posts
    return posts;
  }

  static add(post) { //Takes a new house/post object and Gives it a unique ID 
    post.id = `sc_${Date.now()}`;
    posts.push(post);
  }

  static getById(id) { //Searches the array and Returns the matching post
    return posts.find(p => p.id === id);
  }

  static delete(id) { //Removes a post from the array and Keeps everything except the one with matching ID
    posts = posts.filter(p => p.id !== id);
  }
}