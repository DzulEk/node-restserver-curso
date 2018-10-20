/**
 * 
 *  Puerto
 * 
 */

process.env.PORT = process.env.PORT || 3000;

/**
 * 
 *  Entorno
 * 
 */

process.env.NODE_ENV = process.env.NODE_ENV || 'Dev';

/**
 * 
 *  Base de Datos
 * 
 */

let urlDB;

if (process.env.NODE_ENV === 'Dev') {

    urlDB = 'mongodb://localhost:27017/cafe';

} else {

    urlDB = 'mongodb://cafe-user:123algo@ds137283.mlab.com:37283/cafe-node';

}
process.env.URLDB = urlDB;