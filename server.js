const http = require('http');

http.createServer(function(req,res){

    req.on('data', (body) =>{
        console.log(JSON.parse(body));
    })

    console.log(req.method);

    res.write('respuesta desde el servidor node!');
    res.end();

})
.listen(3000,function(){
    console.log('Servidor iniciado en puerto 3000');
})
