// Wait for the DOM to be fully loaded before running the script
document.addEventListener("DOMContentLoaded", function () {
  // Select the logout link element by its ID
  const logoutLink = document.querySelector("#logout");
  // Create a new BroadcastChannel for logout communication
  const logoutChannel = new BroadcastChannel("user-logout");

  // Function to handle logout action
  function logoutHandler(event) {
    event.preventDefault(); // Prevent the default link behavior
    // Remove user data from session storage
    sessionStorage.removeItem("loggedInUser");
    sessionStorage.setItem("loggedOut", "true"); // Indicate the user is logged out
    // Redirect to the login page
    window.location.href = "./login.html";
  }

  // Check if the logout link exists before adding an event listener
  if (!logoutLink) {
    return; // Exit if the logout link is not found
  } else {
    // Attach the logout handler to the logout link
    logoutLink.addEventListener("click", logoutHandler);
  }

  // Function to check the login status of the user
  function checkLoginStatus() {
    // Redirect to login if the user is not logged in or has logged out
    if (!sessionStorage.getItem("loggedInUser") || sessionStorage.getItem("loggedOut") === "true") {
      window.location.href = "./login.html";
    }
  }

  // Listen for messages on the logout BroadcastChannel
  logoutChannel.onmessage = (event) => {
    if (event.data.action === "logout") {
      // Handle logout from other tabs/windows
      sessionStorage.removeItem("loggedInUser");
      sessionStorage.setItem("loggedOut", "true");
      window.location.href = "./login.html";
    }
  };

  // Listen for changes in the session storage (e.g., across tabs)
  window.addEventListener("storage", (event) => {
    if (event.key === "userLoggedOut" && event.newValue === "true") {
      // Handle logout when storage indicates user logged out
      sessionStorage.removeItem("loggedInUser");
      window.location.href = "./login.html";
    }
  });

  // Check login status when the page loads
  window.addEventListener("load", checkLoginStatus);
  // Check login status when navigating back or forward in history
  window.addEventListener("popstate", checkLoginStatus);
});
