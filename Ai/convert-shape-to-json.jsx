// Create JSON   8((
JSON = {};

// implement JSON.stringify serialization
JSON.stringify = JSON.stringify || function(obj) {

  var t = typeof (obj);
  if ('object' !== t || null === obj) {

    // simple data type
    if ('string' === t) {
      obj = '"' + obj + '"';
    }
    return String(obj);

  } else {

    // recurse array or object
    var n, v, json = [], arr = (obj && Array === obj.constructor);

    for (n in obj) {
      if (!obj.hasOwnProperty(n)) {
        continue;
      }

      v = obj[n];
      t = typeof (v);

      if ('string' === t) {
        v = '"' + v + '"';
      } else if ('object' === t && null !== v) {
        v = JSON.stringify(v);
      }

      json.push((arr ? '' : '"' + n + '":') + String(v));
    }

    return (arr ? '[' : '{') + String(json) + (arr ? ']' : '}');
  }
};

// implement JSON.parse de-serialization
JSON.parse = JSON.parse || function(str) {
  var p = '';
  if ('' === str) {
    str = '""';
  }
  eval('var p=' + str + ';');
  return p;
};

/**
 * Система логирования происходящего
 * @author Sergey Turulin sergey@turulin.ru
 * @constructor
 * @param {boolean} writeLog
 */
STLog = function(writeLog) {
  writeLog = writeLog || false;
  const file = new File('~/Desktop/ai-convert-shape-to-json.log');

  if (true === writeLog) {
    file.open('w');
    file.encoding = 'UTF-8';
  }

  /**
   * Пишем строку в лог
   * @param line
   */
  this.write = function(line) {
    if (true !== writeLog) {
      return;
    }

    const now = new Date();
    const nowString = '[' +
        (now.getHours() < 10 ? '0' : '') + now.getHours() + ':' +
        (now.getMinutes() < 10 ? '0' : '') + now.getMinutes() + ':' +
        (now.getSeconds() < 10 ? '0' : '') + now.getSeconds() + ':' +
        (now.getMilliseconds() < 10 ? '00' :
            (now.getMilliseconds() < 100 ? '0' : '')) +
        now.getMilliseconds() + ']';
    file.writeln(nowString + ' ' + line);
  };

  /**
   * @param {string=} line
   */
  this.addPart = function(line) {
    if (true !== writeLog) {
      return;
    }
    this.write('__________________________________');
    if (undefined !== typeof line) {
      this.write(line);
    }
  };

  this.addPart('Start');
};
var isError = false;

if (0 === app.documents.length) {
  alert('Нужно открыть файл.');
  isError = true;
} else {
  if (0 === app.activeDocument.selection.length) {
    alert('Нужно что-то выделить.');
    isError = true;
  } else {
    const pageItem = app.activeDocument.selection[0];
    if ('[PathItem ]' !== pageItem.toString()) {
      alert('Обсчитать можно только форму - PathItem.');
      isError = true;
    }
  }
}

function run() {
  const log = new STLog(true);

  function roundPoint(point) {
    const K = 1000;
    return [
      Math.round(K * point[0]) / K,
      Math.round(K * point[1]) / K,
    ];
  }

  if ('[PathItem ]' !== pageItem.toString()) {
    alert('Обсчитать можно только форму - PathItem.');
    isError = true;
  }

  function isEqualPoints(p1, p2) {
    return (p1[0] === p2[0]) && (p1[1] === p2[1]);
  }

  var points = [];
  var i, anchor, leftDirection, rightDirection;
  for (i = 0; i < pageItem.pathPoints.length; i++) {
    anchor = roundPoint(pageItem.pathPoints[i].anchor);
    leftDirection = roundPoint(pageItem.pathPoints[i].leftDirection);
    rightDirection = roundPoint(pageItem.pathPoints[i].rightDirection);

    points.push({
      anchor: anchor,
      rightDirection:
          isEqualPoints(anchor, leftDirection) ? null : leftDirection,
      leftDirection:
          isEqualPoints(anchor, rightDirection) ? null : rightDirection,
    });
  }

  log.addPart('Result:\n\n' + JSON.stringify(points));
  alert('JSON сохранён на рабочем столе.');
}

if (!isError) {
  run();
}
