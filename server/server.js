const express = require('express');
const path = require('path');

const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname, '/../public');

let app = express();

app.use(express.static(publicPath));

app.listen(port, () => {
    console.log(`server running on port ${port}`);
});
