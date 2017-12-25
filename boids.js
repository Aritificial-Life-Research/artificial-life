class Boid {
	constructor(x, y) {
		this.acceleration = createVector(0, 0)
		this.velocity = createVector(random(-1, 1), random(-1, 1));
		this.position = createVector(x, y);

		this.maxSpeed = 3.0;
		this.maxForce = 0.05;
		this.sepDist = 25.0;
	}

	run(allBoids) {
		//runs the whole thing
			this.move(allBoids);
			this.changePosition();
			this.display();
	}

	applyForce(force) {
		this.acceleration.add(force);
	}

	move(allBoids) {
		//For each boid, calculate how much it will be moved by each of the
		//operations.
			var v1 = this.rule1(allBoids);
			var v2 = this.rule2(allBoids);
			var v3 = this.rule3(allBoids);
			v1.mult(1.5);			//Weight
			//Add vectors from 3 rules to current boid velocity.
			this.applyForce(v1);
			this.applyForce(v2);
			this.applyForce(v3);
	}

	changePosition() {
		//Updates boid position
		this.velocity.add(this.acceleration);
		this.velocity.limit(this.maxSpeed);
		this.position.add(this.velocity);
		this.acceleration.mult(0);
	}

	seek(target) {
		var desiredLoc = p5.Vector.sub(target, this.position);

		desiredLoc.normalize();
		desiredLoc.mult(this.maxSpeed);

		var steer = p5.Vector.sub(desiredLoc, this.velocity);
		steer.limit(this.maxForce);
		return steer
	}

	display() {
		fill(175);
		stroke(0);
		ellipse(this.position.x, this.position.y, 10, 10);
	}

	rule1(allBoids) {
		//Boids try to fly towards the center of mass of neighboring boids.
		var neighboringDist = 50;
		var pc_j = createVector(0, 0);
		var count = 0;

		for (let b of allBoids) {
			var d = p5.Vector.dist(this.position, b.position);
			if ((d > 0) && (d < neighboringDist)) {
				pc_j.add(b.position);
				count++;
			}
		}
		if (count > 0) {
			pc_j.div(count);
			return this.seek(pc_j);
		}
		else {
			return createVector(0, 0);
		}
	}

	rule2(allBoids) {
		//Boids try to keep a small distance away from other objects (including
		//other boids).
		var c = createVector(0, 0);
		var count = 0;

		for (let b of allBoids) {
			var d = p5.Vector.dist(this.position, b.position)
			if ((d > 0) && (d < this.sepDist)) {
				var difference = p5.Vector.sub(this.position, b.position);
				difference.normalize();
				difference.div(d);
				c.add(difference);
				count++;
			}
		}
		if (count > 0) {
			c.div(count);
		}
		if (c.mag() > 0) {
			c.normalize();
			c.mult(this.maxSpeed);
			c.sub(this.velocity);
			c.limit(this.maxForce);
		}
		return c;
	}

	rule3(allBoids) {
		//Boids try to match velocity with nearby boids.
		var pv_j = createVector(0, 0);
		var count = 0;
		var neighboringDist = 50;

		for (let b of allBoids) {
			var d = p5.Vector.dist(this.position, b.position)
			if ((d > 0) && (d < neighboringDist)) {
				pv_j.add(b.velocity);
				count++;
			}
		}
		if (count > 0) {
			pv_j.div(count);
			pv_j.normalize();
			pv_j.mult(this.maxSpeed);
			var steer = p5.Vector.sub(pv_j, this.velocity);
			steer.limit(this.maxForce);
			return steer;
		}
		else {
			return createVector(0, 0);
		}
	}
}
