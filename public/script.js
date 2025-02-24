document.addEventListener("DOMContentLoaded", function () {
    // Get references to DOM elements
    const menuButton = document.querySelector(".menu-btn");
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("overlay");
    const closeButton = document.querySelector(".close-btn");
    const menuLinks = document.querySelectorAll(".menu-link");

    // Function to show the sidebar and overlay
    function showMenu() {
        sidebar.classList.add("show");
        overlay.classList.add("show");
    }

    // Function to hide the sidebar and overlay
    function hideMenu() {
        sidebar.classList.remove("show");
        overlay.classList.remove("show");
    }

    // Open menu when clicking the menu button
    menuButton.addEventListener("click", showMenu);

    // Close menu when clicking the close button
    closeButton.addEventListener("click", hideMenu);

    // Close menu when clicking outside (on the overlay)
    overlay.addEventListener("click", hideMenu);

    // Close menu when clicking any menu link
    menuLinks.forEach(link => {
        link.addEventListener("click", hideMenu);
    });
});
