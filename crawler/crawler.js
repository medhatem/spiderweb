const request = require('request');
const cheerio = require('cheerio');
const url = require('url');
const axios = require('axios');

class Site {
  constructor(url_princ, enfant, path, title) {
    this.lien_principal = url_princ;
    this.set_enfant = enfant;
    this.set_path = path;
    this.titre = title;
  }

  set set_path(path) {
    this._set_path = path;

}

get set_path() {
    return this._set_path;
}
set set_enfant(enfant) {
  this._set_enfant = enfant;

}

get set_enfant() {
  return this._set_enfant;
}

}


class Crawler {
    constructor() {
      this.instance= null;
    }
    
    async subscribe(){
      try {
      const res= await axios.post('http://127.0.0.1:3000/subscribe',{ "secret": "ii" });
      const token= res.data.crawler_token;
      console.log("token: "+token);
      this.instance= axios.create({baseURL: 'http://127.0.0.1:3000',headers:{Authorization: token}})
      }catch (e) {
        console.error(e);
      }
    }
    
    // function pour analyser la page d'un lien recu  
    lancerAnalyse(lien_principal){
        let urls_enfants= new Set();
        let path_enfants = new Set();
        
        console.log(lien_principal);
        let lien_principal_valide=null;
        try {
            lien_principal_valide = new URL(lien_principal);
          } catch (error) {
            lien_principal_valide = new URL("https://"+lien_principal);
          } 


        return new Promise(function (resolve, reject) {
            request(lien_principal_valide.origin, function (err, res, body) {
                if(err)
                {
                    reject(err);
                    return;
                }   
                else
                {
            
                    let $ = cheerio.load(body);  //loading of complete HTML body
                
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
          
                    resolve(new Site(lien_principal, urls_enfants, path_enfants, $("title").text()));

                  }
                
            }
            )
        });
    }

    async envoyer_resultat(sites){
        const result = await this.instance.post('/urls/sites',{
            sites
        })
        return result;
    }

    union_set(setA, setB) {
      var union = new Set(setA);
      for (var elem of setB) {
        union.add(elem);
      }
      return union;
    }

    async recevoir(){

      try {
        
        const result=  await this.instance.post('/urls/feast',{
          maxUrlsCount: 25
        })

        console.log("resultat de feast:")
        console.log(result.data);

        const sites= await Promise.all(
        result.data.map(async (url) => {
            return await crawler.lancerAnalyse(url);
        }));


        for (const site of sites) {

          const sites_paths =new Set(); // {Site, Site, Site}
          if(site.set_path != null){
            for(const path of site.set_path){
              sites_paths.add(await crawler.lancerAnalyse(site.lien_principal + path));
              const sleep = (waitTimeInMs) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));
              await sleep(1000); // sleep for 1 second
            }
          }
          for(const enfant of sites_paths){
            site.set_enfant =this.union_set(enfant.set_enfant,site.set_enfant); // {Site.set_enfant, Site, Site}, {url, url, url}
          }

          for(const path of sites_paths){
            site.set_path =this.union_set(path.set_path,site.set_path); // {Site.set_enfant, Site, Site}, {url, url, url}
          }
        }



         
         console.log("¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨");
         console.log("site apres:" );
        console.log(sites);


        sites.forEach(site => {
          site.set_enfant= [...site.set_enfant];
          site.set_path= [...site.set_path];

        });

       await this.envoyer_resultat(sites);
      } catch (error) {
        console.error(error);
      }
 

    }

    async run(){
        try {
          await this.subscribe();

          while(true){

            try {
                await this.recevoir();
                const sleep = (waitTimeInMs) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));

                await sleep(1000); // sleep for 1 second
                
            } catch (error) {
                console.log("rien a faire")
                const sleep = (waitTimeInMs) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));

                await sleep(1000); // sleep for 1 second

            }
        }
        } catch (e) {
          console.log('erreeeeur:'+ e)
        }
 
    }

  }

  crawler = new Crawler();

  crawler.run();

//  crawler2 = new Crawler();

//   crawler2.run();
