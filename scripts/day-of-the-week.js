var items = [];
var id = null;

function run(context){
    // find all products on the layout, this adds them to the "items" array we can use later
    findProducts(context,context.root);

    // loop through all products now stored in the items array
    for (var i=0;i<items.length;i++){
        var product = items[i];

		var parameters = {
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
            dueDate: context.jobs.productProperty(
				context.job.id,
				product.name,
				"Due Date"
			),
		}
                
        var date = new Date(parameters.dueDate);
        var day = date.getDay()

        if(id == null || id < day){
            id = day
        }
    }

    var day, color, build

    switch(id){
        case 0:
            day = "Sunday";
            color = "Light Gray"
            build = [0,0,0,30]
        break;
        case 1:
            day = "Monday";
            color = "Pink"
            build = [0,35,0,0]
        break;
        case 2:
            day = "Tuesday";
            color = "Yellow"
            build = [0,0,75,0]
        break;
        case 3:
            day = "Wednesday";
            color = "Purple"
            build = [20,20,0,0]
        break;
        case 4:
            day = "Thursday";
            color = "Green"
            build = [30,0,30,0]
        break;
        case 5:
            day = "Friday";
            color = "Blue"
            build = [35,0,5,0]
        break;
        case 6:
            day = "Saturday";
            color = "Dark Gray"
            build = [0,0,0,70]
        break;
        default:
            day = "Unknown";
            color = "Black";
            build = [0,0,0,100]
    }

    // Create new Painter to draw with and clear the pen so there will be no stroke.
    var painter = new Painter(context.data);
        painter.clearPen();
        painter.clearBrush();

    // Create penColor from first color of layout
    var penColor = new Color()
        penColor.cyan = build[0];
        penColor.magenta = build[1];
        penColor.yellow = build[2];
        penColor.black = build[3];
    
    // Create pen with penColor and thickness
    var pen = new Pen(penColor);
        painter.pen = pen;
        painter.setBrush(penColor);

    // Draw the shape
    var barRect = new Rect(
        context.root.globalRect.left + (.125*72),
        context.root.globalRect.height - (.625*72),
        .5*72,
        .25*72
    );

    painter.draw(barRect);

    // Draw the shape
    var barRect = new Rect(
        context.root.globalRect.left + context.root.globalRect.width - (.625*72),
        context.root.globalRect.height - (.625*72),
        .5*72,
        .25*72
    );

    painter.draw(barRect);

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