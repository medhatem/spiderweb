const request = require('request');
const cheerio = require('cheerio');
const url = require('url');

class Site {
    constructor(url_princ,enfant, parent) {
      this.lien_principal = url_princ;
      this.titre= null;
      this.list_parent=parent;
      this.list_enfant=enfant;
    }
}

class Crawler {
    constructor(url_princ, li) {
      this.lien_principal = url_princ;
      this.list=li;
    }
    set lien_principal(url_princ) {
      this._lien_principal = url_princ;
    }

    get lien_principal() {
      return this._lien_principal;
    }
    
    set list(lists) {
        this._list = lists;
      }
  
    get list() {
        return this._list;
    }
      
    lancerAnalyse(lien_principal,list){
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
    recevoir(){
        
    }
  }

//   var li=[];
//   let myset= new Set();
//   c = new Crawler("https://www.npmjs.com/", li);
//   c.lancerAnalyse("https://www.npmjs.com/", li,myset);

  var li1=[];
  
  c = new Crawler("http://github.com", li1);
  c.lancerAnalyse("http://github.com",li1);
