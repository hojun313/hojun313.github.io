console.log('script.js loaded and running'); // Added for debugging

document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement; // This refers to the <html> tag

    // Function to set the theme
    function setTheme(theme) {
        htmlElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        // Update button text based on current theme
        themeToggle.textContent = theme === 'dark' ? '💡' : '🌙';
    }

    // Get stored theme or default to dark
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
        setTheme(storedTheme);
    } else {
        // Default to dark mode if no preference is stored
        setTheme('dark');
    }

    // Toggle theme on button click
    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    });
});