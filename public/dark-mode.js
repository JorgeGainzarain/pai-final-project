document.addEventListener('DOMContentLoaded', () => {
    const darkModeToggleButton = document.getElementById('dark-mode-toggle-button');
    const darkModeEnabled = document.cookie.includes('dark-mode=enabled');

    if (darkModeEnabled) {
        document.body.classList.add('dark');
        darkModeToggleButton.innerHTML = '<i class="fa fa-sun"></i>';
    } else {
        darkModeToggleButton.innerHTML = '<i class="fa fa-moon"></i>';
    }

    darkModeToggleButton.addEventListener('click', () => {
        if (document.body.classList.contains('dark')) {
            document.cookie = 'dark-mode=disabled; path=/';
            document.body.classList.remove('dark');
        } else {
            document.cookie = 'dark-mode=enabled; path=/';
            document.body.classList.add('dark');
        }
        window.location.reload();
    });
});