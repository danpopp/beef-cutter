#!/usr/bin/env node
/**
  * Access to BeEF RESTful API for Node.js 
  * By: Dan Popp (dan@comeandget.me) - December 2012
  */
var program = require('commander');

program
  .option('-l, --local', 'Show connected clients on the LAN by MAC address.')
  .option('-o, --online', 'List online hosts by IP only.')
  .option('-O, --fullon', 'List online hosts with device URI included.')
  .option('-x, --offline', 'List offline hosts by IP only.')
  .option('-X, --fulloff', 'List offline hosts with device URI included.')
  .option('-d, --debug', 'Show debugging info.')
  .version('BeEF-Cutter: BeEF RESTful API Access for Node.js\nVersion 0.0.4-alpha (codename: "cheese-doodle")')
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
                var beefobj = JSON.parse(beefchunk);
                var token = beefobj.token;
                if (program.debug){
 			console.log('BeEF Authorization Token:');
                process.stdout.write(token);
				console.log('\r');
                }
                hooks = '/api/hooks?token=' + token;
                var optionsgetmsg = {
                        host : 'localhost',
                        port : 3000,
                        path : hooks,
                        method : 'GET'
                };
                
var reqGet = beef.request(optionsgetmsg, function(res) {
	if (program.local){
		console.log('\nShowing ONLINE hosts (LAN-only):');
		res.on('data', function(beefchunk) {
                console.log('\nIP ADDRESS:\t\t MAC ADDRESS:\t\t\tDEVICE URI:');
                var beefjson = JSON.parse(beefchunk);
                var hookedlist = (beefjson['hooked-browsers'].online);
                for (i in hookedlist)
                {
		var util = require('util'),
		exec = require('child_process').exec,
		child;
		child = exec('/usr/sbin/arp | grep ' + hookedlist[i].ip + '| awk \'{print $1"\t\t "$3"\t\t' + hookedlist[i].page_uri + '"}\'| tr -d "\n"',
			function (error, stdout, stderr) {
				if (program.debug){
				var output = stdout.split(/(\r?\n)/g);
				}
				else
				{
				var output = stdout.replace(/\n$/, '')
				}
				//required to prevent empty lines when processing stdout
				if (output != '')
				{
				console.log(output);
				}
				
				if (program.debug){
				console.log('error: ' + stderr);
				if (error !== null) {
				console.log('exec error: ' + error);
				}
				}
			});
		}
	});
	}				
	if (program.online){
        	res.on('data', function(beefchunk) {
                console.log('\nShowing all ONLINE hosts:\n');
		var beefjson = JSON.parse(beefchunk);
                var hookedlist = (beefjson['hooked-browsers'].online);
                console.info('IP ADDRESS:');
                for (i in hookedlist)
                {
                console.log(hookedlist[i].ip + '\r');
                }
                });
	}
	if (program.fullon){
		res.on('data', function(beefchunk) {
                console.log('\nShowing all ONLINE hosts:\n');
		var beefjson = JSON.parse(beefchunk);
                var hookedlist = (beefjson['hooked-browsers'].online);
                console.info('IP ADDRESS:\t\tDEVICE URI:');
                for (i in hookedlist)
                {
                console.log(hookedlist[i].ip + '\t\t' + hookedlist[i].page_uri + '\r');
                }
                });
	}
	if (program.offline){
		res.on('data', function(beefchunk) {
                console.log('\nShowing OFFLINE hosts:\n');
		var beefjson = JSON.parse(beefchunk);
                var hookedlist = (beefjson['hooked-browsers'].offline);
                console.info('IP ADDRESS:\r');
                for (i in hookedlist)
                {
                console.log(hookedlist[i].ip + '\r');
                }
		});
	}
	if (program.fulloff){
        	res.on('data', function(beefchunk) {
                console.log('\nShowing OFFLINE hosts:\n');
		var beefjson = JSON.parse(beefchunk);
		var hookedlist = (beefjson['hooked-browsers'].offline);
		console.info('IP ADDRESS:\tDEVICE URI:');
                for (i in hookedlist)
                {
                console.log(hookedlist[i].ip + '\t\t' + hookedlist[i].page_uri + '\r');
                }
                });
	}
	});
	reqGet.end();
        reqGet.on('error', function(e) {
        	console.error(e);
        });
	});
});
reqPost.write(beefObject);
reqPost.end();
reqPost.on('error', function(e) {
        console.error(e);
});
