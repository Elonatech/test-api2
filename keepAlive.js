const http = require("http");
const https = require("https");
const url = require("url");

// Use a default URL if BASEURL is not defined
const baseUrl = process.env.BASEURL;

const pingServer = () => {
  // Check if baseUrl is defined before making the request
  if (!baseUrl) {
    console.error("BASEURL is not defined. Skipping server ping.");
    return;
  }

  const parsedUrl = url.parse(baseUrl);
  const protocol = parsedUrl.protocol === "https:" ? https : http;

  protocol
    .get(baseUrl, (res) => {
      if (res.statusCode === 200) {
        console.log("Server pinged successfully");
      } else {
        console.error(`Failed to ping server. Status code: ${res.statusCode}`);
      }
    })
    .on("error", (err) => {
      console.error("Error pinging server:", err);
    });
};

// Ping the server every 10 minutes
setInterval(pingServer, 10 * 60 * 1000);

module.exports = pingServer;
