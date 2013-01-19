var buster = require('buster'),
    soap = require('soap'),
    fs = require('fs'),
    path = require('path'),
    AllegroWebAPI;

AllegroWebAPI = require('../main');

buster.testCase('AllegroWebAPI Class', {
    setUp: function (done) {
        var self = this;

        self.server = require('http').createServer(function  (req, res) {
            fs.readFile(
                path.resolve(process.cwd(), 'test/fixtures/wsdl.xml'),
                function (err, data) {
                    res.writeHead(200);
                    res.end(data);
                }
            );
        });

        self.server.listen(1337);

        soap.createClient('http://localhost:1337', function (error, client) {
            self.client = client;

            self.stub(client, 'doQuerySysStatus');

            self.allegroWebAPI = new AllegroWebAPI(self.client, {
                login: 'test',
                password: 'test123',
                countryCode: '1',
                webapiKey: '123456'
            });
            done();
        });
    },

    tearDown: function (done) {
        this.server.close(function () {
            done();
        });
    },

    'soap client call': function () {
        this.allegroWebAPI.doQuerySysStatus();
        assert.calledOnce(this.client.doQuerySysStatus);
    }
});
