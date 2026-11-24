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
        const shortUrl = `${window.location.origin}/${data.code}`;
        result.innerHTML = `
             <h3>Your Short URL:</h3>
               <a href="${shortUrl}" target="_blank">
                    ${shortUrl}
               </a>
         <button id="copyBtn">Copy Link</button>
        `;

        document.getElementById("copyBtn")
            .addEventListener("click", async () => {
                await navigator.clipboard.writeText(shortUrl);
                result.querySelector("#copyBtn").textContent = "Copied!";
            });

    } catch (error) {
        result.textContent = error.message;
    }
});

const historyBtn = document.getElementById("historyBtn");
const historyList = document.getElementById("historyList");

async function loadHistory() {
    try {
        const response = await fetch("/api/links");
        const links = await response.json();

        if (!response.ok) {
            throw new Error("Unable to load history");
        }

        if (links.length === 0) {
            historyList.innerHTML = "<p>No URL history found</p>";
            return;
        }

        historyList.innerHTML = links.map(link => `
            <div>
                <p>Original URL: ${link.url}</p>
                <a href="${window.location.origin}/${link.code}" target="_blank">
                    ${window.location.origin}/${link.code}
                </a>
                <p>${new Date(link.createdAt).toLocaleString()}</p>
            </div>
            <hr>
        `).join("");

    } catch (error) {
        historyList.textContent = error.message;
    }
}

historyBtn.addEventListener("click", loadHistory);