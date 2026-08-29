const fs = require('fs');

const code = fs.readFileSync('src/js/app.js', 'utf-8');
const lines = code.split('\n');

// We'll write some logic to split the code by regex matching "function xxx"
// But it's actually safer to just do basic exports on top level variables.
// Let's just create state.js by taking the top part.
let stateCode = '';
let uiCode = '';
let apiCode = '';
let mainCode = '';

// This is too brittle.
