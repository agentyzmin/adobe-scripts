/**
 * @author Sergey Turulin sergey@turulin.ru
 */

/** @type {boolean} Show dialog with options: true or false */
const SHOW_DIALOG = true;

/** @type {number} Default value of margin */
const DEFAULT_MARGIN = 0;

/** @type {string} Default unit: mm or pt */
const DEFAULT_UNIT = 'mm';

/**
 * @type {boolean} Geometric bounds: true or false
 * If true — The bounds of the artwork excluding stroke width.
 * If false — The visible bounds of the artwork including stroke width.
 */
const GEOMETRIC_BOUNDS = false;


/**
 * @param {Object=} options
 * @param {string=} options.margin
 * @param {string=} options.unit
 * @param {boolean=} options.geometricBounds
 * @param options
 */
function createArtboardBySelectedV1(options) {

    options = options || {};
    options.margin = parseFloat(options.margin) || 0;
    options.unit = options.unit || 'mm';
    if (false !== options.geometricBounds) {
        options.geometricBounds = true;
    }

    if ('mm' !== options.unit && 'pt' !== options.unit) {
        alert('Error: \nUndefined unit "' + options.unit + '".\nCan be only "mm" or "pt".');
        return false;
    }

    var rect = {
        left: null,
        top: null,
        bottom: null,
        right: null,
    };
    var pageItem, bounds, left, top, right, bottom;
    for (var i = 0; i < selection.length; i++) {
        pageItem = selection[i];

        // Is selected pageItem guide?
        if ('PathItem' === pageItem.typename && pageItem.guides) {
            continue;
        }

        bounds = options.geometricBounds ? pageItem.geometricBounds : pageItem.visibleBounds;

        left = bounds[0];
        if (null === rect.left || rect.left > left) {
            rect.left = left;
        }

        top = bounds[1];
        if (null === rect.top || rect.top < top) {
            rect.top = top;
        }

        right = bounds[2];
        if (null === rect.right || rect.right < right) {
            rect.right = right;
        }

        bottom = bounds[3];
        if (null === rect.bottom || rect.top > bottom) {
            rect.bottom = bottom;
        }
    }

    const marginPt = new UnitValue(options.margin, options.unit).as('pt');

    try {
        app.activeDocument.artboards.add([
            rect.left - marginPt,
            rect.top + marginPt,
            rect.right + marginPt,
            rect.bottom - marginPt,
        ]);
    } catch (e) {
        alert('Error:\n' + e.message);
    }
}

function showDialog() {
    /*
    Code for Import https://scriptui.joonas.me — (Triple click to select):
    {"activeId":10,"items":{"item-0":{"id":0,"type":"Dialog","parentId":false,"style":{"enabled":true,"varName":null,"windowType":"Dialog","creationProps":{"su1PanelCoordinates":false,"maximizeButton":false,"minimizeButton":false,"independent":false,"closeButton":true,"borderless":false,"resizeable":false},"text":"Create artboard","preferredSize":[0,0],"margins":16,"orientation":"column","spacing":10,"alignChildren":["center","top"]}},"item-1":{"id":1,"type":"Panel","parentId":0,"style":{"enabled":true,"varName":"panelMargin","creationProps":{"borderStyle":"etched","su1PanelCoordinates":false},"text":"Margin","preferredSize":[150,0],"margins":10,"orientation":"column","spacing":10,"alignChildren":["left","top"],"alignment":null}},"item-2":{"id":2,"type":"EditText","parentId":9,"style":{"enabled":true,"varName":"margin","creationProps":{"noecho":false,"readonly":false,"multiline":false,"scrollable":false,"borderless":false,"enterKeySignalsOnChange":false},"softWrap":false,"text":"20","justify":"left","preferredSize":[40,0],"alignment":null,"helpTip":null}},"item-4":{"id":4,"type":"RadioButton","parentId":5,"style":{"enabled":false,"varName":"visibleBounds","text":"Visible","preferredSize":[0,0],"alignment":null,"helpTip":null,"checked":false}},"item-5":{"id":5,"type":"Panel","parentId":0,"style":{"enabled":true,"varName":"groupBounds","creationProps":{"borderStyle":"etched","su1PanelCoordinates":false},"text":"Bounds","preferredSize":[150,0],"margins":10,"orientation":"column","spacing":10,"alignChildren":["left","top"],"alignment":null}},"item-6":{"id":6,"type":"RadioButton","parentId":5,"style":{"enabled":true,"varName":"geometricBounds","text":"geometric","preferredSize":[0,0],"alignment":null,"helpTip":null,"checked":true}},"item-7":{"id":7,"type":"Group","parentId":0,"style":{"enabled":true,"varName":"groupButtons","preferredSize":[150,0],"margins":0,"orientation":"row","spacing":10,"alignChildren":["right","center"],"alignment":null}},"item-8":{"id":8,"type":"Button","parentId":7,"style":{"enabled":true,"varName":"buttonCreate","text":"Create","justify":"center","preferredSize":[0,0],"alignment":null,"helpTip":null}},"item-9":{"id":9,"type":"Group","parentId":1,"style":{"enabled":true,"varName":"groupMargin","preferredSize":[0,0],"margins":0,"orientation":"row","spacing":10,"alignChildren":["left","center"],"alignment":null}},"item-10":{"id":10,"type":"DropDownList","parentId":9,"style":{"enabled":true,"varName":"unit","text":"DropDownList","listItems":"mm,pt","preferredSize":[0,0],"alignment":null,"selection":0,"helpTip":null}}},"order":[0,1,9,2,10,5,6,4,7,8],"settings":{"importJSON":true,"indentSize":false,"cepExport":false,"includeCSSJS":true,"showDialog":true,"functionWrapper":false,"afterEffectsDockable":false,"itemReferenceList":"None"}}
    */

// DIALOG
// ======
    var dialog = new Window("dialog");
    dialog.text = "Create artboard";
    dialog.orientation = "column";
    dialog.alignChildren = ["center", "top"];
    dialog.spacing = 10;
    dialog.margins = 16;

// PANELMARGIN
// ===========
    var panelMargin = dialog.add("panel", undefined, undefined, {name: "panelMargin"});
    panelMargin.text = "Margin";
    panelMargin.preferredSize.width = 150;
    panelMargin.orientation = "column";
    panelMargin.alignChildren = ["left", "top"];
    panelMargin.spacing = 10;
    panelMargin.margins = 10;

// GROUPMARGIN
// ===========
    var groupMargin = panelMargin.add("group", undefined, {name: "groupMargin"});
    groupMargin.orientation = "row";
    groupMargin.alignChildren = ["left", "center"];
    groupMargin.spacing = 10;
    groupMargin.margins = 0;

    var margin = groupMargin.add('edittext {properties: {name: "margin"}}');
    margin.text = "20";
    margin.preferredSize.width = 40;

    var unit_array = ["mm", "pt"];
    var unit = groupMargin.add("dropdownlist", undefined, undefined, {name: "unit", items: unit_array});
    unit.selection = 0;

// GROUPBOUNDS
// ===========
    var groupBounds = dialog.add("panel", undefined, undefined, {name: "groupBounds"});
    groupBounds.text = "Bounds";
    groupBounds.preferredSize.width = 150;
    groupBounds.orientation = "column";
    groupBounds.alignChildren = ["left", "top"];
    groupBounds.spacing = 10;
    groupBounds.margins = 10;

    var geometricBounds = groupBounds.add("radiobutton", undefined, undefined, {name: "geometricBounds"});
    geometricBounds.text = "Geometric";

    var visibleBounds = groupBounds.add("radiobutton", undefined, undefined, {name: "visibleBounds"});
    visibleBounds.text = "Visible";

// GROUPBUTTONS
// ============
    var groupButtons = dialog.add("group", undefined, {name: "groupButtons"});
    groupButtons.preferredSize.width = 150;
    groupButtons.orientation = "row";
    groupButtons.alignChildren = ["right", "center"];
    groupButtons.spacing = 10;
    groupButtons.margins = 0;

    var buttonCreate = groupButtons.add("button", undefined, undefined, {name: "buttonCreate"});
    buttonCreate.text = "Create";

    buttonCreate.onClick = function () {
        const options = {
            margin: margin.text,
            unit: unit.selection.toString(),
            geometricBounds: geometricBounds.value,
        };
        dialog.close();
        createArtboardBySelectedV1(options);
    }

    dialog.onShow = function () {
        margin.text = DEFAULT_MARGIN;
        for (var i = 0; unit.items.length; i++) {
            if (DEFAULT_UNIT === unit.items[i].text) {
                unit.selection = i;
                break;
            }
        }
        geometricBounds.value = GEOMETRIC_BOUNDS;
        visibleBounds.value = !GEOMETRIC_BOUNDS;
    }

    dialog.show();
}

function run() {
    if (0 === app.documents.length) {
        alert('Error: \nNo documents opened.');
        return false;
    }

    if (0 === selection.length) {
        alert('Error: \nNothing selected.');
        return false;
    }

    if (SHOW_DIALOG) {
        showDialog();
    } else {
        const options = {
            margin: DEFAULT_MARGIN,
            unit: DEFAULT_UNIT,
            geometricBounds: GEOMETRIC_BOUNDS,
        };
        createArtboardBySelectedV1(options);
    }
}

run();
