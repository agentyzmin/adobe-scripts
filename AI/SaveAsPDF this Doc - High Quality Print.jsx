function saveAsPDF() {
    var pdfFile = new File(app.activeDocument.path + "/" + app.activeDocument.name.split('.')[0] + '.pdf');
    var pdfOptions = new PDFSaveOptions();
    pdfOptions.compatibility = PDFCompatibility.ACROBAT5;
    pdfOptions.generateThumbnails = true;
    pdfOptions.preserveEditability = true;
    pdfOptions.preset = "[High Quality Print]";
    app.activeDocument.saveAs(pdfFile, pdfOptions);
}
saveAsPDF()