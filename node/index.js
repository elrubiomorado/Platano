const express = require('express');
const app = express();
const spawn = require('child_process').spawn;

//Abrimos el prorgama
const net = spawn('../net/NetApp/NetApp/bin/Debug/NetApp.exe');

net.stdout.on('data', function(data){
    console.log('Recibi de .NET este mensaje: ' + data.toString());
});

app.get('/', function(req, res){
    console.log('recibi solicitud: ' + req.query.movimiento + ', ' + req.query.brincar + ', ' + req.query.acelerar);
    net.stdin.write(req.query.movimiento + ',' + req.query.brincar + ',' + req.query.acelerar + '\r\n');
    res.send('hola amigo');
});

app.use(express.static('public'));

//levantar el servidor en puerto 3000
app.listen(3000, function(){
    console.log('se levanto el servidor');
});

