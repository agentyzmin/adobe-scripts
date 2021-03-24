function saveAsPDF() {
    var allDocumentsLength = app.documents.length;
    for (var i = allDocumentsLength - 1; i >= 0; i--) {
        app.activeDocument = app.documents[i]; // Not necessary, only required whn you want to make document as active.
        var doc = app.documents[i];
        var pdfFile = new File(doc.path + "/" + doc.name.split('.')[0] + '.pdf');
        var pdfOptions = new PDFSaveOptions();
        pdfOptions.compatibility = PDFCompatibility.ACROBAT5;
        pdfOptions.generateThumbnails = true;
        pdfOptions.preserveEditability = true;
        pdfOptions.preset = "[High Quality Print]";
        doc.saveAs(pdfFile, pdfOptions);
        doc.close(SaveOptions.DONOTSAVECHANGES);
    }
}

saveAsPDF();