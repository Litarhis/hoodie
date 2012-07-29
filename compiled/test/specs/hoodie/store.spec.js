// Generated by CoffeeScript 1.3.3

describe("Hoodie.Store", function() {
  beforeEach(function() {
    this.hoodie = new Mocks.Hoodie;
    return this.store = new Hoodie.Store(this.hoodie);
  });
  describe(".save(type, id, object, options)", function() {
    beforeEach(function() {
      return spyOn(this.store, "_now").andReturn('now');
    });
    it("should return a defer", function() {
      var promise;
      promise = this.store.save('document', '123', {
        name: 'test'
      });
      return expect(promise).toBeDefer();
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
        _results.push(expect(promise).toBeDefer());
      }
      return _results;
    });
    return it("should allow numbers, lowercase letters and dashes for for id only", function() {
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
        _results.push(expect(promise).toBeDefer());
      }
      return _results;
    });
  });
  describe("create(type, object)", function() {
    beforeEach(function() {
      return spyOn(this.store, "save").andReturn("save_promise");
    });
    it("should proxy to save method", function() {
      this.store.create("test", {
        funky: "value"
      });
      return expect(this.store.save).wasCalledWith("test", void 0, {
        funky: "value"
      });
    });
    return it("should return promise of save method", function() {
      return expect(this.store.create()).toBe('save_promise');
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
    _when("passed objects is a promise", function() {
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
    _when("passed objects is a type (string)", function() {
      beforeEach(function() {
        var findAll_promise;
        findAll_promise = jasmine.createSpy("findAll_promise");
        return spyOn(this.store, "findAll").andReturn({
          pipe: findAll_promise
        });
      });
      return it("should update objects return by findAll(type)", function() {
        this.store.updateAll("car", {
          funky: 'update'
        });
        return expect(this.store.findAll).wasCalledWith("car");
      });
    });
    return _when("no objects passed", function() {
      beforeEach(function() {
        var findAll_promise;
        findAll_promise = jasmine.createSpy("findAll_promise");
        return spyOn(this.store, "findAll").andReturn({
          pipe: findAll_promise
        });
      });
      return it("should update all objects", function() {
        this.store.updateAll(null, {
          funky: 'update'
        });
        expect(this.store.findAll).wasCalled();
        return expect(this.store.findAll.mostRecentCall.args.length).toBe(0);
      });
    });
  });
  describe(".find(type, id)", function() {
    it("should return a defer", function() {
      var defer;
      defer = this.store.find('document', '123');
      return expect(defer).toBeDefer();
    });
    describe("invalid arguments", function() {
      _when("no arguments passed", function() {
        return it("should be rejected", function() {
          var promise;
          promise = this.store.find();
          return expect(promise).toBeRejected();
        });
      });
      return _when("no id passed", function() {
        return it("should be rejected", function() {
          var promise;
          promise = this.store.find('document');
          return expect(promise).toBeRejected();
        });
      });
    });
    return describe("aliases", function() {
      beforeEach(function() {
        return spyOn(this.store, "find");
      });
      return it("should allow to use .find", function() {
        this.store.find('test', '123');
        return expect(this.store.find).wasCalledWith('test', '123');
      });
    });
  });
  describe(".findAll(type)", function() {
    it("should return a defer", function() {
      return expect(this.store.findAll()).toBeDefer();
    });
    return describe("aliases", function() {
      beforeEach(function() {
        return spyOn(this.store, "findAll");
      });
      return it("should allow to use .loadAll", function() {
        this.store.loadAll('test');
        return expect(this.store.findAll).wasCalledWith('test');
      });
    });
  });
  describe(".findOrCreate(attributes)", function() {
    _when("object exists", function() {
      beforeEach(function() {
        var promise;
        promise = this.hoodie.defer().resolve('existing_object').promise();
        return spyOn(this.store, "find").andReturn(promise);
      });
      return it("should resolve with existing object", function() {
        var promise;
        promise = this.store.findOrCreate({
          id: '123',
          attribute: 'value'
        });
        return expect(promise).toBeResolvedWith('existing_object');
      });
    });
    return _when("object does not exist", function() {
      beforeEach(function() {
        return spyOn(this.store, "find").andReturn(this.hoodie.defer().reject().promise());
      });
      it("should call `.create` with passed attributes", function() {
        var promise;
        spyOn(this.store, "create").andReturn(this.hoodie.defer().promise());
        promise = this.store.findOrCreate({
          id: '123',
          attribute: 'value'
        });
        return expect(this.store.create).wasCalledWith({
          id: '123',
          attribute: 'value'
        });
      });
      it("should reject when `.create` was rejected", function() {
        var promise;
        spyOn(this.store, "create").andReturn(this.hoodie.defer().reject().promise());
        promise = this.store.findOrCreate({
          id: '123',
          attribute: 'value'
        });
        return expect(promise).toBeRejected();
      });
      return it("should resolve when `.create` was resolved", function() {
        var promise;
        promise = this.hoodie.defer().resolve('new_object').promise();
        spyOn(this.store, "create").andReturn(promise);
        promise = this.store.findOrCreate({
          id: '123',
          attribute: 'value'
        });
        return expect(promise).toBeResolvedWith('new_object');
      });
    });
  });
  describe(".delete(type, id)", function() {
    it("should return a defer", function() {
      var defer;
      defer = this.store["delete"]('document', '123');
      return expect(defer).toBeDefer();
    });
    describe("invalid arguments", function() {
      _when("no arguments passed", function() {
        return it("should be rejected", function() {
          var promise;
          promise = this.store["delete"]();
          return expect(promise).toBeRejected();
        });
      });
      return _when("no id passed", function() {
        return it("should be rejected", function() {
          var promise;
          promise = this.store["delete"]('document');
          return expect(promise).toBeRejected();
        });
      });
    });
    return describe("aliases", function() {
      beforeEach(function() {
        return spyOn(this.store, "delete");
      });
      return it("should allow to use .destroy", function() {
        this.store.destroy("test", 12, {
          option: "value"
        });
        return expect(this.store["delete"]).wasCalledWith("test", 12, {
          option: "value"
        });
      });
    });
  });
  describe(".deleteAll(type)", function() {
    it("should return a defer", function() {
      return expect(this.store.deleteAll()).toBeDefer();
    });
    return describe("aliases", function() {
      return it("should allow to use .destroyAll", function() {
        return expect(this.store.destroyAll).toBe(this.store.deleteAll);
      });
    });
  });
  return describe(".uuid(num = 7)", function() {
    it("should default to a length of 7", function() {
      return expect(this.store.uuid().length).toBe(7);
    });
    return _when("called with num = 5", function() {
      return it("should generate an id with length = 5", function() {
        return expect(this.store.uuid(5).length).toBe(5);
      });
    });
  });
});
