const request = require('request');
const cheerio = require('cheerio');
const url = require('url');
const axios = require('axios');

class Site {
    constructor(url_princ,enfant, parent) {
      this.lien_principal = url_princ;
      this.titre= null;
      this.list_parent=parent;
      this.list_enfant=enfant;
    }
}

class Crawler {
    constructor() {
    }
      
    lancerAnalyse(lien_principal){
        let myset= new Set();
        console.log(this.lien_principal);
        request(this.lien_principal, function (err, res, body) {
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
                        myset.add(link1.hostname);

                    }else{
                        const link2 = $(this).text();
                        var sp=link2.split(" ");
                        sp.forEach(phrase => {
                            if(phrase.match("http") === "http"){
                                const link = new URL(phrase);
                                myset.add(link.hostname);

                            }
                        });
                    }
                });
                const principal_url = new URL(lien_principal);
                console.log("____________________________________________________________________");
                console.log("____________________________________________________________________");
                myset.forEach(function(lien) {
                    //const current_url = new URL(lien);
                    if(principal_url.hostname.toString().match(principal_url.hostname.toString()) !=lien.toString() ){
                        console.log(lien);
                    }
                  })

            }
        }
        );
    }

    envoyer_resultat(){

    }
    async recevoir(){

        const list=  await axios.post('127.0.0.1:3000/urls/feast',{
          crawlerId: 1,
          maxUrlsCount: 25
        })

        console.log(list);
        c.lancerAnalyse(list[0]);
        // array.forEach(url => {
          
        //   c.lancerAnalyse(url);
        // });
    }
  }

//   var li=[];
//   let myset= new Set();
//   c = new Crawler("https://www.npmjs.com/", li);
//   c.lancerAnalyse("https://www.npmjs.com/", li,myset);


  c = new Crawler();

  c.recevoir();
  


