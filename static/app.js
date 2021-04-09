document.addEventListener("DOMContentLoaded", async function () {
  const apiURL = "http://localhost:5000/";
  const billsPage = document.querySelector("#bills");
  const statesPage = document.querySelector("#states");
  const loginForm = document.querySelector("#login-form");
  const registerForm = document.querySelector("#register-form");

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
    loadPage = async function (page = "bills") {
      this.hideAll();
      await this.init();
      const authenticated = await this.user.loggedIn();
      if (!authenticated && page == "bills") {
        console.log("not logged in");
        page = "account";
      }

      if (authenticated) {
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
      location.hash = this.selector;
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

  class PageStates extends Page {
    constructor(selector, columns = {}) {
      super(selector, columns);
    }
  }

  class PageBills extends Page {
    constructor(selector, columns = {}) {
      super(selector, columns);
    }

    populate = async function (user) {
      for (let column of Object.values(this.columns)) {
        await column.populate(user);
      }
    };

    toggleBackButtons = function () {
      const backButtons = document.querySelectorAll(".flex-column-back");
      for (let backButton of backButtons) {
        backButton.classList.toggle("invisible");
      }
    };
  }

  class PageAccounts extends Page {
    constructor(selector, columns = {}) {
      super(selector, columns);
    }
  }

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
      const response = await axios.get(this.logoutURL);
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

      for (let column of Object.values(LGSLTR.pageBills.columns)) {
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

  class Column {
    constructor(selector, items = []) {
      this._element = document.getElementById(selector);
      this.items = items;
    }
  }

  class BillsFollowing extends Column {
    constructor(selector, items = [], url) {
      super(selector, items);
      this.apiURL = apiURL + "";
    }

    populate = async function (user) {
      const bills = user.bills_following;

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
        this.items.push(newBill);
        const billElement = newBill.create();
        this._element.appendChild(billElement);
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
        this.items.push(newBill);
        const billElement = newBill.create();
        this._element.appendChild(billElement);
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
        this._element.appendChild(new_state.create());
      }
    };
  }

  class StatesInfo extends Column {
    constructor(selector, items = [], id) {
      super(selector, items);
    }

    init = async function () {};

    populate = async function (stateID) {};
  }

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

    create = function () {
      const container = document.createElement("div");
      container.id = this.code;
      container.dataset.id = this.id;
      container.innerHTML = this.name;
      container.classList.add("flex-column-item");

      return container;
    };

    //Needs finished
    expand() {}
  }

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
      actions = [],
      comments = []
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

    createIdentifier = function () {
      const identifier = document.createElement("h6");
      identifier.innerHTML = this.identifier;
      identifier.classList.add("bill-identifier");

      return identifier;
    };

    createTitle = function () {
      const title = document.createElement("p");
      title.innerHTML = this.title;
      title.classList.add("bill-title");

      return title;
    };

    createAbstract = function () {
      const abstract = document.createElement("p");
      abstract.innerHTML = this.abstract;
      abstract.classList.add("extra");
      abstract.classList.add("bill-abstract");

      return abstract;
    };

    createSponsorsList = function () {
      const sponsorsList = document.createElement("ul");
      sponsorsList.classList.add("extra");
      sponsorsList.classList.add("bill-sponsors-list");

      for (let sponsor of this.sponsors) {
        const sponsorLI = document.createElement("li");
        sponsorLI.innerHTML = sponsor.name;
        sponsorLI.classList.add("bill-sponsor");
        sponsorsList.appendChild(sponsorLI);
      }

      return sponsorsList;
    };

    createCommentsList = function () {
      const commentsList = document.createElement("ul");
      commentsList.classList.add("bill-comments-list");
      commentsList.classList.add("extra");

      if (this.comments) {
        for (let comment of this.comments) {
          const commentLI = document.createElement("li");
          commentLI.classList.add("bill-comment");

          const commentText = document.createElement("p");
          commentText.innerHTML = comment.text;
          commentText.classList.add("bill-comment-text");

          const commentUser = document.createElement("p");
          commentUser.innerHTML = comment.user;
          commentUser.classList.add("bill-comment-user");

          const commentLikes = document.createElement("p");
          commentLikes.innerHTML = comment.likes;
          commentLikes.classList.add("bill-comment-likes");

          commentLI.appendChild(commentText);
          commentLI.appendChild(commentUser);
          commentLI.appendChild(commentLikes);

          commentsList.appendChild(commentLI);
        }
      }

      return commentsList;
    };

    createTagsList = function () {
      const tagsList = document.createElement("p");
      tagsList.classList.add("bill-tags-list");
      if (this.tags) {
        for (let tag of this.tags) {
          const tagSpan = document.createElement("span");
          tagSpan.classList.add("bill-tag");
          tagSpan.innerHTML = tag.name;

          tagsList.appendChild(tagSpan);
        }
      }

      return tagsList;
    };

    createExpand = function () {
      const expand = document.createElement("i");
      expand.classList.add("bill-toggle-expand");
      expand.classList.add("fas");
      expand.classList.add("fa-chevron-circle-down");
      return expand;
    };

    createFollow = function () {
      const follow = document.createElement("i");
      const bills_following_ids = [];
      follow.classList.add("bill-toggle-follow");
      follow.classList.add("fas");

      for (let bill of LGSLTR.user.bills_following) {
        bills_following_ids.push(bill.id);
      }
      if (bills_following_ids.includes(this.id)) {
        follow.classList.add("fa-minus-circle");
        return follow;
      }

      follow.classList.add("fa-plus-circle");

      return follow;
    };

    createURL = function () {
      const url = document.createElement("a");
      url.classList.add("extra");
      url.classList.add("bill-url");
      url.href = this.webURL;

      return url;
    };

    // Needs edit
    create = function () {
      const container = document.createElement("div");
      container.dataset.id = this.id;
      container.classList.add("flex-column-item");

      const identifier = this.createIdentifier();
      const follow = this.createFollow();
      const expand = this.createExpand();
      const title = this.createTitle();
      const abstract = this.createAbstract();
      const sponsorsList = this.createSponsorsList();
      const commentsList = this.createCommentsList();
      const tagsList = this.createTagsList();

      container.appendChild(identifier);
      container.appendChild(expand);
      container.appendChild(follow);
      container.appendChild(title);
      container.appendChild(abstract);
      container.appendChild(sponsorsList);
      container.appendChild(commentsList);
      container.appendChild(tagsList);

      const extras = container.querySelectorAll(".extra");
      for (let extra of extras) {
        extra.classList.toggle("hidden");
      }

      this._element = container;

      return container;
    };

    toggleExpand = function () {
      if (!this.full) {
        this.update();
      }

      const extras = this._element.querySelectorAll(".extra");

      const expandToggle = this._element.querySelector(".bill-toggle-expand");

      for (let extra of extras) {
        extra.classList.toggle("hidden");
      }
      console.log("FLIP!");
      expandToggle.classList.toggle("flip");
    };

    toggleFollow = async function () {
      const response = await axios.post(apiURL + "/follow");
      console.log(response.data);
    };

    // Needs edit
    update = async function (billID) {
      const response = await axios.get(this.apiURL);
      const data = response.data.bill;
      this.abstract = data.abstract;
      this.actions = data.actions;
      this.comments = data.comments;
      this.full = data.full;
      this.identifier = data.identifier;
      this.sponsors = data.sponsors;
      this.state = data.state;
      this.tags = data.tags;
      this.title = data.title;
      this.url = data.url;

      this.console.log(data);
    };
  }

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

  billsPage.addEventListener("click", function (evt) {
    const parent = evt.target.parentNode;
    const target = evt.target;
    if (target.classList.contains("flex-column-header")) {
      parent.style.flexBasis = "100%";
      // Needs to reference column class
      LGSLTR.pageBills.toggleBackButtons();
    }

    if (parent.classList.contains("flex-column-header")) {
      target.parentNode.parentNode.style.flexBasis = "100%";
      LGSLTR.pageBills.toggleBackButtons();
    }

    if (target.classList.contains("flex-column-back")) {
      target.parentNode.parentNode.style.flexBasis = "32%";
      LGSLTR.pageBills.toggleBackButtons();
    }

    if (target.classList.contains("bill-toggle-expand")) {
      const id = target.parentNode.dataset.id;
      const column = target.parentNode.parentNode.id;
      if (column == "bills-following") {
        const bill = LGSLTR.pageBills.columns.following.items.find(
          (bill) => bill.id == id
        );
        bill.toggleExpand();
      } else if (column == "bills-state") {
        const bill = LGSLTR.pageBills.columns.state.items.find(
          (bill) => bill.id == id
        );
        bill.toggleExpand();
      }
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
    LGSLTR.user.login();
  });

  registerForm.addEventListener("submit", async function (evt) {
    evt.preventDefault();
    LGSLTR.user.register();
  });

  LGSLTR.loadPage();
});
