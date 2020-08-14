/**
 * Array polyfill
 */
if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function(searchElement, fromIndex) {
    var k;

    // 1. Положим O равным результату вызова ToObject с передачей ему
    //    значения this в качестве аргумента.
    if (this == null) {
      throw new TypeError('"this" is null or not defined');
    }

    var O = Object(this);

    // 2. Положим lenValue равным результату вызова внутреннего метода Get
    //    объекта O с аргументом "length".
    // 3. Положим len равным ToUint32(lenValue).
    var len = O.length >>> 0;

    // 4. Если len равен 0, вернём -1.
    if (len === 0) {
      return -1;
    }

    // 5. Если был передан аргумент fromIndex, положим n равным
    //    ToInteger(fromIndex); иначе положим n равным 0.
    var n = +fromIndex || 0;

    if (Math.abs(n) === Infinity) {
      n = 0;
    }

    // 6. Если n >= len, вернём -1.
    if (n >= len) {
      return -1;
    }

    // 7. Если n >= 0, положим k равным n.
    // 8. Иначе, n<0, положим k равным len - abs(n).
    //    Если k меньше нуля 0, положим k равным 0.
    k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

    // 9. Пока k < len, будем повторять
    while (k < len) {
      // a. Положим Pk равным ToString(k).
      //   Это неявное преобразование для левостороннего операнда в операторе in
      // b. Положим kPresent равным результату вызова внутреннего метода
      //    HasProperty объекта O с аргументом Pk.
      //   Этот шаг может быть объединён с шагом c
      // c. Если kPresent равен true, выполним
      //    i.  Положим elementK равным результату вызова внутреннего метода Get
      //        объекта O с аргументом ToString(k).
      //   ii.  Положим same равным результату применения
      //        Алгоритма строгого сравнения на равенство между
      //        searchElement и elementK.
      //  iii.  Если same равен true, вернём k.
      if (k in O && O[k] === searchElement) {
        return k;
      }
      k++;
    }
    return -1;
  };
}

/**
 * Обработчик ошибок
 * @author Sergey Turulin sergey@turulin.ru
 * @constructor
 * @param {number=} level - Уровень возможной ошибки
 * 1 - исключительная ошибка - нельзя обработать запрос
 * 2 - по умолчанию, не хватает каких-то данных, чтобы выполнить запрос
 * 3 - ошибка, которая влияет только на внешний вид
 * @param {string=} lang
 */
STErrorSolver = function(level, lang) {
  level = level || 2;
  lang = lang || 'en';

  var messages = [];

  this.check = function(e) {
    log.write('STErrorSolver' + '.check({level: ' + e.level + ', message: ' +
        e.message + '})');

    if (e.level <= level) {
      alertError(e);
    }

    if (messages.indexOf(e.message[lang]) < 0) {
      messages.push(e.message[lang]);
    }
  };
};

/**
 * Система логирования происходящего
 * @author Sergey Turulin sergey@turulin.ru
 * @constructor
 * @param {boolean} writeLog
 */
STLog = function(writeLog) {
  writeLog = writeLog || false;
  const file = new File('~/Desktop/log-ai-export-pdf-dwg-eps.log');

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

/**
 * Подробное описание ошибки
 * @param e
 */
function alertError(e) {
  log.write('alertError: ' + e.message);
  var filePath, filePaths;

  if (e.e) {
    filePath = e.e.fileName;
    filePaths = filePath.split('/');
    alert(e.e.message +
        '\nномер строки: ' + (e.e.line || '[не известно]') +
        '\nфайл ошибки: ' +
        (filePaths[filePaths.length - 1] || '[не известно]') +
        '\nномер ошибки: ' + (e.e.number || '[не известно]') +
        '\nполный путь файла: ' + (filePath || '[не известно]'),
    );
  } else {
    if (e.fileName) {
      filePath = e.fileName;
      filePaths = filePath.split('/');
      alert(e.message +
          '\nномер строки: ' + (e.line || '[не известно]') +
          '\nфайл ошибки: ' +
          (filePaths[filePaths.length - 1] || '[не известно]') +
          '\nномер ошибки: ' + (e.number || '[не известно]') +
          '\nполный путь файла: ' + (filePath || '[не известно]'),
      );
    } else {
      alert(e.message);
    }
  }
}

/**
 * @param {Document} doc
 * @param {string} rangeString
 * @param {string} folderName
 * @param {string} toName
 */
function saveAsPdf(doc, rangeString, folderName, toName) {

  var pdfSaveOptions = new PDFSaveOptions();
  pdfSaveOptions.viewAfterSaving = false;
  pdfSaveOptions.pDFPreset = '[PDF/X-3:2002]';
  pdfSaveOptions.artboardRange = rangeString;
  if (app.PDFPresetsList.indexOf(pdfSaveOptions.pDFPreset) < 0) {
    throw {
      level: 2,
      message:
          'ExportPdfPreset "' + pdfSaveOptions.pDFPreset + '" did not find.',
    };
  }

  var folder = new Folder(doc.path + '/' + folderName);
  if (!folder.exists) {
    try {
      if (!folder.create()) {
        this.errorSolver.check(
            1,
            'Failed to create folder for pdf.',
        );
      }
    } catch (e) {
      this.errorSolver.check(
          e.level || 1,
          e.message || 'Failed to create folder for pdf.',
          e,
      );
    }
  }

  var filename = folder.fullName + '/' +
      doc.name.substr(0, doc.name.lastIndexOf('.')) + toName + '.pdf';
  try {
    doc.saveAs(new File(filename), pdfSaveOptions);
  } catch (e) {
    throw {
      level: 1,
      message: 'Failed to save pdf.',
      e: e,
    };
  }
}

/**
 *
 * @param {Document} doc
 * @param {string} folderName
 * @param {string} toName
 */
function exportDwg(doc, folderName, toName) {

  var folder = new Folder(doc.path + '/' + folderName);
  if (!folder.exists) {
    try {
      if (!folder.create()) {
        this.errorSolver.check(
            1,
            'Failed to create folder for dwg.',
        );
      }
    } catch (e) {
      this.errorSolver.check(
          e.level || 1,
          e.message || 'Failed to create folder for dwg.',
          e,
      );
    }
  }

  var exportOptionsAutoCAD = new ExportOptionsAutoCAD();
  exportOptionsAutoCAD.exportOption = AutoCADExportOption.MaximumEditability;

  var filename = folder.fullName + '/' +
      doc.name.substr(0, doc.name.lastIndexOf('.')) + toName + '.dwg';
  try {
    doc.exportFile(new File(filename), ExportType.AUTOCAD, exportOptionsAutoCAD);
  } catch (e) {
    throw {
      level: 1,
      message: 'Failed to export dwg.',
      e: e,
    };
  }
}

/**
 * @param {Document} doc
 * @param {string} folderName
 * @param {string} toName
 */
function saveAsEps(doc, folderName, toName) {

  var folder = new Folder(doc.path + '/' + folderName);
  if (!folder.exists) {
    try {
      if (!folder.create()) {
        this.errorSolver.check(
            1,
            'Failed to create folder for eps.',
        );
      }
    } catch (e) {
      this.errorSolver.check(
          e.level || 1,
          e.message || 'Failed to create folder for eps.',
          e,
      );
    }
  }

  var ePSSaveOptions = new EPSSaveOptions();

  var filename = folder.fullName + '/' +
      doc.name.substr(0, doc.name.lastIndexOf('.')) + toName + '.eps';
  try {
    doc.saveAs(new File(filename), ePSSaveOptions);
  } catch (e) {
    throw {
      level: 1,
      message: 'Failed to save eps.',
      e: e,
    };
  }
}

function exportPdfDwgEps() {
  if (0 === app.documents.length) {
    throw {
      level: 1,
      message: 'No opened document.',
    };
  }

  const FOLDER_NAME = 'Export-PDF-DWG-EPS';
  const DOC_FILE = new File(app.activeDocument.fullName);
  const DOC_ARTBOARDS_LENGTH = app.activeDocument.artboards.length;

  var doc, i, pageNumber;
  // Экспорт в pdf
  // Все страницы в один
  doc = app.activeDocument;
  saveAsPdf(doc, '', FOLDER_NAME, '_PAGE_ALL');
  doc.close();

  // Страницы в отдельные файлы
  for (i = 0; i < DOC_ARTBOARDS_LENGTH; i++) {
    doc = app.open(DOC_FILE);
    pageNumber = (i + 1).toString();
    saveAsPdf(doc, pageNumber, FOLDER_NAME, '_PAGE_' + (i + 1).toString());
    doc.close(SaveOptions.DONOTSAVECHANGES);
  }

  // Экспорт в DWG
  doc = app.open(DOC_FILE);
  exportDwg(doc, FOLDER_NAME, '');
  doc.close(SaveOptions.DONOTSAVECHANGES);

  // Экспорт в EPS
  doc = app.open(DOC_FILE);
  saveAsEps(doc, FOLDER_NAME, '');
  doc.close(SaveOptions.DONOTSAVECHANGES);
}

const log = new STLog(false);
const errorSolver = new STErrorSolver();

try {
  exportPdfDwgEps();
} catch (e) {
  errorSolver.check(e);
}
