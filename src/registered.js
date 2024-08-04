// Import the fetchFromApi function
import { fetchFromApi } from './functions.js';

document.addEventListener("DOMContentLoaded", () => {
  // Retrieve the logged-in user from session storage
  const storedUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
  
  // Check if storedUser is null, which means no user is logged in
  if (!storedUser) {
    // Redirect to login page if no user is found
    window.location.href = "./login.html";
    return; // Stop further execution
  }

  // If user is logged in, proceed with fetching registered courses
  console.log(storedUser);
  const registeredCourses = storedUser.courses || [];

  const registeredCoursesList = document.querySelector(".registered-courses");

  if (registeredCourses.length === 0) {
    registeredCoursesList.innerHTML = 
      '<p>No course(s) found 😭</p>';
    registeredCoursesList.style.backgroundColor = "transparent";
    registeredCoursesList.style.color = "red";
  } else {
    registeredCourses.forEach((course) => {
      const courseItem = document.createElement("div");
      courseItem.className = "course-item";
      courseItem.innerHTML = 
        `<h2>${course.title}</h2>
        <p>${course.description}</p>
        <div class="course-buttons">
          <button onclick="accessCourse(${course.id})">Access Course</button>
          <button class="remove-course" onclick="removeCourse(${course.id})">Remove Course</button>
        </div>`;
      registeredCoursesList.appendChild(courseItem);
    });
  }
});

function accessCourse(courseId) {
  if (courseId == 1) {
    window.location.href = "./html_intro.html";
  } else {
    window.location.href = "./python_intro.html";
  }
}
// Attach the accessCourse function to the window object to make it globally accessible
window.accessCourse = accessCourse;

async function removeCourse(courseId) {
  try {
    const users = await fetchFromApi('students');
    const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
    const user = users.find((user) => user.id === loggedInUser.id);

    if (!user) {
      alert("User not found");
      return;
    }

    let confirmDeletion = confirm("Proceed to remove course?");
    if (confirmDeletion) {
      user.courses = user.courses.filter((course) => course.id !== courseId);
    } else {
      return;
    }

    await fetchFromApi(`students/${user.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    sessionStorage.setItem("loggedInUser", JSON.stringify(user));

    window.location.reload();
  } catch (error) {
    console.error("Error removing course:", error);
  }
}
// Attach the removeCourse function to the window object to make it globally accessible
window.removeCourse = removeCourse;
