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
 * Log system
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
 * Error report
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
        '\nполный путь файла: ' + (filePath || '[не известно]'),
    );

  } else {
    alert(e.message);
  }
}

/**
 * @param {Document} doc
 * @param {File} file
 * @param {string} rangeString
 */
function saveAsPdf(doc, file, rangeString) {
  const pdfSaveOptions = new PDFSaveOptions();
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

  try {
    doc.saveAs(new File(file), pdfSaveOptions);
  } catch (e) {
    throw {
      level: 1,
      message: 'Failed to save pdf.',
      e: e,
    };
  }
}

/**
 * Export DWG
 * @param {Document} doc
 * @param {File} file
 */
function exportDwg(doc, file) {

  var exportOptionsAutoCAD = new ExportOptionsAutoCAD();
  exportOptionsAutoCAD.exportOption = AutoCADExportOption.MaximumEditability;

  try {
    doc.exportFile(file, ExportType.AUTOCAD, exportOptionsAutoCAD);
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
 * @param {File} file
 * @param {string} rangeString
 */
function saveAsEps(doc, file, rangeString) {

  var ePSSaveOptions = new EPSSaveOptions();
  ePSSaveOptions.compatibility = Compatibility.ILLUSTRATOR13;
  ePSSaveOptions.saveMultipleArtboards = ('' !== rangeString);
  ePSSaveOptions.artboardRange = rangeString;

  try {
    doc.saveAs(file, ePSSaveOptions);
  } catch (e) {
    throw {
      level: 1,
      message: 'Failed to save eps.',
      e: e,
    };
  }
}

/**
 * Get file name
 * @param {Document} doc
 * @return {string}
 */
function getFileName(doc) {
  return doc.name.substr(0, doc.name.lastIndexOf('.'));
}

/**
 * Get type of the file
 * @param {Document} doc
 * @return {string}
 */
function getFileType(doc) {
  return doc.name.substr(doc.name.lastIndexOf('.') + 1);
}

/**
 * Check: if folder exists & create if not exists
 * @param {Folder} folder
 */
function checkFolder(folder) {
  log.addPart('fun: checkFolder()');

  if (!folder.exists) {
    try {
      if (!folder.create()) {
        this.errorSolver.check(
            1,
            'Failed to create folder "' + folder.name + '".',
        );
      }
    } catch (e) {
      this.errorSolver.check(
          e.level || 1,
          e.message || 'Failed to create folder "' + folder.name + '".',
          e,
      );
    }
  }
}

/**
 * @param {Object} options
 */
function exportPdfDwgEps(options) {
  log.addPart('fun: exportPdfDwgEps()');

  if (0 === app.documents.length) {
    throw {
      level: 1,
      message: 'No opened document.',
    };
  }

  const DOC_FILE_SOURCE = new File(app.activeDocument.fullName);
  const DOC_NAME = getFileName(app.activeDocument);
  const DOC_ARTBOARDS_LENGTH = app.activeDocument.artboards.length;
  const DOC_FOLDER_PATH = app.activeDocument.path;

  const FOLDER_NAME = options.folderName;
  const FOLDER_PATH = app.activeDocument.path + '/' + FOLDER_NAME;
  const FOLDER = new Folder(FOLDER_PATH);
  checkFolder(FOLDER);

  const DOC_FILE_TEMP = new File(DOC_FOLDER_PATH + '/' + DOC_NAME +
      '__TEMP_' + Math.round(Math.random() * 10000).toString()
      + '.' + getFileType(app.activeDocument),
  );

  if (options.createOutlines || options.outlineStroke) {
    if (options.createOutlines) {
      createOutlines(app.activeDocument);
    }
    if (options.outlineStroke) {
      outlineStroke(app.activeDocument);
    }
    app.activeDocument.saveAs(DOC_FILE_TEMP);
  }
  const DOC_FILE = new File(app.activeDocument.fullName);

  var doc, folderPdf, folderEps, file, i, pageNumber;

  // Экспорт в pdf
  // Все страницы в один
  if (true === options.pdfSingle) {
    doc = app.activeDocument;
    file = new File(FOLDER_PATH + '/' + DOC_NAME + '.pdf');
    saveAsPdf(doc, file, '');
    doc.close();
  }

  if (true === options.pdfMultiply || true === options.epsMultiply) {
    // Страницы в отдельные файлы

    if (true === options.pdfMultiply) {
      folderPdf = new Folder(
          FOLDER_PATH + (options.pdfPlaceInFolder ? '/PDF' : ''));
      checkFolder(folderPdf);
    }

    if (true === options.epsMultiply) {
      folderEps = new Folder(
          FOLDER_PATH + (options.pdfPlaceInFolder ? '/EPS' : ''));
      checkFolder(folderEps);
    }

    for (i = 0; i < DOC_ARTBOARDS_LENGTH; i++) {
      pageNumber = (i < 9 ? '0' : '') + (i + 1).toString();

      if (true === options.pdfMultiply) {
        doc = app.open(DOC_FILE);
        file = new File(folderPdf.fullName + '/'
            + DOC_NAME + '_PAGE-' + pageNumber + '.pdf');
        saveAsPdf(doc, file, pageNumber);
        doc.close(SaveOptions.DONOTSAVECHANGES);
      }

      if (true === options.epsMultiply) {
        doc = app.open(DOC_FILE);
        file = new File(folderEps.fullName + '/'
            + DOC_NAME + '_PAGE.eps');
        saveAsEps(doc, file, pageNumber);
        doc.close(SaveOptions.DONOTSAVECHANGES);
      }
    }
  }

  // Экспорт в EPS все страницы
  if (true === options.epsSingle) {
    doc = app.open(DOC_FILE);
    file = new File(FOLDER_PATH + '/' + DOC_NAME + '.eps');
    saveAsEps(doc, file, '');
    doc.close(SaveOptions.DONOTSAVECHANGES);
  }

  // Экспорт в DWG
  if (true === options.dwgSingle) {
    doc = app.open(DOC_FILE);
    file = new File(FOLDER_PATH + '/' + DOC_NAME + '.dwg');
    exportDwg(doc, file);
    doc.close(SaveOptions.DONOTSAVECHANGES);
  }

  if (DOC_FILE_TEMP.exists) {
    DOC_FILE_TEMP.remove();
  }

  app.open(DOC_FILE_SOURCE);
}

const log = new STLog(true);
const errorSolver = new STErrorSolver();

/**
 * Create outlines from all texts in the document
 * @param {Document} doc
 */
function createOutlines(doc) {
  log.addPart('fun: createOutlines()');

  var i, textFrame;
  for (i = doc.textFrames.length - 1; i >= 0; i--) {
    textFrame = doc.textFrames[i];
    textFrame.createOutline();
  }
}

/**
 * Create outlines from stroke
 * @param {Document} doc
 */
function outlineStroke(doc) {
  log.addPart('fun: outlineStroke()');

  var i, pathItem, wasHidden, wasLocked;
  for (i = doc.pathItems.length - 1; i >= 0; i--) {
    log.write('i = ' + i);
    pathItem = doc.pathItems[i];

    wasHidden = pathItem.hidden;
    wasLocked = pathItem.locked;

    try {
      pathItem.hidden = false;
      pathItem.locked = false;
      if (pathItem.stroked && pathItem.editable) {
        selection = null;
        pathItem.selected = true;
        app.executeMenuCommand('OffsetPath v22');
        pathItem.hidden = wasHidden;
        pathItem.locked = wasLocked;
        log.write(': stroke outlined');
      }

    } catch (e) {
      log.write('err: ' + e.message);
    }
  }

  log.addPart('fun-end: outlineStroke()');
}

/**
 * Show start dialog
 */
function showDialog() {
  if (0 === app.documents.length) {
    throw {
      level: 1,
      message: 'No opened document.',
    };
  }

  /*
  Code for Import https://scriptui.joonas.me — (Triple click to select):
  {"activeId":16,"items":{"item-0":{"id":0,"type":"Dialog","parentId":false,"style":{"enabled":true,"varName":null,"windowType":"Dialog","creationProps":{"su1PanelCoordinates":false,"maximizeButton":false,"minimizeButton":false,"independent":false,"closeButton":true,"borderless":false,"resizeable":false},"text":"File export","preferredSize":[0,0],"margins":16,"orientation":"column","spacing":10,"alignChildren":["center","top"]}},"item-1":{"id":1,"type":"Panel","parentId":0,"style":{"enabled":true,"varName":"pdfPanel","creationProps":{"borderStyle":"etched","su1PanelCoordinates":false},"text":"PDF","preferredSize":[200,0],"margins":10,"orientation":"column","spacing":10,"alignChildren":["left","top"],"alignment":null}},"item-2":{"id":2,"type":"Checkbox","parentId":1,"style":{"enabled":true,"varName":"pdfSingle","text":"One file","preferredSize":[0,0],"alignment":null,"helpTip":null,"checked":true}},"item-3":{"id":3,"type":"Checkbox","parentId":1,"style":{"enabled":true,"varName":"pdfMultiply","text":"Split by pages","preferredSize":[0,0],"alignment":null,"helpTip":null,"checked":true}},"item-4":{"id":4,"type":"Panel","parentId":0,"style":{"enabled":true,"varName":"dwgPanel","creationProps":{"borderStyle":"etched","su1PanelCoordinates":false},"text":"DWG","preferredSize":[200,0],"margins":10,"orientation":"column","spacing":10,"alignChildren":["left","top"],"alignment":null}},"item-5":{"id":5,"type":"Checkbox","parentId":4,"style":{"enabled":true,"varName":"dwgSingle","text":"One file","preferredSize":[0,0],"alignment":null,"helpTip":null,"checked":true}},"item-6":{"id":6,"type":"Panel","parentId":0,"style":{"enabled":true,"varName":"epsPanel","creationProps":{"borderStyle":"etched","su1PanelCoordinates":false},"text":"EPS","preferredSize":[200,0],"margins":10,"orientation":"column","spacing":10,"alignChildren":["left","top"],"alignment":null}},"item-7":{"id":7,"type":"Checkbox","parentId":6,"style":{"enabled":true,"varName":"epsMultiply","text":"Split by pages","preferredSize":[0,0],"alignment":null,"helpTip":null,"checked":true}},"item-8":{"id":8,"type":"Group","parentId":0,"style":{"enabled":true,"varName":"btnGroup","preferredSize":[200,0],"margins":0,"orientation":"row","spacing":10,"alignChildren":["right","center"],"alignment":null}},"item-9":{"id":9,"type":"Button","parentId":8,"style":{"enabled":true,"varName":"btnExport","text":"Export","justify":"center","preferredSize":[0,0],"alignment":null,"helpTip":null}},"item-10":{"id":10,"type":"Button","parentId":8,"style":{"enabled":true,"varName":"btnCancel","text":"Cancel","justify":"center","preferredSize":[0,0],"alignment":null,"helpTip":null}},"item-11":{"id":11,"type":"Checkbox","parentId":6,"style":{"enabled":true,"varName":"epsSingle","text":"One file","preferredSize":[0,0],"alignment":null,"helpTip":null}},"item-12":{"id":12,"type":"Panel","parentId":0,"style":{"enabled":true,"varName":"mainPanel","creationProps":{"borderStyle":"etched","su1PanelCoordinates":false},"text":"Options","preferredSize":[200,0],"margins":10,"orientation":"column","spacing":10,"alignChildren":["left","top"],"alignment":null}},"item-13":{"id":13,"type":"EditText","parentId":12,"style":{"enabled":true,"varName":"folderName","creationProps":{"noecho":false,"readonly":false,"multiline":false,"scrollable":false,"borderless":false,"enterKeySignalsOnChange":false},"softWrap":false,"text":"Export-PDF-DWG-EPS","justify":"left","preferredSize":[0,0],"alignment":"fill","helpTip":null}},"item-14":{"id":14,"type":"StaticText","parentId":12,"style":{"enabled":true,"varName":"labelFolderName","creationProps":{"truncate":"none","multiline":false,"scrolling":false},"softWrap":false,"text":"Folder name:","justify":"left","preferredSize":[0,0],"alignment":null,"helpTip":null}},"item-15":{"id":15,"type":"Checkbox","parentId":12,"style":{"enabled":true,"varName":"createOutlines","text":"Texts: create outlines","preferredSize":[0,0],"alignment":null,"helpTip":null,"checked":true}},"item-16":{"id":16,"type":"Checkbox","parentId":12,"style":{"enabled":true,"varName":"outlineStroke","text":"Paths: outline stroke","preferredSize":[0,0],"alignment":null,"helpTip":null,"checked":false}},"item-17":{"id":17,"type":"Checkbox","parentId":6,"style":{"enabled":true,"varName":"epsPlaceInFolder","text":"Place pages in folder PDF","preferredSize":[0,0],"alignment":null,"helpTip":null,"checked":true}},"item-18":{"id":18,"type":"Checkbox","parentId":1,"style":{"enabled":true,"varName":"pdfPlaceInFolder","text":"Place pages in folder PDF","preferredSize":[0,0],"alignment":null,"helpTip":null,"checked":true}}},"order":[0,12,14,13,15,16,1,2,3,18,6,11,7,17,4,5,8,10,9],"settings":{"importJSON":true,"indentSize":false,"cepExport":false,"includeCSSJS":true,"showDialog":true,"functionWrapper":false,"afterEffectsDockable":false,"itemReferenceList":"None"}}
  */

// DIALOG
// ======
  var dialog = new Window('dialog');
  dialog.text = 'File export';
  dialog.orientation = 'column';
  dialog.alignChildren = ['center', 'top'];
  dialog.spacing = 10;
  dialog.margins = 16;

// MAINPANEL
// =========
  var mainPanel = dialog.add(
      'panel', undefined, undefined, {name: 'mainPanel'});
  mainPanel.text = 'Options';
  mainPanel.preferredSize.width = 200;
  mainPanel.orientation = 'column';
  mainPanel.alignChildren = ['left', 'top'];
  mainPanel.spacing = 10;
  mainPanel.margins = 10;

  var labelFolderName = mainPanel.add(
      'statictext', undefined, undefined, {name: 'labelFolderName'});
  labelFolderName.text = 'Folder name:';

  var folderName = mainPanel.add('edittext {properties: {name: "folderName"}}');
  folderName.text = getFileName(app.activeDocument);
  folderName.alignment = ['fill', 'top'];

  var createOutlines = mainPanel.add(
      'checkbox', undefined, undefined, {name: 'createOutlines'});
  createOutlines.text = 'Texts: create outlines';
  createOutlines.value = true;

  var outlineStroke = mainPanel.add(
      'checkbox', undefined, undefined, {name: 'outlineStroke'});
  outlineStroke.text = 'Paths: outline stroke';

// PDFPANEL
// ========
  var pdfPanel = dialog.add('panel', undefined, undefined, {name: 'pdfPanel'});
  pdfPanel.text = 'PDF';
  pdfPanel.preferredSize.width = 200;
  pdfPanel.orientation = 'column';
  pdfPanel.alignChildren = ['left', 'top'];
  pdfPanel.spacing = 10;
  pdfPanel.margins = 10;

  var pdfSingle = pdfPanel.add(
      'checkbox', undefined, undefined, {name: 'pdfSingle'});
  pdfSingle.text = 'One file';
  pdfSingle.value = true;

  var pdfMultiply = pdfPanel.add(
      'checkbox', undefined, undefined, {name: 'pdfMultiply'});
  pdfMultiply.text = 'Split by pages';
  pdfMultiply.value = true;

  var pdfPlaceInFolder = pdfPanel.add(
      'checkbox', undefined, undefined, {name: 'pdfPlaceInFolder'});
  pdfPlaceInFolder.text = 'Place pages in folder PDF';
  pdfPlaceInFolder.value = true;

// EPSPANEL
// ========
  var epsPanel = dialog.add('panel', undefined, undefined, {name: 'epsPanel'});
  epsPanel.text = 'EPS';
  epsPanel.preferredSize.width = 200;
  epsPanel.orientation = 'column';
  epsPanel.alignChildren = ['left', 'top'];
  epsPanel.spacing = 10;
  epsPanel.margins = 10;

  var epsSingle = epsPanel.add(
      'checkbox', undefined, undefined, {name: 'epsSingle'});
  epsSingle.text = 'One file';

  var epsMultiply = epsPanel.add(
      'checkbox', undefined, undefined, {name: 'epsMultiply'});
  epsMultiply.text = 'Split by pages';
  epsMultiply.value = true;

  var epsPlaceInFolder = epsPanel.add(
      'checkbox', undefined, undefined, {name: 'epsPlaceInFolder'});
  epsPlaceInFolder.text = 'Place pages in folder PDF';
  epsPlaceInFolder.value = true;

// DWGPANEL
// ========
  var dwgPanel = dialog.add('panel', undefined, undefined, {name: 'dwgPanel'});
  dwgPanel.text = 'DWG';
  dwgPanel.preferredSize.width = 200;
  dwgPanel.orientation = 'column';
  dwgPanel.alignChildren = ['left', 'top'];
  dwgPanel.spacing = 10;
  dwgPanel.margins = 10;

  var dwgSingle = dwgPanel.add(
      'checkbox', undefined, undefined, {name: 'dwgSingle'});
  dwgSingle.text = 'One file';
  dwgSingle.value = true;

// BTNGROUP
// ========
  var btnGroup = dialog.add('group', undefined, {name: 'btnGroup'});
  btnGroup.preferredSize.width = 200;
  btnGroup.orientation = 'row';
  btnGroup.alignChildren = ['right', 'center'];
  btnGroup.spacing = 10;
  btnGroup.margins = 0;

  var btnCancel = btnGroup.add(
      'button', undefined, undefined, {name: 'btnCancel'});
  btnCancel.text = 'Cancel';

  var btnExport = btnGroup.add(
      'button', undefined, undefined, {name: 'btnExport'});
  btnExport.text = 'Export';

  btnExport.onClick = function() {
    const options = {
      folderName: folderName.text,
      createOutlines: createOutlines.value,
      outlineStroke: outlineStroke.value,
      pdfSingle: pdfSingle.value,
      pdfMultiply: pdfMultiply.value,
      pdfPlaceInFolder: pdfPlaceInFolder.value,
      epsSingle: epsSingle.value,
      epsMultiply: epsMultiply.value,
      epsPlaceInFolder: epsPlaceInFolder.value,
      dwgSingle: dwgSingle.value,
    };
    dialog.close();
    exportPdfDwgEps(options);
  };

  btnCancel.onClick = function() {
    dialog.close();
  };

  pdfMultiply.onClick = function() {
    pdfPlaceInFolder.enabled = pdfMultiply.value;
  };
  epsMultiply.onClick = function() {
    epsPlaceInFolder.enabled = epsMultiply.value;
  };

  dialog.onShow = function() {
    pdfPlaceInFolder.enabled = pdfMultiply.value;
    epsPlaceInFolder.enabled = epsMultiply.value;
  };

  dialog.show();
}

try {
  showDialog();
} catch (e) {
  errorSolver.check(e);
}
