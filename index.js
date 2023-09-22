import envStates from './envSingleton.js';
import express from 'express';
import valor from './data.js';

const app = express();

app.get('/', (req, res) => {
  res.send(envStates);
});

console.log(valor);

//console.log("index: ", );
//console.log("SCR-END-JWT-DEVNE: ", envStates['SCR-END-JWT-DEVNE']);
app.listen(3000, () => console.log('Example app is listening on port 3000.'));