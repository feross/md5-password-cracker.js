var numWorkers = 8
var workers = []
var startTime = +new Date

for (var i = 0; i < numWorkers; i++) {

  // Create worker
  var worker = new Worker('worker.js')
  workers.push(worker)

  // Message handler
  worker.addEventListener('message', function (e) {
    switch (e.data.cmd) {
      case "log":
        log(e.data.data, e.data.id)
        break

      case "setRate":
        log(addCommasToInteger(e.data.data) + " passwords/second", e.data.id)
        break

      case "foundPassword":
        log("FOUND PASSWORD: " + e.data.data, e.data.id)

        var totalTime = (+new Date - startTime) / 1000
        log("TOTAL TIME: " + totalTime + " seconds")

        workers.forEach(function(worker) {
          worker.terminate()
        })
        break

      default:
        log("Main page doesn't understand command " + e.data.cmd)
        break
    }
  })

  // Error handler
  worker.addEventListener('error', function(e) {
    log(['ERROR: Line ', e.lineno, ' in ', e.filename, ': ', e.message].join(''))
  })

  // Set worker settings
  worker.postMessage({ cmd: "setWorkerId", data: i })
  worker.postMessage({ cmd: "setMaxPassLength", data: 5 })
  worker.postMessage({ cmd: "setPassToCrack", data: "e2fc714c4727ee9395f324cd2e7f331f" })

  // Start worker
  worker.postMessage({ cmd: "performCrack", data: {start: i, hop: numWorkers} })

}


// Helper functions

function addCommasToInteger(x) {
  x = parseInt(x) + ''
  var rgx = /(\d+)(\d{3})/
  while (rgx.test(x)) {
    x = x.replace(rgx, '$1' + ',' + '$2')
  }
  return x
}

function log(msg, workerId) {
  var prefix = workerId != null
    ? "Worker " + workerId + " says: "
    : "Main page says: "

  var selector = workerId != null
    ? "#worker" + workerId
    : "#log"

  document.querySelector(selector).textContent = prefix + msg
}


