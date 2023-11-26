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
			parameters: context.jobs.productProperty(
				context.job.id,
				product.name,
				"Script Parameters"
			),
            pockets: context.jobs.productProperty(
                context.job.id,
                product.name,
                "Script Pockets"
            ),
		}

		// If the script does not need to be ran, continue through the product.
        if(!scripts.name.contains("PolePocket")){
			continue;
		}

        // If there is no pocket data then skip the rest.
        if(scripts.pockets == null){
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

        var barRect

        var pocket = {
            size:{
                top: scripts.pockets.split(',')[0].split(':')[2],
                bottom: scripts.pockets.split(',')[1].split(':')[2],
                left: scripts.pockets.split(',')[2].split(':')[2],
                right: scripts.pockets.split(',')[3].split(':')[2]
            },
            side:{
                top: scripts.pockets.split(',')[0].split(':')[1] == "true",
                bottom: scripts.pockets.split(',')[1].split(':')[1] == "true",
                left: scripts.pockets.split(',')[2].split(':')[1] == "true",
                right: scripts.pockets.split(',')[3].split(':')[1] == "true"
            }
        }
        
        // If it has a top pocket (including top and bottom), then draw the shape and return out before drawing bottom.
        if(pocket.side.top){
            // Draw the shape
            if(product.rotation == 90){
                barRect = new Rect(
                    product.position.x-product.globalRect.width+(pocket.size.top*72)+(1*72),
                    product.position.y+((product.globalRect.height-(specs.width*specs.scale.width*72))/2),
                    (specs.height*specs.scale.height*72),
                    ((specs.width*specs.scale.width*72))
                );
            }else{
                barRect = new Rect(
                    product.position.x+((product.globalRect.width-(specs.width*specs.scale.width*72))/2),
                    product.position.y+(product.globalRect.height-(specs.height*specs.scale.height*72))-(pocket.size.top*72)-(1*72),
                    (specs.width*specs.scale.width*72),
                    (specs.height*specs.scale.height*72)
                );
            }
        }

        // If it's only a bottom pocket, then draw the shape.
        if(pocket.side.bottom && !pocket.side.top){
            // Draw the shape
            if(product.rotation == 90){
                barRect = new Rect(
                    product.position.x-(specs.height*72)-(pocket.size.bottom*72)-(1*72),
                    product.position.y+((product.globalRect.height-(specs.width*specs.scale.width*72))/2),
                    (specs.height*specs.scale.height*72),
                    ((specs.width*specs.scale.width*72))
                );
            }else{
                barRect = new Rect(
                    product.position.x+((product.globalRect.width-(specs.width*specs.scale.width*72))/2),
                    product.position.y+(pocket.size.bottom*72)+(1*72),
                    (specs.width*specs.scale.width*72),
                    (specs.height*specs.scale.height*72)
                );
            }
        }

        // Draw the dashed line based on the above settings.
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