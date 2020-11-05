const request = require("request");
const cheerio = require("cheerio");
const url = require("url");
const axios = require("axios");

class Site {
  constructor(url_princ, enfant, path, title) {
    this.lien_principal = url_princ;
    this.set_enfant = enfant;
    this.set_path = path;
    this.titre = title;
  }
}

class Crawler {
  constructor() {
    this.instance = axios.create({
      baseURL: "http://127.0.0.1:3000",
      headers: { Authorization: "mSlu20JMWtM/RSrfxWVtvJuRlEg=" },
    });
  }

  // function pour analyser la page d'un lien recu
  lancerAnalyse(lien_principal) {
    let urls_enfants = new Set();
    let path_enfants = new Set();

    let lien_principal_valide = null;
    try {
      lien_principal_valide = new URL(lien_principal);
    } catch (error) {
      lien_principal_valide = new URL("https://" + lien_principal);
    }

    return new Promise(function (resolve, reject) {
      request(lien_principal_valide.origin, function (err, res, body) {
        if (err) {
          reject(err);
          return;
        } else {
          let $ = cheerio.load(body); //loading of complete HTML body

          $("a").each(function (index) {

            const link = $(this).attr("href");

            if (link && link[0].toString() == "/") {
              path_enfants.add(link);
              urls_enfants.add(lien_principal_valide.origin.toString() + link);
            } else if (link && link.match("http") == "http") {

              try {
                const link1 = new URL(link);
                urls_enfants.add(link1.hostname.replace("www.", ""));
              } catch (error) {
                const link1 = new URL("https://" + link);
                urls_enfants.add(link1.hostname.replace("www.", ""));
              }

            } else {

              const link2 = $(this).text();

              var sp = link2.split(" ");

              sp.forEach((phrase) => {

                if (phrase && phrase.match("http") === "http") {

                  try {
                    const link = new URL(phrase);
                    urls_enfants.add(link.hostname.replace("www.", ""));
                  } catch (error) {
                    const link = new URL("https://" + phrase);
                    urls_enfants.add(link.hostname.replace("www.", ""));
                  }

                }
              });
            }
          });

          resolve(new Site(lien_principal, [...urls_enfants], [...path_enfants], $("title").text(), ""));
        }
      });
    });
  }

  async envoyer_resultat(sites) {
    const result = await this.instance.post("/urls/sites", {
      sites,
    });
    return result;
  }

  async recevoir() {
    try {
      const result = await this.instance.post("/urls/feast", {
        maxUrlsCount: 25,
      });

      // console.log(result.data);
      const sites = await Promise.all(
        result.data.map(async (url) => {
          return await crawler.lancerAnalyse(url);
        })
      );

      const sites_path = sites.path_enfants.map(async (url)=>{
        return await crawler.lancerAnalyse(sites.lien_principal + url);
      })

      console.log("¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨");
      console.log("site:" );
       console.log(sites);
       console.log( "site path:" );
       console.log( sites_path);
       
      await this.envoyer_resultat(sites);
    } catch (error) {
      console.error(error);
    }
  }

  async run() {
    while (true) {
      try {
        await this.recevoir();
        const sleep = (waitTimeInMs) => new Promise((resolve) => setTimeout(resolve, waitTimeInMs));

        await sleep(10000); // sleep for 10 seconds
      } catch (error) {
        console.log("rien a faire");
        const sleep = (waitTimeInMs) => new Promise((resolve) => setTimeout(resolve, waitTimeInMs));

        await sleep(10000); // sleep for 10 seconds
      }
    }
  }
}

crawler = new Crawler();

crawler.run();
