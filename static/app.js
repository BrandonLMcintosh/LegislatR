document.addEventListener("DOMContentLoaded", async function () {
  const apiURL = "http://lgsltr.herokuapp.com/";
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
      this.clear();
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
      const existingStates = this._element.querySelectorAll(
        ".flex-column-item"
      );
      if (existingStates.length != 52) {
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
      }
    };
  }

  class StatesBills extends Column {
    constructor(selector, items = [], id) {
      super(selector, items);
    }

    init = async function () {};

    populate = async function (stateID) {
      this.clear();
      const result = await axios.get(apiURL + "states/" + stateID + "/bills");
      const response = result.data;
      const billsList = response.state_bills;
      for (let bill of billsList) {
        const id = bill.id;
        const title = bill.title;
        const identifier = bill.identifier;
        const full = bill.full;
        const abstract = bill.abstract;
        const url = bill.url;
        const state = bill.state;
        const tags = bill.tags;
        const sponsors = bill.sponsors;
        const actions = bill.actions;
        const comments = bill.comments;
        const new_bill = new Bill(
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
        this._element.appendChild(new_bill.create());
        this.items.push(new_bill);
      }
    };

    clear = function () {
      this.items = [];
      const bills = this._element.querySelectorAll(".flex-column-item");
      for (let bill of bills) {
        bill.remove();
      }
    };
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
      identifier.textContent = this.identifier;
      identifier.classList.add("bill-identifier");

      return identifier;
    };

    createTitle = function () {
      const title = document.createElement("p");
      title.textContent = this.title;
      title.classList.add("bill-title");

      return title;
    };

    createAbstract = function () {
      const abstract = document.createElement("p");
      abstract.textContent = "abstract: " + this.abstract;
      abstract.classList.add("extra");
      abstract.classList.add("bill-abstract");

      return abstract;
    };

    createActionsList = function () {
      const actionsDiv = document.createElement("div");
      actionsDiv.classList.add("extra");
      actionsDiv.classList.add("bill-actions");
      actionsDiv.textContent = "Actions:";
      const actionsList = document.createElement("ul");
      actionsList.classList.add("bill-actions-list");

      for (let action of this.actions) {
        const actionLI = document.createElement("li");
        const organization = document.createElement("p");
        organization.textContent = "organization: " + action.organization;
        const description = document.createElement("p");
        description.textContent = "description: " + action.description;
        const date = document.createElement("p");
        date.textContent = "date: " + action.date;
        actionLI.appendChild(organization);
        actionLI.appendChild(description);
        actionLI.appendChild(date);

        actionsList.appendChild(actionLI);
      }

      actionsDiv.appendChild(actionsList);

      return actionsDiv;
    };

    createSponsorsList = function () {
      const sponsorsDiv = document.createElement("div");
      sponsorsDiv.classList.add("extra");
      sponsorsDiv.classList.add("bill-sponsors");
      sponsorsDiv.textContent = "Sponsors:";
      const sponsorsList = document.createElement("ul");
      sponsorsList.classList.add("bill-sponsors-list");

      for (let sponsor of this.sponsors) {
        const sponsorLI = document.createElement("li");
        sponsorLI.textContent = sponsor.name;
        sponsorLI.classList.add("bill-sponsor");
        sponsorsList.appendChild(sponsorLI);
      }

      sponsorsDiv.appendChild(sponsorsList);

      return sponsorsDiv;
    };

    createCommentsList = function () {
      const commentsDiv = document.createElement("div");
      commentsDiv.classList.add("extra");
      commentsDiv.classList.add("bill-comments");
      commentsDiv.textContent = "Comments:";
      const commentsList = document.createElement("ul");
      commentsList.classList.add("bill-comments-list");

      for (let comment of this.comments) {
        const commentLI = document.createElement("li");
        commentLI.classList.add("bill-comment");

        const commentText = document.createElement("p");
        commentText.textContent = comment.text;
        commentText.classList.add("bill-comment-text");

        const commentUser = document.createElement("p");
        commentUser.textContent = comment.user;
        commentUser.classList.add("bill-comment-user");

        const commentLikes = document.createElement("p");
        commentLikes.textContent = comment.likes;
        commentLikes.classList.add("bill-comment-likes");

        commentLI.appendChild(commentText);
        commentLI.appendChild(commentUser);
        commentLI.appendChild(commentLikes);

        commentsList.appendChild(commentLI);
      }

      commentsDiv.appendChild(commentsList);
      return commentsDiv;
    };

    // createTagsList = function () {
    //   const tagsDiv = document.createElement("div");
    //   tagsDiv.classList.add("extra");
    //   tagsDiv.classList.add("bill-tags");
    //   tagsDiv.textContent = "Tags: ";
    //   const tagsList = document.createElement("p");
    //   tagsList.classList.add("bill-tags-list");
    //   for (let tag of this.tags) {
    //     const tagSpan = document.createElement("span");
    //     tagSpan.textContent = tag.name;

    //     tagsList.appendChild(tagSpan);
    //   }

    //   tagsDiv.appendChild(tagsList);

    //   return tagsDiv;
    // };

    createExpand = function () {
      const expand = document.createElement("i");
      expand.classList.add("bill-toggle-expand");
      expand.classList.add("fas");
      expand.classList.add("fa-chevron-circle-down");
      return expand;
    };

    createFollow = function () {
      const follow = document.createElement("i");
      follow.classList.add("bill-toggle-follow");
      follow.classList.add("fas");

      if (this.isFollowed()) {
        follow.classList.add("fa-minus-circle");
        return follow;
      }

      follow.classList.add("fa-plus-circle");

      return follow;
    };

    createLink = function () {
      const url = document.createElement("a");
      url.classList.add("extra");
      url.classList.add("bill-link");
      url.href = this.webURL;
      url.innerHTML = '<i class="fas fa-external-link-square-alt"></i>';

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
      const actionsList = this.createActionsList();
      const commentsList = this.createCommentsList();
      // const tagsList = this.createTagsList();
      const link = this.createLink();

      container.appendChild(identifier);
      container.appendChild(expand);
      container.appendChild(follow);
      container.appendChild(title);
      container.appendChild(abstract);
      container.appendChild(sponsorsList);
      container.appendChild(actionsList);
      container.appendChild(commentsList);
      // container.appendChild(tagsList);
      container.appendChild(link);

      const extras = container.querySelectorAll(".extra");
      for (let extra of extras) {
        extra.classList.toggle("hidden");
      }

      this._element = container;

      return container;
    };

    toggleExpand = async function () {
      if (!this.full) {
        await this.update();
      }

      const extras = this._element.querySelectorAll(".extra");

      const expandToggle = this._element.querySelector(".bill-toggle-expand");

      this._element.classList.toggle("expanded");
      for (let extra of extras) {
        extra.classList.toggle("hidden");
      }
      expandToggle.classList.toggle("flip");
    };

    isFollowed = function () {
      const bills_following_ids = [];
      for (let bill of LGSLTR.user.bills_following) {
        bills_following_ids.push(bill.id);
      }
      if (bills_following_ids.includes(this.id)) {
        return true;
      }
      return false;
    };

    toggleFollow = async function () {
      if (this.isFollowed()) {
        this.makePlusButton();
        this.deleteFromFollowing();
      } else {
        this.makeMinusButton();
        this.addToFollowing();
      }
      await axios.post(this.apiURL + "/follow");
    };

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

      const abstract = this._element.querySelector(".bill-abstract");
      const actions = this._element.querySelector(".bill-actions-list");
      const comments = this._element.querySelector(".bill-comments-list");
      const identifier = this._element.querySelector(".bill-identifier");
      const sponsors = this._element.querySelector(".bill-sponsors-list");
      const tags = this._element.querySelector(".bill-tags-list");
      const title = this._element.querySelector(".bill-title");
      const link = this._element.querySelector(".bill-link");

      abstract.textContent = "Abstract: " + this.abstract;
      identifier.textContent = this.identifier;
      title.textContent = this.title;
      link.href = this.url;

      actions.innerHTML = "";
      for (let action of this.actions) {
        const actionLI = document.createElement("li");
        const organization = document.createElement("p");
        organization.textContent = action.organization;
        const description = document.createElement("p");
        description.textContent = action.description;
        const date = document.createElement("p");
        date.textContent = action.date;
        actionLI.appendChild(organization);
        actionLI.appendChild(description);
        actionLI.appendChild(date);
        actions.appendChild(actionLI);
      }

      comments.innerHTML = "";
      for (let comment of this.comments) {
        const commentLI = document.createElement("li");
        commentLI.classList.add("bill-comment");
        const commentText = document.createElement("p");
        commentText.textContent = comment.text;
        commentText.classList.add("bill-comment-text");
        const commentUser = document.createElement("p");
        commentUser.textContent = comment.user;
        commentUser.classList.add("bill-comment-user");
        const commentLikes = document.createElement("p");
        commentLikes.textContent = comment.likes;
        commentLikes.classList.add("bill-comment-likes");
        commentLI.appendChild(commentText);
        commentLI.appendChild(commentUser);
        commentLI.appendChild(commentLikes);
        comments.appendChild(commentLI);
      }

      sponsors.innerHTML = "";
      for (let sponsor of this.sponsors) {
        const sponsorLI = document.createElement("li");
        sponsorLI.textContent = sponsor.name;
        sponsorLI.classList.add("bill-sponsor");
        sponsors.appendChild(sponsorLI);
      }

      // tags.innerHTML = "";
      // for (let tag of this.tags) {
      //   const tagSpan = document.createElement("span");
      //   tagSpan.textContent = tag.name;
      //   tags.appendChild(tagSpan);
      // }
    };

    makeMinusButton = function () {
      const billElements = document.querySelectorAll(`[data-id="${this.id}"]`);
      for (let billElement of billElements) {
        const follow = billElement.querySelector(".bill-toggle-follow");
        follow.classList.remove("fa-plus-circle");
        follow.classList.add("fa-minus-circle");
      }
    };

    makePlusButton = function () {
      const billElements = document.querySelectorAll(`[data-id="${this.id}"]`);
      for (let billElement of billElements) {
        const follow = billElement.querySelector(".bill-toggle-follow");
        follow.classList.remove("fa-minus-circle");
        follow.classList.add("fa-plus-circle");
      }
    };

    addToFollowing = function () {
      LGSLTR.user.bills_following.push(this);
      LGSLTR.pageBills.columns.following.items.push(this);
      LGSLTR.pageBills.columns.following._element.appendChild(this.create());
    };

    deleteFromFollowing = function () {
      const billFollowingElement = LGSLTR.pageBills.columns.following._element.querySelector(
        `[data-id='${this.id}']`
      );

      LGSLTR.pageBills.columns.following.items = LGSLTR.pageBills.columns.following.items.filter(
        (bill) => bill.id != this.id
      );

      billFollowingElement.remove();

      LGSLTR.user.bills_following = LGSLTR.user.bills_following.filter(
        (bill) => bill.id != this.id
      );
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
  states.columns.bills = new StatesBills("states-bills");
  const account = new PageAccounts("account");
  account.columns.login = new AccountLogin("account-login");
  account.columns.register = new AccountRegister("account-register");
  const LGSLTR = new App(states, bills, account, user);

  window.addEventListener("hashchange", async function () {
    hash = location.hash;
    page = hash.slice(1);
    LGSLTR.loadPage(page);
  });

  billsPage.addEventListener("click", async function (evt) {
    const target = evt.target;
    const id = target.parentNode.dataset.id;
    const column = target.parentNode.parentNode.id;

    let bill = null;
    let tag = null;

    if (column == "bills-following") {
      bill = LGSLTR.pageBills.columns.following.items.find(
        (bill) => bill.id == id
      );
    } else if (column == "bills-state") {
      bill = LGSLTR.pageBills.columns.state.items.find((bill) => bill.id == id);
    }

    if (target.classList.contains("bill-toggle-expand")) {
      await bill.toggleExpand();
    }

    if (target.classList.contains("bill-toggle-follow")) {
      await bill.toggleFollow();
    }
  });

  statesPage.addEventListener("click", async function (evt) {
    const target = evt.target;
    const column = target.parentElement.id;
    if (column == "states-list") {
      const stateID = target.dataset.id;
      await LGSLTR.pageStates.columns.bills.populate(stateID);
      LGSLTR.pageStates.columns.list._element.style.flexBasis = "5%";
      const backButton = LGSLTR.pageStates.columns.bills._element.querySelector(
        ".flex-column-back"
      );
      backButton.classList.remove("invisible");
    }

    if (target.classList.contains("flex-column-back")) {
      LGSLTR.pageStates.columns.list._element.style.flexBasis = "100%";
      LGSLTR.pageStates.columns.bills.clear();
    }

    if (target.classList.contains("bill-toggle-expand")) {
      const id = target.parentElement.dataset.id;
      bill = LGSLTR.pageStates.columns.bills.items.find(
        (bill) => bill.id == id
      );
      bill.toggleExpand();
    }

    if (target.classList.contains("bill-toggle-follow")) {
      const id = target.parentElement.dataset.id;
      bill = LGSLTR.pageStates.columns.bills.items.find(
        (bill) => bill.id == id
      );
      bill.toggleFollow();
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
