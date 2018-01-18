/* eslint-disable */

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export function shuffle(arr) {
  let _arr = arr.slice()
  for (let i = 0; i < _arr.length; i++) {
    let j = getRandomInt(0, i)
    let t = _arr[i]
    _arr[i] = _arr[j]
    _arr[j] = t
  }
  return _arr
}

// 节流
export function debounce(func, delay) {
  let timer

  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}

// 转化成html格式的文本
export function encodeHtml(str) {
  let encodedStr = "";
  if (str == "") return encodedStr;
  else {
    for (var i = 0; i < str.length; i++) {
      encodedStr += "&#" + str.substring(i, i + 1).charCodeAt().toString(10) + ";";
    }
  }
  return encodedStr;
}