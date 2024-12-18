const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const twilio = require('twilio');

// Base de datos simulada
const db = {
  users: [
    { id: 1, email: "Sincere@duocuc.cl" },
    { id: 2, email: "fruna@duocuc.cl" }
  ],
  "send-sms": [
    {
      to: [],
      body: []
    }
  ]
};

const accountSid = 'AC61037ce1eff4c978ae99ad73612aa2f8'; // Account SID de Twilio
const authToken = '92b8d9d011d8f5d80af3da5832cfebda';   // Auth Token de Twilio
const client = new twilio(accountSid, authToken);

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Ruta para obtener el email de un usuario
app.get('/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const user = db.users.find(u => u.id === userId);

  if (user) {
    res.json({ email: user.email });
  } else {
    res.status(404).json({ error: 'Usuario no encontrado' });
  }
});

// Ruta para enviar un SMS
app.post('/send-sms', (req, res) => {
  const { to, body } = req.body;

  // Lógica para enviar SMS
  client.messages.create({
    body: body,
    from: '+13203772307', // Número de Twilio
    to: to // Número de teléfono o destinatario
  })
    .then(message => {
      // Almacenar en la base de datos simulada
      db['send-sms'].push({ to, body });
      res.json({ sid: message.sid });
    })
    .catch(error => {
      console.error('Error al enviar SMS:', error);
      res.status(500).json({ error: 'Error al enviar SMS' });
    });
});

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});