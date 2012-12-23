importScripts('jshash-2.2/md5-min.js', 'chars.js')

// Cracking settings
var workerId
  , maxPassLength = undefined
  , passToCrack = undefined

// Timer variables
var interval = 10000
  , count = 0
  , startTime = +new Date

function log(msg) {
  this.postMessage( {cmd: "log", data: msg, id: workerId })
}

function crack(prefixes) {
  log("Started cracking")

  var queue = prefixes
    , pw = undefined
    , prefix = undefined
  while (queue[0]) {
    prefix = queue.shift()
    for (var j = 0; j < charsLength; j++) {
      pw = prefix + chars[j]
      
      if (hex_md5(pw) == passToCrack) {
        log("FOUND PASSWORD: " + pw)
        return
      }

      count += 1
      if (count % interval == 0) {
        this.postMessage({ cmd: "setRate", data: interval / ((new Date - startTime) / 1000), id: workerId })
        // log('queue size ' + queue.length)
        count = 0
        startTime = +new Date
      }

      if (pw[maxPassLength - 1] == null)
        queue.push(pw)
    }
  }

}

this.addEventListener('message', function(e) {

  switch (e.data.cmd) {
    case "setWorkerId":
      workerId = e.data.data
      break

    case "setMaxPassLength":
      maxPassLength = e.data.data
      break

    case "setPassToCrack":
      passToCrack = e.data.data
      break

    case "performCrack":
      crack(e.data.data)
      break

    default:
      this.postMessage({ cmd: "log", data: "Worker doesn't understand command " + e.data.cmd })
      break

  }

})