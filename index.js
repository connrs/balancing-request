var request = require('request'),
    BalancingUrl = require('balancing-url');

function OLProxyRequestRemote() {
  this._balancingUrl = new BalancingUrl();
}

OLProxyRequestRemote.routeTypes = BalancingUrl.routeTypes;

OLProxyRequestRemote.prototype.setRoutes = function (routes) {
  this._balancingUrl.setRoutes(routes);
};

OLProxyRequestRemote.prototype.remoteStream = function (path) {
  return request(this._balancingUrl.generateUrl(path));
};

OLProxyRequestRemote.prototype.setRouteType = function (RouteType) {
  this._balancingUrl.setRouteType(RouteType);
};

module.exports = OLProxyRequestRemote;
