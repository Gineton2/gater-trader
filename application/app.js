const express = require('express');
const app = express();

app.use("/", indexRouter); // route middleware from ./routes/index.js



// app.get('/', (req, res) => {res.send("TEAM07's INSTANCE IS UP AND RUNNNING")});

// app.listen(1234, () => console.log('Server running on port 1234'));