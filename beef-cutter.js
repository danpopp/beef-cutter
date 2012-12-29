//Access to BeEF RESTful API for Node.js 
//By: Dan Popp (dan@comeandget.me) */* December 2012

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
                var reqGet = beef.request(optionsgetmsg, function(res) {
                        res.on('data', function(beefchunk) {
                                console.info('BODY: ' + beefchunk + '\n');
                                var beefjson = JSON.parse(beefchunk);
                                console.info('hooked-browsers' + beefjson['hooked-browsers']);
                        });

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
