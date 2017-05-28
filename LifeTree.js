var GrowPoint = function(level, x, y, len, theta)
{
	this.level = level;
	this.count = 0;
	this.x = x;
	this.y = y;
	this.len = len;
	this.theta = theta;
	var deg = Math.PI * theta / 180;
	this.next_x = x + len * Math.cos(deg);
	this.next_y = y + len * Math.sin(deg);
}

GrowPoint.prototype.branch = function(paint)
{
	var tool = new ToolLine();
	tool.setStartPoint(this.x, this.y);
	tool.setEndPoint(this.next_x, this.next_y);
	tool.draw(paint);
	
	var tool = new ToolLine();
	tool.setStartPoint(this.x, -this.y);
	tool.setEndPoint(this.next_x, -this.next_y);
	tool.draw(paint);
}

var LifeTree = function()
{
	this.total_level = 5;
	this.init_len = 50;
	this.init_theta = 30;
	this.len_r = 0.5;
	this.theta_t = 10;
	
	this.growPoints = [];
	this.level_1_count = 0;
}

LifeTree.prototype.grow = function(paint)
{
	this.level_1_count ++;
	this.growPoints.push(new GrowPoint(1, 0, 0, this.init_len, this.init_theta  + this.theta_t * this.level_1_count));
	for(var i in this.growPoints){
		var p = this.growPoints[i];
		p.branch(paint);
		p.count ++;
		console.log(p);
		this.growPoints.push(new GrowPoint(p.level + 1, p.next_x, p.next_y, p.len * this.len_r , p.theta + this.theta_t * p.count));
	}
}

LifeTree.prototype.animate = function(paint)
{
	function sleep (time){
		return new Promise((resolve) => setTimeout(resolve, time));
	}
	for(var i=0; i<this.total_level; ++i){
		sleep(i * 500).then(() => {this.grow(paint)})
	}
}


