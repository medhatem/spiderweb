const request = require('request');
const cheerio = require('cheerio');
const url = require('url');
const lien_principal = "http://github.com";
//const URL ="/redirect?redir_token=QUFFLUhqa0t0Vi15cDB0dmpfc3NVYmpGenZVeFpVZzltd3xBQ3Jtc0trc04zYkFUWnYySzh0a2ZoVzlxc3ZmWHpieW9WZEZ0b3Q4a1cwLWxlOGFXbDA2THVOemwzamEtcnRzZklkdm11dGlyeXdBVWRhampDdWhpazhOeVpEaG1OQU1uZHl5eHhLT1lCRi04UGgxTU9oQjZCZw%3D%3D&q=http%3A%2F%2Fwww.instagram.com%2Fmourad_oudia&event=video_description&v=fi6Dw90fKgQ";
var list=[];

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
            //const name = $(this).find('div._1-2Iqu>div.col-7-12>div._3wU53n').text();
            //console.log(link);   //link for smartphone
            //console.log(name);   //name of smartphone
            if(link.match("http") == "http"){
               // console.log(link);
                list.push(link);
            }else{
                const link2 = $(this).text();
                var sp=link2.split(" ");
                sp.forEach(phrase => {
                    if(phrase.match("http") == "http"){
                        //console.log(phrase);
                    
            
                        list.push(phrase);
                    }

                });

            }

        });
        // $('script').each(function(index){
        //     const link = $(this).attr('src');
        //     //const name = $(this).find('div._1-2Iqu>div.col-7-12>div._3wU53n').text();
        //     //console.log(link);   //link for smartphone
        //     //console.log(name);   //name of smartphone
        //     list.push(link);
        // });
        const principal_url = new URL(lien_principal);
        //console.log(principal_url.hostname);
        list.forEach(lien => {
            //lien.match(URL.hostname)  
            
            const current_url = new URL(lien);
            if(principal_url.hostname.toString().match(principal_url.hostname.toString()) !=current_url.hostname.toString() ){
                console.log(current_url.hostname)
            }

        });
        //console.log(list.length);
        //console.log(list);
    }
}
);
//list.forEach(url=>console.log(url));
//console.log(list.length);