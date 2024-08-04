import { fetchFromApi, addEventListeners } from './functions.js';

// Ensure the DOM is fully loaded before running the script
document.addEventListener("DOMContentLoaded", () => {
  // Select necessary DOM elements
  const signupForm = document.querySelector("#signup");
  const usernameInput = document.querySelector("#userName");
  const emailInput = document.querySelector("#eMail");
  const pwordInput = document.querySelector("#pword");
  const signupMsg = document.querySelector("#signup-message");
  const togglePassword = document.querySelector("#togglePassword");

  let globalUserId = null; // Global variable to store user ID

  /*
   
  * S I G N   U P   F U N C T I O N A L I T Y *
  
  */

  // Function to check if username or email already exists
  async function checkUser(un, ue) {
    const data = await fetchFromApi("students");

    if (!data) return false; // Handle API error gracefully

    // Check if username or email already exists in fetched data
    const userExists = data.some((student) => {
      if (student.username === un || student.email === ue) {
        globalUserId = student.id; // Store the user ID in the global variable
        return true;
      }
      return false;
    });

    return userExists;
  }

  // Function to add user data from sign up
  async function addUser(e) {
    e.preventDefault(); // Prevent default form submission

    const userName = usernameInput.value;
    const userEmail = emailInput.value;
    const userPassword = pwordInput.value;

    // Check if username or email already exists
    const userExists = await checkUser(userName, userEmail);

    if (userExists) {
      signupMsg.textContent = "Username and/or email already exist(s)!";
      signupMsg.style.color = "red";
      signupMsg.style.display = "block";
      setTimeout(() => signupMsg.style.display = "none", 3000);
    } else {
      const data = {
        username: userName,
        email: userEmail,
        password: userPassword,
        newUser: true,
        courses: [],
      };

      try {
        // Send a POST request to the server
        const newUser = await fetchFromApi("students", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (newUser) {
          globalUserId = newUser.id; // Store the new user's id in the global variable

          // Store data in sessionStorage
          sessionStorage.setItem(
            "registeredUser",
            JSON.stringify({
              id: globalUserId,
              username: userName,
              email: userEmail,
              password: userPassword,
            })
          );

          // Show success message
          signupMsg.style.color = "green";
          signupMsg.style.display = "block";
          signupMsg.textContent = "Successfully registered!";
          setTimeout(() => {
            signupMsg.style.display = "none";
            window.location.href = "./login.html";
          }, 3000);

          // Clear input fields after successful registration
          usernameInput.value = "";
          emailInput.value = "";
          pwordInput.value = "";
        } else {
          throw new Error("Failed to register user.");
        }
      } catch (err) {
        // Show error message
        signupMsg.style.color = "red";
        signupMsg.style.display = "block";
        signupMsg.textContent = "Error: " + err.message;
        setTimeout(() => signupMsg.style.display = "none", 3000);
      }
    }
  }

  function togglePasswordVisibility() {
    const type =
      pwordInput.getAttribute("type") === "password" ? "text" : "password";
    pwordInput.setAttribute("type", type);

    // Change the icon
    togglePassword.innerHTML = type === "password" ? "&#128065;" : "&#128584;";
  }

  // Attach event listeners using addEventListeners
  addEventListeners("#togglePassword", "click", togglePasswordVisibility);
  addEventListeners("#signup", "submit", addUser);
});
