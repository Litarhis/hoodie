// Generated by CoffeeScript 1.3.3

Backbone.connect = function(url) {
  return Backbone.hoodie = new Hoodie(url);
};

Backbone.sync = function(method, modelOrCollection, options) {
  var attributes, id, promise, type;
  id = modelOrCollection.id, attributes = modelOrCollection.attributes, type = modelOrCollection.type;
  type || (type = modelOrCollection.model.prototype.type);
  promise = (function() {
    switch (method) {
      case "read":
        if (id) {
          return Backbone.hoodie.my.store.find(type, id);
        } else {
          return Backbone.hoodie.my.store.findAll();
        }
        break;
      case "create":
        return Backbone.hoodie.my.store.create(type, attributes);
      case "update":
        return Backbone.hoodie.my.store.update(type, id, attributes);
      case "delete":
        return Backbone.hoodie.my.store["delete"](type, id);
    }
  })();
  if (options.success) {
    promise.done(options.success);
  }
  if (options.error) {
    return promise.fail(options.error);
  }
};

Backbone.Model.prototype.merge = function(attributes) {
  return this.set(attributes, {
    remote: true
  });
};

Backbone.Collection.prototype.initialize = function() {
  var opts, type,
    _this = this;
  type = this.model.prototype.type;
  opts = {
    remote: true
  };
  if (this.model.prototype.type) {
    Backbone.hoodie.my.remote.on("create:" + this.model.prototype.type, function(id, attributes) {
      return _this.add(attributes, opts);
    });
    Backbone.hoodie.my.remote.on("destroye:" + this.model.prototype.type, function(id, attributes) {
      var _ref;
      return (_ref = _this.get(id)) != null ? _ref.destroy(opts) : void 0;
    });
    return Backbone.hoodie.my.remote.on("update:" + this.model.prototype.type, function(id, attributes) {
      var _ref;
      return (_ref = _this.get(id)) != null ? _ref.merge(attributes, opts) : void 0;
    });
  }
};
