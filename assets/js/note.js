document.addEventListener("DOMContentLoaded", function () {

    const params = new URLSearchParams(window.location.search);
    const noteFile = params.get("file");
    const subject = params.get("subject");

    if (!noteFile || !subject) {
        document.getElementById("note-content").innerHTML = "<p>Error: Missing parameters.</p>";
        return;
    }

    document.getElementById("note-title").textContent = noteFile.replace(".md", "");

    const md = window.markdownit();

    fetch(`../assets/notes/${subject}/${noteFile}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("File not found");
            }
            return response.text();
        })
        .then(markdown => {
            const content = md.render(markdown);
            const container = document.getElementById("note-content");
            container.innerHTML = content;
            hljs.highlightAll();
            requestAnimationFrame(() => {
                MathJax.typesetClear();
                MathJax.typesetPromise().catch(err => {
                    console.log('MathJax typeset error:', err);
                });
            });
        })
        .catch(error => {
            document.getElementById("note-content").innerHTML = "<p>Error loading file.</p>";
            console.error("Error fetching markdown file:", error);
        });
});
