// Generated by CoffeeScript 1.3.3

describe("Hoodie.LocalStore", function() {
  beforeEach(function() {
    this.hoodie = new Mocks.Hoodie;
    this.store = new Hoodie.LocalStore(this.hoodie);
    spyOn(this.store, "_setObject").andCallThrough();
    spyOn(this.store, "_getObject").andCallThrough();
    spyOn(this.store.db, "getItem").andCallThrough();
    spyOn(this.store.db, "setItem").andCallThrough();
    spyOn(this.store.db, "removeItem").andCallThrough();
    return spyOn(this.store.db, "clear").andCallThrough();
  });
  describe("new", function() {
    return it("should subscribe to account:signout event", function() {
      var store;
      spyOn(this.hoodie, "on");
      store = new Hoodie.LocalStore(this.hoodie);
      return expect(this.hoodie.on).wasCalledWith('account:signout', store.clear);
    });
  });
  describe(".save(type, id, object, options)", function() {
    beforeEach(function() {
      spyOn(this.store, "_now").andReturn('now');
      return spyOn(this.store, "cache").andReturn('cachedObject');
    });
    it("should return a promise", function() {
      var promise;
      promise = this.store.save('document', '123', {
        name: 'test'
      });
      return expect(promise).toBePromise();
    });
    describe("invalid arguments", function() {
      _when("no arguments passed", function() {
        return it("should be rejected", function() {
          return expect(this.store.save()).toBeRejected();
        });
      });
      return _when("no object passed", function() {
        return it("should be rejected", function() {
          var promise;
          promise = this.store.save('document', 'abc4567');
          return expect(promise).toBeRejected();
        });
      });
    });
    _when("id is '123', type is 'document', object is {name: 'test'}", function() {
      beforeEach(function() {
        return this.promise = this.store.save('document', '123', {
          name: 'test'
        }, {
          option: 'value'
        });
      });
      it("should cache document", function() {
        return expect(this.store.cache).wasCalled();
      });
      it("should add timestamps", function() {
        var object;
        object = this.store.cache.mostRecentCall.args[2];
        expect(object.createdAt).toBe('now');
        return expect(object.updatedAt).toBe('now');
      });
      _and("options.remote is true", function() {
        it("should not touch createdAt / updatedAt timestamps", function() {
          var object;
          this.store.save('document', '123', {
            name: 'test'
          }, {
            remote: true
          });
          object = this.store.cache.mostRecentCall.args[2];
          expect(object.createdAt).toBeUndefined();
          return expect(object.updatedAt).toBeUndefined();
        });
        return it("should add a _syncedAt timestamp", function() {
          var object;
          this.store.save('document', '123', {
            name: 'test'
          }, {
            remote: true
          });
          object = this.store.cache.mostRecentCall.args[2];
          return expect(object._syncedAt).toBe('now');
        });
      });
      _and("options.silent is true", function() {
        return it("should not touch createdAt / updatedAt timestamps", function() {
          var object;
          this.store.save('document', '123', {
            name: 'test'
          }, {
            silent: true
          });
          object = this.store.cache.mostRecentCall.args[2];
          expect(object.createdAt).toBeUndefined();
          return expect(object.updatedAt).toBeUndefined();
        });
      });
      it("should pass options", function() {
        var options;
        options = this.store.cache.mostRecentCall.args[3];
        return expect(options.option).toBe('value');
      });
      _when("successful", function() {
        beforeEach(function() {
          return this.store.cache.andReturn('doc');
        });
        it("should resolve the promise", function() {
          return expect(this.promise).toBeResolved();
        });
        it("should pass the object to done callback", function() {
          return expect(this.promise).toBeResolvedWith('cachedObject', true);
        });
        _and("object did exist before", function() {
          beforeEach(function() {
            this.store._cached['document/123'] = {};
            return this.promise = this.store.save('document', '123', {
              name: 'test'
            }, {
              option: 'value'
            });
          });
          return it("should pass false (= not created) as the second param to the done callback", function() {
            return expect(this.promise).toBeResolvedWith('doc', false);
          });
        });
        return _and("object did not exist before", function() {
          beforeEach(function() {
            delete this.store._cached['document/123'];
            return this.promise = this.store.save('document', '123', {
              name: 'test'
            }, {
              option: 'value'
            });
          });
          return it("should pass true (= new created) as the second param to the done callback", function() {
            return expect(this.promise).toBeResolvedWith('doc', true);
          });
        });
      });
      return _when("failed", function() {
        beforeEach(function() {
          return this.store.cache.andCallFake(function() {
            throw new Error("i/o error");
          });
        });
        return it("should return a rejected promise", function() {
          var promise;
          promise = this.store.save('document', '123', {
            name: 'test'
          });
          return expect(promise).toBeRejected();
        });
      });
    });
    _when("id is '123', type is 'document', object is {id: '123', type: 'document', name: 'test'}", function() {
      return beforeEach(function() {
        var key, type, _ref;
        this.store.save('document', '123', {
          id: '123',
          type: 'document',
          name: 'test'
        });
        return _ref = this.store.cache.mostRecentCall.args, type = _ref[0], key = _ref[1], this.object = _ref[2], _ref;
      });
    });
    _when("id is '123', type is '$internal', object is {action: 'do some background magic'}}", function() {
      beforeEach(function() {
        return this.promise = this.store.save('$internal', '123', {
          action: 'do some background magic'
        });
      });
      return it("should work", function() {
        return expect(this.promise).toBeResolved();
      });
    });
    it("should not overwrite createdAt attribute", function() {
      var id, object, type, _ref;
      this.store.save('document', '123', {
        createdAt: 'check12'
      });
      _ref = this.store.cache.mostRecentCall.args, type = _ref[0], id = _ref[1], object = _ref[2];
      return expect(object.createdAt).toBe('check12');
    });
    it("should allow numbers and lowercase letters for type only. And must start with a letter or $", function() {
      var invalid, key, promise, valid, _i, _j, _len, _len1, _results;
      invalid = ['UPPERCASE', 'underLines', '-?&$', '12345', 'a'];
      valid = ['car', '$email'];
      for (_i = 0, _len = invalid.length; _i < _len; _i++) {
        key = invalid[_i];
        promise = this.store.save(key, 'valid', {});
        expect(promise).toBeRejected();
      }
      _results = [];
      for (_j = 0, _len1 = valid.length; _j < _len1; _j++) {
        key = valid[_j];
        promise = this.store.save(key, 'valid', {});
        _results.push(expect(promise).toBeResolved());
      }
      return _results;
    });
    it("should allow numbers, lowercase letters and dashes for for id only", function() {
      var invalid, key, promise, valid, _i, _j, _len, _len1, _results;
      invalid = ['UPPERCASE', 'underLines', '-?&$'];
      valid = ['abc4567', '1', 123, 'abc-567'];
      for (_i = 0, _len = invalid.length; _i < _len; _i++) {
        key = invalid[_i];
        promise = this.store.save('valid', key, {});
        expect(promise).toBeRejected();
      }
      _results = [];
      for (_j = 0, _len1 = valid.length; _j < _len1; _j++) {
        key = valid[_j];
        promise = this.store.save('valid', key, {});
        _results.push(expect(promise).toBeResolved());
      }
      return _results;
    });
    _when("called without id", function() {
      beforeEach(function() {
        var _ref;
        this.promise = this.store.save('document', void 0, {
          name: 'test'
        }, {
          option: 'value'
        });
        return _ref = this.store.cache.mostRecentCall.args, this.type = _ref[0], this.key = _ref[1], this.object = _ref[2], _ref;
      });
      it("should generate an id", function() {
        return expect(this.key).toMatch(/^[a-z0-9]{7}$/);
      });
      it("should pass options", function() {
        var options;
        options = this.store.cache.mostRecentCall.args[3];
        return expect(options.option).toBe('value');
      });
      return _when("successful", function() {
        it("should resolve the promise", function() {
          return expect(this.promise).toBeResolved();
        });
        it("should pass the object to done callback", function() {
          return expect(this.promise).toBeResolvedWith('cachedObject', true);
        });
        return it("should pass true (= created) as the second param to the done callback", function() {
          return expect(this.promise).toBeResolvedWith('cachedObject', true);
        });
      });
    });
    _when("passed public: true option", function() {
      return it("should save object with $public attribute set to true", function() {
        var key, object, type, _ref;
        this.store.save('document', 'abc4567', {
          name: 'test'
        }, {
          "public": true
        });
        _ref = this.store.cache.mostRecentCall.args, type = _ref[0], key = _ref[1], object = _ref[2];
        return expect(object.$public).toBe(true);
      });
    });
    _when("passed public: false option", function() {
      return it("should save object with $public attribute set to false", function() {
        var key, object, type, _ref;
        this.store.save('document', 'abc4567', {
          name: 'test'
        }, {
          "public": false
        });
        _ref = this.store.cache.mostRecentCall.args, type = _ref[0], key = _ref[1], object = _ref[2];
        return expect(object.$public).toBe(false);
      });
    });
    return _when("passed public: ['aj@example.com', 'bj@example.com'] option", function() {
      return it("should save object with $public attribute set to ['aj@example.com', 'bj@example.com']", function() {
        var key, object, type, _ref;
        this.store.save('document', 'abc4567', {
          name: 'test'
        }, {
          "public": ['aj@example.com', 'bj@example.com']
        });
        _ref = this.store.cache.mostRecentCall.args, type = _ref[0], key = _ref[1], object = _ref[2];
        return expect(object.$public.join()).toBe(['aj@example.com', 'bj@example.com'].join());
      });
    });
  });
  describe(".create(type, object, options)", function() {
    beforeEach(function() {
      return spyOn(this.store, "save").andReturn('promise');
    });
    return it("should call .save(type, undefined, options) and return its promise", function() {
      var promise;
      promise = this.store.create('couch', {
        funky: 'fresh'
      });
      expect(this.store.save).wasCalledWith('couch', void 0, {
        funky: 'fresh'
      });
      return expect(promise).toBe('promise');
    });
  });
  describe(".update(type, id, update, options)", function() {
    beforeEach(function() {
      spyOn(this.store, "find");
      return spyOn(this.store, "save").andReturn({
        then: function() {}
      });
    });
    _when("object cannot be found", function() {
      beforeEach(function() {
        this.store.find.andReturn($.Deferred().reject());
        return this.promise = this.store.update('couch', '123', {
          funky: 'fresh'
        });
      });
      return it("should create it", function() {
        return expect(this.store.save).wasCalledWith('couch', '123', {
          funky: 'fresh'
        }, {});
      });
    });
    return _when("object can be found", function() {
      beforeEach(function() {
        this.store.find.andReturn($.Deferred().resolve({
          style: 'baws'
        }));
        return this.store.save.andReturn($.Deferred().resolve('resolved by save'));
      });
      _and("update is an object", function() {
        beforeEach(function() {
          return this.promise = this.store.update('couch', '123', {
            funky: 'fresh'
          });
        });
        it("should save the updated object", function() {
          return expect(this.store.save).wasCalledWith('couch', '123', {
            style: 'baws',
            funky: 'fresh'
          }, {});
        });
        return it("should return a resolved promise", function() {
          return expect(this.promise).toBeResolvedWith('resolved by save');
        });
      });
      _and("update is a function", function() {
        beforeEach(function() {
          return this.promise = this.store.update('couch', '123', function(obj) {
            return {
              funky: 'fresh'
            };
          });
        });
        it("should save the updated object", function() {
          return expect(this.store.save).wasCalledWith('couch', '123', {
            style: 'baws',
            funky: 'fresh'
          }, {});
        });
        return it("should return a resolved promise", function() {
          return expect(this.promise).toBeResolvedWith('resolved by save');
        });
      });
      return _and("update wouldn't make a change", function() {
        beforeEach(function() {
          return this.promise = this.store.update('couch', '123', function(obj) {
            return {
              style: 'baws'
            };
          });
        });
        it("should save the object", function() {
          return expect(this.store.save).wasNotCalled();
        });
        return it("should return a resolved promise", function() {
          return expect(this.promise).toBeResolvedWith({
            style: 'baws'
          });
        });
      });
    });
  });
  describe(".updateAll(objects)", function() {
    beforeEach(function() {
      spyOn(this.hoodie, "isPromise").andReturn(false);
      return this.todoObjects = [
        {
          type: 'todo',
          id: '1'
        }, {
          type: 'todo',
          id: '2'
        }, {
          type: 'todo',
          id: '3'
        }
      ];
    });
    it("should return a promise", function() {
      return expect(this.store.updateAll(this.todoObjects, {})).toBePromise();
    });
    it("should update objects", function() {
      var obj, _i, _len, _ref, _results;
      spyOn(this.store, "update");
      this.store.updateAll(this.todoObjects, {
        funky: 'update'
      });
      _ref = this.todoObjects;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        obj = _ref[_i];
        _results.push(expect(this.store.update).wasCalledWith(obj.type, obj.id, {
          funky: 'update'
        }, {}));
      }
      return _results;
    });
    it("should resolve the returned promise once all objects have been updated", function() {
      var promise;
      promise = this.hoodie.defer().resolve().promise();
      spyOn(this.store, "update").andReturn(promise);
      return expect(this.store.updateAll(this.todoObjects, {})).toBeResolved();
    });
    it("should not resolve the retunred promise unless object updates have been finished", function() {
      var promise;
      promise = this.hoodie.defer().promise();
      spyOn(this.store, "update").andReturn(promise);
      return expect(this.store.updateAll(this.todoObjects, {})).notToBeResolved();
    });
    return _when("passed objects is a promise", function() {
      beforeEach(function() {
        return this.hoodie.isPromise.andReturn(true);
      });
      return it("should update objects returned by promise", function() {
        var obj, promise, _i, _len, _ref, _results,
          _this = this;
        promise = {
          pipe: function(cb) {
            return cb(_this.todoObjects);
          }
        };
        spyOn(this.store, "update");
        this.store.updateAll(promise, {
          funky: 'update'
        });
        _ref = this.todoObjects;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          obj = _ref[_i];
          _results.push(expect(this.store.update).wasCalledWith(obj.type, obj.id, {
            funky: 'update'
          }, {}));
        }
        return _results;
      });
    });
  });
  describe(".find(type, id)", function() {
    beforeEach(function() {
      return spyOn(this.store, "cache").andCallThrough();
    });
    it("should return a promise", function() {
      return this.promise = this.store.find('document', '123');
    });
    describe("invalid arguments", function() {
      _when("no arguments passed", function() {
        return it("should call the fail callback", function() {
          var promise;
          promise = this.store.find();
          return expect(promise).toBeRejected();
        });
      });
      return _when("no id passed", function() {
        return it("should call the fail callback", function() {
          var promise;
          promise = this.store.find('document');
          return expect(promise).toBeRejected();
        });
      });
    });
    _when("object can be found", function() {
      beforeEach(function() {
        this.store.cache.andReturn({
          name: 'test'
        });
        return this.promise = this.store.find('document', 'abc4567');
      });
      return it("should call the done callback", function() {
        return expect(this.promise).toBeResolved();
      });
    });
    _when("object cannot be found", function() {
      beforeEach(function() {
        this.store.cache.andReturn(false);
        return this.promise = this.store.find('document', 'abc4567');
      });
      return it("should call the fail callback", function() {
        return expect(this.promise).toBeRejected();
      });
    });
    return it("should cache the object after the first get", function() {
      this.store.find('document', 'abc4567');
      this.store.find('document', 'abc4567');
      return expect(this.store.db.getItem.callCount).toBe(1);
    });
  });
  describe(".findAll(filter)", function() {
    var with_2CatsAnd_3Dogs;
    with_2CatsAnd_3Dogs = function(specs) {
      return _and("two cat and three dog objects exist in the store", function() {
        beforeEach(function() {
          spyOn(this.store, "_index").andReturn(["cat/1", "cat/2", "dog/1", "dog/2", "dog/3"]);
          return spyOn(this.store, "cache").andCallFake(function(type, id) {
            return {
              name: "" + type + id,
              age: parseInt(id)
            };
          });
        });
        return specs();
      });
    };
    it("should return a promise", function() {
      var promise;
      promise = this.store.findAll();
      return expect(promise).toBePromise();
    });
    _when("called without a type", function() {
      with_2CatsAnd_3Dogs(function() {
        return it("should return'em all", function() {
          var promise, results, success;
          success = jasmine.createSpy('success');
          promise = this.store.findAll();
          promise.done(success);
          results = success.mostRecentCall.args[0];
          return expect(results.length).toBe(5);
        });
      });
      _and("no documents exist in the store", function() {
        beforeEach(function() {
          return spyOn(this.store, "_index").andReturn([]);
        });
        return it("should return an empty array", function() {
          var promise;
          promise = this.store.findAll();
          return expect(promise).toBeResolvedWith([]);
        });
      });
      return _and("there are other documents in localStorage not stored with store", function() {
        beforeEach(function() {
          spyOn(this.store, "_index").andReturn(["_someConfig", "someOtherShizzle", "whatever", "valid/123"]);
          return spyOn(this.store, "cache").andReturn({});
        });
        return it("should not return them", function() {
          var promise, results, success;
          success = jasmine.createSpy('success');
          promise = this.store.findAll();
          promise.done(success);
          results = success.mostRecentCall.args[0];
          return expect(results.length).toBe(1);
        });
      });
    });
    return _when("called only with filter `function(obj) { return obj.age === 1}` ", function() {
      return with_2CatsAnd_3Dogs(function() {
        return it("should return one dog", function() {
          var promise, results, success;
          success = jasmine.createSpy('success');
          promise = this.store.findAll(function(obj) {
            return obj.age === 1;
          });
          promise.done(success);
          results = success.mostRecentCall.args[0];
          return expect(results.length).toBe(2);
        });
      });
    });
  });
  describe(".delete(type, id)", function() {
    _when("objecet cannot be found", function() {
      beforeEach(function() {
        return spyOn(this.store, "cache").andReturn(false);
      });
      return it("should return a rejected the promise", function() {
        var promise;
        promise = this.store["delete"]('document', '123');
        return expect(promise).toBeRejected();
      });
    });
    _when("object can be found and has not been synched before", function() {
      beforeEach(function() {
        return spyOn(this.store, "cache").andReturn({});
      });
      it("should remove the object", function() {
        this.store["delete"]('document', '123');
        return expect(this.store.db.removeItem).wasCalledWith('document/123');
      });
      it("should set the _cached object to false", function() {
        delete this.store._cached['document/123'];
        this.store["delete"]('document', '123');
        return expect(this.store._cached['document/123']).toBe(false);
      });
      it("should clear document from changed", function() {
        spyOn(this.store, "clearChanged");
        this.store["delete"]('document', '123');
        return expect(this.store.clearChanged).wasCalledWith('document', '123');
      });
      it("should return a resolved promise", function() {
        var promise;
        promise = this.store["delete"]('document', '123');
        return expect(promise).toBeResolved();
      });
      return it("should return a clone of the cached object (before it was deleted)", function() {
        var promise;
        spyOn($, "extend");
        promise = this.store["delete"]('document', '123', {
          remote: true
        });
        return expect($.extend).wasCalled();
      });
    });
    _when("object can be found and delete comes from remote", function() {
      beforeEach(function() {
        return spyOn(this.store, "cache").andReturn({
          _syncedAt: 'now'
        });
      });
      return it("should remove the object", function() {
        this.store["delete"]('document', '123', {
          remote: true
        });
        return expect(this.store.db.removeItem).wasCalledWith('document/123');
      });
    });
    return _when("object can be found and was synched before", function() {
      beforeEach(function() {
        return spyOn(this.store, "cache").andReturn({
          _syncedAt: 'now'
        });
      });
      it("should mark the object as deleted and cache it", function() {
        var promise;
        promise = this.store["delete"]('document', '123');
        return expect(this.store.cache).wasCalledWith('document', '123', {
          _syncedAt: 'now',
          _deleted: true
        });
      });
      return it("should not remove the object from store", function() {
        this.store["delete"]('document', '123');
        return expect(this.store.db.removeItem).wasNotCalled();
      });
    });
  });
  describe(".cache(type, id, object)", function() {
    beforeEach(function() {
      spyOn(this.store, "markAsChanged");
      spyOn(this.store, "clearChanged");
      spyOn(this.store, "_isDirty");
      spyOn(this.store, "_isMarkedAsDeleted");
      return this.store._cached = {};
    });
    _when("object passed", function() {
      it("should write the object to localStorage, but without type & id attributes", function() {
        this.store.cache('couch', '123', {
          color: 'red'
        });
        return expect(this.store.db.setItem).wasCalledWith('couch/123', '{"color":"red"}');
      });
      return _when("`options.remote = true` passed", function() {
        return it("should clear changed object", function() {
          this.store.cache('couch', '123', {
            color: 'red'
          }, {
            remote: true
          });
          return expect(this.store.clearChanged).wasCalledWith('couch', '123');
        });
      });
    });
    _when("no object passed", function() {
      _and("object is already cached", function() {
        beforeEach(function() {
          return this.store._cached['couch/123'] = {
            color: 'red'
          };
        });
        return it("should not find it from localStorage", function() {
          this.store.cache('couch', '123');
          return expect(this.store.db.getItem).wasNotCalled();
        });
      });
      return _and("object is not yet cached", function() {
        beforeEach(function() {
          return delete this.store._cached['couch/123'];
        });
        _and("object does exist in localStorage", function() {
          beforeEach(function() {
            return this.store._getObject.andReturn({
              color: 'red'
            });
          });
          return it("should cache it for future", function() {
            this.store._getObject.andReturn({
              color: 'red'
            });
            this.store.cache('couch', '123');
            return expect(this.store._cached['couch/123'].color).toBe('red');
          });
        });
        return _and("object does not exist in localStorage", function() {
          beforeEach(function() {
            return this.store._getObject.andReturn(false);
          });
          it("should cache it for future", function() {
            this.store.cache('couch', '123');
            return expect(this.store._cached['couch/123']).toBe(false);
          });
          return it("should return false", function() {
            return expect(this.store.cache('couch', '123')).toBe(false);
          });
        });
      });
    });
    _when("object is dirty", function() {
      beforeEach(function() {
        return this.store._isDirty.andReturn(true);
      });
      return it("should mark it as changed", function() {
        this.store.cache('couch', '123');
        return expect(this.store.markAsChanged).wasCalledWith('couch', '123', {
          color: 'red',
          type: 'couch',
          id: '123'
        });
      });
    });
    _when("object is not dirty", function() {
      beforeEach(function() {
        return this.store._isDirty.andReturn(false);
      });
      _and("not marked as deleted", function() {
        beforeEach(function() {
          return this.store._isMarkedAsDeleted.andReturn(false);
        });
        return it("should clean it", function() {
          this.store.cache('couch', '123');
          return expect(this.store.clearChanged).wasCalledWith('couch', '123');
        });
      });
      return _but("marked as deleted", function() {
        beforeEach(function() {
          return this.store._isMarkedAsDeleted.andReturn(true);
        });
        return it("should mark it as changed", function() {
          this.store.cache('couch', '123');
          return expect(this.store.markAsChanged).wasCalledWith('couch', '123', {
            color: 'red',
            type: 'couch',
            id: '123'
          });
        });
      });
    });
    return it("should return the object including type & id attributes", function() {
      var obj;
      obj = this.store.cache('couch', '123', {
        color: 'red'
      });
      expect(obj.color).toBe('red');
      expect(obj.type).toBe('couch');
      return expect(obj.id).toBe('123');
    });
  });
  describe(".clear()", function() {
    it("should return a promise", function() {
      var promise;
      promise = this.store.clear();
      return expect(promise).toBePromise();
    });
    it("should clear localStorage", function() {
      this.store.clear();
      return expect(this.store.db.clear).wasCalled();
    });
    it("should clear chache", function() {
      this.store._cached = 'funky';
      this.store.clear();
      return expect($.isEmptyObject(this.store._cached)).toBeTruthy();
    });
    it("should clear dirty docs", function() {
      spyOn(this.store, "clearChanged");
      this.store.clear();
      return expect(this.store.clearChanged).wasCalled();
    });
    it("should resolve promise", function() {
      var promise;
      promise = this.store.clear();
      return expect(promise).toBeResolved();
    });
    return _when("an error occurs", function() {
      beforeEach(function() {
        return spyOn(this.store, "clearChanged").andCallFake(function() {
          throw new Error('ooops');
        });
      });
      return it("should reject the promise", function() {
        var promise;
        promise = this.store.clear();
        return expect(promise).toBeRejected();
      });
    });
  });
  describe(".isDirty(type, id)", function() {
    _when("no arguments passed", function() {
      return it("returns true when there are no dirty documents", function() {
        this.store._dirty = {};
        return expect(this.store.isDirty()).toBeTruthy();
      });
    });
    return _when("type & id passed", function() {
      _and("object was not yet synced", function() {
        beforeEach(function() {
          return spyOn(this.store, "cache").andReturn({
            _syncedAt: void 0
          });
        });
        return it("should return true", function() {
          return expect(this.store.isDirty('couch', '123')).toBeTruthy();
        });
      });
      return _and("object was synced", function() {
        _and("object was not updated yet", function() {
          beforeEach(function() {
            return spyOn(this.store, "cache").andReturn({
              _syncedAt: new Date(0),
              updatedAt: void 0
            });
          });
          return it("should return false", function() {
            return expect(this.store.isDirty('couch', '123')).toBeFalsy();
          });
        });
        _and("object was updated at the same time", function() {
          beforeEach(function() {
            return spyOn(this.store, "cache").andReturn({
              _syncedAt: new Date(0),
              updatedAt: new Date(0)
            });
          });
          return it("should return false", function() {
            return expect(this.store.isDirty('couch', '123')).toBeFalsy();
          });
        });
        return _and("object was updated later", function() {
          beforeEach(function() {
            return spyOn(this.store, "cache").andReturn({
              _syncedAt: new Date(0),
              updatedAt: new Date(1)
            });
          });
          return it("should return true", function() {
            return expect(this.store.isDirty('couch', '123')).toBeTruthy();
          });
        });
      });
    });
  });
  describe(".markAsChanged(type, id, object)", function() {
    beforeEach(function() {
      this.store._dirty = {};
      spyOn(window, "setTimeout").andReturn('newTimeout');
      spyOn(window, "clearTimeout");
      spyOn(this.hoodie, "trigger");
      return this.store.markAsChanged('couch', '123', {
        color: 'red'
      });
    });
    it("should add it to the dirty list", function() {
      return expect(this.store._dirty['couch/123'].color).toBe('red');
    });
    it("should should trigger an `store:dirty` event", function() {
      return expect(this.hoodie.trigger).wasCalledWith('store:dirty');
    });
    it("should start dirty timeout for 2 seconds", function() {
      var args;
      args = window.setTimeout.mostRecentCall.args;
      expect(args[1]).toBe(2000);
      return expect(this.store._dirtyTimeout).toBe('newTimeout');
    });
    return it("should clear dirty timeout", function() {
      this.store._dirtyTimeout = 'timeout';
      this.store.markAsChanged('couch', '123', {
        color: 'red'
      });
      return expect(window.clearTimeout).wasCalledWith('timeout');
    });
  });
  describe(".changedDocs()", function() {
    _when("there are no changed docs", function() {
      beforeEach(function() {
        return this.store._dirty = {};
      });
      return it("should return an empty array", function() {
        expect($.isArray(this.store.changedDocs())).toBeTruthy();
        return expect(this.store.changedDocs().length).toBe(0);
      });
    });
    return _when("there are 2 dirty docs", function() {
      beforeEach(function() {
        return this.store._dirty = [
          {
            type: 'couch',
            id: '123',
            color: 'red'
          }, {
            type: 'couch',
            id: '456',
            color: 'green'
          }
        ];
      });
      return it("should return the two docs", function() {
        return expect(this.store.changedDocs().length).toBe(2);
      });
    });
  });
  describe(".isMarkedAsDeleted(type, id)", function() {
    _when("object 'couch/123' is marked as deleted", function() {
      beforeEach(function() {
        return spyOn(this.store, "cache").andReturn({
          _deleted: true
        });
      });
      return it("should return true", function() {
        return expect(this.store.isMarkedAsDeleted('couch', '123')).toBeTruthy();
      });
    });
    return _when("object 'couch/123' isn't marked as deleted", function() {
      beforeEach(function() {
        return spyOn(this.store, "cache").andReturn({});
      });
      return it("should return false", function() {
        return expect(this.store.isMarkedAsDeleted('couch', '123')).toBeFalsy();
      });
    });
  });
  return describe(".clearChanged(type, id)", function() {
    _when("type & id passed", function() {
      return it("should remove the respective object from the dirty list", function() {
        this.store._dirty['couch/123'] = {
          color: 'red'
        };
        this.store.clearChanged('couch', 123);
        return expect(this.store._dirty['couch/123']).toBeUndefined();
      });
    });
    _when("no arguments passed", function() {
      return it("should remove all objects from the dirty list", function() {
        this.store._dirty = {
          'couch/123': {
            color: 'red'
          },
          'couch/456': {
            color: 'green'
          }
        };
        this.store.clearChanged();
        return expect($.isEmptyObject(this.store._dirty)).toBeTruthy();
      });
    });
    return it("should trigger a `store:dirty` event", function() {
      spyOn(this.hoodie, "trigger");
      this.store.clearChanged();
      return expect(this.hoodie.trigger).wasCalledWith('store:dirty');
    });
  });
});
