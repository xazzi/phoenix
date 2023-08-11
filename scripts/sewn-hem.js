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
			),
            dynamic: context.jobs.productProperty(
				context.job.id,
				product.name,
				"Script Dynamic"
			).split(',')
		}

		// If the script does not need to be ran, continue through the product.
        if(!scripts.name.contains("SewnHem")){
			continue;
		}

        // Pull these variables from other places in the CSV
		var specs = {
			width: context.jobs.productProperty(
				context.job.id,
				product.name,
				"View Width"
			),
			height: context.jobs.productProperty(
				context.job.id,
				product.name,
				"View Height"
			),
            scale: {
                width: context.jobs.productProperty(
                    context.job.id,
                    product.name,
                    "Scale Width"
                )/100,
                height: context.jobs.productProperty(
                    context.job.id,
                    product.name,
                    "Scale Height"
                )/100,
            }
		}

		// Create new Painter to draw with and clear the pen so there will be no stroke.
      	var painter = new Painter(context.data);
			painter.clearPen();
			painter.clearBrush();

        // Create penColor from first color of layout
        var penColor = new Color()
            penColor.black = 30;
        
        // Create pen with penColor and thickness
        var pen = new Pen(penColor);
            pen.thickness = 1
            pen.dashPattern = [3,6];
            painter.pen = pen;

        // For now, skip the dashed line if it's not 100% scale. Adjust this later to account for the scale in the hem.
        if(specs.scale.width != 1 || specs.scale.height != 1){
            continue;
        }

        var barRect, offsetX, offsetY

        // Loop through the dynamic properties and define what is needed for the script.
        for(var k in scripts.dynamic){
            if(scripts.dynamic[k].contains("Offset")){
                offsetX = scripts.dynamic[k].split(':')[1]*72;
                offsetY = scripts.dynamic[k].split(':')[1]*72;
            }
        }

        // Draw the shape
        if(product.rotation == 90){
            barRect = new Rect(
                product.position.x-product.globalRect.width+offsetX,
                product.position.y+offsetY,
                product.globalRect.width-(offsetX*2),
                product.globalRect.height-(offsetY*2)
            );
        }else if(product.rotation == -90){
            barRect = new Rect(
                product.position.x+offsetX,
                product.position.y-product.globalRect.height+offsetY,
                product.globalRect.width-(offsetX*2),
                product.globalRect.height-(offsetY*2)
            );
        }else if(product.rotation == 180){
            barRect = new Rect(
                product.position.x-product.globalRect.width+offsetX,
                product.position.y-product.globalRect.height+offsetY,
                product.globalRect.width-(offsetX*2),
                product.globalRect.height-(offsetY*2)
            );
        }else{
            barRect = new Rect(
                product.position.x+offsetX,
                product.position.y+offsetY,
                product.globalRect.width-(offsetX*2),
                product.globalRect.height-(offsetY*2)
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