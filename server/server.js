const express = require('express');
const cors = require('cors');
const app = express();
const queueManager = require('./queues');


app.use(cors());

app.use(express.json());

app.get('/', (req,res) =>{
    res.json('hello from server');
})
// POST /api/:queue_name -> Add a new message to the queue
app.post('/api/:queue_name', (req, res) => {
    console.log('/api/:queue_name', req.params);
    const { queue_name } = req.params;
    const message = req.body;
    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }

    queueManager.addMessage(queue_name, message);
    res.status(201).json({ message: 'Message added to queue' });
});


// GET /api/queues -> Get the list of queues and the count of messages in each
app.get('/api/num_of_msgs',  (req, res) => {
    console.log(" Get the list of queues and the count of messages in eachGET /api/queues called");  // Add log here
    const queues =  queueManager.getQueues(10000);
    console.log("Queues:", queues);  // Log queues
    res.json(queues);
});


// GET /api/:queue_name?timeout={ms} -> Get the next message from the queue
app.get('/api/:queue_name', async (req, res) => {
    console.log("GET /api/:queue_name?timeout={ms}")
    const { queue_name } = req.params;
    const timeout = parseInt(req.query.timeout) || 10000; // Default timeout 10s

    const message = await queueManager.getMessage(queue_name, timeout);

    if (message) {
        res.json(message);
    } else {
        res.sendStatus(204); // No message available
    }
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});