/*jslint node: true, stupid: true */
/*globals describe, before, beforeeach, after, it */

var assert = require('assert'),
    path = require('path');

suite('Round Robin Route Type', function () {
  var RoundRobinRoute = require('../round_robin_route'),
      route;

  test('Returns routes by round robin.', function () {
    var urls = [
          'http://example.org',
          'http://example.net',
          'http://example.com'
        ];

    route = new RoundRobinRoute(urls);
    assert.equal(route.getUrl(), urls[0]);
    assert.equal(route.getUrl(), urls[1]);
    assert.equal(route.getUrl(), urls[2]);
    assert.equal(route.getUrl(), urls[0]);
  });
});
