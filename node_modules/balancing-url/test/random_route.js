/*jslint node: true, stupid: true */
/*globals describe, before, beforeeach, after, it */

var assert = require('assert'),
    path = require('path');

suite('Random Route Type', function () {
  var RandomRoute = require('../random_route'),
      oldMathRandom,
      randomRoute;

  function mockMathRandom(fixedValue) {
    oldMathRandom = Math.random;
    Math.random = function () {
      return fixedValue;
    };
  }

  function restoreMathRandom() {
    Math.random = oldMathRandom;
  }

  test('Returns a randomly chosen route', function () {
    var urls = [
          'http://example.org',
          'http://example.net',
          'http://example.com'
        ];

    mockMathRandom(1/3);
    randomRoute = new RandomRoute(urls);
    assert.equal(randomRoute.getUrl(), urls[1]);
    restoreMathRandom();
  });
});
