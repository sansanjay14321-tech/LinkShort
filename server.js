const express = require("express");

const app = express();
app.use(express.json());
app.use(express.static("public"));      

const links = [];

function makeCode() {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";

    for (let i = 0; i < 6; i++) {
        code += chars[Math.floor(Math.random() * chars.length)];
    }

    return code;
}

app.post("/api/links", (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({
            error: "URL is required"
        });
    }

    let validUrl;

    try {
        validUrl = new URL(url);

        if (!["http:", "https:"].includes(validUrl.protocol)) {
            throw new Error("Invalid protocol");
        }
    } catch {
        return res.status(400).json({
            error: "Please enter a valid HTTP or HTTPS URL"
        });
    }

    const code = makeCode();

    links.push({
        code: code,
        url: validUrl.href
    });

    res.status(201).json({
        code: code,
        shortUrl: `http://localhost:3000/${code}`,
        originalUrl: validUrl.href
    });
});

app.get("/:code", (req, res) => {
    const code = req.params.code;

    const link = links.find(item => item.code === code);

    if (!link) {
        return res.status(404).send("Short link not found");
    }

    res.redirect(link.url);
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});