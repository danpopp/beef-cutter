#!/usr/bin/env node
/**
  * Access to BeEF RESTful API for Node.js 
  * By: Dan Popp (dan@comeandget.me) - December 2012
  */
var program = require('commander');

program
  .version('BeEF-Cutter: BeEF RESTful API Access for Node.js\nVersion 0.0.3-alpha (codename: "shnickerdoodle")')
  .option('-o, --online', 'List online hosts by IP.')
  .option('-O, --fullon', 'List online hosts with page URI included.')
  .option('-x, --offline', 'List offline hosts by IP.')
  .option('-X, --fulloff', 'List offline hosts with page URI included.')
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
                console.log('\r');
                hooks = '/api/hooks?token=' + token;
                var optionsgetmsg = {
                        host : 'localhost',
                        port : 3000,
                        path : hooks,
                        method : 'GET'
                };

                if (program.online){
                var reqGet = beef.request(optionsgetmsg, function(res) {
                        res.on('data', function(beefchunk) {
                                console.info('\nONLINE HOST(S):\r');
                                var beefjson = JSON.parse(beefchunk);
                                var hookedlist = (beefjson['hooked-browsers'].online);
                                for (i in hookedlist)
                                {
                                console.log(hookedlist[i].ip + '\r');
                                }
                        });

                });
                reqGet.end();
                reqGet.on('error', function(e) {
                        console.error(e);
                });
                }

                if (program.fullon){
                var reqGet = beef.request(optionsgetmsg, function(res) {
                        res.on('data', function(beefchunk) {
                                console.info('\nONLINE HOST(S):\t\tPAGE URI:');
                                var beefjson = JSON.parse(beefchunk);
                                var hookedlist = (beefjson['hooked-browsers'].online);
                                for (i in hookedlist)
                                {
                                console.log(hookedlist[i].ip + '\t\t' + hookedlist[i].page_uri + '\r');
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
                                console.info('\nOFFLINE HOST(S):\r');
                                var beefjson = JSON.parse(beefchunk);
                                var hookedlist = (beefjson['hooked-browsers'].offline);
                                for (i in hookedlist)
                                {
                                console.log(hookedlist[i].ip + '\r');
                                }
                        });

                });
                reqGet.end();
                reqGet.on('error', function(e) {
                        console.error(e);
                });
                }

                if (program.fulloff){
                var reqGet = beef.request(optionsgetmsg, function(res) {
                        res.on('data', function(beefchunk) {
                                console.info('\nOFFLINE HOST(S):\tPAGE URI:');
                                var beefjson = JSON.parse(beefchunk);
                                var hookedlist = (beefjson['hooked-browsers'].offline);
                                for (i in hookedlist)
                                {
                                console.log(hookedlist[i].ip + '\t\t' + hookedlist[i].page_uri + '\r');
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
