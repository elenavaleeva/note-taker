const fs = require("fs");
const path = require("path");
const { uuid } = require("uuidv4");

class Post {
  constructor(title, text) {
    this.title = title;
    this.text = text;
    this.id = uuid();
  }

  static save(post) {
    return new Promise((resolve, reject) => {
      fs.readFile(
        path.join(__dirname, "..", "db", "db.json"),
        "utf8",
        (err, data) => {
          if (err) return reject(err);

          let posts = JSON.parse(data);
          posts.push(post);

          fs.writeFile(
            path.join(__dirname, "..", "db", "db.json"),
            JSON.stringify(posts),
            (err) => {
              if (err) return reject(err);
              resolve();
            }
          );
        }
      );
    });
  }

  static getAll() {
    return new Promise((resolve, reject) => {
      fs.readFile(
        path.join(__dirname, "..", "db", "db.json"),
        "utf8",
        (err, data) => {
          if (err) return reject(err);
          resolve(JSON.parse(data));
        }
      );
    });
  }
}

module.exports = Post;
