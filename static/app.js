document.addEventListener("DOMContentLoaded", async function () {
  const apiURL = "http://localhost:5000/";
  const billsPage = document.querySelector("#bills");
  const statesPage = document.querySelector("#states");
  const loginForm = document.querySelector("#login-form");
  const registerForm = document.querySelector("#register-form");
  // Edits required
  class App {
    constructor(pageStates, pageBills, pageAccount, user) {
      this.pageStates = pageStates;
      this.pageBills = pageBills;
      this.pageAccount = pageAccount;
      this.pages = [this.pageStates, this.pageBills, this.pageAccount];
      this.user = user;
    }

    hideAll = function () {
      for (let page of this.pages) {
        page.hide();
      }
    };

    init = async function () {
      console.log("initializing pages");
      for (let page of this.pages) {
        await page.init();
      }
    };

    // Needs edit
    loadPage = async function (page = "account") {
      this.hideAll();
      await this.init();
      if (!this.user.loggedIn() && page == "bills") {
        page = "account";
      }

      if (LGSLTR.user.loggedIn()) {
        await populateUserData();
      }

      if (page == "account") {
        this.pageAccount.unhide();
      } else if (page == "bills") {
        this.pageBills.unhide();
      } else if (page == "states") {
        this.pageStates.unhide();
      } else if (page == "logout") {
        this.user.logout();
      }
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
      for (let column of Object.values(this.columns)) {
        column.init();
      }
    };
  }

  // Edits required
  class PageStates extends Page {
    constructor(selector, columns = {}) {
      super(selector, columns);
    }

    // Needs edit
    init = async function () {
      for (let column of Object.values(columns)) {
        column.init();
      }
    };
  }

  // Edits required
  class PageBills extends Page {
    constructor(selector, columns = {}) {
      super(selector, columns);
    }

    // Needs edit
    populateStateBills = async function (stateID) {
      response = await axios.get(apiURL + `states/${stateID}/bills`);
      bills = response.data.bills;
      for (let bill of bills) {
        const billElement = createInitialBillElement(bill);
        parentColumn.appendChild(billElement);
      }
    };

    // Needs finished
    populateTags = async function (user) {};

    // Needs finished
    populateBillsFollowing = async function (user) {};

    populateUserData = async function (user) {};
  }

  class PageAccounts extends Page {
    constructor(selector, columns = {}) {
      super(selector, columns);
    }

    init = async function () {
      response = await axios.get(apiURL + "states/list");
      data = response.data;
      console.log(data);
    };
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
      liked_comments = []
      //Not working at global scope
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
    constructor(selector, items = []) {
      this._element = document.getElementById(selector);
      this.items = items;
    }

    toggleBackButtons = function () {
      const backButtons = document.querySelectorAll(".flex-column-back");
      for (let backButton of backButtons) {
        backButton.classList.toggle("invisible");
      }
    };
  }

  class BillsFollowing extends Column {
    constructor(selector, items = [], url) {
      super(selector, items);
      this.apiURL = apiURL + "";
    }

    init = async function () {};
  }

  class BillsState extends Column {
    constructor(selector, items = [], url) {
      super(selector, items);
      this.apiURL = apiURL + url;
    }

    init = async function () {};
  }

  class BillsTags extends Column {
    constructor(selector, items = [], url) {
      super(selector, items);
      this.apiURL = apiURL + url;
    }

    init = async function () {};
  }

  class AccountLogin extends Column {
    constructor(selector, items = [], url = "user/login") {
      super(selector, items);
      this.apiURL = apiURL + url;
    }

    init = async function () {};
  }

  class AccountRegister extends Column {
    constructor(selector, items = [], url = "user/register") {
      super(selector, items);
      this.apiURL = apiURL + url;
    }

    init = async function () {
      const stateSelect = document.querySelector("#register-form-state-select");
      const response = await axios.get(apiURL + "states/list");
      const states = response.data;
      console.log(states);
      for (let state of states.data) {
        const stateOption = document.createElement("option");
        stateOption.value = state.id;
        stateOption.innerHTML = state.code;
        stateSelect.appendChild(stateOption);
      }
    };
  }

  class StatesList extends Column {
    constructor(selector, items = [], url = "states/list") {
      super(selector, items);
      this.apiURL = apiURL + url;
    }

    init = async function () {
      response = await axios.get(apiURL);
      const states = response.data;
      for (let state of states.data) {
        let new_state = new State(
          state.id,
          state.code,
          state.name,
          state.full,
          state.url,
          state.politicians,
          state.bills
        );
        this.items.append(new_state);
        this._element.appendChild(new_state.buildElement());
      }
    };
  }

  class StatesInfo extends Column{
    constructor(selector, items = [], id)
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
  const bills = new PageBills("bills");
  bills.columns.following = new BillsFollowing("bills-following");
  bills.columns.state = new BillsState("bills-state");
  bills.columns.tags = new BillsTags("bills-tags");
  const states = new PageStates("states");
  states.columns.list = new StatesList("states-list", "states/list");
  states.columns.info = new StatesInfo("states-info");
  const account = new PageAccounts("account");
  account.columns.login = new AccountLogin("account-login");
  account.columns.register = new AccountRegister("account-register");
  const LGSLTR = new App(states, bills, account, user);

  window.addEventListener("hashchange", async function () {
    hash = location.hash;
    page = hash.slice(1);
    LGSLTR.loadPage(page);
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
    await LGSLTR.loadPage("bills");
  } else {
    await LGSLTR.loadPage();
  }
});
