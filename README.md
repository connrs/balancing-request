#Balancing Request

An extension of request that takes a set of balancing URL routes and creates a suitable request object based upon a path. Its primary role is as a remote interface dependency of ol-proxy.

##Usage

To create an instance of the request generator, you must first instantiate it by passing in a set of routes and also an optional route type object that is used to perform the balancing computation.

    var balancingRequest = require('balancing-request');
    var routes = [
      'http://example.com',
      'http://example.org'
    ];
    var streamGenerator = balancingRequest(routes);
    var stream = streamGenerator('/sample.jpg');

##Route Types

By default, Balancing Request uses a route type that randomises the URL but you can specify a round robin (balancingUrl.routeTypes.ROUND_ROBIN) route type or create your own custom route type and pass it in as the second parameter when creating your stream generator.

For further information, see [connrs/balancing-url](https://github.com/connrs/balancing-url)
