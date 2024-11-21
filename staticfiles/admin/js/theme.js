'use strict';
{
    function setTheme(mode) {
        if (mode !== "light" && mode !== "dark" && mode !== "auto") {
            console.error(`Got invalid theme mode: ${mode}. Resetting to auto.`);
            mode = "auto";
        }
        document.documentElement.dataset.theme = mode;
        localStorage.setItem("theme", mode);
    }

    function cycleTheme() {
        const currentTheme = localStorage.getItem("theme") || "auto";
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

        if (prefersDark) {
            handleDarkPreference(currentTheme);
            return;
        }
        handleLightPreference(currentTheme);
    }

    function handleDarkPreference(currentTheme) {
        switch (currentTheme) {
            case "auto":
                setTheme("light");
                break;
            case "light":
                setTheme("dark");
                break;
            default:
                setTheme("auto");
        }
    }

    function handleLightPreference(currentTheme) {
        switch (currentTheme) {
            case "auto":
                setTheme("dark");
                break;
            case "dark":
                setTheme("light");
                break;
            default:
                setTheme("auto");
        }
    }

    function initTheme() {
        const currentTheme = localStorage.getItem("theme");
        currentTheme ? setTheme(currentTheme) : setTheme("auto");
    }

    window.addEventListener('load', function(_) {
        const buttons = document.getElementsByClassName("theme-toggle");
        Array.from(buttons).forEach((btn) => {
            btn.addEventListener("click", cycleTheme);
        });
    });

    initTheme();
}