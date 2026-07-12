const { diagrams } = require("./generate_chen_erd.js");
const fs = require("fs");
fs.writeFileSync("diagram1.dot", diagrams[0]);
fs.writeFileSync("diagram2.dot", diagrams[1]);
console.log("Written diagram1.dot, lines:", diagrams[0].split("\n").length);
console.log("--- First 20 lines of diagram1.dot ---");
console.log(diagrams[0].split("\n").slice(0, 20).join("\n"));
console.log("--- Around line 12 ---");
console.log(diagrams[0].split("\n").slice(8, 16).join("\n"));
