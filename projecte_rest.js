const express = require('express');
const app = express();
const fs = require('fs');

//const cartesBaralla = require('./baralla.json');

var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/*let partides = [];
let cartesPartida = [];
let primerJugador = [];
let segonJugador = [];*/

let partida = { 'codi': -1 };
let primerJugador = {cartes: [], aposta: 0};
let segonJugador = {cartes: [], aposta: 0};

app.post('/iniciarJoc/:codiPartida', (req, res) => {
  console.log('POST /iniciarJoc/codiPartida');
  partida.codi = req.body.codiPartida;
  console.log(`Creada partida amb codi: ${partida.codi}`);
  res.send(`Has entrat a la sala número ${partida.codi}.`);
});

app.get('/obtenirCarta/:codiPartida', (req, res) => {
  // Reparteix les cartes a cada jugador.
  // Agafa les cartes d'un JSON.

  // comprova que la partida existeix
  if (req.params.codiPartida != partida.codi) {
    console.log(`Params codipartida: ${req.params.codiPartida} , Server codiPartida: ${partida.codi}`);
    res.send(`Aquesta partida no existeix.`);
    return;
  }

  // llegeix la baralla de cartes de l'arxiu JSON
  fs.readFile('./baralla.json', 'utf8', (err, barallaJSON) => {
    if (err) {
      console.log(`S'ha produït un error llegint el fitxer baralla.json del disc.
            \nError: ${err}`);
      res.send(`S'ha produït un error llegint el fitxer baralla.json del disc.`);
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
      console.log('Cartes jugador 1:'); 
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
      console.log('Cartes jugador 2:'); 
      segonJugador.cartes.forEach(carta => {
        console.log(`${carta.pal}, ${carta.color}, ${carta.carta}`);
      });
      /******* DEBUG *******/ 

    } catch (err) {
      console.log(`S'ha produït un error llegint el JSON de la baralla de cartes. 
            \nError: ${err}`);
      res.send('');
    }
  });

  res.send(`S'han repartit les cartes.`);
});

app.get('/mostrarCartes/:codiPartida', (req, res) => {
  if (req.params.codiPartida != partida.codi) {
    res.send('No existeix cap partida amb aquest codi!');
  }
  
  res.send(`Cartes primer jugador: 
            ${JSON.stringify(primerJugador.cartes)} 
            Cartes segon jugador: 
            ${JSON.stringify(segonJugador.cartes)}`);
});

app.put('/tirarCarta/codiPartida/carta', (req, res) => {
  
});

app.put('/moureJugador/codiPartida/aposta/quantitat', (req, res) => {
  // TODO
  // guardar la quantitat que passen al body a primerJugaror/segonJugador.aposta
  // req.body.quantitatApostada
  // req.body.codiJugador
  
});

app.put('/moureJugador/codiPartida/passa', (req, res) => {
  // TODO
});

app.delete('/acabarJoc/:codi', (req, res) => {
  let partida = partides.find(codi => codi === req.params.codi);
  partides.splice(partides.indexOf(partida), 1);
  res.send('Partida acabada.');
});

app.listen(3000, () => console.log('inici servidor al port 3000'));
