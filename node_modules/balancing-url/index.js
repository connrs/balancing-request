var RoundRobinRoute = require('./round_robin_route');
var RandomRoute = require('./random_route');

function BalancingUrl() {
  this._routes = {};
  this._routesRegex = {};
}

BalancingUrl.routeTypes = {
  RANDOM: RandomRoute,
  ROUND_ROBIN: RoundRobinRoute
};

BalancingUrl.prototype._routes = undefined;
BalancingUrl.prototype._routesRegex = undefined;
BalancingUrl.prototype._routeType = BalancingUrl.routeTypes.RANDOM;

BalancingUrl.prototype.setRoutes = function (routes) {
  if (this._isString(routes)) {
    this._setRoutePath('', [routes]);
  }
  else if (this._isStringArray(routes)) {
    this._setRoutePath('', routes);
  }
  else if (this._isObjectArray(routes)) {
    this._setObjectArrayRoutes(routes);
  }
};

BalancingUrl.prototype.generateUrl = function (requestUri) {
  var url = this._getRouteUrl(requestUri);
  return url;
};

BalancingUrl.prototype.setRouteType = function (routeType) {
  this._routeType = routeType;
};

BalancingUrl.prototype._setRoutePath = function (path, urls) {
  path = this._stripTrailingSlash(path);
  urls = urls.map(this._stripTrailingSlash);
  this._routes[path] = new this._routeType(urls);
  this._routesRegex[path] = this._createRouteRegex(path);
};

BalancingUrl.prototype._stripTrailingSlash = function (url) {
  return url.replace(/\/$/, '');
};

BalancingUrl.prototype._createRouteRegex = function (path) {
  return new RegExp('^(' + this._escapeRegex(path) + ')(\/.*)');
};

BalancingUrl.prototype._setObjectArrayRoutes = function (routes) {
  var i, size = routes.length;

  for (i = 0; i < size; i++) {
    this._setRoutePath(routes[i].match, routes[i].urls);
  }
};

BalancingUrl.prototype._escapeRegex = function (str) {
  return str.replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
};

BalancingUrl.prototype._isString = function (str) {
  return Object.prototype.toString.apply(str) === '[object String]';
};

BalancingUrl.prototype._isArray = function (arr) {
  return Object.prototype.toString.apply(arr) === '[object Array]';
};

BalancingUrl.prototype._isObject = function (obj) {
  return Object.prototype.toString.apply(obj) === '[object Object]';
};

BalancingUrl.prototype._isStringArray = function (arr) {
  return arr.filter(this._isString).length === arr.length;
};

BalancingUrl.prototype._isObjectArray = function (arr) {
  return arr.filter(this._isObject).length === arr.length;
};

BalancingUrl.prototype._getRouteUrl = function (requestUri) {
  var routePath = this._routeKeyForMatchingRequestUri(requestUri);

  if (typeof routePath !== 'undefined') {
    return this._routes[routePath].getUrl() + this._stripRoutePathFromRequestUri(routePath, requestUri);
  }
};

BalancingUrl.prototype._routeKeyForMatchingRequestUri = function (requestUri) {
  var i, routePaths = Object.keys(this._routes);

  for (i = 0; i < routePaths.length; i++) {
    if (this._routePathMatchesRequestUri(routePaths[i], requestUri)) {
      return routePaths[i];
    }
  }
};

BalancingUrl.prototype._routePathMatchesRequestUri = function (routePath, requestUri) {
  return this._routesRegex[routePath].test(requestUri);
};

BalancingUrl.prototype._stripRoutePathFromRequestUri = function (routePath, requestUri) {
return requestUri.match(this._routesRegex[routePath])[2];
};

function balancingUrl(routes, routeType) {
  var url = new BalancingUrl();
  if (typeof routeType !== 'undefined') {
    url.setRouteType(routeType);
  }
  url.setRoutes(routes);
  return url.generateUrl.bind(url);
}
balancingUrl.routeTypes = BalancingUrl.routeTypes;

module.exports = balancingUrl;
