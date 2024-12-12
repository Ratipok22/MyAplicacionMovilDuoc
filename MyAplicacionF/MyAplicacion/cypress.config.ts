module.exports = {
  e2e: {
    baseUrl: 'http://localhost:8100', // Dirección base para la aplicación
    env: {
      apiServer: 'http://localhost:3000', // Dirección del JSON-Server
    },
  },
};
