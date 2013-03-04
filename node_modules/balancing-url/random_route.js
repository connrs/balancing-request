function RandomRoute(urls) {
  this._urls = urls;
  this._size = urls.length;
}

RandomRoute.prototype.getUrl = function () {
  return this._getRandomUrl();
};

RandomRoute.prototype._getRandomUrl = function () {
  return this._urls[this._randomNumber()];
};

RandomRoute.prototype._randomNumber = function () {
  var index = Math.floor(Math.random() * this._size);
  return index;
};

module.exports = RandomRoute;
