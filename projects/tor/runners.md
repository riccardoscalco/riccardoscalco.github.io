# Dati statici

## Dati dei runners (oggetto le cui chiavi sono i pettorali)


```
{
  "432": {
    "nome": "Max Damage",
    "sess0": "M",
    "nazionalità": "IT",
    "pettorale": "432"
  },
  "56": {
    ...
  },
}
```

## Dati delle basi (oggetto le cui chiavi sono gli id delle basi)


```
{
  "B1": {
    "nome": "La Thuile",
    "km": "17",
    "dislivelloAccumulato": "xyz"
    "baseVita": false
  },
  "B2": {
    "nome": "Planaval",
    "km": "43",
    "dislivelloAccumulato": "xyz"
    "baseVita": false
  },
  ...
}
```

# Dati variabili

## Dati di cronometraggio (array di oggetti)


```
[
  {
    "pettorale": "432",
    "dinamica": [
      {
        "idBase": "B1",
        "timeOut": ""
      },
      {
        "idBase": "B2",
        "timeIn": "",
        "timeOut": "",
      },
      {
        "idBase": "B3",
        "timeIn": ""
      }
    ]
  },
  ...
]
```

Assunzioni:

- se sono presenti entrambe le key "timeIn" e "timeOut" allora ha senso calcolare un tempo di pausa nella base

- se è presente solo "timeIn" allora non ha senso calcolare un tempo di pausa, assumo che il corridore sia solo passato di là, senza fermarsi.

- se sono presenti sia "timeIn" che "timeOut", con "timeIn" avente valore definito e "timeOut" indefinito, allora assumo che si tratti di una base vita e che il corridore sia fermo alla base.

Se per voi è preferibile tenere basi diverse per in/out, allora un esempio di json è il seguente:


```
[
  {
    "pettorale": "432",
    "dinamica": [
      {
        "idBase": "B1",
        "timeOut": ""
      },
      {
        "idBase": "B2",
        "timeIn": ""
      },
      {
        "idBase": "B3",
        "timeOut": ""
      },
      {
        "idBase": "B4",  # questa ha solo il timeIn
        "timeIn": ""
      },
      {
        "idBase": "B5",
        "timeIn": ""
      },
      {
        "idBase": "B6",
        "timeOut": ""
      }
    ]
  },
  ...
]
```