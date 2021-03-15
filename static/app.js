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

  class App {
    constructor(pages = {}) {
      this.pages = pages;
    }

    build = function () {};

    populate = async function () {};

    update = async function () {
      for (let page of pages) {
        await page.update();
      }
    };

    selectPage = function () {};
  }

  class Page {
    constructor(name, columns = {}) {
      this.name = name;
      this.columns = columns;
    }

    populate = async function () {};

    update = async function () {
      for (let column of columns) {
        await column.update();
      }
    };
  }

  class Column {
    constructor(header, url, items = {}) {
      this.url = url;
      this.header = header;
      this.type = type;
      this.items = items;
    }

    build = function () {};

    populate = async function () {};

    update = async function () {
      for (let item of (items = {})) {
        await item.update();
      }
    };

    expand = function () {};

    back = function () {};
  }

  class Item {
    constructor(url) {
      this.url = url;
    }

    parentHTML = function () {};

    grab = async function () {
      const results = await axios.get(`${APIURL}`);
      return results;
    };

    expand = function () {};

    back = function () {};
  }

  class Bill extends Item {
    constructor(APIURL, body, state, tags, sponsors, comments) {
      super(APIURL);
      this.body = body;
      this.state = state;
      this.tags = tags;
      this.sponsors = sponsors;
      this.comments = comments;
    }

    update = async function () {
      const result = await super.grab();
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
