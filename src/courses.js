import { fetchFromApi } from "./functions.js";

// Define the registerCourse function before the DOMContentLoaded event
async function registerCourse(courseId) {
  try {
    // Retrieve logged-in user data from session storage
    const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));

    // Check if loggedInUser is null, indicating no user is logged in
    if (!loggedInUser) {
      alert("Please log in to register for a course.");
      window.location.href = "./login.html";
      return; // Stop further execution
    }

    // Get the list of available courses from session storage
    const availableCourses = JSON.parse(
      sessionStorage.getItem("availableCourses")
    );
    const course = availableCourses.find((c) => c.id === courseId);

    if (!course) {
      alert("Course not found");
      return;
    }

    const users = await fetchFromApi("students");
    const user = users.find((user) => user.id === loggedInUser.id);

    if (!user) {
      alert("User not found");
      return;
    }

    // Check if the course is already registered
    if (user.courses.some((c) => c.id === courseId)) {
      alert("You are already registered for this course");
      return;
    }

    // Add the course to the user's registered courses
    user.courses.push(course);

    // Update the user's data on the server
    await fetchFromApi(`students/${user.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    // Update the session storage with the new user data
    sessionStorage.setItem("loggedInUser", JSON.stringify(user));

    alert(`Registered for course: ${course.title}`);
  } catch (error) {
    console.error("Error registering course:", error);
  }
}

// Attach the registerCourse function to the window object to make it globally accessible
window.registerCourse = registerCourse;

document.addEventListener("DOMContentLoaded", () => {
  const courses = [
    {
      id: 1,
      title: "Introduction to HTML",
      description: "The backbone of WWW 🌐",
    },
    {
      id: 2,
      title: "Introduction to Python",
      description: "Get introduced to Python 🐍",
    },
  ];

  const courseList = document.querySelector(".course-list");

  courses.forEach((course) => {
    const courseItem = document.createElement("div");
    courseItem.className = "course-item";
    courseItem.innerHTML = `
      <h2>${course.title}</h2>
      <p>${course.description}</p>
      <button onclick="registerCourse(${course.id})">Register</button>
    `;
    courseList.appendChild(courseItem);
  });

  // Store courses in session storage for later use
  sessionStorage.setItem("availableCourses", JSON.stringify(courses));
});
