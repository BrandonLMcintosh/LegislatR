document.addEventListener("DOMContentLoaded", async function () {
  // Edits required
  class App {
    constructor(pageStates, pageBills, user) {
      this.pageStates = pageStates;
      this.pageBills = pageBills;
      this.user = user;
    }

    hideAll = function () {
      for (let page of this.pages) {
        page.hide();
      }
    };

    init = function () {
      for (let page of this.pages) {
        page.init();
      }
    };

    // Needs edit
    loadPage = async function (pageID = "#account") {
      this.hideAll();
      await populateInitialInfo();
      if (!logged_in() && pageID == "#bills") {
        pageID = "#account";
      }

      if (logged_in()) {
        await populateUserData();
      }
      if (pageID == "#logout") {
        return await logout();
      }
      const contentArea = document.querySelector(pageID);
      contentArea.style.display = "flex";
    };
  }

  // Edits required
  class Page {
    constructor(selector, columns = {}) {
      this.selector = selector;
      this._element = document.getElementById(selector);
      this.columns = columns;
    }

    hide() {
      this._element.style.display = "none";
    }
    unhide() {
      this._element.style.display = "flex";
    }
    // Needs finished
    init = async function () {
      for (let column of this.columns) {
        column.init();
      }
    };
  }

  // Edits required
  class StatesPage extends Page {
    constructor(selector, columns = {}) {
      super(selector, columns);
    }

    // Needs edit
    populateStates = async function () {
      const stateSelect = document.querySelector("#register-form-state-select");
      const statesPageColumn = document.querySelector("#states-list");
      const response = await axios.get(apiURL + "states/list");
      const states = response.data;
      for (let state of states.data) {
        const stateOption = document.createElement("option");
        stateOption.value = state.id;
        stateOption.innerHTML = state.code;

        const stateDiv = document.createElement("div");
        stateDiv.classList.add("flex-column-item");

        stateSelect.appendChild(stateOption);
        statesPageColumn.appendChild(stateDiv);
      }
    };
  }

  // Edits required
  class BillsPage extends Page {
    constructor(selector, columns = {}) {
      super(selector, columns);
    }

    // Needs edit
    populateBills = async function (stateID, parentColumn) {
      response = await axios.get(apiURL + `states/${stateID}/bills`);
      bills = response.data.bills;
      for (let bill of bills) {
        const billElement = createInitialBillElement(bill);
        parentColumn.appendChild(billElement);
      }
    };

    // Needs finished
    populateTags = async function (userID) {};

    // Needs finished
    populateBillsFollowing = async function (userID) {};
  }

  // Edits Required
  class User {
    constructor(
      id = null,
      username = null,
      state = null,
      tags_following = [],
      bills_following = [],
      comments = [],
      liked_comments = [],
      //Not working at global scope
      apiURL = apiURL
    ) {
      this.id = id;
      this.username = username;
      this.state = state;
      this.tags_following = tags_following;
      this.bills_following = bills_following;
      this.comments = comments;
      this.liked_comments = liked_comments;
      this.registerURL = apiURL + "user/register";
      this.loginURL = apiURL + "user/login";
    }

    login = async function () {
      loginUsername = document.querySelector("#login-form-username");
      loginPassword = document.querySelector("#login-form-password");
      loginError = document.querySelector("#login-form-error");

      username = loginUsername.value;
      password = loginPassword.value;

      response = await axios.post(this.loginURL, {
        username: username,
        password: password,
      });

      data = response.data.data;
      if (data.error) {
        return (loginError.innerHTML = data.error);
      }

      loginError.innerHTML = null;

      sessionStorage.setItem("userID", data.user_id);

      loginUsername.value = null;
      loginPassword.value = null;

      user_response = await axios.get(apiURL + `user/${getUserID()}`);
      user = user_response.data;

      location.hash = "";
      location.hash = "#bills";
    };

    register = async function () {
      registerUsername = document.querySelector("#register-form-username");
      registerPassword = document.querySelector("#register-form-password");
      registerPhone = document.querySelector("#register-form-phone");
      registerState = document.querySelector("#register-form-state-select");
      registerError = document.querySelector("#register-form-error");

      const username = registerUsername.value;
      const password = registerPassword.value;
      const phone = registerPhone.value;
      const state = registerState.value;

      response = await axios.post(this.registerURL, {
        username: username,
        password: password,
        phone: phone,
        state: state,
      });

      data = response.data;
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
      location.hash = "#bills";
    };

    // Needs re-implemented
    logout = async function () {};

    loggedIn = function () {
      const userID = sessionStorage.getItem("userID");
      if (userID) {
        logoutNav.classList.remove("hidden");
        accountNav.classList.add("hidden");
        return true;
      }
      return false;
    };

    clear = async function () {};
  }

  // Edits required. Class may need to be more specific
  class Column {
    constructor(selector, url, items = []) {
      this._element = document.getElementById(selector);
      this.apiURL = apiURL + url;
      this.items = items;
    }

    init = async function () {
      response = await axios.get(apiURL);
      data = response.data;
      return data;
    };

    toggleBackButtons = function () {
      const backButtons = document.querySelectorAll(".flex-column-back");
      for (let backButton of backButtons) {
        backButton.classList.toggle("invisible");
      }
    };
  }

  //Edits required
  class State {
    constructor(id, code, name, full, url, politicians = [], bills = []) {
      this.id = id;
      this.code = code;
      this.name = name;
      this.full = full;
      this.webURL = url;
      this.politicians = politicians;
      this.bills = bills;
      this.apiURL = apiURL + `states/${this.id}`;
    }

    get element() {
      return this.buildElement();
    }

    buildElement() {
      const container = document.createElement("div");
      container.id = this.code;
      container.dataset.id = this.id;
      container.innerHTML = this.name;

      return container;
    }

    //Needs finished
    expand() {}
  }

  //Edits required
  class Bill {
    constructor(
      id,
      title,
      identifier,
      full,
      abstract = null,
      url = null,
      state,
      tags = [],
      sponsors = [],
      actions = {},
      comments = {}
    ) {
      this.id = id;
      this.title = title;
      (this.identifier = identifier), (this.full = full);
      this.abstract = abstract;
      this.webURL = url;
      this.state = state;
      this.tags = tags;
      this.sponsors = sponsors;
      this.actions = actions;
      this.comments = comments;
      this.apiURL = apiURL + `bills/${this.id}`;
    }

    // Needs edit
    create = function () {
      const container = document.createElement("div");
      container.dataset.id = bill.id;

      const title = document.createElement("h3");
      title.innerHTML = bill.title;

      const abstract = document.createElement("p");
      abstract.innerHTML = bill.abstract;

      const identifier = document.createElement("h2");
      identifier.innerHTML = bill.abstract;

      const sponsorList = document.createElement("ul");
      sponsorList.classList.toggle("hidden");

      const commentList = document.createElement("ul");
      commentList.classList.toggle("hidden");

      const tagList = document.createElement("p");
      tagList.appendChild();

      const follow = document.createElement("button");
      if (user.bills_following.contains(this.id)) {
        follow.innerHTML = "unfollow";
        follow.classList.toggle("hidden");
        follow.classList.add("unfollow");
      }
      follow.innerHTML = "follow";
      follow.classList.toggle("follow");

      const url = document.createElement("a");
      url.classList.toggle("hidden");
      url.href = bill.url;

      container.appendChild(billElementIdentifier);
      container.appendChild(billElementTitle);
      container.appendChild(billElementAbstract);

      return container;
    };

    expand = function () {};

    toggleFollow = async function () {};

    // Needs edit
    populateBill = async function (billID) {
      response = await axios.get(apiURL + `bills/${billID}`);
      data = response.data.data;
      console.log(data);
    };
  }

  // Edits required
  class Tag {
    constructor(id, name, taggedBills = []) {
      this.id = id;
      this.name = name;
      this.taggedBills = taggedBills;
    }
  }

  const user = new User();
  const apiURL = "http://localhost:5000/";

  const bills = new Page("bills");
  bills.following = new Column("bills-following");
  bills.state = new Column("bills-state");
  bills.tags = new Column("bills-tags");

  const states = new Page("states");
  states.list = new Column("states-list");
  states.info = new Column("states-info");

  const LGSLTR = new App(states, bills, user);

  const billsPage = document.querySelector("#bills");
  const statesPage = document.querySelector("#states");
  const loginForm = document.querySelector("#login-form");
  const registerForm = document.querySelector("#register-form");

  // PageIDs no longer exists. fix this.
  window.addEventListener("hashchange", async function () {
    hash = location.hash;
    if (pageIDs.includes(hash)) {
      return loadPage(hash);
    }
    if (hash == "#logout") {
      await logout();
    }
  });
  // Make edits to fit in the class functions
  billsPage.addEventListener("click", function (evt) {
    const parent = evt.target.parentNode;
    const target = evt.target;
    if (target.classList.contains("flex-column-header")) {
      parent.style.flexBasis = "100%";
      // Needs to reference column class
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

  // Make edits to fit in the class functions
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
    LGSLTR.user.login();
  });

  registerForm.addEventListener("submit", async function (evt) {
    evt.preventDefault();
    LGSLTR.user.register();
  });

  if (LGSLTR.user.loggedIn()) {
    await LGSLTR.loadPage("#bills");
  } else {
    await LGSLTR.loadPage();
  }
});
