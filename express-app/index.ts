import express from "express";

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.setHeader("Cache-Control", "public, max-age=120");
  res.send("Hello, World! " + new Date().toISOString());
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
