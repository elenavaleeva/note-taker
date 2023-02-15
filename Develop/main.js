const express = require("express");
const fs = require("fs");
const path = require("path");
const Post = require("./models/post");

const app = express();

app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "notes.html"));
});

app.get("/api/notes", (req, res) => {
  fs.readFile(path.join(__dirname, "db", "db.json"), "utf8", (err, data) => {
    if (err)
      return res
        .status(500)
        .json({ message: "Error reading file", error: err });

    const posts = JSON.parse(data);
    res.json(posts);
  });
});

app.post("/api/notes", (req, res) => {
  const post = new Post(req.body.title, req.body.text);

  Post.save(post)
    .then(() => {
      res.status(201).json({ message: "Post created successfully" });
    })
    .catch((error) => {
      res.status(500).json({ message: "Error creating post", error });
    });
});

app.delete("/api/notes/:id", (req, res) => {
  fs.readFile(path.join(__dirname, "db", "db.json"), "utf8", (err, data) => {
    if (err)
      return res
        .status(500)
        .json({ message: "Error reading file", error: err });

    let posts = JSON.parse(data);
    posts = posts.filter((post) => post.id !== req.params.id);

    fs.writeFile(
      path.join(__dirname, "db", "db.json"),
      JSON.stringify(posts),
      (err) => {
        if (err)
          return res
            .status(500)
            .json({ message: "Error writing file", error: err });

        res.json({ message: "Post deleted successfully" });
      }
    );
  });
});

app.listen(4000, (req, res) => {
  if (req) {
    return console.log(req);
  }

  console.log(`Server OK`);
});

//========================================================================================================================================================
