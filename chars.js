// Try all alpha-numeric passwords (lower and uppercase)
var alpha = "abcdefghijklmnopqrstuvwxyz"
var num = "0123456789"
var chars = [];
chars.push.apply(chars, alpha.split(""))
chars.push.apply(chars, alpha.toUpperCase().split(""))
chars.push.apply(chars, num.split(""))

var charsLength = chars.length