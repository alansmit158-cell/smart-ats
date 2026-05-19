const { Worker } = require('worker_threads');
const path = require('path');
const EventEmitter = require('events');

class NLPWorkerPool extends EventEmitter {
  constructor(maxWorkers = 3) {
    super();
    this.maxWorkers = maxWorkers;
    this.activeWorkers = 0;
    this.queue = [];
    this.auditLogs = []; // Stores audit logs
  }

  addAuditLog(action, details = '') {
      const log = {
          time: new Date().toISOString(),
          action,
          details
      };
      this.auditLogs.push(log);
      if (this.auditLogs.length > 100) this.auditLogs.shift(); // Keep last 100
      console.log(`[AUDIT] ${action} ${details}`);
  }

  processCV({ pdfText, candidateId, retries = 0 }) {
    return new Promise((resolve, reject) => {
      const task = { pdfText, candidateId, retries, resolve, reject };
      
      if (this.activeWorkers < this.maxWorkers) {
        this._runWorker(task);
      } else {
        this.addAuditLog('TASK_QUEUED', `Candidat ${candidateId} mis en file d'attente.`);
        this.queue.push(task);
      }
    });
  }

  _runWorker({ pdfText, candidateId, retries, resolve, reject }) {
    this.activeWorkers++;
    this.addAuditLog('WORKER_START', `Démarrage pour candidat ${candidateId} (Tentative ${retries + 1})`);

    const worker = new Worker(
      path.join(__dirname, 'nlpWorker.js'),
      {
        workerData: {
          pdfText,
          candidateId,
          mongoUri: process.env.MONGO_URI,
          groqKey: process.env.GROQ_API_KEY,
          groqModel: process.env.GROQ_MODEL
        }
      }
    );

    worker.on('message', (result) => {
      this.activeWorkers--;
      if (result.success) {
        this.addAuditLog('WORKER_SUCCESS', `Terminé pour candidat ${candidateId}`);
        resolve(result);
        this.emit('completed', result);
      } else {
        this.addAuditLog('WORKER_FAIL', `Échec pour candidat ${candidateId}: ${result.error}`);
        this._handleWorkerFailure({ pdfText, candidateId, retries, resolve, reject }, new Error(result.error));
      }
      this._processQueue();
    });

    worker.on('error', (error) => {
      this.activeWorkers--;
      this.addAuditLog('WORKER_ERROR', `Crash pour candidat ${candidateId}: ${error.message}`);
      this._handleWorkerFailure({ pdfText, candidateId, retries, resolve, reject }, error);
      this._processQueue();
    });

    worker.on('exit', (code) => {
      if (code !== 0) {
        this.activeWorkers--;
        this.addAuditLog('WORKER_EXIT', `Arrêt inattendu (code ${code}) pour candidat ${candidateId}`);
        this._handleWorkerFailure({ pdfText, candidateId, retries, resolve, reject }, new Error(`Exit code ${code}`));
        this._processQueue();
      }
    });
  }

  _handleWorkerFailure(task, error) {
      if (task.retries < 2) {
          this.addAuditLog('TASK_RETRY', `Réassignation de la tâche pour candidat ${task.candidateId}`);
          task.retries++;
          this.queue.unshift(task); // Put back at the front of the queue
      } else {
          this.addAuditLog('TASK_ABORTED', `Tâche abandonnée après ${task.retries} tentatives pour candidat ${task.candidateId}`);
          task.reject(error);
          this.emit('failed', { candidateId: task.candidateId, error: error.message });
      }
  }

  _processQueue() {
    if (this.queue.length > 0 && this.activeWorkers < this.maxWorkers) {
      const nextTask = this.queue.shift();
      this.addAuditLog('QUEUE_POP', `Traitement depuis la file (${this.queue.length} restantes)`);
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
