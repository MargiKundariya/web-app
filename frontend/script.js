const API = "http://localhost:3000";

async function addUser() {

  const name = document.getElementById("nameInput").value;

  const email = document.getElementById("emailInput").value;

  if (!name || !email) {
    alert("Please enter all fields");
    return;
  }

  try {

    const response = await fetch(`${API}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name,
        email
      })
    });

    const data = await response.json();

    console.log(data);

    alert("User saved successfully!");

  } catch (error) {

    console.error(error);

    alert("Error saving user");

  }
}
async function loadUsers() {

  try {

    const response =
      await fetch(`${API}/users`);

    const users =
      await response.json();

    const list =
      document.getElementById("list");

    list.innerHTML = "";

    users.forEach(user => {

      const li =
        document.createElement("li");

      li.textContent =
        `${user.name} - ${user.email}`;

      list.appendChild(li);

    });

  } catch (error) {

    console.error(error);

  }
}
