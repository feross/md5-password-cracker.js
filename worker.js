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

function crack(options) {
  log("Started cracking")

  var hop = options.hop
    , length = 1
    , pw = undefined
    , prefix = undefined
    , view = undefined
    , buf = new ArrayBuffer(maxPassLength)
    , bufView = new Uint8Array(buf)
  
  bufView[maxPassLength - 1] = from + options.start
  view = bufView.subarray(maxPassLength - length)

  while (true) {
    pw = String.fromCharCode.apply(null, view)

    if (hex_md5(pw) == passToCrack) {

      this.postMessage({ cmd: "foundPassword", data: pw, id: workerId })
      return
    }

    view[length - 1] += hop
    // Check if we need to carry any numbers
    for (var i = length - 1; i >= 0; --i) {
    
      if (view[i] >= to) {    
        view[i] = (view[i] % to) + from

        if (i == 0) {
          length += 1
          view = bufView.subarray(maxPassLength - length)
          view[0] = from + 1
        } else {
          view[i - 1] += 1
        }
      } else {
        break
      }
    }

    // Timer stuff
    count += 1
    if (count % interval == 0) {
      this.postMessage({ cmd: "setRate", data: interval / ((new Date - startTime) / 1000), id: workerId })
      count = 0
      startTime = +new Date
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

