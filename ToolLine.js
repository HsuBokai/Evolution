
var ToolLine = function()
{
    this.start_x = 0;
    this.start_y = 0;
    this.end_x = 10;
    this.end_y = 10;
}

ToolLine.prototype.setStartPoint = function(x, y)
{
    this.start_x = x;
    this.start_y = y;
}

ToolLine.prototype.setEndPoint = function(x, y)
{
    this.end_x = x;
    this.end_y = y;
}

ToolLine.prototype.draw = function(paint)
{
    paint.context.beginPath();
    //context.fillStyle = color;
    //context.lineWidth = 3;
    paint.context.moveTo(paint.x_axis(this.start_x), paint.y_axis(this.start_y));
    paint.context.lineTo(paint.x_axis(this.end_x), paint.y_axis(this.end_y));
    paint.context.stroke();
}
