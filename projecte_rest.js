const express = require("express");
const app = express();
const fs = require("fs");

var bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/*let partides = [];
let cartesPartida = [];
let primerJugador = [];
let segonJugador = [];*/

let partida = { codi: -1 };
let primerJugador = { cartes: [], aposta: 0 };
let segonJugador = { cartes: [], aposta: 0 };

/*************** S'INICIA LA PARTIDA ***************/
app.post("/iniciarJoc/:codiPartida", (req, res) => {
  console.log("POST /iniciarJoc/codiPartida");
  partida.codi = req.body.codiPartida;
  console.log(`Creada partida amb codi: ${partida.codi}`);
  res.send(`Has entrat a la sala número ${partida.codi}.`);
});

/*************** ES REPARTEIXEN LES CARTES ALS JUGADORS ***************/
app.get("/obtenirCarta/:codiPartida", (req, res) => {
  // comprova que la partida existeix
  if (req.params.codiPartida != partida.codi) {
    res.send(`Aquesta partida no existeix.`);
  } else {
    // llegeix la baralla de cartes de l'arxiu JSON
    fs.readFile("./baralla.json", "utf8", (err, barallaJSON) => {
      if (err) {
        console.log(`S'ha produït un error llegint el fitxer baralla.json del disc.
          \nError: ${err}`);
        res.send(
          `S'ha produït un error llegint el fitxer baralla.json del disc.`
        );
      }
      try {
        var data = JSON.parse(barallaJSON);

        // un cop s'ha llegit el JSON, reparteix les cartes a cada jugador
        let cartesRepartides = [];
        let numCarta;

        // primer jugador
        while (primerJugador.cartes.length != 5) {
          numCarta = Math.floor(Math.random() * 52); // selecciona una carta al atzar, del 1 al 52

          // comprova que la carta no estigui ja repartida
          if (!cartesRepartides.includes(numCarta)) {
            cartesRepartides.push(numCarta);
            primerJugador.cartes.push(data.baralla[numCarta]);
          }
        }

        /******* DEBUG *******/

        console.log("Cartes jugador 1:");
        primerJugador.cartes.forEach(carta => {
          console.log(`${carta.pal}, ${carta.color}, ${carta.carta}`);
        });
        /******* DEBUG *******/

        // segon jugador
        while (segonJugador.cartes.length != 5) {
          numCarta = Math.floor(Math.random() * 52); // selecciona una carta al atzar, del 1 al 52

          // comprova que la carta no estigui ja repartida
          if (!cartesRepartides.includes(numCarta)) {
            cartesRepartides.push(numCarta);
            segonJugador.cartes.push(data.baralla[numCarta]);
          }
        }

        /******* DEBUG *******/

        console.log("Cartes jugador 2:");
        segonJugador.cartes.forEach(carta => {
          console.log(`${carta.pal}, ${carta.color}, ${carta.carta}`);
        });
        /******* DEBUG *******/
      } catch (err) {
        console.log(`S'ha produït un error llegint el JSON de la baralla de cartes. 
          \nError: ${err}`);
        res.send("");
      }
    });

    res.send(`S'han repartit les cartes.`);
  }
});

/*************** ES MOSTREN LES CARTES DELS DOS JUGADORS ***************/
app.get("/mostrarCartes/:codiPartida", (req, res) => {
  if (req.params.codiPartida != partida.codi) {
    res.send(`Aquesta partida no existeix.`);
    return;
  }

  res.send(`Cartes primer jugador: 
            ${JSON.stringify(primerJugador.cartes)} 
            Cartes segon jugador: 
            ${JSON.stringify(segonJugador.cartes)}`);
});

/*************** EL JUGADOR LLENÇA UNA CARTA ***************/
app.put("/tirarCarta/codiPartida/carta", (req, res) => {
  if (req.body.codiPartida != partida.codi) {
    res.send(`Aquesta partida no existeix.`);
  } else {
    carta = {
      pal: req.body.carta.pal,
      color: req.body.carta.color,
      carta: req.body.carta.carta
    };

    let trobaCarta = c => {
      if (
        c.pal == carta.pal &&
        c.color == carta.color &&
        c.carta == carta.carta
      )
        return c;
    };

    console.log(`\nS'ha intentar llençar la carta: ${JSON.stringify(carta)}`);

    if (req.body.codiJugador == 0) {
      if (primerJugador.cartes.find(trobaCarta) != undefined) {
        primerJugador.cartes.splice(
          primerJugador.cartes.findIndex(trobaCarta),
          1
        );
        res.send(
          `El primer jugador ha llençat la carta: ${JSON.stringify(carta)}`
        );
      } else {
        res.send("El primer jugador no té aquesta carta.");
      }
    } else if (req.body.codiJugador == 1) {
      if (segonJugador.cartes.find(trobaCarta) != undefined) {
        segonJugador.cartes.splice(
          segonJugador.cartes.findIndex(trobaCarta),
          1
        );
        res.send(
          `El segon jugador ha llençat la carta: ${JSON.stringify(carta)}`
        );
      } else {
        res.send("El segon jugador no té aquesta carta.");
      }
    }
  }
});

/*************** EL JUGADOR APOSTA UNA QUANTITAT ***************/
app.put("/moureJugador/codiPartida/aposta/quantitat", (req, res) => {
  if (req.body.codiPartida != partida.codi) {
    res.send(`Aquesta partida no existeix.`);
  } else {
    if (req.body.codiJugador == 0) {
      primerJugador.aposta = req.body.quantitatAposta;
      res.send(`El primer jugador ha apostat:  ${primerJugador.aposta}`);
    } else if (req.body.codiJugador == 1) {
      segonJugador.aposta = req.body.quantitatAposta;
      res.send(`El primer jugador ha apostat:  ${segonJugador.aposta}`);
    }
  }
});

/*************** EL JUGADOR PASSA ***************/
app.put("/moureJugador/codiPartida/passa", (req, res) => {
  if (req.body.codiPartida != partida.codi) {
    res.send(`Aquesta partida no existeix.`);
  } else {
    if (req.body.codiJugador == 0) {
      res.send(`El primer jugador passa.`);
    } else if (req.body.codiJugador == 1) {
      res.send(`El segon jugador passa.`);
    }
  }
});

app.delete("/acabarJoc/:codi", (req, res) => {
  let partida = partides.find(codi => codi === req.params.codi);
  if (partida == undefined) {
    res.send(`Aquesta partida no existeix.`);
  } else {
    partides.splice(partides.indexOf(partida), 1);
    res.send("Partida acabada.");
  }
});

app.listen(3000, () => console.log("inici servidor al port 3000"));
