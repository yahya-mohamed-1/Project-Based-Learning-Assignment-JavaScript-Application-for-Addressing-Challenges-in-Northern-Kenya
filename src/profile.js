import { fetchFromApi, addEventListeners } from './functions.js';

document.addEventListener("DOMContentLoaded", async function () {
  // Select necessary DOM elements
  const countyOfBirth = document.querySelector("#county");
  const profilePic = document.getElementById("profile-pic");
  const firstName = document.getElementById("first-name");
  const middleName = document.getElementById("middle-name");
  const lastName = document.getElementById("last-name");
  const gender = document.getElementById("gender");
  const dateOfBirth = document.getElementById("dob");
  const currentEmail = document.getElementById("email");
  const currentPassword = document.getElementById("password");
  const currentUsername = document.getElementById("username");
  // Get form and image upload elements
  const profileForm = document.querySelector("#update-form");
  const imageUpload = document.getElementById("image-upload");
  // Retrieve stored user data from sessionStorage
  const storedUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
  
  // Function to populate the profile form with user data
  function populateProfile(user) {
    // Populate the fields with user data, using empty string if data is not available
    currentUsername.value = user.username || "";
    currentEmail.value = user.email || "";
    currentPassword.value = user.password || "";
    firstName.value = user.firstName || "";
    middleName.value = user.middleName || "";
    lastName.value = user.lastName || "";
    gender.value = user.gender || "";
    dateOfBirth.value = user.dateOfBirth || "";
    countyOfBirth.value = user.county || "";

    // Set profile picture if available
    if (user.profilePic) {
      profilePic.style.backgroundImage = `url(${user.profilePic})`;
    }
  }

  try {
    if (storedUser) {
      storedUser.newUser = false;
      // Populate the profile form with the retrieved user data
      populateProfile(storedUser);
    } else {
      throw new Error("User not logged in");
    }

    // Add event listener to allow clicking on the profile picture to trigger file selection
    addEventListeners("#profile-pic", "click", function () {
      imageUpload.click();
    });

    // Event listener to preview selected profile picture
    addEventListeners("#image-upload", "change", function (event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
          profilePic.style.backgroundImage = `url(${e.target.result})`;
        };
        reader.readAsDataURL(file);
      }
    });

    // Add event listener for toggling password visibility
    addEventListeners("#toggle-password", "click", function () {
      const passwordField = document.getElementById("password");
      if (passwordField.type === "password") {
        passwordField.type = "text";
        this.innerHTML = "&#128584;"; // Closed eye icon
      } else {
        passwordField.type = "password";
        this.innerHTML = "&#128065;"; // Open eye icon
      }
    });

    // Add event listener to handle form submission
    addEventListeners("#update-form", "submit", async function (event) {
      event.preventDefault(); // Prevent default form submission

      // Collect updated user data from form
      const updatedUser = {
        ...storedUser, // Preserve existing user data
        firstName: document.getElementById("first-name").value,
        middleName: document.getElementById("middle-name").value,
        lastName: document.getElementById("last-name").value,
        gender: document.getElementById("gender").value,
        dateOfBirth: document.getElementById("dob").value,
        county: document.getElementById("county").value,
        email: document.getElementById("email").value,
        username: document.getElementById("username").value,
        password: document.getElementById("password").value,
      };

      // Handle profile picture upload
      if (imageUpload.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
          updatedUser.profilePic = e.target.result;
          updateProfile(updatedUser); // Call function to update profile
        };
        reader.readAsDataURL(imageUpload.files[0]);
      } else {
        updateProfile(updatedUser); // Call function to update profile
      }
    });

    // Function to update the user profile on the server
    async function updateProfile(updatedUser) {
      try {
        // Send a PATCH request to the server to update the user's profile
        const responseUser = await fetchFromApi(
          `students/${updatedUser.id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedUser),
          }
        );

        if (!responseUser) {
          throw new Error("Failed to update profile");
        }

        // Update sessionStorage with the new user data
        sessionStorage.setItem("loggedInUser", JSON.stringify(responseUser));
        console.log("Profile updated successfully");

        // Redirect to course registration page after a delay
        setTimeout(function () {
          window.location.href = "./registered_course.html";
        }, 3000);
      } catch (error) {
        console.error("Error updating profile:", error);
      }
    }
  } catch (error) {
    // Handle error if user is not logged in
    window.location.href = "./login.html"; // Redirect to login page
  }
});
