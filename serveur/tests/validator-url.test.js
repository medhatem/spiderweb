const validator = require("validator");

const real_urls = [
  {
    _id: {
      $oid: "5f9adc7f4c656d139863d443",
    },
    url: "https://facebook.com",
  },
  {
    _id: {
      $oid: "5f9adc7f4c656d139863d444",
    },
    url: "https://usherbrooke.ca",
  },
  {
    _id: {
      $oid: "5f9adc7f4c656d139863d445",
    },
    url: "https://expressjs.com",
  },
  {
    _id: {
      $oid: "5f9adc7f4c656d139863d446",
    },
    url: "https://medium.com",
  },
  {
    _id: {
      $oid: "5f9adce94c656d139863d44c",
    },
    url: "l.facebook.com",
  },
  {
    _id: {
      $oid: "5f9adce94c656d139863d44d",
    },
    url: "usherbrooke.ca",
  },
  {
    _id: {
      $oid: "5f9adce94c656d139863d44e",
    },
    url: "www.usherbrooke.ca",
  },
  {
    _id: {
      $oid: "5f9adce94c656d139863d44f",
    },
    url: "monportail.usherbrooke.ca",
  },
  {
    _id: {
      $oid: "5f9adce94c656d139863d450",
    },
    url: "simus.usherbrooke.ca",
  },
  {
    _id: {
      $oid: "5f9adce94c656d139863d451",
    },
    url: "authentification.usherbrooke.ca",
  },
  {
    _id: {
      $oid: "5f9adce94c656d139863d452",
    },
    url: "usherbrooke.account.worldcat.org",
  },
  {
    _id: {
      $oid: "5f9adce94c656d139863d453",
    },
    url: "messagerie.usherbrooke.ca",
  },
  {
    _id: {
      $oid: "5f9adce94c656d139863d454",
    },
    url: "www.centrecultureludes.ca",
  },
  {
    _id: {
      $oid: "5f9adce94c656d139863d455",
    },
    url: "www.facebook.com",
  },
  {
    _id: {
      $oid: "5f9adce94c656d139863d456",
    },
    url: "www.youtube.com",
  },
  {
    _id: {
      $oid: "5f9adce94c656d139863d457",
    },
    url: "www.twitter.com",
  },
  {
    _id: {
      $oid: "5f9adce94c656d139863d458",
    },
    url: "www.instagram.com",
  },
  {
    _id: {
      $oid: "5f9adce94c656d139863d459",
    },
    url: "www.linkedin.com",
  },
  {
    _id: {
      $oid: "5f9adce94c656d139863d45a",
    },
    url: "support.eji.org",
  },
  {
    _id: {
      $oid: "5f9adce94c656d139863d45b",
    },
    url: "nodejs.org",
  },
  {
    _id: {
      $oid: "5f9adce94c656d139863d45c",
    },
    url: "github.com",
  },
  {
    _id: {
      $oid: "5f9adce94c656d139863d45d",
    },
    url: "strongloop.com",
  },
  {
    _id: {
      $oid: "5f9adce94c656d139863d45e",
    },
    url: "expressjs.com",
  },
  {
    _id: {
      $oid: "5f9adce94c656d139863d45f",
    },
    url: "openjsf.org",
  },
  {
    _id: {
      $oid: "5f9adce94c656d139863d460",
    },
    url: "creativecommons.org",
  },
  {
    _id: {
      $oid: "5f9adce94c656d139863d461",
    },
    url: "medium.com",
  },
  {
    _id: {
      $oid: "5f9adce94c656d139863d462",
    },
    url: "about.medium.com",
  },
  {
    _id: {
      $oid: "5f9adce94c656d139863d463",
    },
    url: "chrissyteigen.medium.com",
  },
  {
    _id: {
      $oid: "5f9adce94c656d139863d464",
    },
    url: "milestaylor.medium.com",
  },
  {
    _id: {
      $oid: "5f9adce94c656d139863d465",
    },
    url: "towardsdatascience.com",
  },
  {
    _id: {
      $oid: "5f9adce94c656d139863d466",
    },
    url: "mrdbourke.medium.com",
  },
  {
    _id: {
      $oid: "5f9adce94c656d139863d467",
    },
    url: "elemental.medium.com",
  },
  {
    _id: {
      $oid: "5f9adce94c656d139863d468",
    },
    url: "level.medium.com",
  },
  {
    _id: {
      $oid: "5f9adce94c656d139863d469",
    },
    url: "davidjdennisjr.medium.com",
  },
  {
    _id: {
      $oid: "5f9adce94c656d139863d46a",
    },
    url: "karyn-86354.medium.com",
  },
  {
    _id: {
      $oid: "5f9adce94c656d139863d46b",
    },
    url: "katiecouric.medium.com",
  },
  {
    _id: {
      $oid: "5f9adce94c656d139863d46c",
    },
    url: "psiloveyou.xyz",
  },
  {
    _id: {
      $oid: "5f9adce94c656d139863d46d",
    },
    url: "jasmcaus.medium.com",
  },
  {
    _id: {
      $oid: "5f9adce94c656d139863d46e",
    },
    url: "help.medium.com",
  },
  {
    _id: {
      $oid: "5f9adce94c656d139863d46f",
    },
    url: "medium.statuspage.io",
  },
  {
    _id: {
      $oid: "5f9adce94c656d139863d470",
    },
    url: "blog.medium.com",
  },
  {
    _id: {
      $oid: "5f9adce94c656d139863d471",
    },
    url: "policy.medium.com",
  },
  {
    _id: {
      $oid: "5f9adcfa4c656d139863d47c",
    },
    url: "www.papercut.com",
  },
  {
    _id: {
      $oid: "5f9adcfa4c656d139863d47d",
    },
    url: "www.desjardins.com",
  },
  {
    _id: {
      $oid: "5f9adcfa4c656d139863d47e",
    },
    url: "www.rogers.com",
  },
  {
    _id: {
      $oid: "5f9adcfa4c656d139863d47f",
    },
    url: "www.vertisoftpme.com",
  },
  {
    _id: {
      $oid: "5f9add084c656d139863d48a",
    },
    url: "developers.google.com",
  },
  {
    _id: {
      $oid: "5f9add084c656d139863d48b",
    },
    url: "www.google.com",
  },
  {
    _id: {
      $oid: "5f9add084c656d139863d48c",
    },
    url: "about.linkedin.com",
  },
  {
    _id: {
      $oid: "5f9add084c656d139863d48d",
    },
    url: "press.linkedin.com",
  },
  {
    _id: {
      $oid: "5f9add084c656d139863d48e",
    },
    url: "blog.linkedin.com",
  },
  {
    _id: {
      $oid: "5f9add084c656d139863d48f",
    },
    url: "developer.linkedin.com",
  },
  {
    _id: {
      $oid: "5f9add084c656d139863d490",
    },
    url: "mobile.linkedin.com",
  },
  {
    _id: {
      $oid: "5f9add084c656d139863d491",
    },
    url: "business.linkedin.com",
  },
  {
    _id: {
      $oid: "5f9add084c656d139863d492",
    },
    url: "learning.linkedin.com",
  },
  {
    _id: {
      $oid: "5f9add084c656d139863d493",
    },
    url: "brand.linkedin.com",
  },
  {
    _id: {
      $oid: "5f9add084c656d139863d494",
    },
    url: "eji.org",
  },
  {
    _id: {
      $oid: "5f9add084c656d139863d495",
    },
    url: "museumandmemorial.eji.org",
  },
  {
    _id: {
      $oid: "5f9add084c656d139863d496",
    },
    url: "shop.eji.org",
  },
  {
    _id: {
      $oid: "5f9add084c656d139863d497",
    },
    url: "justmercy.eji.org",
  },
  {
    _id: {
      $oid: "5f9add084c656d139863d498",
    },
    url: "calendar.eji.org",
  },
  {
    _id: {
      $oid: "5f9add084c656d139863d499",
    },
    url: "twitter.com",
  },
  {
    _id: {
      $oid: "5f9add084c656d139863d49a",
    },
    url: "v8.dev",
  },
  {
    _id: {
      $oid: "5f9add084c656d139863d49b",
    },
    url: "trademark-list.openjsf.org",
  },
  {
    _id: {
      $oid: "5f9add084c656d139863d49c",
    },
    url: "trademark-policy.openjsf.org",
  },
  {
    _id: {
      $oid: "5f9add084c656d139863d49d",
    },
    url: "raw.githubusercontent.com",
  },
  {
    _id: {
      $oid: "5f9add084c656d139863d49e",
    },
    url: "docs.github.com",
  },
  {
    _id: {
      $oid: "5f9add084c656d139863d49f",
    },
    url: "lab.github.com",
  },
  {
    _id: {
      $oid: "5f9add084c656d139863d4a0",
    },
    url: "opensource.guide",
  },
  {
    _id: {
      $oid: "5f9add084c656d139863d4a1",
    },
    url: "github.community",
  },
  {
    _id: {
      $oid: "5f9add084c656d139863d4a2",
    },
    url: "education.github.com",
  },
  {
    _id: {
      $oid: "5f9add084c656d139863d4a3",
    },
    url: "stars.github.com",
  },
  {
    _id: {
      $oid: "5f9add084c656d139863d4a4",
    },
    url: "enterprise.github.com",
  },
  {
    _id: {
      $oid: "5f9add084c656d139863d4a5",
    },
    url: "www.npmjs.com",
  },
  {
    _id: {
      $oid: "5f9add084c656d139863d4a6",
    },
    url: "apps.apple.com",
  },
  {
    _id: {
      $oid: "5f9add084c656d139863d4a7",
    },
    url: "play.google.com",
  },
  {
    _id: {
      $oid: "5f9add084c656d139863d4a8",
    },
    url: "desktop.github.com",
  },
  {
    _id: {
      $oid: "5f9add084c656d139863d4a9",
    },
    url: "cli.github.com",
  },
  {
    _id: {
      $oid: "5f9add084c656d139863d4aa",
    },
    url: "resources.github.com",
  },
  {
    _id: {
      $oid: "5f9add084c656d139863d4ab",
    },
    url: "partner.github.com",
  },
  {
    _id: {
      $oid: "5f9add084c656d139863d4ac",
    },
    url: "atom.io",
  },
  {
    _id: {
      $oid: "5f9add084c656d139863d4ad",
    },
    url: "electronjs.org",
  },
  {
    _id: {
      $oid: "5f9add084c656d139863d4ae",
    },
    url: "services.github.com",
  },
  {
    _id: {
      $oid: "5f9add084c656d139863d4af",
    },
    url: "githubstatus.com",
  },
  {
    _id: {
      $oid: "5f9add084c656d139863d4b0",
    },
    url: "github.blog",
  },
  {
    _id: {
      $oid: "5f9add084c656d139863d4b1",
    },
    url: "socialimpact.github.com",
  },
  {
    _id: {
      $oid: "5f9add084c656d139863d4b2",
    },
    url: "shop.github.com",
  },
  {
    _id: {
      $oid: "5f9add084c656d139863d4b3",
    },
    url: "join.slack.com",
  },
  {
    _id: {
      $oid: "5f9add084c656d139863d4b4",
    },
    url: "loopback.io",
  },
  {
    _id: {
      $oid: "5f9add084c656d139863d4b5",
    },
    url: "www.ibm.com",
  },
  {
    _id: {
      $oid: "5f9add084c656d139863d4b6",
    },
    url: "www.linuxfoundation.org",
  },
  {
    _id: {
      $oid: "5f9add084c656d139863d4b7",
    },
    url: "code-of-conduct.openjsf.org",
  },
  {
    _id: {
      $oid: "5f9add084c656d139863d4b8",
    },
    url: "training.linuxfoundation.org",
  },
  {
    _id: {
      $oid: "5f9add084c656d139863d4b9",
    },
    url: "overview.openjsf.org",
  },
  {
    _id: {
      $oid: "5f9add084c656d139863d4ba",
    },
    url: "events.linuxfoundation.org",
  },
  {
    _id: {
      $oid: "5f9add084c656d139863d4bb",
    },
    url: "lists.openjsf.org",
  },
  {
    _id: {
      $oid: "5f9add084c656d139863d4bc",
    },
    url: "amp.dev",
  },
  {
    _id: {
      $oid: "5f9add084c656d139863d4bd",
    },
    url: "appium.io",
  },
  {
    _id: {
      $oid: "5f9add084c656d139863d4be",
    },
    url: "arc.codes",
  },
  {
    _id: {
      $oid: "5f9add084c656d139863d4bf",
    },
    url: "dojo.io",
  },
  {
    _id: {
      $oid: "5f9add084c656d139863d4c0",
    },
    url: "eslint.org",
  },
  {
    _id: {
      $oid: "5f9add084c656d139863d4c1",
    },
    url: "esprima.org",
  },
  {
    _id: {
      $oid: "5f9add084c656d139863d4c2",
    },
    url: "gruntjs.com",
  },
  {
    _id: {
      $oid: "5f9add084c656d139863d4c3",
    },
    url: "hospitalrun.io",
  },
  {
    _id: {
      $oid: "5f9add084c656d139863d4c4",
    },
    url: "interledgerjs.org",
  },
  {
    _id: {
      $oid: "5f9add084c656d139863d4c5",
    },
    url: "theintern.github.io",
  },
  {
    _id: {
      $oid: "5f9add084c656d139863d4c6",
    },
    url: "messageformat.github.io",
  },
  {
    _id: {
      $oid: "5f9add084c656d139863d4c7",
    },
    url: "jerryscript.net",
  },
  {
    _id: {
      $oid: "5f9add084c656d139863d4c8",
    },
    url: "jquery.com",
  },
  {
    _id: {
      $oid: "5f9add084c656d139863d4c9",
    },
    url: "jquerymobile.com",
  },
  {
    _id: {
      $oid: "5f9add084c656d139863d4ca",
    },
    url: "jqueryui.com",
  },
  {
    _id: {
      $oid: "5f9add084c656d139863d4cb",
    },
    url: "libuv.org",
  },
  {
    _id: {
      $oid: "5f9add084c656d139863d4cc",
    },
    url: "lodash.com",
  },
  {
    _id: {
      $oid: "5f9add084c656d139863d4cd",
    },
    url: "markojs.com",
  },
  {
    _id: {
      $oid: "5f9add084c656d139863d4ce",
    },
    url: "mochajs.org",
  },
  {
    _id: {
      $oid: "5f9add084c656d139863d4cf",
    },
    url: "momentjs.com",
  },
  {
    _id: {
      $oid: "5f9add084c656d139863d4d0",
    },
    url: "nodered.org",
  },
  {
    _id: {
      $oid: "5f9add084c656d139863d4d1",
    },
    url: "qunitjs.com",
  },
  {
    _id: {
      $oid: "5f9add084c656d139863d4d2",
    },
    url: "requirejs.org",
  },
  {
    _id: {
      $oid: "5f9add084c656d139863d4d3",
    },
    url: "sizzlejs.com",
  },
  {
    _id: {
      $oid: "5f9add084c656d139863d4d4",
    },
    url: "webdriver.io",
  },
  {
    _id: {
      $oid: "5f9add084c656d139863d4d5",
    },
    url: "webhint.io",
  },
  {
    _id: {
      $oid: "5f9add084c656d139863d4d6",
    },
    url: "webpack.js.org",
  },
  {
    _id: {
      $oid: "5f9add084c656d139863d4d7",
    },
    url: "terms-of-use.openjsf.org",
  },
  {
    _id: {
      $oid: "5f9add084c656d139863d4d8",
    },
    url: "privacy-policy.openjsf.org",
  },
  {
    _id: {
      $oid: "5f9add084c656d139863d4d9",
    },
    url: "bylaws.openjsf.org",
  },
  {
    _id: {
      $oid: "5f9add164c656d139863d4e4",
    },
    url: "network.creativecommons.org",
  },
  {
    _id: {
      $oid: "5f9add164c656d139863d4e5",
    },
    url: "search.creativecommons.org",
  },
  {
    _id: {
      $oid: "5f9add164c656d139863d4e6",
    },
    url: "mailchi.mp",
  },
  {
    _id: {
      $oid: "5f9add164c656d139863d4e7",
    },
    url: "store.creativecommons.org",
  },
  {
    _id: {
      $oid: "5f9add164c656d139863d4e8",
    },
    url: "us.netdonor.net",
  },
  {
    _id: {
      $oid: "5f9add164c656d139863d4e9",
    },
    url: "www.flickr.com",
  },
  {
    _id: {
      $oid: "5f9add164c656d139863d4ea",
    },
    url: "affinitybridge.com",
  },
  {
    _id: {
      $oid: "5f9add164c656d139863d4eb",
    },
    url: "nicolascole77.medium.com",
  },
  {
    _id: {
      $oid: "5f9add164c656d139863d4ec",
    },
    url: "sebastien-bouttier.medium.com",
  },
  {
    _id: {
      $oid: "5f9add164c656d139863d4ed",
    },
    url: "ellengau.medium.com",
  },
  {
    _id: {
      $oid: "5f9add164c656d139863d4ee",
    },
    url: "patricktompkins.medium.com",
  },
  {
    _id: {
      $oid: "5f9add164c656d139863d4ef",
    },
    url: "roccopendola.medium.com",
  },
  {
    _id: {
      $oid: "5f9add164c656d139863d4f0",
    },
    url: "jobs.medium.com",
  },
  {
    _id: {
      $oid: "5f9add164c656d139863d4f1",
    },
    url: "rsci.app.link",
  },
  {
    _id: {
      $oid: "5f9add164c656d139863d4f2",
    },
    url: "itunes.apple.com",
  },
  {
    _id: {
      $oid: "5f9add164c656d139863d4f3",
    },
    url: "www.nytimes.com",
  },
  {
    _id: {
      $oid: "5f9add164c656d139863d4f4",
    },
    url: "www.pexels.com",
  },
  {
    _id: {
      $oid: "5f9add164c656d139863d4f5",
    },
    url: "unsplash.com",
  },
  {
    _id: {
      $oid: "5f9add164c656d139863d4f6",
    },
    url: "www.sportscasting.com",
  },
  {
    _id: {
      $oid: "5f9add164c656d139863d4f7",
    },
    url: "bleacherreport.com",
  },
  {
    _id: {
      $oid: "5f9add164c656d139863d4f8",
    },
    url: "datamozart.medium.com",
  },
  {
    _id: {
      $oid: "5f9add164c656d139863d4f9",
    },
    url: "en.wikipedia.org",
  },
  {
    _id: {
      $oid: "5f9add164c656d139863d4fa",
    },
    url: "www.kaggle.com",
  },
  {
    _id: {
      $oid: "5f9add164c656d139863d4fb",
    },
    url: "pixabay.com",
  },
  {
    _id: {
      $oid: "5f9add164c656d139863d4fc",
    },
    url: "romanorac.medium.com",
  },
  {
    _id: {
      $oid: "5f9add164c656d139863d4fd",
    },
    url: "www.reddit.com",
  },
  {
    _id: {
      $oid: "5f9add164c656d139863d4fe",
    },
    url: "datascienceisfun.net",
  },
  {
    _id: {
      $oid: "5f9add164c656d139863d4ff",
    },
    url: "imp.i115008.net",
  },
  {
    _id: {
      $oid: "5f9add164c656d139863d500",
    },
    url: "aigents.co",
  },
  {
    _id: {
      $oid: "5f9add164c656d139863d501",
    },
    url: "www.mrdbourke.com",
  },
  {
    _id: {
      $oid: "5f9add164c656d139863d502",
    },
    url: "www.kieranblakey.co.uk",
  },
  {
    _id: {
      $oid: "5f9add164c656d139863d503",
    },
    url: "jamanetwork.com",
  },
  {
    _id: {
      $oid: "5f9add164c656d139863d504",
    },
    url: "www.bu.edu",
  },
  {
    _id: {
      $oid: "5f9add164c656d139863d505",
    },
    url: "www.yanapan.com",
  },
  {
    _id: {
      $oid: "5f9add164c656d139863d506",
    },
    url: "www.mariachimi.com",
  },
  {
    _id: {
      $oid: "5f9add164c656d139863d507",
    },
    url: "science.sciencemag.org",
  },
  {
    _id: {
      $oid: "5f9add164c656d139863d508",
    },
    url: "www.ncbi.nlm.nih.gov",
  },
  {
    _id: {
      $oid: "5f9add164c656d139863d509",
    },
    url: "danagsmith.medium.com",
  },
  {
    _id: {
      $oid: "5f9add164c656d139863d50a",
    },
    url: "www.apa.org",
  },
  {
    _id: {
      $oid: "5f9add164c656d139863d50b",
    },
    url: "coronavirus.medium.com",
  },
  {
    _id: {
      $oid: "5f9add164c656d139863d50c",
    },
    url: "bostonreview.net",
  },
  {
    _id: {
      $oid: "5f9add164c656d139863d50d",
    },
    url: "kaepernick7.medium.com",
  },
  {
    _id: {
      $oid: "5f9add164c656d139863d50e",
    },
    url: "iamjoelleon.medium.com",
  },
  {
    _id: {
      $oid: "5f9add164c656d139863d50f",
    },
    url: "jada.medium.com",
  },
  {
    _id: {
      $oid: "5f9add164c656d139863d510",
    },
    url: "www.pinterest.com",
  },
  {
    _id: {
      $oid: "5f9add164c656d139863d511",
    },
    url: "ir.citi.com",
  },
  {
    _id: {
      $oid: "5f9add164c656d139863d512",
    },
    url: "marker.medium.com",
  },
  {
    _id: {
      $oid: "5f9add244c656d139863d51d",
    },
    url: "www.sleepnumber.com",
  },
  {
    _id: {
      $oid: "5f9add244c656d139863d51e",
    },
    url: "bookshop.org",
  },
  {
    _id: {
      $oid: "5f9add244c656d139863d51f",
    },
    url: "www.socialmediatoday.com",
  },
  {
    _id: {
      $oid: "5f9add244c656d139863d520",
    },
    url: "assets-global.website-files.com",
  },
  {
    _id: {
      $oid: "5f9add244c656d139863d521",
    },
    url: "policies.google.com",
  },
  {
    _id: {
      $oid: "5f9add244c656d139863d522",
    },
    url: "www.atlassian.com",
  },
  {
    _id: {
      $oid: "5f9add244c656d139863d523",
    },
    url: "karenetropen.medium.com",
  },
  {
    _id: {
      $oid: "5f9add244c656d139863d524",
    },
    url: "wobanner.medium.com",
  },
  {
    _id: {
      $oid: "5f9add244c656d139863d525",
    },
    url: "ritwikdey.medium.com",
  },
  {
    _id: {
      $oid: "5f9add244c656d139863d526",
    },
    url: "ev.medium.com",
  },
  {
    _id: {
      $oid: "5f9add244c656d139863d527",
    },
    url: "www.harpercollins.com",
  },
  {
    _id: {
      $oid: "5f9add244c656d139863d528",
    },
    url: "ybbaaker.medium.com",
  },
  {
    _id: {
      $oid: "5f9add244c656d139863d529",
    },
    url: "dsa.medium.com",
  },
  {
    _id: {
      $oid: "5f9add244c656d139863d52a",
    },
    url: "qrdoc.io",
  },
  {
    _id: {
      $oid: "5f9add244c656d139863d52b",
    },
    url: "blog.papercut.com",
  },
  {
    _id: {
      $oid: "5f9add244c656d139863d52c",
    },
    url: "portal.papercut.com",
  },
  {
    _id: {
      $oid: "5f9add244c656d139863d52d",
    },
    url: "go.papercut.com",
  },
  {
    _id: {
      $oid: "5f9add244c656d139863d52e",
    },
    url: "facebook.com",
  },
  {
    _id: {
      $oid: "5f9add244c656d139863d52f",
    },
    url: "community.spiceworks.com",
  },
  {
    _id: {
      $oid: "5f9add244c656d139863d530",
    },
    url: "youtube.com",
  },
  {
    _id: {
      $oid: "5f9add244c656d139863d531",
    },
    url: "accweb.mouv.desjardins.com",
  },
  {
    _id: {
      $oid: "5f9add244c656d139863d532",
    },
    url: "www.disnat.com",
  },
  {
    _id: {
      $oid: "5f9add244c656d139863d533",
    },
    url: "www.vmdconseil.ca",
  },
  {
    _id: {
      $oid: "5f9add244c656d139863d534",
    },
    url: "www.fiduciedesjardins.com",
  },
  {
    _id: {
      $oid: "5f9add244c656d139863d535",
    },
    url: "blogues.desjardins.com",
  },
  {
    _id: {
      $oid: "5f9add244c656d139863d536",
    },
    url: "www.desjardinsassurancevie.com",
  },
  {
    _id: {
      $oid: "5f9add244c656d139863d537",
    },
    url: "instagram.com",
  },
  {
    _id: {
      $oid: "5f9add324c656d139863d542",
    },
    url: "quebeccloud.com",
  },
  {
    _id: {
      $oid: "5f9add324c656d139863d543",
    },
    url: "webtel.com",
  },
  {
    _id: {
      $oid: "5f9add324c656d139863d544",
    },
    url: "www.princecraft.com",
  },
  {
    _id: {
      $oid: "5f9add324c656d139863d545",
    },
    url: "anotresante.ca",
  },
  {
    _id: {
      $oid: "5f9add324c656d139863d546",
    },
    url: "www.womentechmakers.com",
  },
  {
    _id: {
      $oid: "5f9add324c656d139863d547",
    },
    url: "developers.googleblog.com",
  },
  {
    _id: {
      $oid: "5f9add324c656d139863d548",
    },
    url: "google.com",
  },
  {
    _id: {
      $oid: "5f9add324c656d139863d549",
    },
    url: "developer.android.com",
  },
  {
    _id: {
      $oid: "5f9add324c656d139863d54a",
    },
    url: "cloud.google.com",
  },
  {
    _id: {
      $oid: "5f9add324c656d139863d54b",
    },
    url: "firebase.google.com",
  },
  {
    _id: {
      $oid: "5f9add324c656d139863d54c",
    },
    url: "flutter.dev",
  },
  {
    _id: {
      $oid: "5f9add324c656d139863d54d",
    },
    url: "www.tensorflow.org",
  },
  {
    _id: {
      $oid: "5f9add324c656d139863d54e",
    },
    url: "docs.google.com",
  },
  {
    _id: {
      $oid: "5f9add324c656d139863d54f",
    },
    url: "web.dev",
  },
  {
    _id: {
      $oid: "5f9add324c656d139863d550",
    },
    url: "go.dev",
  },
  {
    _id: {
      $oid: "5f9add324c656d139863d551",
    },
    url: "chromeos.dev",
  },
  {
    _id: {
      $oid: "5f9add324c656d139863d552",
    },
    url: "android-developers.googleblog.com",
  },
  {
    _id: {
      $oid: "5f9add324c656d139863d553",
    },
    url: "www.google.ca",
  },
  {
    _id: {
      $oid: "5f9add324c656d139863d554",
    },
    url: "maps.google.ca",
  },
  {
    _id: {
      $oid: "5f9add324c656d139863d555",
    },
    url: "news.google.com",
  },
  {
    _id: {
      $oid: "5f9add324c656d139863d556",
    },
    url: "mail.google.com",
  },
  {
    _id: {
      $oid: "5f9add324c656d139863d557",
    },
    url: "drive.google.com",
  },
  {
    _id: {
      $oid: "5f9add324c656d139863d558",
    },
    url: "translate.google.ca",
  },
  {
    _id: {
      $oid: "5f9add324c656d139863d559",
    },
    url: "books.google.ca",
  },
  {
    _id: {
      $oid: "5f9add324c656d139863d55a",
    },
    url: "www.blogger.com",
  },
  {
    _id: {
      $oid: "5f9add324c656d139863d55b",
    },
    url: "photos.google.com",
  },
  {
    _id: {
      $oid: "5f9add324c656d139863d55c",
    },
    url: "video.google.ca",
  },
  {
    _id: {
      $oid: "5f9add324c656d139863d55d",
    },
    url: "accounts.google.com",
  },
  {
    _id: {
      $oid: "5f9add324c656d139863d55e",
    },
    url: "linkedin.com",
  },
  {
    _id: {
      $oid: "5f9add324c656d139863d55f",
    },
    url: "news.linkedin.com",
  },
  {
    _id: {
      $oid: "5f9add324c656d139863d560",
    },
    url: "engineering.linkedin.com",
  },
  {
    _id: {
      $oid: "5f9add324c656d139863d561",
    },
    url: "economicgraph.linkedin.com",
  },
  {
    _id: {
      $oid: "5f9add324c656d139863d562",
    },
    url: "news.microsoft.com",
  },
  {
    _id: {
      $oid: "5f9add324c656d139863d563",
    },
    url: "www.microsoft.com",
  },
  {
    _id: {
      $oid: "5f9add324c656d139863d564",
    },
    url: "forms.feedblitz.com",
  },
  {
    _id: {
      $oid: "5f9add324c656d139863d565",
    },
    url: "www.feedblitz.com",
  },
  {
    _id: {
      $oid: "5f9add324c656d139863d566",
    },
    url: "slideshare.net",
  },
  {
    _id: {
      $oid: "5f9add324c656d139863d567",
    },
    url: "c.singular.net",
  },
  {
    _id: {
      $oid: "5f9add324c656d139863d568",
    },
    url: "www.slideshare.net",
  },
];

test.each(real_urls)("url: %p", (obj) => {
  expect(validator.isURL(obj.url)).toBeTruthy();
});
