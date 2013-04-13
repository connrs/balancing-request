#Balancing URL

A simple class to randomise the generation of a URL based upon a matching route. The tests in test/ provide a range of implementation details.

When instantiating the class, you may pass either a single string with a domain (eg. `http://example.com`) or an array of domains. This will create a wildcard match; when generating a URL, it will wildcard match and always return a URL. If you, instead, instantiate the class and configure an array of objects of the format `{ match: '/path', urls: [ 'http://example.com', 'http://example.org' ] }`, then it will check that the request URI passed to the generateUrl function matches a path and return a URL with one of the randomised URLs.

You may specify the randomisation process for the URLs by defining which route type that the class should use like so:

    var balancingUrl = require('balancing-url');
    var routes = [
      'http://example.com',
      'http://example.org'
    ];
    var generateUrl = balancingUrl(routes, balancingUrl.routeTypes.RANDOM);

    console.log(generateUrl('/here'));
    // http://example.com/here

Available route types include: `BalancingUrl.routeTypes.RANDOM` and `BalancingUrl.routeTypes.ROUND_ROBIN`. Alternatively, you may create your own route type interface. Simply ensure that the public interface of the object matches the interface of the route type objects included in this module. Use the route type tests for further assistance.

##Routes

You can specify routes in several formats:

### Single String

If you're crazy, you can pass a single string when instantiating your generator:

    var generator = balancingUrl('http://example.com');
    var url = generator('/crazy');
    // http://example.com/crazy

When you pass your path in, it will simply build a full URL using http://example.com as the base.

### Array of strings

This is the simplest method of providing a set of base URLs to balance with:

    var urls = [
      'http://example.com',
      'http://example.org'
    ];
    var generator = balancingUrl(urls);
    var url = generator('/test.jpg');
    // http://example.com/test.jpg

When you path your path in, it will use the route type (defaulting to balancingUrl.routeType.RANDOM) to build the full URL.

### Path matching object

Use this method when you wish to match paths to particular sets of base URLs.

    var routes = [
      {
         match: '/example_path',
         urls: [
           'http://example.com',
           'http://example.org'
         ]
      },
      {
         match: '/example_path_2',
         urls: [
           'http://example2.com',
           'http://example2.org'
         ]
      }
    ];
    var generator = balancingUrl(urls);
    var url = generator('/example_path_2/test');
    // http://example2.org/test

In the above example, the generator first matches the passed path and uses the matching set of URLs. Note that the result will not contain the matching part of the path. This is by design so that you can create pseudo paths for matching only.
