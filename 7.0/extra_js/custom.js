function addFullscreenButtons() {
    document.querySelectorAll(".mermaid").forEach((diagram, index) => {
        console.log("Found a mermaid diagram", diagram);

        // Prevent adding multiple buttons
        if (diagram.closest(".mermaid-wrapper")) return;

        // Create a wrapper
        const wrapper = document.createElement("div");
        wrapper.classList.add("mermaid-wrapper");
        wrapper.style.position = "relative";

        // Move the diagram into the wrapper
        diagram.parentNode.insertBefore(wrapper, diagram);
        wrapper.appendChild(diagram);

        // Create a button
        const button = document.createElement("button");
        button.innerText = "🔍 Full Screen";
        button.style.position = "absolute";
        button.style.top = "5px";
        button.style.right = "5px";
        button.style.background = "rgba(0, 0, 0, 0.7)";
        button.style.color = "white";
        button.style.border = "none";
        button.style.padding = "5px";
        button.style.cursor = "pointer";
        button.style.zIndex = "1000";
        button.style.borderRadius = "5px";

        wrapper.appendChild(button);

        // Fullscreen logic
        button.addEventListener("click", () => {
            if (!document.fullscreenElement) {
                wrapper.requestFullscreen().then(() => {
                    wrapper.classList.add("fullscreen-mermaid");
                });
            } else {
                document.exitFullscreen();
            }
        });

        // Listen for full-screen exit
        document.addEventListener("fullscreenchange", () => {
            if (!document.fullscreenElement) {
                wrapper.classList.remove("fullscreen-mermaid");
            }
        });
    });
}


// Wait for Mermaid.js to finish rendering
document.addEventListener("DOMContentLoaded", function () {
    console.log("Document loaded. Waiting for Mermaid...");
    
    let attempts = 0;
    const checkMermaid = setInterval(() => {
        if (document.querySelector(".mermaid")) {
            console.log("Mermaid diagrams detected, adding buttons.");
            clearInterval(checkMermaid);
            addFullscreenButtons();
        } else if (attempts > 10) { // Stop after 10 tries (~5 seconds)
            console.log("Mermaid diagrams not found.");
            clearInterval(checkMermaid);
        }
        attempts++;
    }, 500); // Check every 500ms
});