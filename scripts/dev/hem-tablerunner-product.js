var items = [];

function run(context){
    // Get the jobs api for performing actions on jobs
    var product = context;

	// Create new Painter to draw with and clear the pen so there will be no stroke.
	var painter = new Painter(context.data);
		painter.clearPen();
		painter.clearBrush();
	
	// Create penColor from first color of layout
	var penColor = new Color(30, 30, 30, 0);

	// Create pen with penColor and thickness
	var pen = new Pen(penColor);
		pen.thickness = 1
		//pen.dashPattern = [3,6]
		painter.pen = pen

	// Set the view size
	var view = {
		width: context.jobs.productProperty(
			context.job.id,
			product.name,
			"ViewWidth"
		),
		height: context.jobs.productProperty(
			context.job.id,
			product.name,
			"ViewHeight"
		)
	}

	// Set the offset
	var offset = {
		x: (product.globalRect.width-(view.width*72))/2,
		y: (product.globalRect.height-(view.height*72))/2
	}

	// Draw the shape
	var barRect = new Rect(product.globalRect.left + (offset.x/2), product.globalRect.bottom + (offset.y/2), (view.width*72)+(1.5*72), (view.height*72)+(1.5*72));
	
	painter.draw(barRect);

    //return true; //?????
    
}