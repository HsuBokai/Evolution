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

var Gene = function(total_level, init_len, init_theta, len_r, theta_t)
{
	this.total_level = total_level;
	this.init_len = init_len;
	this.init_theta = init_theta;
	this.len_r = len_r;
	this.theta_t = theta_t;
}

Gene.prototype.mutate = function()
{
	var change = Math.floor(Math.random() * 2) * 2 - 1;
	switch(Math.floor(Math.random() * 5)) {
		case 0:
			this.total_level += 1;
			break;
		case 1:
			this.init_len += change * 10;
			break;
		case 2:
			this.init_theta += change * 30;
			break;
		case 3:
			this.len_r *= ( 1 + change * 0.1 );
			break;
		case 4:
			this.theta_t += change * 50;
			break;
		default:
			console.log("err");
	}
}

var LifeTree = function(gene)
{
	this.gene = gene;
	this.growPoints = [];
	this.level_1_count = 0;
}

LifeTree.prototype.growLen = function(len)
{
	return len * this.gene.len_r;
}

LifeTree.prototype.growTheta = function(theta, count)
{
	return theta + this.gene.theta_t * count;
}

LifeTree.prototype.grow = function(paint)
{
	this.level_1_count ++;
	this.growPoints.push(new GrowPoint(1, 0, 0, this.growLen(this.gene.init_len), this.growTheta(this.gene.init_theta, this.level_1_count)));
	for(var i in this.growPoints){
		var p = this.growPoints[i];
		p.branch(paint);
		p.count ++;
		//console.log(p);
		this.growPoints.push(new GrowPoint(p.level + 1, p.next_x, p.next_y, this.growLen(p.len), this.growTheta(p.theta, p.count)));
	}
}

LifeTree.prototype.animate = function(paint)
{
	function sleep (time){
		return new Promise((resolve) => setTimeout(resolve, time));
	}
	for(var i=0; i<this.gene.total_level; ++i){
		sleep(i * 500).then(() => {this.grow(paint)})
	}
}


