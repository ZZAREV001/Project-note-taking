const express = require('express');
const app = express();   // run the server

const port = 4000;      // run at port 3000

app.listen(port, () => {
    console.log(`Tha app is running on http://localhost:${port}`);
})
