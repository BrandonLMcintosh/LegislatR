document.addEventListener("DOMContentLoaded", function () {
  //   const pages = ["#account", "#home", "#states", "#bills"];
  //   const billsPage = document.getElementById("bills");
  //   const statesPage = document.getElementById("states");
  //   const homePage = document.getElementById("home");
  //   const accountPage = document.getElementById("account");

  //   function hidePages() {
  //     for (let page of pages) {
  //       const pageElement = document.querySelector(page);
  //       pageElement.style.display = "none";
  //     }
  //   }

  //   function loadPage(pageID = "#bills") {
  //     hidePages();
  //     console.log("clicked");
  //     const contentArea = document.querySelector(pageID);
  //     contentArea.style.display = "flex";
  //   }

  //   window.addEventListener("hashchange", function () {
  //     loadPage(location.hash);
  //   });

  //   billsPage.addEventListener("click", function (evt) {
  //     const parent = evt.target.parentNode;
  //     const target = evt.target;
  //     if (target.classList.contains("flex-column-header")) {
  //       parent.style.flexBasis = "100%";
  //       toggleBackButtons();
  //     }

  //     if (parent.classList.contains("flex-column-header")) {
  //       target.parentNode.parentNode.style.flexBasis = "100%";
  //       target.sibling;
  //       toggleBackButtons();
  //     }

  //     if (target.classList.contains("flex-column-back")) {
  //       target.parentNode.parentNode.style.flexBasis = "auto";
  //       toggleBackButtons();
  //     }
  //   });

  //   statesPage.addEventListener("click", function (evt) {
  //     const target = evt.target;
  //     const parent = target.parentNode;
  //     if (
  //       target.classList.contains("flex-column-item") |
  //       parent.classList.contains("flex-column-item")
  //     ) {
  //       document.querySelector("#states-list").style.flexBasis = "5%";
  //     }
  //   });

  //   function toggleBackButtons() {
  //     const backButtons = document.querySelectorAll(".flex-column-back");
  //     for (let backButton of backButtons) {
  //       backButton.classList.toggle("invisible");
  //     }
  //   }

  //   loadPage();
  // });

  const APIURL = "https://localhost:5000/";

  class App {
    constructor(pages = {}) {
      this.pages = pages;
    }

    selectPage = function () {
      // hide all pages
      // unhide page I want
    };
  }

  class Page {
    constructor(name, columns = {}) {
      this.name = name;
      this.columns = columns;
    }

    populate = async function () {
      for (let column of this.columns) {
        await column.populate();
      }
    };
  }

  class Column {
    constructor(header, url, type, items = {}) {
      this.url = APIURL + url;
      this.header = header;
      this.type = type;
      this.items = items;
    }

    build = function () {};

    get = async function () {
      const results = await axios.get(url);
      return results;
    };

    expand = function () {};

    back = function () {};
  }

  class Item {
    constructor(id) {
      this.url = APIURL + url;
    }

    get = async function () {
      const results = await axios.get(url);
      return results;
    };

    select = function () {};

    back = function () {};
  }

  class Bill extends Item {
    constructor(id, title, web_url, state, tags, sponsors, actions, comments) {
      super(id);
      this.title = title;
      this.web_url = web_url;
      this.state = state;
      this.tags = tags;
      this.sponsors = sponsors;
      this.actions = actions;
      this.comments = comments;
    }

    update = async function () {
      const result = await super.get();
      this.body = body;
      this.state = state;
      this.tags = tags;
      this.sponsors = sponsors;
      this.comments = comments;
    };
  }

  class State extends Item {
    constructor(APIURL, bills = {}, politicians) {
      super(APIURL);
      this.bills = bills;
      this.politicians = politicians;
    }

    update = async function () {
      const result = await super.grab();
      this.bills = bills;
      this.politicians = politicians;
    };
  }

  class Tag extends Item {
    constructor(APIURL, bills) {
      super(APIURL);
      this.bills = bills;
    }

    update = async function () {
      const result = await super.grab();
      this.bills = bills;
    };
  }

  class Politician extends Item {
    constructor(APIURL, fullName, state, sponsoredBills, senator) {
      super(APIURL);
      this.fullName = fullName;
      this.state = state;
      this.sponsoredBills = sponsoredBills;
      this.senator = senator;
    }

    update = async function () {
      const result = await super.grab();
      this.state = state;
      this.sponsoredBills = sponsoredBills;
      this.senator = senator;
    };
  }

  class User {
    constructor(username, phone, state, tags, bills, comments) {
      this.username = username;
      this.phone = phone;
      this.state = state;
      this.tags = tags;
      this.bills = bills;
      this.comments = comments;
    }

    update = async function () {};

    loggedIn = function () {};
  }

  const LGSLTR = new App();

  LGSLTR.pages = {
    bills: new Page("bills"),
    states: new Page("states"),
    account: new Page("account"),
  };

  LGSLTR.pages.bills.columns = {
    following: new Column("following"),
    state: new Column("state"),
    tags: new Column("tags"),
  };

  LGSLTR.pages.states.columns = {
    states: new Column("states"),
    info: new Column("info"),
  };

  LGSLTR.pages.account.columns = {
    login: new Column("login"),
    register: new Column("register"),
  };
});
