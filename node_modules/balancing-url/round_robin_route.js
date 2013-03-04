function RoundRobinRoute(urls) {
  this._urls = urls;
  this._size = urls.length;
  this._index = 0;
}

RoundRobinRoute.prototype.getUrl = function () {
  var url = this._getCurrentUrl();

  this._updateIndexByRoundRobin();

  return url;
};

RoundRobinRoute.prototype._getCurrentUrl = function () {
  return this._urls[this._index];
};

RoundRobinRoute.prototype._updateIndexByRoundRobin = function () {
  this._index = (this._index + 1) % this._size;
};

module.exports = RoundRobinRoute;
