const request = require('request');
const cheerio = require('cheerio');
const url = require('url');
var validUrl = require('valid-url');
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
        this.instance= axios.create({baseURL: 'http://127.0.0.1:3000',headers:{Authorization: "mSlu20JMWtM/RSrfxWVtvJuRlEg="}})
    }



    // function pour analyser la page d'un lien recu  
    lancerAnalyse(lien_principal){
        let urls_enfants= new Set();
        
        console.log(lien_principal);

        if (validUrl.isUri(lien_principal)){
            console.log('lien_principal is valid URI');

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
                            if(link && link.match("http") == "http" ){
                                if (validUrl.isUri(link)){
                                    const link1 = new URL(link);
                                    urls_enfants.add(link1.hostname);
                                } 
                                else {
                                    console.log('Not a URI');
                                }
    
    
    
                            }else{
                                const link2 = $(this).text();
                                var sp=link2.split(" ");
                                sp.forEach(phrase => {
                                    if(phrase && phrase.match("http") === "http"){
                                        if (validUrl.isUri(phrase)){
                                            const link = new URL(phrase);
                                            urls_enfants.add(link.hostname);
                                        } 
                                        else {
                                            console.log('Not a URI');
                                        }
    
    
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
                        resolve(new Site(lien_principal,[...urls_enfants], $("title").text()));
                    }
                   
                }
                )
            });
        } 
        else {
            console.log('lien_principal Not a URI');
        }



    }


    async envoyer_resultat(sites){
        const result = await this.instance.post('/urls/sites',{
            sites
        })
        return result;
    }

    async recevoir(){

      try {
        
        const result=  await this.instance.post('/urls/feast',{
          maxUrlsCount: 25
        })

        console.log(result.data);
        const sites= await Promise.all(
        result.data.map(async (url) => {
            return await crawler.lancerAnalyse(url);
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
                const sleep = (waitTimeInMs) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));

                await sleep(100000); // sleep for 10 seconds
                
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
  


