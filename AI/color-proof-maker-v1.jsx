// ABOUT
// 
// 
// 
// v.1.0

// AUTHOR
// 2020, Aleksandr Kolodko, alexkolodko.com

// LICENCE CC-BY 

/////////////////////////////////////////////////////////////////



const PT_TO_MM = 2.8346456692913;
const EM_TO_MM = 0.3514598035146;


// GLOBAL VARIABLES
doc = app.activeDocument;

// Шрифт и размер в pt
FONT = "Helvetica-Bold";
FONTSIZE = 10;

// Шаг краски
STEP = 3;

// ±
QV = 8;

// Количество вариантов
QTY = 10;


// Отступ между цветами в мм
MARGIN = 2;

// Отступ до палитры в мм
PALLETE_MARGIN = 8;

// Размер образца цвета в мм
rectW = 40;
rectH = 20;

// Определяем белый и черный цвет для надписей
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


    // changedColor = selectedOBJ_COLOR;
    
    // colorA = [
    //     "changedColor.cyan",
    //     "changedColor.magenta",
    //     "changedColor.yellow",
    //     "changedColor.blac"
    // ];


    // for (j=0; j < 4; j++) {        

    //     drawLabel(labelPositionY, labelPositionX - (rectH * PT_TO_MM * j) - (MARGIN * PT_TO_MM * j) - (5 * PT_TO_MM * j), "Pallete " + colorN[j]);
        
    //     border = colorA[j] + QV;

    //         for (i=0;i <= QTY;i++) {
    //             if(colorA[j] > border || colorA[j] > 100){break;}
    //             colorA[j] = colorA[j] + STEP;
    //             drawRect(labelPositionY + (MARGIN * PT_TO_MM * i) + (rectW * PT_TO_MM * i), 0, changedColor);
    //         }

    // }






    // 
    // drawLabel(labelPositionY, labelPositionX, "Pallete C");

    // border = selectedOBJ_COLOR.cyan + QV;
    // for (i=0;i <= QTY;i++) {
    //     if(changedColor.cyan >= border || changedColor.cyan > 100){break;}
    //     changedColor.cyan = changedColor.cyan + STEP;
    //     drawRect(labelPositionY + (MARGIN * PT_TO_MM * i) + (rectW * PT_TO_MM * i), 0, changedColor);
    // }


    // drawLabel(labelPositionY, labelPositionX - (rectH * PT_TO_MM) - (MARGIN * PT_TO_MM) - (5 * PT_TO_MM), "Pallete M");

    // border = selectedOBJ_COLOR.magenta + QV;
    // for (i=0;i <= QTY;i++) {
    //     if(changedColor.magenta >= border || changedColor.magenta > 100){break;}
    //     changedColor.magenta = changedColor.magenta + STEP;
    //     drawRect(labelPositionY + (MARGIN * PT_TO_MM * i) + (rectW * PT_TO_MM * i), 0 - (rectH * PT_TO_MM) - (MARGIN * PT_TO_MM) - (5 * PT_TO_MM), changedColor);
    // }

    // drawLabel(labelPositionY, labelPositionX - (rectH * PT_TO_MM * 2) - (MARGIN * PT_TO_MM * 2) - (10 * PT_TO_MM), "Pallete Y");

    // border = selectedOBJ_COLOR.yellow + QV;
    // for (i=0;i <= QTY;i++) {
    //     if(changedColor.yellow >= border || changedColor.yellow > 100){break;}
    //     changedColor.yellow = changedColor.yellow + STEP;
    //     drawRect(labelPositionY + (MARGIN * PT_TO_MM * i) + (rectW * PT_TO_MM * i), 0 - (rectH * PT_TO_MM * 2) - (MARGIN * PT_TO_MM * 2) - (10 * PT_TO_MM), changedColor);
    // }


    // drawLabel(labelPositionY, labelPositionX - (rectH * PT_TO_MM * 3) - (MARGIN * PT_TO_MM * 3) - (15 * PT_TO_MM), "Pallete K");

    // border = selectedOBJ_COLOR.black + QV;
    // for (i=0;i <= QTY;i++) {
    //     if(changedColor.black >= border || changedColor.black > 100){break;}
    //     changedColor.black = changedColor.black + STEP;
    //     drawRect(labelPositionY + (MARGIN * PT_TO_MM * i) + (rectW * PT_TO_MM * i), 0 - (rectH * PT_TO_MM * 3) - (MARGIN * PT_TO_MM * 3) - (15 * PT_TO_MM), changedColor);
    // }





    alert(
        "Color Palletes" + "\n" +
        "C:" + variants_C +"\n" +
        "M:" + variants_M +"\n" +
        "Y:" + variants_Y +"\n" +
        "K:" + variants_K
        );

    // alert(variants_C.join('\n'));
    // alert(variants_C[1]);


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
    
    for (var i = 0; i < c.length; i++) {
        selectedOBJ_COLOR.cyan = c[i];
        drawRect (
            xc + (MARGIN * PT_TO_MM * i) + (rectW * PT_TO_MM * i),
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
    for (var ii = 0; ii < m.length; ii++) {
        selectedOBJ_COLOR.cyan = c[0];    ///////////// <-------------
        selectedOBJ_COLOR.magenta = m[ii];
        drawRect (
            xc + (MARGIN * PT_TO_MM * ii) + (rectW * PT_TO_MM * ii), 
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
    for (var iii = 0; iii < y.length; iii++) {
        selectedOBJ_COLOR.magenta = m[0];    ///////////// <-------------
        selectedOBJ_COLOR.yellow = y[iii];
        drawRect (
            xc + (MARGIN * PT_TO_MM * iii) + (rectW * PT_TO_MM * iii),
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
    for (var iiii = 0; iiii < k.length; iiii++) {
        selectedOBJ_COLOR.yellow = y[0];    ///////////// <-------------        
        selectedOBJ_COLOR.black = k[iiii];
        drawRect (
            xc + (MARGIN * PT_TO_MM * iiii) + (rectW * PT_TO_MM * iiii),
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

    // return [color, aMin, aMax];
    // var NewArr = color.bind(aMin).bind(aMax);
    // return NewArr;


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



// // Draw random pallete
// function drawRandomPallete (x, y) {
//     for (var iii = 0; iii < QTY; iii++) {
//         rectX = x + (rectW * PT_TO_MM * iii) + (MARGIN * PT_TO_MM * iii);
//         rectY = y;
//         colorX = randomColor();
//         drawRect (rectX, rectY, colorX);
//     }
// }



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
function addProofLayer() {
    artLayer = doc.layers.add();
    artLayer.index = 0;
    artLayer.name = "ProofPallete";
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








// // Random color
// function randomColor (newCMYKColor) {
//     newCMYKColor = new CMYKColor();
//     newCMYKColor.cyan    = getRandomInt(0,100);
//     newCMYKColor.magenta = getRandomInt(0,100);
//     newCMYKColor.yellow  = getRandomInt(0,100);
//     // newCMYKColor.black   = getRandomInt(0,100);
//     return newCMYKColor;
// }

// function getRandomInt(min, max) {
//     min = Math.ceil(min);
//     max = Math.floor(max);
//     return Math.floor(Math.random() * (max - min)) + min; //Включно з мінімальним та виключаючи максимальне значення 
// }




// function getColorValues(color)
// {
//         if(color.typename)
//         {
//             switch(color.typename)
//             {
//                 case "CMYKColor":
//                     if(displayAs == "CMYKColor"){
//                         return ([Math.floor(color.cyan),Math.floor(color.magenta),Math.floor(color.yellow),Math.floor(color.black)]);}
//                     else
//                     {
//                         color.typename="RGBColor";
//                         return  [Math.floor(color.red),Math.floor(color.green),Math.floor(color.blue)] ;
                       
//                     }
//                 case "RGBColor":
                   
//                    if(displayAs == "CMYKColor"){
//                         return rgb2cmyk(Math.floor(color.red),Math.floor(color.green),Math.floor(color.blue));
//                    }else
//                     {
//                         return  [Math.floor(color.red),Math.floor(color.green),Math.floor(color.blue)] ;
//                     }
//                 case "GrayColor":
//                     if(displayAs == "CMYKColor"){
//                         return rgb2cmyk(Math.floor(color.gray),Math.floor(color.gray),Math.floor(color.gray));
//                     }else{
//                         return [Math.floor(color.gray),Math.floor(color.gray),Math.floor(color.gray)];
//                     }
//                 case "SpotColor":
//                     return getColorValues(color.spot.color);
//             }    
//         }
//     return "Non Standard Color Type";
// }





// function unGroupItems(items) {
//     for ( var i = 0; i < items.length; i++ ) {
//         var item = items[i];
//         if (item.typename == "GroupItem") {
//             items.splice(i, 1);
//             var groupContent = [];
//             for ( var j = 0; j < item.pathItems.length; j++ ) {
//                 groupContent.push(item.pathItems[j])
//             }
//             for ( var j = 0; j < item.compoundPathItems.length; j++ ) {
//                 groupContent.push(item.compoundPathItems[j])
//             }
//             for ( var j = 0; j < item.groupItems.length; j++ ) {
//                 groupContent.push(item.groupItems[j]);
//             }
//             for ( var j = 0; j < groupContent.length; j++) {
//                 items.splice(i+1, 0, groupContent[j]);
//             }
//         }
//     }
//     return items;
// }



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

