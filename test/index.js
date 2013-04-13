/*jslint node: true, stupid: true */
/*globals describe, before, beforeeach, after, it */

var assert = require('assert');
var path = require('path');
var requestMock = function (path) {
  return requestMock.process(path);
};

require.cache[path.resolve(__dirname, '../node_modules/request/main.js')] = { exports: requestMock };

suite('Balancing Request', function () {
  var balancingRequest = require('../index.js');
  var remoteStream;

  test('Returns a stream with only a single route set.', function (done) {
    var url = 'http://example.com';
    var path = '/path.jpg';

    requestMock.process = function (generatedUrl) {
      assert.equal(generatedUrl, url + path);
      done();
    };

    remoteStream = balancingRequest(url);
    remoteStream(path);
  });

  test('Returns a stream with an array of routes set.', function (done) {
    var urls = ['http://example.com'];
    var path = '/path.jpg';

    requestMock.process = function (generatedUrl) {
      assert.equal(generatedUrl, urls[0] + path);
      done();
    };

    remoteStream = balancingRequest(urls);
    remoteStream(path);
  });

  test('Invalid route returns undefined', function () {
    var routes = [
          { match: '/valid_route', urls: [ 'http://example.com' ] }
        ];
    var path = '/invalid_route/path.jpg';

    remoteStream = balancingRequest(routes);
    assert.equal(undefined, remoteStream(path));
  });

  test('Selects a URL using a custom Route Type.', function (done) {
    var urls = ['http://example.com', 'http://example.net'];
    var path = '/path.jpg';

    function RouteTypeMock(urls) {
      this._urls = urls;
    }

    RouteTypeMock.prototype.getUrl = function () {
      return this._urls[0];
    };

    requestMock.process = function (generatedUrl) {
      assert.equal(generatedUrl, urls[0] + path);
      done();
    };

    remoteStream = balancingRequest(urls, RouteTypeMock);
    remoteStream(path);
  });
});
