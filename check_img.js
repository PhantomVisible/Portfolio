const fs = require('fs');
const buffer = fs.readFileSync('src/assets/textures/java-logo.png');
// just check the size or we can assume they are colored logos
console.log("Image size:", buffer.length);
