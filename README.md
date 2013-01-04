beef-cutter
===========

Node.js RESTful API access for BeEF, the Browser Exploitation Framework (https://github.com/beefproject/beef).

Uses commander.js (https://github.com/visionmedia/commander.js).

## Installation
    $ git clone https://github.com/danpopp/beef-cutter.git
    $ cd beef-cutter
    $ npm install commander
    
## Usage
    $ node beef-cutter.js [options] 
    

## Options:

    -h, --help     output usage information
    -V, --version  output the version number
    -l, --local    Show connected clients on the LAN.
    -o, --online   List online hosts by IP only.
    -O, --fullon   List online hosts with device URI included.
    -x, --offline  List offline hosts by IP only.
    -X, --fulloff  List offline hosts with device URI included.
    -d, --debug    Show debugging info.
