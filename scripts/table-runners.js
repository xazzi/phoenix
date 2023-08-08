// This script is built requiring multiple mechanisms enabling it:
// - Enabled in the CSV.
// - Enabled in this code below.
// - The mark must be assigned to a product or press as well.

var items = [];

function run(context){
    // find all products on the layout, this adds them to the "items" array we can use later
    findProducts(context,context.root);

    // Loop through all products now stored in the items array
    for (var i=0;i<items.length;i++) {
        var product = items[i];

		// Pull the script information.
		var scripts = {
			name: context.jobs.productProperty(
				context.job.id,
				product.name,
				"Script Name"
			)
		}

		// If the script does not need to be ran, continue through the product.
		if(scripts.name != "TableRunner"){
			continue;
		}

		// Pull necessary parameters for the script.
		var parameters = {
			width: context.jobs.productProperty(
				context.job.id,
				product.name,
				"View Width"
			),
			height: context.jobs.productProperty(
				context.job.id,
				product.name,
				"View Height"
			)
		}

		// Create new Painter to draw with and clear the pen so there will be no stroke.
		var painter = new Painter(context.data);
			painter.clearPen();
			painter.clearBrush();

		// Create penColor from first color of layout
		var penColor = new Color()
			penColor.magenta = 100;
		
		// Create pen with penColor and thickness
		var pen = new Pen(penColor);
			pen.thickness = 1
			painter.pen = pen;

		var barRect

		// Draw the shape
		if(product.rotation == 90){
			barRect = new Rect(
				product.position.x-product.globalRect.width+((product.globalRect.width-(parameters.height*72))/2)-(.75*72),
				product.position.y+((product.globalRect.height-(parameters.width*72))/2)-(.75*72),
				(parameters.height*72)+(1.5*72),
				(parameters.width*72)+(1.5*72)
			);
		}else{
			barRect = new Rect(
				product.position.x+((product.globalRect.width-(parameters.width*72))/2)-(.75*72),
				product.position.y+((product.globalRect.height-(parameters.height*72))/2)-(.75*72),
				(parameters.width*72)+(1.5*72),
				(parameters.height*72)+(1.5*72)
			);
		}

		painter.draw(barRect);
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