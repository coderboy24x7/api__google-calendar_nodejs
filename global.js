Object.defineProperty(global, 'rootRequire', {
    get: function () {
        return function (name) {
            return require(__dirname + '/' + name);
        }
    }
});

Object.defineProperty(global, 'rootFileName', {
    get: function () {
        return function (name) {
            return __dirname + '/' + name;
        }
    }
});