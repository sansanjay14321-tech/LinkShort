const express = require('express');

const router = express.Router();

function makeCode(links) {
    const characters =
        'abcdefghijklmnopqrstuvwxyz0123456789';

    let code;

    do {
        code = '';

        for (let i = 0; i < 6; i++) {
            code += characters[
                Math.floor(Math.random() * characters.length)
            ];
        }
    } while (links.some(link => link.code === code));

    return code;
}

function isValidUrl(value) {
    try {
        const parsed = new URL(value);

        return (
            parsed.protocol === 'http:' ||
            parsed.protocol === 'https:'
        );
    } catch {
        return false;
    }
}

module.exports = (links) => {

    router.post('/', (req, res) => {
        const { url, alias } = req.body || {};

        if (typeof url !== 'string' || !isValidUrl(url)) {
            return res.status(400).json({
                message: 'Invalid URL'
            });
        }

        let code;

        if (alias !== undefined && alias !== '') {

            if (
                typeof alias !== 'string' ||
                !/^[a-zA-Z0-9-]{3,20}$/.test(alias) ||
                alias.toLowerCase() === 'api'
            ) {
                return res.status(400).json({
                    message: 'Invalid alias'
                });
            }

            if (links.some(link => link.code === alias)) {
                return res.status(409).json({
                    message: 'Alias already exists'
                });
            }

            code = alias;

        } else {
            code = makeCode(links);
        }

        const newLink = {
            code,
            url,
            createdAt: new Date().toISOString()
        };

        links.push(newLink);

        res.status(201).json(newLink);
    });

    router.get('/', (req, res) => {
        res.json(links);
    });

    router.get('/:code', (req, res) => {
        const link = links.find(
            item => item.code === req.params.code
        );

        if (!link) {
            return res.status(404).json({
                message: 'Link not found'
            });
        }

        res.json(link);
    });

    router.put('/:code', (req, res) => {
        const link = links.find(
            item => item.code === req.params.code
        );

        if (!link) {
            return res.status(404).json({
                message: 'Link not found'
            });
        }

        const { url } = req.body || {};

        if (typeof url !== 'string' || !isValidUrl(url)) {
            return res.status(400).json({
                message: 'Invalid URL'
            });
        }

        link.url = url;

        res.json({
            message: 'Link updated successfully',
            link
        });
    });

    router.delete('/:code', (req, res) => {
        const index = links.findIndex(
            item => item.code === req.params.code
        );

        if (index === -1) {
            return res.status(404).json({
                message: 'Link not found'
            });
        }

        const deletedLink = links.splice(index, 1)[0];

        res.json({
            message: 'Link deleted successfully',
            link: deletedLink
        });
});

    return router;
}; 