const phrase =
  "Unlock the ease of accessing all your passwords, simplifying your digital life with one login";

// Get the password reminder element
const passwordReminder = document.getElementById("password-reminder");

// Function to dynamically write and erase the phrase
function writeAndErase(index, direction) {
  // Write the phrase if index is valid
  if (index >= 1 && index <= phrase.length) {
    passwordReminder.textContent = phrase.slice(0, index);
    //          start (optional): The index at which to begin extraction. If omitted, it extracts from the start of the array. If negative, it specifies an offset from the end of the array (e.g., -2 indicates the second-to-last element).as here start is set to 0 no negative index taken into consideration

    // end (optional): The index before which to end extraction. slice() extracts up to, but not including, the end index. If omitted, it extracts through the end of the array. If negative, it specifies an offset from the end of the array.
  }

  // Update the index based on the direction being + or - if - continuous going to reduce if + continuous going to increase untill reach end or begining
  index += direction;

  // If we reached the end of the phrase or the beginning, change direction always be 1 and -1
  if (index > phrase.length || index < 0) {
    direction *= -1;
  }

  // Call the function recursively after a delay
  setTimeout(() => {
    writeAndErase(index, direction);
  }, 100);
}

// Start the process
writeAndErase(1, 1);

//storing user details to local storage and window onload function reversing it
const photoInput = document.getElementById("photo-input");
const photoPreview = document.getElementById("photo-preview");
//selecting input feild of user details
const nameInput = document.getElementById("nameInput");
const professionInput = document.getElementById("professionInput");
const addressInput = document.getElementById("addressInput");

// Event listener for file input change
photoInput.addEventListener("change", function () {
  const file = this.files[0]; //files is a array and at the 0th index we selecting the file
  if (file) {
    const reader = new FileReader(); // Create a new FileReader object
    //  In JavaScript, the FileReader is an API provided by the browser to read the contents of files asynchronously.
    //  When you create a new instance of FileReader using the new keyword, it creates a new object that provides methods and properties for reading files.
    reader.onload = function (e) {
      // Set the background image of photoPreview to the read file
      photoPreview.style.backgroundImage = `url(${reader.result})`;
      // Store the photo URL in local storage
      localStorage.setItem("photoURL", reader.result);
    };
    reader.readAsDataURL(file); // Read the file as a data URL
  } else {
    photoPreview.style.backgroundImage = "none"; // If no file is chosen, remove the background image
  }
});

// Event listeners for input fields to store user details
nameInput.addEventListener("input", () =>
  localStorage.setItem("name", nameInput.value)
);
professionInput.addEventListener("input", () =>
  localStorage.setItem("profession", professionInput.value)
);
addressInput.addEventListener("input", () =>
  localStorage.setItem("address", addressInput.value)
);

// Load user details and photo when the page loads
window.addEventListener("load", () => {
  const name = localStorage.getItem("name");
  const profession = localStorage.getItem("profession");
  const address = localStorage.getItem("address");
  const photoURL = localStorage.getItem("photoURL");
  //set it again to input feild
  if (name) nameInput.value = name;
  if (profession) professionInput.value = profession;
  if (address) addressInput.value = address;
  if (photoURL) photoPreview.style.backgroundImage = `url(${photoURL})`;
});




//search filter funtionality
document.getElementById("search").addEventListener("keyup", function (event) {
  //searchTerm will trim the all targeted value and convert it to lowercase
  const searchTerm = event.target.value.trim().toLowerCase();
  //listItems selecting all the li-element of id-allpass 
  const listItems = document.querySelectorAll("#allpass li");
  //run a for each loop if get display else none
  listItems.forEach((item) => {
    const titleText = item.textContent.trim().toLowerCase();
    if (titleText.includes(searchTerm)) {
      item.style.display = "flex";
    } else {
      item.style.display = "none";
    }
  });
});






// Function to handle form submission
function handleFormSubmit(event) {
  event.preventDefault(); //preventing from auto submitted
  const website = document.getElementById("website").value.trim();
  const title = document.getElementById("title").value.trim(); // if any extra space then remove
  const password = document.getElementById("password").value.trim(); // if any extra space then remove
  //making a object of title and password
  const userdetails = {
    website: website,
    title: title,
    password: password,
  };
  //post the data using axios on crud crud
  axios
    .post(
      "https://crudcrud.com/api/d3da01ec65184a8286590e4a53b234e8/password",
      userdetails
    )
    .then((response) => {
      const newUserDetails = response.data;
      alert("Password & website added successfully");
      displayUserOnScreen(newUserDetails); // display on the screen fn called with argu  as userdetails
      updatePasswordCount(1); // Increment password count
    })
    .catch((error) => {
      console.error(error);
      alert("Error in adding website & password");
    });

  // Clear input fields
  document.getElementById("title").value = "";
  document.getElementById("password").value = "";
  document.getElementById("website").value = "";
}

// Function to display user details on the screen
function displayUserOnScreen(userdetails) {
  const passList = document.getElementById("allpass");
  const newLi = document.createElement("li"); //creating new element
  newLi.innerHTML = `${userdetails.website}-${userdetails.title} - ${userdetails.password} <button class="delete-btn">Delete</button> <button class="edit-btn">Edit</button>`;
  passList.appendChild(newLi); //append in allpass ul

  // Adding event listener for delete button
  const deleteBtn = newLi.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", function () {
    axios
      .delete(
        `https://crudcrud.com/api/d3da01ec65184a8286590e4a53b234e8/password/${userdetails._id}` //delete from cloud using specific id
      )
      .then(() => {
        newLi.remove(); //remove from screen
        updatePasswordCount(-1); // Decrement password count by -1
        alert("Password deleted successfully");
      })
      .catch(() => {
        alert("Error in deleting password");
      });
  });

  // Adding event listener for edit button
  const editBtn = newLi.querySelector(".edit-btn");
  editBtn.addEventListener("click", function () {
    document.getElementById("website").value = userdetails.website;
    document.getElementById("title").value = userdetails.title;
    document.getElementById("password").value = userdetails.password;
    updatePasswordCount(-1); // Decrement password count by -1
    newLi.remove(); //remove from screen

    axios
      .put(
        `https://crudcrud.com/api/d3da01ec65184a8286590e4a53b234e8/password/${userdetails._id}`,
        updatedUserDetails
      )
      .then(() => {
        // Update the password entry on the screen
        userdetails.website = newWebsite;
        userdetails.title = newTitle;
        userdetails.password = newPassword;
        newLi.innerHTML = ` ${newWebsite}-${newTitle} - ${newPassword} <button class="delete-btn">Delete</button> <button class="edit-btn">Edit</button>`;
        alert("Password updated successfully");
      })
      .catch(() => {
        alert("Error in updating password");
      });
  });
}

// Function to update password count
function updatePasswordCount(count) {
  //selecting the passwordcount id
  const passwordCount = document.getElementById("passwordcount");

  //to get the number of count from from text using the split method whose first element is text and second element is number but type string , using parseInt convert it into integer if this passwordCount.textContent.split(":")[1].trim() is Nan type then it will be return 0.
  let currentCount =
    parseInt(passwordCount.textContent.split(":")[1].trim()) || 0;
  currentCount += count; //increment the count
  passwordCount.innerHTML = `<li style="margin: 20px;">Total Passwords: ${currentCount}</li>`; // Update password count and insert element
}

// Function to load passwords on page load
window.addEventListener("DOMContentLoaded", () => {
  axios
    .get("https://crudcrud.com/api/d3da01ec65184a8286590e4a53b234e8/password")

    .then((response) => {
      const passwordCount = document.getElementById("passwordcount");
      passwordCount.innerHTML = `<li style="margin: 20px;">Total Passwords: ${response.data.length}</li>`; // Set initial passwordcount
      //using foreach loop display all data on screen that is already in backend/cloud
      response.data.forEach((userdetails) => {
        displayUserOnScreen(userdetails);
      });
    })

    .catch((error) => {
      console.error(error);
      alert("Error in fetching passwords");
    });

  // Add event listener for form submission
  document
    .getElementById("password-form")
    .addEventListener("submit", handleFormSubmit);
});

