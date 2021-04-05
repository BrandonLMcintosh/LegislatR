document.addEventListener("DOMContentLoaded", async function () {
  const pageIDs = ["#account", "#states", "#bills"];
  const pages = ["account", "states", "bills"];
  const apiURL = "http://localhost:5000/";
  const billsPage = document.querySelector("#bills");
  const statesPage = document.querySelector("#states");
  const loginForm = document.querySelector("#login-form");
  const registerForm = document.querySelector("#register-form");
  const logoutNav = document.querySelector("#nav-logout");
  const accountNav = document.querySelector("#nav-account");
  const userID = sessionStorage.getItem("userID");

  function logged_in() {
    if (sessionStorage.getItem("userID")) {
      logoutNav.classList.remove("hidden");
      accountNav.classList.add("hidden");
      return true;
    }
    return false;
  }

  function hidePages() {
    for (let page of pages) {
      const pageElement = document.getElementById(page);
      pageElement.style.display = "none";
    }
  }

  async function loadPage(pageID = "#account") {
    hidePages();
    await populateInitialInfo();
    if (userID) {
      pageID = "#bills";
    }
    const contentArea = document.querySelector(pageID);
    contentArea.style.display = "flex";
  }

  async function logout() {
    await axios.get(apiURL + "/user/logout");
    accountNav.classList.remove("hidden");
    logoutNav.classList.add("hidden");
    sessionStorage.removeItem("userID");
    location.hash = "";
    location.hash = "#account";
  }

  function toggleBackButtons() {
    const backButtons = document.querySelectorAll(".flex-column-back");
    for (let backButton of backButtons) {
      backButton.classList.toggle("invisible");
    }
  }

  async function populateInitialInfo() {
    const stateSelect = document.querySelector("#register-form-state-select");
    const statesPageColumn = document.querySelector("#states-list");
    const response = await axios.get(apiURL + "/states/list");
    const states = response.data;
    for (let state of states.data) {
      const stateOption = document.createElement("option");
      stateOption.value = state.id;
      stateOption.innerHTML = state.code;

      const stateDiv = document.createElement("div");
      stateDiv.classList.add("flex-column-item");
      stateDiv.id = state.code;
      stateDiv.dataset.id = state.id;
      stateDiv.innerHTML = state.name;

      stateSelect.appendChild(stateOption);
      statesPageColumn.appendChild(stateDiv);
    }
  }

  window.addEventListener("hashchange", async function () {
    hash = location.hash;
    if (pageIDs.includes(hash)) {
      return loadPage(hash);
    }
    if (hash == "#logout") {
      await logout();
    }
  });

  billsPage.addEventListener("click", function (evt) {
    const parent = evt.target.parentNode;
    const target = evt.target;
    if (target.classList.contains("flex-column-header")) {
      parent.style.flexBasis = "100%";
      toggleBackButtons();
    }

    if (parent.classList.contains("flex-column-header")) {
      target.parentNode.parentNode.style.flexBasis = "100%";
      target.sibling;
      toggleBackButtons();
    }

    if (target.classList.contains("flex-column-back")) {
      target.parentNode.parentNode.style.flexBasis = "auto";
      toggleBackButtons();
    }
  });

  statesPage.addEventListener("click", function (evt) {
    const target = evt.target;
    const parent = target.parentNode;
    if (
      target.classList.contains("flex-column-item") |
      parent.classList.contains("flex-column-item")
    ) {
      document.querySelector("#states-list").style.flexBasis = "5%";
    }
  });

  loginForm.addEventListener("submit", async function (evt) {
    evt.preventDefault();

    loginUsername = document.querySelector("#login-form-username");
    loginPassword = document.querySelector("#login-form-password");
    loginError = document.querySelector("#login-form-error");

    username = loginUsername.value;
    password = loginPassword.value;

    response = await axios.post(apiURL + "/user/login", {
      username: username,
      password: password,
    });

    data = response.data.data;
    if (data.error) {
      return (loginError.innerHTML = data.error);
    }

    loginError.innerHTML = null;

    console.log(data);
  });

  registerForm.addEventListener("submit", async function (evt) {
    evt.preventDefault();

    registerUsername = document.querySelector("#register-form-username");
    registerPassword = document.querySelector("#register-form-password");
    registerPhone = document.querySelector("#register-form-phone");
    registerState = document.querySelector("#register-form-state-select");
    registerError = document.querySelector("#register-form-error");

    username = registerUsername.value;
    password = registerPassword.value;
    phone = registerPhone.value;
    state = registerState.value;

    response = await axios.post(apiURL + "/user/register", {
      username: username,
      password: password,
      phone: phone,
      state: state,
    });

    data = response.data.data;
    if (data.error) {
      return (registerError.innerHTML = data.error);
    }

    registerError.innerHTML = null;

    sessionStorage.setItem("userID", data.user_id);

    registerUsername.value = null;
    registerPassword.value = null;
    registerPhone.value = null;
    registerState.value = null;

    location.hash = "";
    location.hash = "bills";
  });

  if (logged_in()) {
    location.hash = "";
    location.hash = "bills";
  } else {
    location.hash = "";
    location.hash = "account";
  }
});
