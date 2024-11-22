const fs = require('fs');
const path = require('path');

const loadRoutes = (app, baseRoute = '/api') => {
    const routesPath = path.join(__dirname, '../routes');

    fs.readdirSync(routesPath).forEach((file) => {
        const route = require(path.join(routesPath, file));
        app.use(baseRoute, route);
    });
}

module.exports = loadRoutes;