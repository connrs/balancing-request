var request = require('request');
var balancingUrl = require('balancing-url');

function OLProxyRequestRemote() {
  this._routeType = undefined;
  this._generateUrl = undefined;
}

OLProxyRequestRemote.prototype.setRoutes = function (routes) {
  this._generateUrl = balancingUrl(routes, this._routeType);
};

OLProxyRequestRemote.prototype.remoteStream = function (path) {
  var url = this._generateUrl(path);

  if (url === undefined) {
    return undefined;
  }

  return request(this._generateUrl(path));
};

OLProxyRequestRemote.prototype.setRouteType = function (RouteType) {
  this._routeType = RouteType;
};

function olProxyRequestRemote(routes, RouteType) {
  var remote = new OLProxyRequestRemote();

  if (typeof RouteType !== 'undefined') {
    remote.setRouteType(RouteType);
  }

  remote.setRoutes(routes);
  return remote.remoteStream.bind(remote);
}
olProxyRequestRemote.routeTypes = balancingUrl.routeTypes;

module.exports = olProxyRequestRemote;
