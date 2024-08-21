class QueueManager {
    constructor() {
        this.queues = {};
    }

    // Add a message to a queue
    addMessage(queueName, message) {
        if (!this.queues[queueName]) {
            this.queues[queueName] = [];
        }
        this.queues[queueName].push(message);
        console.log(this.queues);
        
    }

    // Get a message from a queue with optional timeout
    getMessage(queueName, timeout = 10000) {
        return new Promise((resolve) => {
            const checkQueue = () => {
                const message = this.queues[queueName]?.shift();
                if (message) {
                    resolve(message);
                } else if (timeout <= 0) {
                    resolve(null); // No message found after timeout
                } else {
                    timeout -= 100; // Check every 100ms
                    setTimeout(checkQueue, 100);
                }
            };
            checkQueue();
        });
    }

    // Get all queues with their message count
    getQueues(timeout = 10000) {
        console.log("im in getQueues");
        
        return Object.entries(this.queues).map(([name, messages]) => ({
            name,
            count: messages.length,
        }));
    }
  }
  
  module.exports = new QueueManager();
  