var GrowPoint = function(level, x, y, len, theta, lineWidth, r, g, b)
{
	this.level = level;
	this.count = 0;
	this.x = x;
	this.y = y;
	this.len = len;
	this.theta = theta;
	this.next_x = x + len * Math.cos(theta);
	this.next_y = y + len * Math.sin(theta);
	this.lineWidth = lineWidth;
	this.r = r;
	this.g = g;
	this.b = b;
}

GrowPoint.prototype.branch = function(paint)
{
	paint.context.lineWidth = this.lineWidth;
	paint.context.strokeStyle = "rgb(" + this.r + "," + this.g + "," + this.b + ")";

	var tool = new ToolLine();
	tool.setStartPoint(this.x, this.y);
	tool.setEndPoint(this.next_x, this.next_y);
	tool.draw(paint);
	
	var tool = new ToolLine();
	tool.setStartPoint(this.x, -this.y);
	tool.setEndPoint(this.next_x, -this.next_y);
	tool.draw(paint);
}

var Gene = function(total_level, init_len, len_r, len_t, init_theta, theta_t)
{
	this.total_level = total_level;
	this.init_len = init_len;
	this.len_r = len_r;
	this.len_t = len_t;
	this.init_theta = init_theta;
	this.theta_t = theta_t;
	this.r = 0;
	this.g = 0;
	this.b = 0;
}

Gene.prototype.setGene = function(gene)
{
	this.total_level = gene.total_level;
	this.init_len = gene.init_len;
	this.len_r = gene.len_r;
	this.len_t = gene.len_t;
	this.init_theta = gene.init_theta;
	this.theta_t = gene.theta_t;
	this.r = gene.r;
	this.g = gene.g;
	this.b = gene.b;
}

Gene.prototype.mutate = function()
{
	var change = Math.floor(Math.random() * 2) * 2 - 1;
	switch(Math.floor(Math.random() * 7)) {
		case 0:
			this.total_level += change;
			if (this.total_level <= 0) {
				this.total_level = 1;
			}
			break;
		case 1:
			this.init_len += change * 10;
			break;
		case 2:
			this.len_r *= ( 1 + change * 0.1 );
			break;
		case 3:
			this.len_t += change * 0.1;
			break;
		case 4:
			this.init_theta += change * 0.1;
			break;
		case 5:
			this.theta_t += change * 0.1;
			break;
		case 6:
			switch(Math.floor(Math.random() * 3)) {
				case 0: this.r = (change + 1) * 64; break;
				case 1: this.g = (change + 1) * 64; break;
				case 2: this.b = (change + 1) * 64; break;
			}
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

LifeTree.prototype.growLen = function(len, count)
{
	return len * Math.abs(Math.cos(this.gene.len_t * count)) * this.gene.len_r;
}

LifeTree.prototype.growTheta = function(theta, count)
{
	return Math.PI * Math.cos(theta + this.gene.theta_t * (count+1));
}

LifeTree.prototype.growWidth = function(level)
{
	//return (level > 10) ? 0.5 : 2.1 - level * 0.2;
	return 1;
}

LifeTree.prototype.initGrowPoint = function()
{
	var count = this.level_1_count;
	var len = this.gene.init_len;
	var theta = this.gene.init_theta;
	var level = 1;

	if (count >= 4) return;
	var size = this.growLen(len, count);
	var th = this.growTheta(theta, count);
	var width = this.growWidth(level);
	var r = this.gene.r;
	var g = this.gene.g;
	var b = this.gene.b;
	//if (count == 1) r = 128;
	//if (count == 2) g = 128;
	//if (count == 3) b = 128;
	this.level_1_count ++;
	this.growPoints.push(new GrowPoint(level, 0, 0, size, th, width, r, g, b));
}

LifeTree.prototype.nextGrowPoint = function(p, paint)
{
	var count = p.count;
	var len = p.len;
	var theta = p.theta;
	var level = p.level + 1;

	if (0 == level % 2) if (count >= 1) return;
	var size = this.growLen(len, count);
	var th = (count >= 2) ? theta : this.growTheta(theta, count);
	var width = this.growWidth(level);
	var r = p.r + 16;
	var g = p.g + 16;
	var b = p.b + 16;
	if (size < 5) {
		return;
	} else {
		p.count ++;
		this.growPoints.push(new GrowPoint(level, p.next_x, p.next_y, size, th, width, r, g, b));
	}
}

LifeTree.prototype.grow = function(paint)
{
	this.initGrowPoint();
	for(var i in this.growPoints) {
		var p = this.growPoints[i];
		p.branch(paint);
		this.nextGrowPoint(p, paint);
	}
}

LifeTree.prototype.animate = function(paint)
{
	paint.clearPaint();
	this.level_1_count = 0;
	this.growPoints = [];
	function sleep (time)
	{
		return new Promise((resolve) => setTimeout(resolve, time));
	}
	for(var i=0; i<this.gene.total_level; ++i) {
		sleep(i * 500).then(() => {this.grow(paint)})
	}
}
