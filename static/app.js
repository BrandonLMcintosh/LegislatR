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
      for (let page of this.pages) {
        await page.init();
      }
    };

    // Needs edit
    loadPage = async function (page = "account") {
      this.hideAll();
      await this.init();
      const authenticated = await this.user.loggedIn();
      if (!authenticated && page == "bills") {
        page = "account";
      }

      if (authenticated) {
        page = "bills";

        await this.pageBills.populate(this.user);
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
        if (column.init) {
          await column.init();
        }
      }
    };
  }

  // Edits required
  class PageStates extends Page {
    constructor(selector, columns = {}) {
      super(selector, columns);
    }
  }

  // Edits required
  class PageBills extends Page {
    constructor(selector, columns = {}) {
      super(selector, columns);
    }

    populate = async function (user) {
      for (let column of Object.values(this.columns)) {
        await column.populate(user);
      }
    };
  }

  class PageAccounts extends Page {
    constructor(selector, columns = {}) {
      super(selector, columns);
    }
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
      this.updateURL = apiURL + `user/${this.id}`;
      this.logoutURL = apiURL + "user/logout";
    }

    login = async function () {
      const loginUsername = document.querySelector("#login-form-username");
      const loginPassword = document.querySelector("#login-form-password");
      const loginError = document.querySelector("#login-form-error");

      const username = loginUsername.value;
      const password = loginPassword.value;

      const response = await axios.post(this.loginURL, {
        username: username,
        password: password,
      });

      const data = response.data;
      if (data.error) {
        return (loginError.innerHTML = data.error);
      }

      loginError.innerHTML = null;
      const user = data.user;
      this.patch(user);

      loginUsername.value = null;
      loginPassword.value = null;

      location.hash = "";
      location.hash = "#bills";
    };

    register = async function () {
      const registerUsername = document.querySelector(
        "#register-form-username"
      );
      const registerPassword = document.querySelector(
        "#register-form-password"
      );
      const registerPhone = document.querySelector("#register-form-phone");
      const registerState = document.querySelector(
        "#register-form-state-select"
      );
      const registerError = document.querySelector("#register-form-error");

      const username = registerUsername.value;
      const password = registerPassword.value;
      const phone = registerPhone.value;
      const state = registerState.value;

      const response = await axios.post(this.registerURL, {
        username: username,
        password: password,
        phone: phone,
        state: state,
      });

      const data = response.data;

      if (data.error) {
        return (registerError.innerHTML = data.error);
      }

      registerError.innerHTML = null;
      const user = data.user;
      this.patch(user);

      registerUsername.value = null;
      registerPassword.value = null;
      registerPhone.value = null;
      registerState.value = null;

      location.hash = "";
      location.hash = "#bills";
    };

    logout = async function () {
      const response = await axios.get(logoutURL);
      this.clear();
    };

    loggedIn = async function () {
      const userID = sessionStorage.getItem("userID");
      if (!userID) {
        return false;
      }
      const logoutNav = document.querySelector("#nav-logout").parentElement;
      const accountNav = document.querySelector("#nav-account").parentElement;
      if (userID != "undefined") {
        this.updateURL = apiURL + `user/${userID}`;
        const result = await this.update();

        if (result == "error") {
          sessionStorage.removeItem("userID");
          return false;
        }

        logoutNav.classList.remove("hidden");

        accountNav.classList.add("hidden");
        return true;
      }
      return false;
    };

    update = async function () {
      const response = await axios.get(this.updateURL);
      const data = response.data;

      if (data.error) {
        return "error";
      }

      const user = data.user;
      this.patch(user);
    };

    patch = function (user) {
      sessionStorage.setItem("userID", user.id);

      this.id = user.id;
      this.username = user.username;
      this.state = user.state;
      this.tags_following = user.tags_following;
      this.bills_following = user.bills_following;
      this.comments = user.comments;
      this.liked_comments = user.liked_comments;
      this.updateURL = apiURL + `user/${this.id}`;
    };

    clear = function () {
      sessionStorage.removeItem("userID");
      this.id = null;
      this.username = null;
      this.state = null;
      this.tags_following = [];
      this.bills_following = [];
      this.comments = [];
      this.liked_comments = [];

      for (let column of Object.values(LGSLTR.bills.columns)) {
        column.clear();
      }

      for (let bill of stateBills) {
        bill.remove();
      }
      for (let tag of tagsFollowing) {
        tag.remove();
      }
    };
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

  // Needs INIT
  class BillsFollowing extends Column {
    constructor(selector, items = [], url) {
      super(selector, items);
      this.apiURL = apiURL + "";
    }

    populate = async function (user) {
      const bills = user.bills_following;

      for (let bill of bills) {
        newBill = new Bill(bill.id);
        await newBill.populate();
      }
    };

    clear = function () {
      const bills = document
        .querySelector("#bills-following")
        .querySelectorAll(".flex-column-item");

      for (let bill of bills) {
        bill.remove();
      }
      this.items = [];
    };
  }

  // Needs INIT
  class BillsState extends Column {
    constructor(selector, items = [], url) {
      super(selector, items);
      this.apiURL = apiURL + url;
    }

    populate = async function (user) {
      const response = await axios.get(
        apiURL + `states/${user.state.id}/bills`
      );
      const bills = response.data.state_bills;

      for (let bill of bills) {
        const abstract = bill.abstract;
        const actions = bill.actions;
        const comments = bill.comments;
        const full = bill.full;
        const id = bill.id;
        const identifier = bill.identifier;
        const sponsors = bill.sponsors;
        const state = bill.state;
        const tags = bill.tags;
        const title = bill.title;
        const url = bill.url;

        const newBill = new Bill(
          id,
          title,
          identifier,
          full,
          abstract,
          url,
          state,
          tags,
          sponsors,
          actions,
          comments
        );
        this.items.append(newBill);
        newBill.create();
      }
    };

    clear = function () {
      const stateBills = document
        .querySelector("#bills-state")
        .querySelectorAll(".flex-column-item");
      for (let bill of stateBills) {
        bill.remove();
      }
      this.items = [];
    };
  }

  // Needs INIT
  class BillsTags extends Column {
    constructor(selector, items = [], url) {
      super(selector, items);
      this.apiURL = apiURL + url;
    }

    populate = async function (user) {};

    clear = function () {
      const tagsFollowing = document
        .querySelector("#bills-tags")
        .querySelectorAll(".flex-column-item");
      for (let tag in tagsFollowing) {
        tag.remove();
      }
      this.items = [];
    };
  }

  class AccountLogin extends Column {
    constructor(selector, items = [], url = "user/login") {
      super(selector, items);
      this.apiURL = apiURL + url;
    }
  }

  class AccountRegister extends Column {
    constructor(selector, items = [], url = "user/register") {
      super(selector, items);
      this.apiURL = apiURL + url;
    }

    init = async function () {
      const stateSelect = document.querySelector("#register-form-state-select");
      const response = await axios.get(apiURL + "states/list");
      const states = response.data.states;
      for (let state of states) {
        const stateOption = document.createElement("option");
        stateOption.value = state.id;
        stateOption.innerHTML = state.code;
        stateSelect.prepend(stateOption);
      }
    };
  }

  class StatesList extends Column {
    constructor(selector, items = [], url = "states/list") {
      super(selector, items);
      this.apiURL = apiURL + url;
    }

    init = async function () {
      const response = await axios.get(this.apiURL);
      const states = response.data.states;
      for (let state of states) {
        let new_state = new State(
          state.id,
          state.code,
          state.name,
          state.full,
          state.url,
          state.politicians,
          state.bills
        );
        this.items.push(new_state);
        this._element.appendChild(new_state.buildElement());
      }
    };
  }

  class StatesInfo extends Column {
    constructor(selector, items = [], id) {
      super(selector, items);
    }

    init = async function () {};

    populate = async function () {};
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
      title = null,
      identifier = null,
      full = null,
      abstract = null,
      url = null,
      state = null,
      tags = [],
      sponsors = [],
      actions = {},
      comments = {}
    ) {
      this.id = id;
      this.title = title;
      this.identifier = identifier;
      this.full = full;
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
      container.dataset.id = this.id;
      container.classList.add("flex-column-item");

      const title = document.createElement("h3");
      title.innerHTML = this.title;
      title.classList.add("bill-title");

      const abstract = document.createElement("p");
      abstract.innerHTML = this.abstract;
      abstract.classList.toggle("hidden");
      abstract.classList.add("bill-abstract");

      const identifier = document.createElement("h2");
      identifier.innerHTML = this.identifier;
      identifier.classList.add("bill-identifier");

      const sponsorList = document.createElement("ul");
      for (let sponsor of this.sponsors) {
        const sponsorLI = document.createElement("li");
        sponsorLI.innerHTML = sponsor.name;
        sponsorLI.classList.append("bill-sponsor");
        sponsorList.appendChild(sponsorLI);
      }
      sponsorList.classList.toggle("hidden");
      sponsorsList.classList.add("bill-sponsors-list");

      const commentList = document.createElement("ul");
      commentList.classList.add("bill-comments-list");
      for (let comment of this.comments) {
        const commentLI = document.createElement("li");
        commentLI.classList.add("bill-comment");
        const commentText = document.createElement("p");
        const commentUser = document.createElement("p");
        const commentLikes = document.createElement("p");
        commentText.innerHTML = comment.text;
        commentText.classList.add("bill-comment-text");
        commentUser.innerHTML = comment.user;
        commentUser.classList.add("bill-comment-user");
        commentLikes.innerHTML = comment.likes;
        commentLikes.classList.add("bill-comment-likes");
        commentLI.appendChild(commentText);
        commentLI.appendChild(commentUser);
        commentLI.appendChild(commentLikes);
      }
      commentList.classList.toggle("hidden");

      const tagList = document.createElement("p");
      tagList.appendChild();

      const follow = document.createElement("button");
      if (LGSLTR.user.bills_following.contains(this.id)) {
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
    populate = async function (billID) {
      const response = await axios.get(this.apiURL);
      const data = response.data;
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
  states.columns.list = new StatesList("states-list", [], "states/list");
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

  LGSLTR.loadPage();
});
