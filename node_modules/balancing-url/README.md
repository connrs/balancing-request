#Balancing URL

A simple class to randomise the generation of a URL based upon a matching route. The tests in test/ provide a range of implementation details.

When instantiating the class, you may pass either a single string with a domain (eg. `http://example.com`) or an array of domains. This will create a wildcard match; when generating a URL, it will wildcard match and always return a URL. If you, instead, instantiate the class and configure an array of objects of the format `{ match: '/path', urls: [ 'http://example.com', 'http://example.org' ] }`, then it will check that the request URI passed to the generateUrl function matches a path and return a URL with one of the randomised URLs.

You may specify the randomisation process for the URLs by defining which route type that the class should use like so:

    var url = new BalancingUrl();
    url.setRouteType(BalancingUrl.routeTypes.RANDOM);

Available route types include: `BalancingUrl.routeTypes.RANDOM` and `BalancingUrl.routeTypes.ROUND_ROBIN`. Alternatively, you may create your own route type interface. Simply ensure that the public interface of the object matches the interface of the route type objects included in this module. Use the route type tests for further assistance.
