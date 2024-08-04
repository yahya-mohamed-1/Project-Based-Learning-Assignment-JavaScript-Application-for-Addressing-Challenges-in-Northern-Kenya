import { fetchFromApi , addEventListeners} from "./functions.js";
document.addEventListener("DOMContentLoaded", function () {
  // Select necessary DOM elements
  const userContainer = document.getElementById("user-details-container");
  const searchInput = document.getElementById("search-input");
  const modal = document.querySelector(".modal");
  const overlay = document.querySelector(".overlay");
  const modalContent = document.querySelector(".modal-content");

  // Create a Broadcast Channel to notify other tabs of user logout
  const logoutChannel = new BroadcastChannel("user-logout");

  // Function to fetch and display users
  async function fetchUsers() {
    const users = await fetchFromApi("students");
    if (users) displayUsers(users);
  }

  // Function to create a user card element
  function createUserCard(user) {
    // Limit names of users to 5 characters only, followed by '...'
    let userNames = `${user.firstName} ${user.middleName} ${user.lastName}`;
    userNames =
      userNames.length > 5 ? `${userNames.slice(0, 5).trim()}...` : userNames;

    // Create user card element with user details
    const userCard = document.createElement("div");
    userCard.classList.add("user-card");
    userCard.innerHTML = `
      <div class="user-card-content">
        <img src="${user.profilePic}" alt="${user.firstName}'s profile picture" class="profile-pic">
        <div class="user-info">
          <p>${userNames}</p>
          <div class="user-actions">
            <button class="view-profile" data-id="${user.id}">View Profile</button>
            <button class="delete-user" data-id="${user.id}">Delete User</button>
          </div>
        </div>
      </div>
    `;
    return userCard;
  }

  // Function to display users in the container
  function displayUsers(users) {
    // Clear existing content before displaying new users
    userContainer.innerHTML = "";
    users.forEach((user) => {
      userContainer.appendChild(createUserCard(user));
    });
    // Add event listeners to the buttons within user cards
    addEventListeners(".view-profile", "click", viewProfileHandler);
    addEventListeners(".delete-user", "click", deleteUserHandler);
  }

  // Handler for view profile button click
  async function viewProfileHandler(event) {
    // Get the user ID from the button data attribute
    const userId = event.target.getAttribute("data-id");
    // Fetch and display user details in the modal
    const user = await fetchFromApi(`students/${userId}`);
    if (user) showModal(user);
  }

  // Function to show modal with user details
  function showModal(user) {
    // Prepare course list and populate modal content with user details
    let coursesList = user.courses.length
      ? user.courses.map((course) => course.title).join(", ")
      : "Not registered for any course.";
    modalContent.innerHTML = `
      <h2>${user.firstName} ${user.middleName} ${user.lastName}</h2>
      <p><strong>Username:</strong> ${user.username}</p>
      <p><strong>Email:</strong> ${user.email}</p>
      <p><strong>Date of Birth:</strong> ${user.dateOfBirth}</p>
      <p><strong>County of Birth:</strong> ${user.county}</p>
      <p><strong>Gender:</strong> ${user.gender}</p>
      <p><strong>Course(s):</strong> ${coursesList}</p>
    `;
    // Show the modal and overlay
    modal.classList.remove("hidden");
    overlay.classList.remove("hidden");
  }

  // Function to hide the modal
  function hideModal() {
    modal.classList.add("hidden");
    overlay.classList.add("hidden");
  }

  // Handler for delete user button click
  async function deleteUserHandler(event) {
    // Get the user ID from the button data attribute
    const userId = event.target.getAttribute("data-id");
    // Confirm the deletion and delete the user if confirmed
    if (confirm("Proceed to delete?")) {
      const response = await fetchFromApi(`students/${userId}`, {
        method: "DELETE",
      });
      if (response) {
        fetchUsers(); // Refresh the user list after deletion

        // Notify all tabs to logout the user
        logoutChannel.postMessage({ action: "logout", userId });
        sessionStorage.setItem("userLoggedOut", "true");
      }
    }
  }

  // Function to handle search functionality
  function searchUsers(event) {
    event.preventDefault(); // Prevent default form submission
    const query = searchInput.value.toLowerCase().trim(); // Get the search query
    if (!query) {
      fetchUsers(); // If no query, fetch all users
      return;
    }

    // Fetch and filter users based on the search query
    fetchFromApi("students").then((users) => {
      const filteredUsers = users.filter((user) =>
        [user.firstName, user.middleName, user.lastName].some((name) =>
          name.toLowerCase().includes(query)
        )
      );
      // Display filtered users or a 'not found' message
      filteredUsers.length
        ? displayUsers(filteredUsers)
        : (userContainer.innerHTML =
            '<p class="not-found">User not found 😭</p>');
    });
  }

  // Function to handle closing the search and clearing input
  function closeSearchHandler() {
    searchInput.value = "";
    searchInput.blur();
    fetchUsers(); // Fetch all users again
  }

  // Fetch and display users on page load
  fetchUsers();

  // Event listener for the Escape key to close the search
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeSearchHandler();
  });

  // Event listener for search form submission
  addEventListeners("#search-form", "submit", searchUsers);

  // Event listener for close modal button click
  addEventListeners(".close-modal", "click", hideModal);

  // Event listener for the Escape key to close the modal
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") hideModal();
  });

  // Event listener for clicking outside the modal to close it
  window.addEventListener("click", function (e) {
    if (e.target === overlay) hideModal();
  });
});
