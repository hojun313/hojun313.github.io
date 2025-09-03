document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    function setTheme(theme) {
        htmlElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        themeToggle.textContent = theme === 'dark' ? '💡' : '🌙';
    }

    const storedTheme = localStorage.getItem('theme');
    // Default to dark mode if no preference is stored
    const defaultTheme = storedTheme || 'dark';
    setTheme(defaultTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    });
});
