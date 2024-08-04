/* Contains common functions to be used across different scripts
*/

// Function to fetch data from API
export async function fetchFromApi(endpoint, options = {}) {
    try {
      const response = await fetch(`http://localhost:3000/${endpoint}`, options);
      if (!response.ok) throw new Error(response.statusText);
      return response.json();
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
    }
  }

  // Function to add event listeners to elements matching the selector
  export function addEventListeners(selector, event, handler) {
    document.querySelectorAll(selector).forEach((element) => {
      element.addEventListener(event, handler);
    });
  }
