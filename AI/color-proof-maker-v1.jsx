// ABOUT
// Скрипт, який генерує варіанти кольорів для цифрового друку у CMYK для виділеного об’єкта. 
// 
// v.1.0

// AUTHOR
// 2020, Aleksandr Kolodko, alexkolodko.com


const PT_TO_MM = 2.8346456692913;
const EM_TO_MM = 0.3514598035146;


// GLOBAL VARIABLES
doc = app.activeDocument;

// Font name and size
FONT = "Helvetica-Bold";
FONTSIZE = 10;

// Colot Step
STEP = 5;

// Range of color
QV = 15;

// Количество вариантов
QTY = 10;

// Margon between swatches
MARGIN = 2;

// Margin between original and swatches
PALLETE_MARGIN = 8;

// Swatch size (width & height) in mm
rectW = 40;
rectH = 20;

// Check balck & white colors for swatch name
black = new CMYKColor();
white = new CMYKColor();
black.black = 100;
white.black = 0;


colorN = [
    "cyan",
    "magenta",
    "yellow",
    "black"
];


// GET COLOR OF SELECTED OBJECT
theSelect = doc.selection;
if (theSelect.length == 0)
    {
    alert("No selected objects");
} else {

    getColorFromSelection();
    // deleteProofLayer();
    addProofLayer();

    // Calculate colors
    variants_C = calculateColors(selectedOBJ_COLOR.cyan);
    variants_M = calculateColors(selectedOBJ_COLOR.magenta);
    variants_Y = calculateColors(selectedOBJ_COLOR.yellow);
    variants_K = calculateColors(selectedOBJ_COLOR.black);


    firstCoordX = 0;
    firstCoordY = 0;
    labelPositionX = ((rectH/10) * PT_TO_MM) + FONTSIZE + (rectH * PT_TO_MM);
    labelPositionY = (rectW * PT_TO_MM) + (PALLETE_MARGIN * PT_TO_MM);

    //Draw original 
    drawLabel(firstCoordY * PT_TO_MM, labelPositionX, "Original");
    drawRect (firstCoordY * PT_TO_MM, firstCoordX * PT_TO_MM, selectedOBJ_COLOR);

    // alert(
    //     "Color Palletes" + "\n" +
    //     "C:" + variants_C +"\n" +
    //     "M:" + variants_M +"\n" +
    //     "Y:" + variants_Y +"\n" +
    //     "K:" + variants_K
    //     );

    drawPallete(
        variants_C,
        variants_M,
        variants_Y,
        variants_K,
        labelPositionY,
        labelPositionX
        );

    selectedOBJ_COLOR.cyan    = variants_C[0];
    selectedOBJ_COLOR.magenta = variants_M[0];
    selectedOBJ_COLOR.yellow  = variants_Y[0];
    selectedOBJ_COLOR.black   = variants_K[0];
}


function drawPallete(c,m,y,k,xc,yc) {

var n = 0;

if (c[0]>0) {
    drawLabel(
        xc, 
        yc, 
        "Pallete C"
        );
    
    for (var i = 1; i < c.length; i++) {
        selectedOBJ_COLOR.cyan = c[i];
        drawRect (
            xc + (MARGIN * PT_TO_MM * (i-1)) + (rectW * PT_TO_MM * (i-1)),
            firstCoordX * n,
            selectedOBJ_COLOR);
        }
    n++;
}

if (m[0]>0) {
    drawLabel(
        xc, 
        yc - (rectH * PT_TO_MM * n) - (MARGIN * PT_TO_MM * n) - (5 * PT_TO_MM * n), 
        "Pallete M"
        );
    for (var ii = 1; ii < m.length; ii++) {
        selectedOBJ_COLOR.cyan = c[0];    ///////////// <-------------
        selectedOBJ_COLOR.magenta = m[ii];
        drawRect (
            xc + (MARGIN * PT_TO_MM * (ii-1)) + (rectW * PT_TO_MM * (ii-1)), 
            firstCoordX - (rectH * PT_TO_MM * n) - (MARGIN * PT_TO_MM * n) - (5 * PT_TO_MM * n),
            selectedOBJ_COLOR);
    }
    n++;
}


if (y[0]>0) {
    drawLabel(
        xc, 
        yc - (rectH * PT_TO_MM * n) - (MARGIN * PT_TO_MM * n) - (5 * PT_TO_MM * n),
        "Pallete Y"
        );
    for (var iii = 1; iii < y.length; iii++) {
        selectedOBJ_COLOR.magenta = m[0];    ///////////// <-------------
        selectedOBJ_COLOR.yellow = y[iii];
        drawRect (
            xc + (MARGIN * PT_TO_MM * (iii-1)) + (rectW * PT_TO_MM * (iii-1)),
            firstCoordX - (rectH * PT_TO_MM * n) - (MARGIN * PT_TO_MM * n) - (5 * PT_TO_MM * n),
            selectedOBJ_COLOR
            );
    }
    n++;
}

if (k[0]>0) {
    drawLabel(
        xc, 
        yc - (rectH * PT_TO_MM * n) - (MARGIN * PT_TO_MM * n) - (5 * PT_TO_MM * n),
        "Pallete K"
        );
    for (var iiii = 1; iiii < k.length; iiii++) {
        selectedOBJ_COLOR.yellow = y[0];    ///////////// <-------------        
        selectedOBJ_COLOR.black = k[iiii];
        drawRect (
            xc + (MARGIN * PT_TO_MM * (iiii-1)) + (rectW * PT_TO_MM * (iiii-1)),
            firstCoordX - (rectH * PT_TO_MM * n) - (MARGIN * PT_TO_MM * n) - (5 * PT_TO_MM * n),
            selectedOBJ_COLOR
            );
    }
    n++;
}


}



function getColorFromSelection () {
    selectedOBJ = doc.selection[0];
    selectedOBJ_COLOR = selectedOBJ.fillColor;

    selectedOBJ_COLOR.cyan = Math.round(selectedOBJ_COLOR.cyan, 0);
    selectedOBJ_COLOR.magenta = Math.round(selectedOBJ_COLOR.magenta, 0);
    selectedOBJ_COLOR.yellow = Math.round(selectedOBJ_COLOR.yellow, 0);
    selectedOBJ_COLOR.black = Math.round(selectedOBJ_COLOR.black, 0);  

    return selectedOBJ_COLOR;
}


function calculateColors (color){
    var aMin = [];
    var aMax = [];

    // Skip for 0 color
    if (color == 0) {
        return [0];
    }

    var calcMin = color;
    var calcMax = color;

    var iter = QV/STEP;
    var iterMin = Math.floor(color / STEP);
    var iterMax = Math.floor((100-color)/STEP);
    
    for (var i = 0; i < iter; i++) {
        calcColorMin = calcMin - STEP;
        calcMin = calcMin - STEP;
            if (calcMin < 0) {break;}
        var arrMin = aMin.push(calcColorMin);        
    }
  
    for (var ii = 0; ii < iter; ii++)
      {
        calcColorMax = calcMax + STEP;
        calcMax = calcMax + STEP;
            if (calcMax > 100) {break;}
        var arrMax = aMax.push(calcColorMax); 
      }   

    for (var NewArr=aMin, iii=0; iii < aMax.length; iii++) aMin.push(aMax[iii]);
    NewArr.unshift(color);
    return NewArr;


}



//  Draw label
function drawLabel (textX, textY, text) {
    textLabel = doc.textFrames.add();
    textLabel.contents = text;
    textLabel.position = [textX,textY];
    textLabel.textRange.fillColor = black;
    textLabel.textRange.characterAttributes.size = FONTSIZE;
    textLabel.textRange.characterAttributes.textFont = app.textFonts.getByName(FONT);
}




// Deletes all layers whose name begins with "ProofPallete" in all open documents   
function deleteProofLayer () {
    var layersDeleted = 0;
    for (var i = 0; i < app.documents.length; i++) {
      var targetDocument = app.documents[i];
      var layerCount = targetDocument.layers.length;
    
      // Loop through layers from the back, to preserve index
      // of remaining layers when we remove one
      for (var ii = layerCount - 1; ii >= 0; ii--) {
        var targetLayer = targetDocument.layers[ii];
        var layerName = new String(targetLayer.name);
        if (layerName.indexOf("ProofPallete") == 0) {
          targetDocument.layers[ii].remove();
          layersDeleted++;
        }
      }
    }
}


// Add layer "ProofPallete"    
function addProofLayer(layername) {
    artLayer = doc.layers.add();
    artLayer.index = 0;
    artLayer.name = "ProofPallete-" + 
    selectedOBJ_COLOR.cyan + "-" +
    selectedOBJ_COLOR.magenta + "-" +
    selectedOBJ_COLOR.yellow + "-" +
    selectedOBJ_COLOR.black;
}


// Draw color rectangle with color value
function drawRect (y, x, color) {

    // Draw rectangle
    rect = doc.activeLayer.pathItems.rectangle(x, y, rectW * PT_TO_MM, rectH * -1 * PT_TO_MM);
    rect.fillColor = color;
    
    //Create a new text frame and assign it to the variable "myTextFrame"
    myTextFrame = doc.textFrames.add();
    
    // Set the contents and position of the text frame
    myTextFrame.position = [y + rectW * PT_TO_MM / 20, x + rectH * PT_TO_MM - (rectH * PT_TO_MM / 20)];
    myTextFrame.textRange.fillColor = is_dark(color)? white : black;
    myTextFrame.textRange.characterAttributes.size = FONTSIZE;
    myTextFrame.textRange.characterAttributes.textFont = app.textFonts.getByName(FONT);
    
    myTextFrame.contents = (
        Math.round(color.cyan, 0) + ' ' + 
        Math.round(color.magenta, 0) + ' ' + 
        Math.round(color.yellow, 0) + ' ' + 
        Math.round(color.black, 0)
        );

    // Group text with rectangle
    var rectGroup = doc.groupItems.add();
    myTextFrame.move (rectGroup,ElementPlacement.PLACEATEND);
    rect.move (rectGroup,ElementPlacement.PLACEATEND);
}



// Check brightness of color
function is_dark(color){
       if(color.typename)
        {
            switch(color.typename)
            {
                case "CMYKColor":
                    return (color.black>30 || color.cyan>35 || color.magenta>35) ? true : false;
                    // return (color.black>30 || (color.cyan>50 && color.magenta>50)) ? true : false;
                case "RGBColor":
                    return (color.red<100  && color.green<100 ) ? true : false;
                case "GrayColor":
                    return color.gray > 50 ? true : false;
                case "SpotColor":
                    return is_dark(color.spot.color);
                
                return false;
            }
        }
}

