document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    function setTheme(theme) {
        htmlElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        themeToggle.textContent = theme === 'dark' ? '💡' : '🌙';
    }

    const storedTheme = localStorage.getItem('theme');
    const defaultTheme = storedTheme || 'dark';
    setTheme(defaultTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    });

    const gameLogToggleButton = document.getElementById('toggle-game-log');
    const gameLogRows = document.querySelectorAll('#game-log-body tr');
    let visibilityLevel = 0;

    const filterGames = () => {
        gameLogRows.forEach(row => {
            const playtime = parseInt(row.dataset.playtime, 10);
            row.style.display = 'none'; // 일단 모두 숨김

            if (visibilityLevel === 0 && playtime >= 5) {
                row.style.display = '';
            } else if (visibilityLevel === 1 && playtime === 3) {
                row.style.display = '';
            } else if (visibilityLevel === 2 && playtime >= 1 && playtime <= 2) {
                row.style.display = '';
            }
        });

        gameLogToggleButton.textContent = '다음 페이지';
    };

    gameLogToggleButton.addEventListener('click', () => {
        visibilityLevel = (visibilityLevel + 1) % 3;
        filterGames();
    });

    // Initial filter
    filterGames();
});