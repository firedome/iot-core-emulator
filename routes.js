var appRouter = function (app) {
    var clientsMap = new Map();

    app.get("/v1/projects/:project/locations/:location/registries/:registry/devices", function(req, res) {
      res.status(200).send({ "devices": [] });
    });

    app.post("/v1/projects/:project/locations/:location/registries/:registry/devices", function(req, res) {
        clientsMap.set(req.body.id, req.body.credentials[0].publicKey.key)
      });
  }
  
  module.exports = appRouter;