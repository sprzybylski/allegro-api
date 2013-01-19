var AllegroWebAPI,
    crypto = require('crypto');

AllegroWebAPI = function (client, options) {
    this.client = client;
    this.options = options;
    this.state = {};

    return this;
};

AllegroWebAPI.prototype.doQuerySysStatus = function (callback) {
    var self = this;

    self.client.doQuerySysStatus({
            sysvar: 3,
            countryId: self.options.countryCode,
            webapiKey: self.options.webapiKey
        },
        function (error, respond) {
            self.state.verKey = respond.verKey;
            callback(error, respond);
        });

    return this;
};

AllegroWebAPI.prototype.doLogin = function (callback) {
    var self = this;

    if (!self.state.verKey) {
        callback(
            new Error('Version key not found. ' +
                'Get the version key using DoQuerySysStatus method.')
        );
    }

    self.client.doLogin({
            userLogin: self.options.login,
            userPassword: self.options.password,
            countryCode: self.options.countryCode,
            webapiKey: self.options.webapiKey,
            localVersion: self.state.verKey
        },
        function (error, respond) {
            self.state.sessionHandlePart = respond.sessionHandlePart;

            callback(error, respond);
        }
    );

    return this;
};

module.exports = AllegroWebAPI;
