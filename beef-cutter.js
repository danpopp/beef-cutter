#!/usr/bin/env node
/**
  * Access to BeEF RESTful API for Node.js 
  * By: Dan Popp (dan@comeandget.me) - December 2012
  */
var program = require('commander');

program
  .version('BeEF-Cutter: BeEF RESTful API Access for Node.js\nVersion 0.0.3-alpha (codename: "shnickerdoodle")')
  .option('-o, --online', 'List online hosts.')
  .option('-x, --offline', 'List offline hosts.')
  .parse(process.argv);

var beef = require('http');

beefObject = JSON.stringify({
        "username" : "beef",
        "password" : "beef"
});

var postheaders = {
        'Content-Type' : 'application/json',
        'Content-Length' : Buffer.byteLength(beefObject, 'utf8')
};

var optionspost = {
        host : 'localhost',
        port : 3000,
        path : '/api/admin/login',
        method : 'POST',
        headers : postheaders
};

var reqPost = beef.request(optionspost, function(res) {
        res.on('data', function(beefchunk) {
                console.info('\nBeEF Authorization Token:');
                var beefobj = JSON.parse(beefchunk);
                var token = beefobj.token;
                process.stdout.write(token);
                console.info('\n');
                var hooks = '/api/hooks?token=' + token;
                var optionsgetmsg = {
                        host : 'localhost',
                        port : 3000,
                        path : hooks,
                        method : 'GET'
                };

                if (program.online){
                var reqGet = beef.request(optionsgetmsg, function(res) {
                        res.on('data', function(beefchunk) {
                                console.info('ONLINE HOSTS:\n');
                                var beefjson = JSON.parse(beefchunk);
                                var hookedlist = (beefjson['hooked-browsers'].online);
                                for (i in hookedlist)
                                {
                                console.log(hookedlist[i].page_uri + '\n');
                                }
                        });

                });
                reqGet.end();
                reqGet.on('error', function(e) {
                        console.error(e);
                });
                }

                if (program.offline){
                var reqGet = beef.request(optionsgetmsg, function(res) {
                        res.on('data', function(beefchunk) {
                                console.info('OFFLINE HOSTS:\n');
                                var beefjson = JSON.parse(beefchunk);
                                var hookedlist = (beefjson['hooked-browsers'].offline);
                                for (i in hookedlist)
                                {
                                console.log(hookedlist[i].page_uri + '\n');
                                }
                        });

                });
                reqGet.end();
                reqGet.on('error', function(e) {
                        console.error(e);
                });
                }
        });
});
reqPost.write(beefObject);
reqPost.end();
reqPost.on('error', function(e) {
        console.error(e);
});
