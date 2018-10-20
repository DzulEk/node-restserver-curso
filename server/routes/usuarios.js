const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const Usuario = require('../models/usuario');

const app = express();


app.get('/usuario', function(req, res) {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    // Se pueden manejar filtros de lo que queremos regresar al pasarlos
    // como 2do parametro en String y separados por un espacio
    Usuario.find({ estado: true }, 'nombre email img google role estado')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {

            if (err) {

                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            // Se debe manejar la misma consulta que al principio en .find()
            Usuario.count({ estado: true }, (err, conteo) => {

                res.json({

                    ok: true,
                    usuarios,
                    contar: conteo

                });

            });



        });

});

app.post('/usuario', function(req, res) {

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioDB) => {

        if (err) {

            return res.status(400).json({
                ok: false,
                err: err
            });
        }

        // usuarioDB.password = null;

        res.json({
            ok: true,
            usuarioDB
        });

    });

});

app.put('/usuario/:id', function(req, res) {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);


    // El tercer parametro indica que nos regresa el objeto actualziado
    // Ver documentación mongoosejs
    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {

        if (err) {

            return res.status(400).json({
                ok: false,
                err
            });

        };

        res.json({
            ok: true,
            usuario: usuarioDB
        });

    });


});


/** Elimina a un Usuario de manera permanento en la BD */
// app.delete('/usuario/:id', function(req, res) {

//     let id = req.params.id;

//     Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

//         if (err) {

//             return res.status(400).json({
//                 ok: false,
//                 err
//             });

//         };

//         if (!usuarioBorrado) {

//             return res.status(400).json({
//                 ok: false,
//                 err: {
//                     message: 'El usuario no fue encontrado'
//                 }
//             });

//         };

//         res.json({
//             ok: true,
//             usuario: usuarioBorrado
//         });

//     });


// });



/** Actualiza el estado de un usuario, pero no lo elimina
 *  de manera permanente de la BD 
 * 
 * 
 *  Instructor
 * 
 *  Solo necesita el id para modificar el estado
 * */
app.delete('/usuario/:id', function(req, res) {

    let id = req.params.id;
    let actualizado = {
        estado: false
    };

    Usuario.findByIdAndUpdate(id, actualizado, { new: true }, (err, usuarioBorrado) => {

        if (err) {

            return res.status(400).json({
                ok: false,
                err
            });

        };

        if (!usuarioBorrado) {

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El usuario no fue encontrado'
                }
            });

        };

        res.json({
            ok: true,
            usuario: usuarioBorrado
        });

    });


});

module.exports = app;