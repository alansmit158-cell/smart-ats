const { Worker } = require('worker_threads');
const path = require('path');
const EventEmitter = require('events');

class NLPWorkerPool extends EventEmitter {
  constructor(maxWorkers = 3) {
    super();
    this.maxWorkers = maxWorkers;    // Maximum 3 analyses simultanées
    this.activeWorkers = 0;
    this.queue = [];                 // File d'attente si tous les workers sont occupés
  }

  // Lancer un traitement NLP dans un Worker Thread
  processCV({ pdfText, candidateId }) {
    return new Promise((resolve, reject) => {
      const task = { pdfText, candidateId, resolve, reject };
      
      if (this.activeWorkers < this.maxWorkers) {
        this._runWorker(task);
      } else {
        // Mettre en file d'attente si tous les workers sont occupés
        console.log(`⏳ Worker pool plein (${this.activeWorkers}/${this.maxWorkers}). Mise en file d'attente du candidat ${candidateId}`);
        this.queue.push(task);
      }
    });
  }

  _runWorker({ pdfText, candidateId, resolve, reject }) {
    this.activeWorkers++;
    console.log(`🚀 Worker Thread démarré pour candidat ${candidateId} (${this.activeWorkers}/${this.maxWorkers} actifs)`);

    const worker = new Worker(
      path.join(__dirname, 'nlpWorker.js'),
      {
        workerData: {
          pdfText,
          candidateId,
          mongoUri: process.env.MONGO_URI,
          openaiKey: process.env.OPENAI_API_KEY
        }
      }
    );

    // Réponse du worker
    worker.on('message', (result) => {
      this.activeWorkers--;
      console.log(`✅ Worker Thread terminé pour candidat ${candidateId}`);
      
      if (result.success) {
        resolve(result);
        this.emit('completed', result);
      } else {
        reject(new Error(result.error));
        this.emit('failed', result);
      }
      
      // Traiter la tâche suivante dans la file
      this._processQueue();
    });

    // Erreur du worker
    worker.on('error', (error) => {
      this.activeWorkers--;
      console.error(`❌ Worker Thread erreur pour ${candidateId}:`, error.message);
      reject(error);
      this._processQueue();
    });

    // Worker terminé sans message
    worker.on('exit', (code) => {
      if (code !== 0) {
        this.activeWorkers--;
        reject(new Error(`Worker stopped with exit code ${code}`));
        this._processQueue();
      }
    });
  }

  _processQueue() {
    if (this.queue.length > 0 && this.activeWorkers < this.maxWorkers) {
      const nextTask = this.queue.shift();
      console.log(`📤 Traitement tâche suivante en file (${this.queue.length} restantes)`);
      this._runWorker(nextTask);
    }
  }

  // Statistiques du pool (pour AdminStats)
  getStats() {
    return {
      activeWorkers: this.activeWorkers,
      maxWorkers: this.maxWorkers,
      queueLength: this.queue.length,
      available: this.maxWorkers - this.activeWorkers
    };
  }
}

// Export singleton — un seul pool pour tout le serveur
module.exports = new NLPWorkerPool(3);
