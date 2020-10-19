const request = require('request');
const cheerio = require('cheerio');
const url = require('url');
const axios = require('axios');

class Site {
    constructor(url_princ,enfant) {
      this.lien_principal = url_princ;
      this.titre= null;
      this.description= null;
      this.set_enfant=enfant;
    }
}



class Crawler {
    constructor() {
    }
    // function pour analyser la page d'un lien recu  
    lancerAnalyse(lien_principal){
        let urls_enfants= new Set();
        const site=new Site();
        console.log(lien_principal);
        request(lien_principal, function (err, res, body) {
            if(err)
            {
                console.log(err);
            }   
            else
            {
        
                let $ = cheerio.load(body);  //loading of complete HTML body
            
                $('a').each(function(index){
                    const link = $(this).attr('href');
                    if(link.match("http") == "http"){
                        const link1 = new URL(link);
                        urls_enfants.add(link1.hostname);

                    }else{
                        const link2 = $(this).text();
                        var sp=link2.split(" ");
                        sp.forEach(phrase => {
                            if(phrase.match("http") === "http"){
                                const link = new URL(phrase);
                                urls_enfants.add(link.hostname);

                            }
                        });
                    }
                });
                const principal_url = new URL(lien_principal);
                console.log("____________________________________________________________________");
                console.log("____________________________________________________________________");
                
                urls_enfants.forEach(function(lien) {
                    //const current_url = new URL(lien);
                    
                    if(principal_url.hostname.toString().match(principal_url.hostname.toString()) !=lien.toString() ){
                        
                        console.log(lien);
                    }
                  })
                  site(lien_principal,urls_enfants);
            }
            console.log("************************")
            console.log(site);
        }
        );
        return site;
    }


    envoyer_resultat(){

    }
    async recevoir(){

      try {
        const instance= axios.create({baseURL: 'http://127.0.0.1:3000'})
        const result=  await instance.post('/urls/feast',{
          crawlerId: 1,
          maxUrlsCount: 25
        })
        const sites=[];
        result.data.forEach(couple => {
            sites.push(crawler.lancerAnalyse(couple.url));
        });
        console.log("*******************************************************");
        console.log(sites);
      } catch (error) {
        console.error(error);
      }
 

    }
  }

//   var li=[];
//   let myset= new Set();
//   c = new Crawler("https://www.npmjs.com/", li);
//   c.lancerAnalyse("https://www.npmjs.com/", li,myset);


  crawler = new Crawler();

  crawler.recevoir().then();
  


