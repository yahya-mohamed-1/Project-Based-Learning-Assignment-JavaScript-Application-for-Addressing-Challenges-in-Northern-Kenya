import { fetchFromApi, addEventListeners } from './functions.js';

document.addEventListener("DOMContentLoaded", () => {
  // Select necessary DOM elements
  const p = document.querySelector("#login-error");
  const form = document.querySelector("#login");
  const unameInput = document.querySelector("#uname");
  const pwordInput = document.querySelector("#pword");
  const togglePassword = document.querySelector("#togglePassword");
  const forgotPassword = document.querySelector("#forgot-password");

  /*
                                                  
  * LOGIN   F U N C T I O N A L I T Y *
                                                  
  */

  // Function to display error messages
  function displayErrorMessage(message) {
    // Set the error message text and make it visible
    p.style.display = "block";
    p.style.color = "red";
    p.textContent = message;
    // Hide the error message after 3 seconds
    setTimeout(() => {
      p.style.display = "none";
    }, 3000);
  }

  // Function to handle the login process
  async function login(event) {
    event.preventDefault(); // Prevent default form submission

    // Get the values from the username and password fields
    const uname = unameInput.value;
    const pword = pwordInput.value;

    try {
      // Fetch user data from the server
      const data = await fetchFromApi("students");

      // Find a user matching the provided credentials
      const matchingUser = data.find(
        (user) => user.username === uname && user.password === pword
      );

      if (matchingUser) {
        // Clear any previous session data for registered user
        sessionStorage.removeItem("registeredUser");
        // Clear any already loggedOut user
        sessionStorage.removeItem("loggedOut");
        // Store the logged-in user's data in the session storage
        sessionStorage.setItem("loggedInUser", JSON.stringify(matchingUser));

        if (matchingUser.newUser) {
          // Update the user's newUser status to false on the server
          await fetchFromApi(`students/${matchingUser.id}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ newUser: false }),
          });

          // Redirect new users to the profile page
          matchingUser.newUser = false;
          window.location.href = "./profile.html";
        } else {
          // Redirect existing users to the registered courses page
          window.location.href = "./registered_course.html";
        }
      } else {
        // Display an error message if the credentials are invalid
        displayErrorMessage("Invalid username and/or password.");
      }
    } catch (err) {
      // Display an error message if there was a problem with the request
      displayErrorMessage("Error: " + err.message);
    }
  }

  // Function to toggle the visibility of the password
  function togglePasswordVisibility() {
    // Check if the password input is currently of type 'password'
    const isPassword = pwordInput.getAttribute("type") === "password";
    // Toggle the input type between 'password' and 'text'
    pwordInput.setAttribute("type", isPassword ? "text" : "password");
    // Toggle the icon for the visibility button
    togglePassword.innerHTML = isPassword ? "&#128584;" : "&#128065;";
  }

  // Add event listeners
  addEventListeners("#togglePassword", "click", togglePasswordVisibility);
  addEventListeners("#login", "submit", login);
  addEventListeners("#forgot-password", "click", () => {
    window.location.href = "./reset_password.html";
  });
});
