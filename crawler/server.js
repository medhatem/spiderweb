const request = require('request');
const cheerio = require('cheerio');
const mongoose = require('fs');

const URL = "https://www.npmjs.com/package/fs";
var list=[];

request(URL, function (err, res, body) {
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
            list.push(link);
        });
        console.log(list.length);
        console.log(list);
    }
}
);
//list.forEach(url=>console.log(url));
//console.log(list.length);