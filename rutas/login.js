var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

var app = express();

var Usuarios = require('../modelos/usuarios');

// autenticacion normal
app.post('/', (req, res) => {

    var body = req.body;

    Usuarios.findOne({ email: body.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'error al buscar usuarios',
                errors: err
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas -email',
                errors: err
            });
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas -password',
                errors: err
            });
        }

        //crear un token!!!
        usuarioDB.password = ';)';
        var token = jwt.sign(
            { usuario: usuarioDB },
            SEED,
            { expiresIn: 14400 }); //14400 = 4 horas

        res.status(200).json({
            ok: true,
            Usuario: usuarioDB,
            token: token,
            id: usuarioDB._id
        });
    });
});

module.exports = app;