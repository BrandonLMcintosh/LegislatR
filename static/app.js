document.addEventListener("DOMContentLoaded", async function () {
  const pageIDs = ["#account", "#states", "#bills"];
  const pages = ['account', 'states', 'bills']
  const apiURL = "http://localhost:5000/";
  const billsPage = document.querySelector("#bills");
  const statesPage = document.querySelector("#states");
  const accountPage = document.querySelector("#state");
  const userID = sessionStorage.getItem("userID");
  location.hash = "";

  function hidePages() {
    for (let page of pages) {
      const pageElement = document.querySelector(page);
      pageElement.style.display = "none";
    }
  }

  async function loadPage(pageID = "#account") {
    hidePages();
    await populateInitialInfo();
    if (userID) {
      pageID = "#bills";
    }
    location.hash = 
    const contentArea = document.querySelector(pageID);
    contentArea.style.display = "flex";
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

  window.addEventListener("hashchange", function () {
    loadPage(location.hash);
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

  accountsPage.addEventListener("click", function (evt) {
    evt.preventDefault();
  });

  await loadPage();
});
