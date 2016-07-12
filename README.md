# Nodman - A Web Interface For Managing Nodejs Processes 
## Overview
----
The whole architecture is simple:
* We have a master node server, which we call it *MP*, that has a web interface.
    * The interaction between the server and the interface is established with socket.io
    * Currently, there are four events established between MP and CP, which are:
        * start
        * close 
        * show log
        * close log
* Apart from *MP*, we have several child node servers, which we call them CPs.
    * The communication between CPs and MP is established using a REIDS server with SUBSCRIBE/PUBLISH
* MP and each CP have two REDIS clients, one for subscribing and one for publising.


