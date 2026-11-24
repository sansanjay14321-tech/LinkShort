const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

const links = [];

const linksRouter = require('./routes/links');

app.use(express.json());

app.use((req, res, next) => {
    const start = Date.now();

    res.on('finish', () => {
        console.log(
            req.method,
            req.originalUrl,
            res.statusCode,
            Date.now() - start + 'ms'
        );
    });

    next();
});

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/links', linksRouter(links));

app.get('/:code', (req, res) => {
    const link = links.find(
        item => item.code === req.params.code
    );

    if (!link) {
        return res.status(404).send('Link not found');
    }

    res.redirect(link.url);
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});