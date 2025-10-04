import express from "express";
import * as fs from "fs";
import { marked } from "marked";
import Mustache from "mustache";
import * as path from "path";
import { securityHeaders } from "./utilities";

const app = express();
const port = 3000;

app.use(securityHeaders);

app.get("/", (_req, res) => {
  res.setHeader("Cache-Control", "public, max-age=120");

  const filePath = path.join(__dirname, "content.md");
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error reading file");
      return;
    }
    const renderedMarkdown = Mustache.render(data, {
      date: new Date().toISOString(),
    });
    const html = marked(renderedMarkdown);
    const jqueryScript =
      '<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>';
    const finalHtml = jqueryScript + html;
    res.send(finalHtml);
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
