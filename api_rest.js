const express = require("express");
const app = express();
const fs = require("fs");

var bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

let partides = [];
//let jugadors = [];

//let partida = { codi: -1 };
let primerJugador = { cartes: [], aposta: 0 };
let segonJugador = { cartes: [], aposta: 0 };

/*************** S'INICIA LA PARTIDA ***************/
app.post("/iniciarJoc", (req, res) => {
  console.log("POST /iniciarJoc/codiPartida");

  partides.push({
    codi: req.body.codiPartida,
    primerJugador: { cartes: [], aposta: 0 },
    segonJugador: { cartes: [], aposta: 0 }
  });

  //partida.codi = req.body.codiPartida;
  console.log(`S'ha creat una partida amb codi: ${req.body.codiPartida}`);
  console.log("Partides existents:\n");
  partides.forEach(p => console.log(`${p.codi}`));
  res.send(`Has entrat a la sala número ${req.body.codiPartida}.`);
});

/*************** ES REPARTEIXEN LES CARTES ALS JUGADORS ***************/
app.get("/obtenirCarta/:codiPartida", (req, res) => {
  let partidaInput = { codiPartida: req.params.codiPartida };

  let trobaPartida = p => {
    if (p.codi == partidaInput.codiPartida) return p;
  };

  let partida = partides.find(trobaPartida);

  // comprova que la partida existeix
  //if (req.params.codiPartida != partida.codi) {
  if (partida == undefined) {
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
        while (partida.primerJugador.cartes.length != 5) {
          numCarta = Math.floor(Math.random() * 52); // selecciona una carta al atzar, del 1 al 52

          // comprova que la carta no estigui ja repartida
          if (!cartesRepartides.includes(numCarta)) {
            cartesRepartides.push(numCarta);
            partida.primerJugador.cartes.push(data.baralla[numCarta]);
          }
        }

        /******* DEBUG *******/

        console.log("Cartes jugador 1:");
        partida.primerJugador.cartes.forEach(carta => {
          console.log(`${carta.pal}, ${carta.color}, ${carta.carta}`);
        });
        /******* DEBUG *******/

        // segon jugador
        while (partida.segonJugador.cartes.length != 5) {
          numCarta = Math.floor(Math.random() * 52); // selecciona una carta al atzar, del 1 al 52

          // comprova que la carta no estigui ja repartida
          if (!cartesRepartides.includes(numCarta)) {
            cartesRepartides.push(numCarta);
            partida.segonJugador.cartes.push(data.baralla[numCarta]);
          }
        }

        /******* DEBUG *******/

        console.log("Cartes jugador 2:");
        partida.segonJugador.cartes.forEach(carta => {
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
  let partidaInput = { codiPartida: req.params.codiPartida };

  let trobaPartida = p => {
    if (p.codi == partidaInput.codiPartida) return p;
  };

  let partida = partides.find(trobaPartida);

  // comprova que la partida existeix
  //if (req.params.codiPartida != partida.codi) {
  if (partida == undefined) {
    res.send(`Aquesta partida no existeix.`);
  } else {
    res.send(`Cartes primer jugador: 
            ${JSON.stringify(partida.primerJugador.cartes)} 
            Cartes segon jugador: 
            ${JSON.stringify(partida.segonJugador.cartes)}`);
  }
});

/*************** EL JUGADOR LLENÇA UNA CARTA ***************/
app.put("/tirarCarta", (req, res) => {
  let partidaInput = { codiPartida: req.body.codiPartida };

  let trobaPartida = p => {
    if (p.codi == partidaInput.codiPartida) return p;
  };

  let partida = partides.find(trobaPartida);

  // comprova que la partida existeix
  //if (req.body.codiPartida != partida.codi) {
  if (partida == undefined) {
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

    console.log(`\nS'ha intentat llençar la carta: ${JSON.stringify(carta)}`);

    if (req.body.codiJugador == 0) {
      if (partida.primerJugador.cartes.find(trobaCarta) != undefined) {
        partida.primerJugador.cartes.splice(
          partida.primerJugador.cartes.findIndex(trobaCarta),
          1
        );
        res.send(
          `El primer jugador ha llençat la carta: ${JSON.stringify(carta)}`
        );
      } else {
        res.send("El primer jugador no té aquesta carta.");
      }
    } else if (req.body.codiJugador == 1) {
      if (partida.segonJugador.cartes.find(trobaCarta) != undefined) {
        partida.segonJugador.cartes.splice(
          partida.segonJugador.cartes.findIndex(trobaCarta),
          1
        );
        res.send(
          `El segon jugador ha llençat la carta: ${JSON.stringify(carta)}`
        );
      } else {
        res.send("El segon jugador no té aquesta carta.");
      }
    } else {
      res.send(`Aquest jugador no existeix.`);
    }
  }
});

/*************** EL JUGADOR APOSTA UNA QUANTITAT ***************/
app.put("/apostar", (req, res) => {
  let partidaInput = { codiPartida: req.body.codiPartida };

  let trobaPartida = p => {
    if (p.codi == partidaInput.codiPartida) return p;
  };

  let partida = partides.find(trobaPartida);

  // comprova que la partida existeix
  //if (req.body.codiPartida != partida.codi) {
  if (partida == undefined) {
    res.send(`Aquesta partida no existeix.`);
  } else {
    if (req.body.codiJugador == 0) {
      partida.primerJugador.aposta = req.body.quantitatAposta;
      console.log(
        `El primer jugador ha apostat:  ${req.body.quantitatAposta}€`
      );
      res.send(
        `El primer jugador ha apostat:  ${partida.primerJugador.aposta}€`
      );
    } else if (req.body.codiJugador == 1) {
      partida.segonJugador.aposta = req.body.quantitatAposta;
      console.log(`El segon jugador ha apostat:  ${req.body.quantitatAposta}€`);
      res.send(`El segon jugador ha apostat:  ${partida.segonJugador.aposta}€`);
    } else {
      res.send(`Aquest jugador no existeix.`);
    }
  }
});

/*************** EL JUGADOR PASSA ***************/
app.put("/passar", (req, res) => {
  let partidaInput = { codiPartida: req.body.codiPartida };

  let trobaPartida = p => {
    if (p.codi == partidaInput.codiPartida) return p;
  };

  // comprova que la partida existeix
  //if (req.body.codiPartida != partida.codi) {
  if (partides.find(trobaPartida) == undefined) {
    res.send(`Aquesta partida no existeix.`);
  } else {
    if (req.body.codiJugador == 0) {
      res.send(`El primer jugador passa.`);
    } else if (req.body.codiJugador == 1) {
      res.send(`El segon jugador passa.`);
    } else {
      res.send(`Aquest jugador no existeix.`);
    }
  }
});

app.delete("/acabarJoc/:codiPartida", (req, res) => {
  let partidaInput = { codiPartida: req.params.codiPartida };

  let trobaPartida = p => {
    if (p.codi == partidaInput.codiPartida) return p;
  };

  let partida = partides.find(trobaPartida);

  console.log(`Partida: ${JSON.stringify(partida)}`);

  // comprova que la partida existeix
  //if (req.params.codiPartida != partida.codi) {
  if (partida == undefined) {
    res.send(`Aquesta partida no existeix.`);
  } else {
    partides.splice(partides.indexOf(partida), 1);
    res.send(`S'ha acabat la partida de la sala número ${partidaInput.codiPartida}.`);
  }
});

app.listen(3000, () => console.log("inici servidor al port 3000"));
