import express from "express";
import { marked } from "marked";
import * as fs from "fs";
import * as path from "path";
import Mustache from "mustache";

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.setHeader("Cache-Control", "public, max-age=120");
  const filePath = path.join(__dirname, "content.md");
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error reading file");
      return;
    }
    const renderedMarkdown = Mustache.render(data, { date: new Date().toISOString() });
    const html = marked(renderedMarkdown);
    res.send(html);
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
