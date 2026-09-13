(() => {
    function startZoom() {
        const elements = Array.from(document.body.children);

        const excluded = [
            "SCRIPT",
            "STYLE",
            "NOSCRIPT"
        ];

        const animatedElements = elements.filter((element) => {
            if (excluded.includes(element.tagName)) {
                return false;
            }

            const name = (
                element.id +
                " " +
                element.className
            ).toLowerCase();

            return !(
                name.includes("cursor") ||
                name.includes("glow") ||
                name.includes("mouse") ||
                name.includes("pointer")
            );
        });

        animatedElements.forEach((element) => {
            element.animate(
                [
                    {
                        transform: "scale(0.15)",
                        opacity: 0,
                    },
                    {
                        transform: "scale(1.08)",
                        opacity: 1,
                        offset: 0.75,
                    },
                    {
                        transform: "scale(1)",
                        opacity: 1,
                    }
                ],
                {
                    duration: 850,
                    easing: "cubic-bezier(0.16, 1, 0.3, 1)",
                    fill: "both"
                }
            );
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", startZoom);
    } else {
        startZoom();
    }
})();


(() => {
    const elements = document.querySelectorAll(".animate-text");

    elements.forEach(element => {
        element.style.visibility = "hidden";
    });

    async function typeText(element) {
        const text = element.textContent;

        element.textContent = "";
        element.style.visibility = "visible";

        for (const character of text) {
            element.textContent += character;
            await new Promise(resolve => setTimeout(resolve, 70));
        }
    }

    async function startTyping() {
        for (const element of elements) {
            await typeText(element);
        }
    }

    startTyping();
})();