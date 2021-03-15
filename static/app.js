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

  loadPage();
});

function Page(columns) {
  this.columns = columns;
  this.update = async function () {};
}

function Column() {}

function Bill(dbID, body, state, tags, sponsors, comments) {
  this.dbID = dbID;
  this.body = body;
  this.state = state;
  this.tags = tags;
  this.sponsors = sponsors;
  this.comments = comments;
  this.update = async function () {
    return;
  };
}

function State(dbID, code, bills, politicians) {
  this.dbID = dbID;
  this.code = code;
  this.bills = bills;
  this.politicians = politicians;
  this.update = async function () {
    return;
  };
}

function Tag(dbID, bills) {
  this.dbID = dbID;
  this.bills = bills;
  this.update = async function () {};
}

function Politician(dbID, fullName, state, sponsoredBills, senator) {
  this.dbID = dbID;
  this.fullName = fullName;
  this.state = state;
  this.sponsoredBills = sponsoredBills;
  this.senator = senator;
  this.update = async function () {
    return;
  };
}

function User(dbID, username, phone, state, tags, bills, comments) {
  this.dbID = dbID;
  this.username = username;
  this.phone = phone;
  this.state = state;
  this.tags = tags;
  this.bills = bills;
  this.comments = comments;
  this.update = async function () {
    return;
  };
}

//process login
const localStorage = window.localStorage;
if (localStorage.getItem("user")) {
  loadPage("#bills");
} else {
  loadPage("#account");
}
