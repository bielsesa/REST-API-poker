# REST-API-poker

**CAT**
Una API REST feta amb NodeJS i ExpressJS.
Representa una partida de Poker.

**ENG**
REST API made with NodeJS and ExpressJS.
Represents a Poker game.

Translations from catalan to english:

`codiPartida = gameCode`

## Endpoints Reference

### Start a game

Route: `/iniciarJoc`

HTTP method: `POST`

Body structure:

```json
{
    "codiPartida" : 1
}
```

### Get cards

Route: `/obtenirCarta/:codiPartida` 

HTTP method: `GET`


### Show players cards

Route: `/mostrarCartes/:codiPartida`

HTTP method: `GET`

### Play a card

Route: `/tirarCarta`

HTTP method: `PUT`

Body structure:

```json
{
    "codiPartida": 1,
    "codiJugador":0,
    "carta" : {
        "pal":"piques",
        "color":"negre",
        "carta":2
    }
}
```

### Bet quantity

Route: `/apostar`

HTTP method: `PUT`

Body structure:

```json
{
    "codiPartida": 1,
    "codiJugador":1,
    "quantitatAposta" : 20
}
```

### Pass turn

Route: `/passar`

HTTP method: `PUT`

Body structure:

```json
{
    "codiPartida": 1,
    "codiJugador":1
}
```

### End game

Route: `/acabarJoc/:codiPartida`

HTTP method: `DELETE`
