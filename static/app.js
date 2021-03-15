document.addEventListener("DOMContentLoaded", function () {
  const pages = ["#account", "#home", "#states", "#bills"];
  const billsPage = document.getElementById("bills");
  const statesPage = document.getElementById("states");
  const homePage = document.getElementById("home");
  const accountPage = document.getElementById("account");

  function hidePages() {
    for (let page of pages) {
      const pageElement = document.querySelector(page);
      pageElement.style.display = "none";
    }
  }

  function loadPage(pageID = "#bills") {
    hidePages();
    console.log("clicked");
    const contentArea = document.querySelector(pageID);
    contentArea.style.display = "flex";
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

  function toggleBackButtons() {
    const backButtons = document.querySelectorAll(".flex-column-back");
    for (let backButton of backButtons) {
      backButton.classList.toggle("invisible");
    }
  }

  //account page

  //home page

  loadPage();
});

function Page() {}

function Column() {}

function bill() {}

function state() {}
