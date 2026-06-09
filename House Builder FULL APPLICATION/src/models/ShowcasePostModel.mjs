// src/models/ShowcasePostModel.mjs
let posts = [];

/**
 * Model representing in-memory Showcase Posts.
 * Handles creation, retrieval, and deletion of house builds.
 */

export class ShowcasePostModel {

    /**
   * Returns all showcase posts.
   *
   * @returns {Array<Object>} Array of showcase post objects.
   */

  static getAll() { 
    return posts;
  }

    /**
   * Adds a new showcase post to storage.
   * Automatically assigns a unique ID.
   *
   * @param {Object} post - The showcase post object.
   * @returns {void}
   */

  static add(post) { 
    post.id = `sc_${Date.now()}`;
    posts.push(post);
  }

    /**
   * Finds a showcase post by ID.
   *
   * @param {string} id - The ID of the post to find.
   * @returns {Object|undefined} The matching post or undefined if not found.
   */

  static getById(id) { //Searches the array and Returns the matching post
    return posts.find(p => p.id === id);
  }

    /**
   * Deletes a showcase post by ID.
   *
   * @param {string} id - The ID of the post to remove.
   * @returns {void}
   */
  
  static delete(id) { //Removes a post from the array and Keeps everything except the one with matching ID
    posts = posts.filter(p => p.id !== id);
  }
}