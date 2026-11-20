const button = document.getElementById("shortenBtn");

button.addEventListener("click", async () => {

    const url = document.getElementById("longUrl").value.trim();
    const result = document.getElementById("result");

    if (!url) {
        result.textContent = "Please enter a URL";
        return;
    }

    try {
        const response = await fetch("/api/links", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ url: url })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Something went wrong");
        }

        result.innerHTML = `
            <h3>Your Short URL:</h3>
            <a href="${data.shortUrl}" target="_blank">
                ${data.shortUrl}
            </a>
            <button id="copyBtn">Copy Link</button>
        `;

        document.getElementById("copyBtn")
            .addEventListener("click", async () => {
                await navigator.clipboard.writeText(data.shortUrl);
                result.querySelector("#copyBtn").textContent = "Copied!";
            });

    } catch (error) {
        result.textContent = error.message;
    }
});