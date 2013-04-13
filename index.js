var request = require('request');
var balancingUrl = require('balancing-url');

function BalancingRequest() {
  this._routeType = undefined;
  this._generateUrl = undefined;
}

BalancingRequest.prototype.setRoutes = function (routes) {
  this._generateUrl = balancingUrl(routes, this._routeType);
};

BalancingRequest.prototype.remoteStream = function (path) {
  var url = this._generateUrl(path);

  if (url === undefined) {
    return undefined;
  }

  return request(this._generateUrl(path));
};

BalancingRequest.prototype.setRouteType = function (RouteType) {
  this._routeType = RouteType;
};

function balancingRequest(routes, RouteType) {
  var remote = new BalancingRequest();

  if (typeof RouteType !== 'undefined') {
    remote.setRouteType(RouteType);
  }

  remote.setRoutes(routes);
  return remote.remoteStream.bind(remote);
}
balancingRequest.routeTypes = balancingUrl.routeTypes;

module.exports = balancingRequest;
