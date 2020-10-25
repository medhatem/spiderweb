const request = require('request');
const cheerio = require('cheerio');
const url = require('url');
const axios = require('axios');

class Site {
    constructor(url_princ,enfant,title,descript) {
      this.lien_principal = url_princ;
      this.set_enfant=enfant;
      this.titre= title;
      this.description= descript;
    }
}


class Crawler {
    constructor() {
        this.instance= axios.create({baseURL: 'http://127.0.0.1:3000'})
    }



    // function pour analyser la page d'un lien recu  
    lancerAnalyse(lien_principal){
        let urls_enfants= new Set();
        
        console.log(lien_principal);
        return new Promise(function (resolve, reject) {
            request(lien_principal, function (err, res, body) {
                if(err)
                {
                    //console.log(err);
                    reject(err);
                    return;
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
                    //console.log("____________________________________________________________________");
                    //console.log("____________________________________________________________________");
                    
                    urls_enfants.forEach(function(lien) {
                        //const current_url = new URL(lien);
                        
                        if(principal_url.hostname.toString().match(principal_url.hostname.toString()) !=lien.toString() ){
                            
                            //console.log(lien);
                        }
                    })
                    resolve(new Site(lien_principal,urls_enfants, $("title").text()));
                }
               
            }
            )
        });

    }


    async envoyer_resultat(sites){
        const result = await this.instance.post('/urls/urls',{
            sites
        })
        return result;
    }

    async recevoir(){

      try {
        
        const result=  await this.instance.post('/urls/feast',{
          crawlerId: 1,
          maxUrlsCount: 25
        })

        
        const sites= await Promise.all(
        result.data.map(async (couple) => {
            return await crawler.lancerAnalyse(couple.url);
        }));
        
        console.log("¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨");
        console.log(sites);
       await this.envoyer_resultat(sites);
      } catch (error) {
        console.error(error);
      }
 

    }

    async run(){
        while(true){

            try {
                await this.recevoir();
                
            } catch (error) {
                console.log("rien a faire")
                const sleep = (waitTimeInMs) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));

                await sleep(10000); // sleep for 10 seconds

            }
        } 
    }
  }

  crawler = new Crawler();

  crawler.run();
  


