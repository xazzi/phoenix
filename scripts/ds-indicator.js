// This script is built requiring multiple mechanisms enabling it:
// - Enabled in the CSV.
// - Enabled in this code below.
// - The mark must be assigned to a product or press as well.

var items = [];
var enable = {
    top: false,
    bottom: false
}

function run(context){
    // find all products on the layout, this adds them to the "items" array we can use later
    findProducts(context, context.root);

    // loop through all products now stored in the items array
    for (var i=0;i<items.length;i++){
        var product = items[i];

        // Pull the script information.
		var scripts = {
			name: context.jobs.productProperty(
				context.job.id,
				product.name,
				"Script Name"
			),
            dynamic: context.jobs.productProperty(
				context.job.id,
				product.name,
				"Script Dynamic"
			).split(',')
		}

        // If the script does not need to be ran, continue through the product.
        if(!scripts.name.contains("DS-Indicators")){
            continue;
        }

        for(var k in scripts.dynamic){
            if(scripts.dynamic[k] == "DSI-T:true"){
                enable.top = true
            }
            if(scripts.dynamic[k] == "DSI-B:true"){
                enable.bottom = true
            }
        }
    }

    // Create new Painter to draw with and clear the pen so there will be no stroke.
    var painter = new Painter(context.data);
        painter.clearPen();
        painter.clearBrush();

    // Create penColor from first color of layout
    var penColor = new Color()
        penColor.cyan = 100;
        penColor.magenta = 0;
        penColor.yellow = 0;
        penColor.black = 0;
    
    // Create pen with penColor and thickness
    var pen = new Pen(penColor);
        painter.pen = pen;
        painter.setBrush(penColor);

    if(enable.top){
        // Draw the shape
        var topLeft = new Rect(
            context.root.globalRect.left + (.125*72),
            context.root.globalRect.height - (.375*72),
            .5*72,
            .25*72
        );
        painter.draw(topLeft);

        // Draw the shape
        var topRight = new Rect(
            context.root.globalRect.left + context.root.globalRect.width - (.625*72),
            context.root.globalRect.height - (.375*72),
            .5*72,
            .25*72
        );
        painter.draw(topRight);
    }

    if(enable.bottom){
        // Draw the shape
        var bottomLeft = new Rect(
            context.root.globalRect.left + (.125*72),
            context.root.globalRect.top - context.root.globalRect.height + (.125*72),
            .5*72,
            .25*72
        );
        painter.draw(bottomLeft);

        // Draw the shape
        var bottomRight = new Rect(
            context.root.globalRect.left + context.root.globalRect.width - (.625*72),
            context.root.globalRect.top - context.root.globalRect.height + (.125*72),
            .5*72,
            .25*72
        );
        painter.draw(bottomRight);
    }
    return true;
}

function findProducts(context,item) {
    // check to see if the input is a product, if so add to "items"
    if (item.type == "Product") {
        items.push(item)
    }
	
    // loop through to find child items of the input item
    for (var i = 0; i < item.children.size(); i++) {
	    // Get item type
		var type = item.children.get(i).type;

		// if item is a mark, ignore
		if (type == "Mark") {
		}

		// if item is a group of products, push each child item to "items" array
		else if (type == "Group") {
			for (var j=0;j<item.children.get(i).children.size();j++) {
				if (item.children.get(i).children.get(j).type == "Product") {
					items.push(item.children.get(i).children.get(j))
				}
			}
		}

		// if item is a product, push to our items array
		else if (type == "Product") {
			items.push(item.children.get(i))
		}

        // otherwise if there are children of this child,
        // put them back into this function to find their children
		else if (item.children.get(i).children.size() < 0) {
			findProducts(context,item.children.get(i))
		}
    }
    return;
}