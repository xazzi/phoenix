var items = [];
var day = {
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false
};

function run(context){
    // find all products on the layout, this adds them to the "items" array we can use later
    findProducts(context,context.root);

    // loop through all products now stored in the items array
    for (var i=0;i<items.length;i++) {
        var product = items[i];

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
            },
			finishingType: context.jobs.productProperty(
				context.job.id,
				product.name,
				"Finishing Type"
			),
            scripts: {
                enabled: context.jobs.productProperty(
                    context.job.id,
                    product.name,
                    "Enable Scripts"
                ),
                name: context.jobs.productProperty(
                    context.job.id,
                    product.name,
                    "Script Name"
                ),
                offset: context.jobs.productProperty(
                    context.job.id,
                    product.name,
                    "Sewn Hem Offset"
                ),
            }
		}

        if(parameters.scripts.enabled == "false"){
            continue;
        }

        if(true){
            day.monday = true;
        }
    }

    var layout = context.root;

    // Create new Painter to draw with and clear the pen so there will be no stroke.
    var painter = new Painter(context.data);
        painter.clearPen();
        painter.clearBrush();

    //if(parameters.scripts.name == "DayLabel"){
    if(true){
            // Create penColor from first color of layout
        var penColor = new Color()
        if(day.monday){
            penColor.cyan = 0;
            penColor.magenta = 35;
            penColor.yellow = 0;
            penColor.black = 0;
        }else{
            penColor.cyan = 0;
            penColor.magenta = 0;
            penColor.yellow = 0;
            penColor.black = 50;
        }
        
        // Create pen with penColor and thickness
        var pen = new Pen(penColor);
            painter.pen = pen;
            painter.setBrush(penColor);

        // Draw the shape
        var barRect = new Rect(
            layout.globalRect.left + (2.5*72),
            layout.globalRect.height - (.375*72),
            2*72,
            .25*72
        );

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