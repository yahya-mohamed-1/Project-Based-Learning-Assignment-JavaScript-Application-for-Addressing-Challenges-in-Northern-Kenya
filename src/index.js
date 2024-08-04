import { addEventListeners } from './functions.js';

document.addEventListener("DOMContentLoaded", () => {
  // Select necessary DOM elements
  const loginLink = document.getElementById("login-link");
  const coursesLink = document.getElementById("mycourses");

  // Function to update the UI based on login status
  function updateUI(isLoggedIn) {
    if (isLoggedIn) {
      // If the user is logged in, display the "My Courses" link and set the login link to "Logout"
      coursesLink.style.display = "inline-block";
      loginLink.textContent = "Logout";
      // Use addEventListeners function to add event listener
      addEventListeners("#login-link", "click", logoutHandler);
    } else {
      // If the user is not logged in, hide the "My Courses" link and set the login link to "Login"
      coursesLink.style.display = "none";
      loginLink.textContent = "Login";
      loginLink.href = "./login.html";
    }
  }

  // Check if there is a logged-in user in sessionStorage and update the UI accordingly
  const loggedInUser = sessionStorage.getItem("loggedInUser");
  updateUI(!!loggedInUser); // Convert loggedInUser to a boolean (true/false)

  // Function to handle user logout
  function logoutHandler(event) {
    event.preventDefault(); // Prevent default link behavior
    sessionStorage.removeItem("loggedInUser"); // Remove the logged-in user from sessionStorage
    window.location.href = "./login.html"; // Redirect to the login page
  }

  // Initialize the carousel using jQuery
  jQuery(document).ready(function ($) {
    var owl = $("#header-carousel");
    owl.owlCarousel({
      nav: false, // Disable navigation buttons
      dots: true, // Enable dots for navigation
      items: 1, // Show one item at a time
      loop: true, // Enable looping of items
      navText: ["&#xf007", "&#xf006"], // Custom navigation text/icons (not used due to nav: false)
      autoplay: true, // Enable autoplay
      autoplayTimeout: 3000, // Set autoplay interval to 3000ms (3 seconds)
    });
  });
});
