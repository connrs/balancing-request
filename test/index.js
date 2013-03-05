/*jslint node: true, stupid: true */
/*globals describe, before, beforeeach, after, it */

var assert = require('assert'),
    path = require('path'),
    BalancingUrlMock = function () {},
    requestMock = function (path) {
      return requestMock.process(path);
    };

BalancingUrlMock.prototype.routeTypes = { RANDOM: function () {} };
BalancingUrlMock.prototype.setRoutes = function () {};
BalancingUrlMock.prototype.setRouteType = function () {};

require.cache[path.resolve(__dirname, '../node_modules/balancing-url/index.js')] = { exports: BalancingUrlMock };
require.cache[path.resolve(__dirname, '../node_modules/request/main.js')] = { exports: requestMock };

suite('OL Proxy Request Remote', function () {
  var OLProxyRequestRemote = require('../index.js'),
      remote;

  test('Returns a stream with only a single route set.', function (done) {
    var url = 'http://example.com',
        path = '/path.jpg';
    BalancingUrlMock.prototype.setRoutes = function (routes) {
      assert.equal(routes, url);
    };
    BalancingUrlMock.prototype.generateUrl = function (path) {
      return url + path;
    };
    requestMock.process = function (generatedUrl) {
      assert.equal(generatedUrl, url + path);
      done();
    };
    remote = new OLProxyRequestRemote();
    remote.setRoutes(url);
    remote.remoteStream(path);
  });

  test('Returns a stream with an array of routes set.', function (done) {
    var urls = ['http://example.com'],
        path = '/path.jpg';

    BalancingUrlMock.prototype.setRoutes = function () {};
    BalancingUrlMock.prototype.generateUrl = function (path) {
      return urls[0] + path;
    };
    requestMock.process = function (generatedUrl) {
      assert.equal(generatedUrl, urls[0] + path);
      done();
    };
    remote = new OLProxyRequestRemote();
    remote.setRoutes(urls);
    remote.remoteStream(path);
  });

  test('It exposes the BalancingUrl Route Types.', function () {
    assert.equal(BalancingUrlMock.routeTypes, OLProxyRequestRemote.routeTypes);
  });

  test('Valid route passed to isValidRoute', function () {
    var routes = [
          { match: '/valid_route', urls: [ 'http://example.com' ] }
        ],
        path = '/valid_route/path.jpg';

    BalancingUrlMock.prototype.setRoutes = function () {};
    BalancingUrlMock.prototype.setRouteType = function () {};
    BalancingUrlMock.prototype.generateUrl = function (path) {
      return !!path.match(routes[0].match);
    };
    remote = new OLProxyRequestRemote();
    remote.setRoutes(routes);
    assert.ok(remote.isValidRoute(path));
  });

  test('Invalid route passed to isValidRoute', function () {
    var routes = [
          { match: '/valid_route', urls: [ 'http://example.com' ] }
        ],
        path = '/invalid_route/path.jpg';

    BalancingUrlMock.prototype.setRoutes = function () {};
    BalancingUrlMock.prototype.setRouteType = function () {};
    BalancingUrlMock.prototype.generateUrl = function (path) {
      if (!!path.match(routes[0].match)) {
        return routes[0].urls[0] + path;
      }
    };
    remote = new OLProxyRequestRemote();
    remote.setRoutes(routes);
    assert.ok(!remote.isValidRoute(path));
  });

  test('Selects a URL using a custom Route Type.', function (done) {
    var urls = ['http://example.com', 'http://example.net'],
        path = '/path.jpg',
        RouteTypeMock = function (urls) { this._urls = urls; };

    RouteTypeMock.prototype.getUrl = function () { return this._urls[0]; };
    BalancingUrlMock.prototype.setRoutes = function () {};
    BalancingUrlMock.prototype.setRouteType = function (RouteType) {
      this._routeType = RouteType;
    };
    BalancingUrlMock.prototype.generateUrl = function (path) {
      var route = new this._routeType(urls);
      return route.getUrl() + path;
    };
    requestMock.process = function (generatedUrl) {
      assert.equal(generatedUrl, urls[0] + path);
      done();
    };
    remote = new OLProxyRequestRemote();
    remote.setRouteType(RouteTypeMock);
    remote.setRoutes(urls);
    remote.remoteStream(path);
  });
});
