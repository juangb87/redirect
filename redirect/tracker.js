// app.js

const express = require("express");
const url = require("url");
const { v4: uuidv4 } = require("uuid");
const config = require("./config"); // Adjust the path based on your file structure

const app = express();
const PORT = 8080;

// Destructure the affiliateMappings from the config
const { affiliateMappings } = config;

// Function to generate a unique and secure click ID
function generateClickId() {
  const timestamp = Date.now();
  const uniqueId = uuidv4();
  const entropy = Math.random().toString(36).substring(2, 8);

  return `${timestamp}-${uniqueId}-${entropy}`;
}

app.get("/", (req, res) => {
  const destinationUrl = req.query.url;

  if (!destinationUrl) {
    return res.status(400).send("Missing destination URL");
  }

  const parsedUrl = url.parse(destinationUrl);
  const rootDomain = parsedUrl.hostname.replace(/^www\./, "");

  if (affiliateMappings.hasOwnProperty(rootDomain)) {
    const affiliateLink = affiliateMappings[rootDomain];
    const clickId = generateClickId();
    const redirectUrl = `${affiliateLink}&url=${encodeURIComponent(
      destinationUrl
    )}&fobs=${clickId}`;
    return res.redirect(redirectUrl);
  } else {
    return res
      .status(404)
      .send("Affiliate link not found for the specified domain");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
