document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);
    const noteFile = params.get("file");
    const subject = params.get("subject");

    if (!noteFile || !subject) {
        document.getElementById("note-content").innerHTML = "<p>Error: Missing parameters.</p>";
        return;
    }

    document.getElementById("note-title").textContent = noteFile.replace(".md", "");

    fetch(`../assets/notes/${subject}/${noteFile}`)
        .then(response => response.text())
        .then(markdown => {
            document.getElementById("note-content").innerHTML = marked.parse(markdown);
        })
        .catch(error => {
            document.getElementById("note-content").innerHTML = "<p>Error loading file.</p>";
            console.error("Error fetching markdown file:", error);
        });
});
