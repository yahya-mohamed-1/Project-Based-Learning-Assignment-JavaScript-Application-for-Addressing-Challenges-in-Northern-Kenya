import { fetchFromApi, addEventListeners } from './functions.js';

document.addEventListener("DOMContentLoaded", () => {
    const p = document.querySelector("#reset-error");
    const form = document.querySelector("#reset");
    const unameInput = document.querySelector("#uname");
    const pwordInput = document.querySelector("#pword");
    const newPwordInput = document.querySelector("#new_pword");
    const togglePassword = document.querySelector("#togglePassword");
    const toggleConfirmPassword = document.querySelector("#toggleConfirmPassword");

    async function resetPassword() {
      try {
        // Fetch user data from the server
        const data = await fetchFromApi("students");
        if (!data) throw new Error('Failed to fetch users.');

        // Find a user matching the provided username
        const user = data.find(user => user.username === unameInput.value);
        if (user) {
          // Check if new password and confirm password match
          if (pwordInput.value === newPwordInput.value) {
            // Check if new password is the same as the current password
            if (pwordInput.value === user.password) {
              p.style.display = "block";
              p.textContent = "New and current passwords cannot be the same!";
              p.style.color = "red";
              setTimeout(() => {
                p.style.display = "none";
              }, 3000);
            } else {
              // Proceed to change the password
              const newPassword = pwordInput.value;
              const updateResponse = await fetchFromApi(
                `students/${user.id}`,
                {
                  method: "PATCH",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ password: newPassword }),
                }
              );

              if (updateResponse) {
                // Display a success message
                p.style.display = "block";
                p.textContent = "Password changed successfully!";
                p.style.color = "green";
                setTimeout(() => {
                  p.style.display = "none";
                }, 3000);
                setTimeout(() => {
                  window.location.href = "./login.html";
                }, 3000);
              } else {
                // Handle error response from the server
                p.style.display = "block";
                p.textContent = "Error updating password. Please try again.";
                p.style.color = "red";
                setTimeout(() => {
                  p.style.display = "none";
                }, 3000);
              }

              // Clear the input fields
              unameInput.value = "";
              pwordInput.value = "";
              newPwordInput.value = "";
            }
          } else {
            // Display an error message if the passwords do not match
            p.style.display = "block";
            p.textContent = "New and confirm passwords do not match.";
            p.style.color = "red";
            setTimeout(() => {
              p.style.display = "none";
            }, 3000);
          }
        } else {
          // Display an error message if the user is not found
          p.style.display = "block";
          p.textContent = "User not found!";
          p.style.color = "red";
          setTimeout(() => {
            p.style.display = "none";
          }, 3000);
        }
      } catch (error) {
        console.error('An error occurred:', error);
        // Display a general error message for any other issues
        p.style.display = "block";
        p.textContent = "An error occurred. Please try again.";
        p.style.color = "red";
        setTimeout(() => {
          p.style.display = "none";
        }, 3000);
      }
    }

    // Add an event listener to the form to handle the submit event
    addEventListeners("#reset", "submit", (e) => {
      e.preventDefault();
      resetPassword();
    });

    // Toggle password visibility for new password
    addEventListeners("#togglePassword", "click", () => {
      const type = pwordInput.type === "password" ? "text" : "password";
      pwordInput.type = type;
      togglePassword.textContent = pwordInput.type === "password" ? "👁️" : "🙈";
    });

    // Toggle password visibility for confirm new password
    addEventListeners("#toggleConfirmPassword", "click", () => {
      const type = newPwordInput.type === "password" ? "text" : "password";
      newPwordInput.type = type;
      toggleConfirmPassword.textContent = newPwordInput.type === "password" ? "👁️" : "🙈";
    });
});
