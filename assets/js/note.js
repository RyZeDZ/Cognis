document.addEventListener("DOMContentLoaded", function () {

    // ✅ Get file name and subject from URL parameters
    const params = new URLSearchParams(window.location.search);
    const noteFile = params.get("file");
    const subject = params.get("subject");

    if (!noteFile || !subject) {
        document.getElementById("note-content").innerHTML = "<p>Error: Missing parameters.</p>";
        return;
    }

    document.getElementById("note-title").textContent = noteFile.replace(".md", "");

    const md = window.markdownit();

    // ✅ Fetch and render Markdown file
    fetch(`../assets/notes/${subject}/${noteFile}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("File not found");
            }
            return response.text();
        })
        .then(markdown => {
            document.getElementById("note-content").innerHTML = md.render(markdown);
            MathJax.typesetPromise();
        })
        .catch(error => {
            document.getElementById("note-content").innerHTML = "<p>Error loading file.</p>";
            console.error("Error fetching markdown file:", error);
        });
});
