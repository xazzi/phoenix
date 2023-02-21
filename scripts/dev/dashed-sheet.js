var items = [];

function run(context){
    // Get the jobs api for performing actions on jobs
	var jobs = context.jobs;
	var job = context.job;

    // find all products on the layout, this adds them to the "items" array we can use later
    findProducts(context,context.root);

    // loop through all products now stored in the items array
    for (var i=0;i<items.length;i++) {
        var product = items[i];

		var parameters = {
			width: context.jobs.productProperty(
				context.job.id,
				product.name,
				"ViewWidth"
			),
			height: context.jobs.productProperty(
				context.job.id,
				product.name,
				"ViewHeight"
			),
			finishingType: context.jobs.productProperty(
				context.job.id,
				product.name,
				"FinishingType"
			),
			dashOffset: context.jobs.productProperty(
				context.job.id,
				product.name,
				"Dash Offset"
			)
		}

		if(parameters.finishingType == "None"){
			continue;
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

		if(parameters.finishingType == "SewnHem"){
			var barRect, offsetX, offsetY

			var offsetX = parameters.dashOffset*72;
			var offsetY = parameters.dashOffset*72;

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