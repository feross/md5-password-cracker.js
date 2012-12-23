// Try all alpha-numeric passwords (lower and uppercase)
// var alpha = "abcdefghijklmnopqrstuvwxyz"
// var num = "0123456789"
// var chars = [];
// chars.push.apply(chars, alpha.split(""))
// chars.push.apply(chars, alpha.toUpperCase().split(""))
// chars.push.apply(chars, num.split(""))

// var charsLength = chars.length


// Letters (upper and lower) and numbers
var from = 48
  , to = 123 /* one past the end */
  , skip1_from = 58
  , skip1_to = 65
  , skip2_from = 91
  , skip2_to = 97

// Letters (upper and lower), numbers, and special characters 
//var from = 33
//  , to = 127; /* one past the end */

// var chars = []
// for (var i = from; i < to; i++) {
//   chars.push(String.fromCharCode(i))
// }
// chars = chars.join('')