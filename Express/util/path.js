const path = require('path');
// path.dirname --> obtiene el nombre del directorio del archivo que le pasamos
// process.mainModule --> se refiere al Main module que inicia la aplicacion (en este caso app.js)
module.exports = path.dirname(process.mainModule.filename);