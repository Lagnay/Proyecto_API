const http = require("http");
const fs = require("fs/promises");
const { v4: uuidv4 } = require("uuid");
const { Client } = require("pg");

const credenciales = {
  user: "lagnay",
  database: "tareas",
  password: "l4gn4y",
  port: 5432,
  host: "localhost",
};

async function clientDemo() {
  //Conexión a través de una instancia de un cliente

  const client = new Client(credenciales);
  await client.connect();
  const now = await client.query("SELECT NOW()");
  await client.end();

  return now;
}

// async function poolDemo() {
//   //Conexión a través de un pool de conexiones

//   const pool = new Pool(credenciales);
//   const now = await pool.query("SELECT NOW()");
//   await pool.end();

//   return now;
// }

//Ejemplo para tareas mientras no se conecta la bd.
const tareas = {
  1: { tarea: "vender", tiempo: "6 horas", estado: "no asignado" },
  2: { tarea: "limpiar", tiempo: "8 horas", estado: "no asignado" },
};

//El comando 'req.url.startsWith' se puede reemplazar con 'pathname'

http
  .createServer(function (req, res) {
    //Para consultar datos por la ruta url, pudiendo tener diferentes rutas y cada una con sus propiedades CRUD
    const url = new URL(req.url, `http://${req.headers.host}`);
    const params = new URLSearchParams(url.searchParams);
    // console.log(params.get("valor1"));
    // console.log(params.get("valor2"));

    //Para leer los datos (cRud: Read)
    if (req.url.startsWith("/tareas") && req.method == "GET") {
      res.write(JSON.stringify(tareas, null, 2));
      res.end();
    }

    //Para crear nuevos datos (Crud: Create)
    if (req.url.startsWith("/tareas") && req.method == "POST") {
      let nuevaTarea;
      req.on("data", (datos) => {
        nuevaTarea = JSON.parse(datos);
      });
      req.on("end", () => {
        const nuevoId = Object.keys(tareas).length + 1; //Obtener número de objetos y sumar 1
        tareas[nuevoId] = nuevaTarea;

        res.write(JSON.stringify(tareas, null, 2));
        res.end();
      });
    }

    //Para modificar o actualizar datos (objetos) (crUd: Update)
    if (req.url.startsWith("/tareas") && req.method == "PUT") {
      let tarea;
      req.on("data", (datos) => {
        tarea = JSON.parse(datos);
      });
      req.on("end", () => {
        const id = params.get("id");

        const tareaActualizada = { ...tareas[id], ...tarea }; // Actualizando tarea

        tareas[id] = tareaActualizada; //Redefiniendo tarea dentro de objeto inicial tareas

        res.write(JSON.stringify(tareas, null, 2));
        res.end();
      });
    }

    //Para eliminar datos (objetos) (cruD: Delete)
    if (req.url.startsWith("/tareas") && req.method == "DELETE") {
      const id = params.get("id");

      delete tareas[id];

      res.write("Tarea eliminada exitosamente");
      res.end();
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    //Para leer los datos (cRud: Read)
    if (req.url.startsWith("/usuarios") && req.method == "GET") {
      res.write(JSON.stringify(usuarios, null, 2));
      res.end();
    }

    //Para crear nuevos datos (Crud: Create)
    if (req.url.startsWith("/usuarios") && req.method == "POST") {
      let nuevoUsuario;
      req.on("data", (datos) => {
        nuevoUsuario = JSON.parse(datos);
      });
      req.on("end", () => {
        const nuevoId = Object.keys(usuarios).length + 1; //Obtener número de objetos y sumar 1
        usuarios[nuevoId] = nuevoUsuario;

        res.write(JSON.stringify(usuarios, null, 2));
        res.end();
      });
    }

    //Para modificar o actualizar datos (objetos) (crUd: Update)
    if (req.url.startsWith("/usuarios") && req.method == "PUT") {
      let usuario;
      req.on("data", (datos) => {
        usuario = JSON.parse(datos);
      });
      req.on("end", () => {
        const id = params.get("id");

        const usuarioActualizado = { ...usuarios[id], ...usuario }; // Actualizando usuario

        usuarios[id] = usuarioActualizado; //Redefiniendo usuario dentro de objeto inicial usuarios

        res.write(JSON.stringify(usuarios, null, 2));
        res.end();
      });
    }

    //Para eliminar datos (objetos) (cruD: Delete)
    if (req.url.startsWith("/usuarios") && req.method == "DELETE") {
      const id = params.get("id");

      delete usuarios[id];

      res.write("Usuario eliminado exitosamente");
      res.end();
    }
    // req.on("data", (body) => {
    //   //on es para crear
    //   console.log(JSON.parse(body));
    // });
    // req.on("end", () => {
    //   console.log(data);
    // });

    // console.log(req.method);

    // res.write("Respuesta desde servidor node !");
    // res.end();
  })
  .listen(3000, function () {
    console.log("Servidor iniciado en puerto 3000");
  });
