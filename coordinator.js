var numWorkers = 8
var charsPerWorker = charsLength / numWorkers

for (var i = 0; i < numWorkers; i++) {

  // Create worker
  var worker = new Worker('worker.js')

  // Message handler
  worker.addEventListener('message', function (e) {
    switch (e.data.cmd) {
      case "log":
        log(e.data.data, e.data.id)
        break
      case "setRate":
        log(addCommasToInteger(e.data.data) + " passwords/second", e.data.id)
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
  worker.postMessage({ cmd: "setPassToCrack", data: "7ed21143076d0cca420653d4345baa2f" })

  // Split up work among workers
  var charsStart = i * charsPerWorker
    , charsEnd = charsStart + charsPerWorker
    , queue = chars.slice(Math.floor(charsStart), Math.floor(charsEnd))

  // Start worker
  worker.postMessage({ cmd: "performCrack", data: queue })

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