document.addEventListener('DOMContentLoaded', () => {
	document.canvas = document.getElementById('canvas');
	document.ctx = canvas.getContext('2d');
	document.w = document.getElementById('canvas').width;
	document.h = document.getElementById('canvas').height;
	document.cw = 10;
	document.d;
	document.food;
	document.score;
	document.level;
	document.snake_array;
	document.paused = false;
	document.gamerunning = false;
});

document.addEventListener('keydown', (e) => {
	if (e === undefined || e.key === undefined) {
		console.log('keydown was undefined');
		return;
	}

	let key = e.key;
	console.log('key', key);

	if (key === 's' && !document.gamerunning) {
		init();
		return;
	} 
	
	if (document.gamerunning) {
		if (key === ' ') {
			pause();
		} else {
			//The function prevents reverse gear
			if (key === 'ArrowRight' && (document.d !== 'right' && document.d !== 'left')) document.d = 'right';
			else if (key === 'ArrowDown' && (document.d !== 'down' && document.d !== 'up')) document.d = 'down';
			else if (key === 'ArrowLeft' && (document.d !== 'left' && document.d !== 'right')) document.d = 'left';
			else if (key === 'ArrowUp' && (document.d !== 'up' && document.d !== 'down')) document.d = 'up';
			//Now you can control the snake with the keyboard
		}
	}
});

const init = () => {
	document.gamerunning = true;
	document.d = 'right';
	create_snake();
	create_food();
	document.score = 0;
	document.level = 1;
	if (typeof document.game_loop !== undefined) {
		clearInterval(document.game_loop);
	}
	document.game_loop = setInterval(paint, 100);
};

const pause = () => {
	if (document.gamerunning) {
		document.paused = !document.paused;
		if (document.paused) {
			clearInterval(document.game_loop)
		} else {
			document.game_loop = setInterval(paint, 100);
		}	
	}
};

const create_snake = () => {
	let length = 5;
	document.snake_array = [];
	for (let i = length - 1; i >= 0; i--) {
		//This will draw the snake horizontally from the top left
		document.snake_array.push({x: i, y:0});
	}	
};

const create_food = () => {
	document.food = {
		x: Math.round(Math.random()*(document.w-document.cw)/document.cw),
		y: Math.round(Math.random()*(document.h-document.cw)/document.cw),
	}; //This creates a cell with x/y between the range of 0-44	
};

const paint = () => {
	//We need to draw the background on each frame in order to avoid a snake trail.
	//Here we paint the canvas
	document.ctx.fillStyle = 'white';
	document.ctx.fillRect(0, 0, document.w, document.h);
	document.ctx.strokeStyle = 'black';
	document.ctx.strokeRect(0, 0, document.w, document.h);
                           	
	//Here we define the movement of the snake using simple logic
	//We simply remove the tail cell and put it in front of the head cell                     	
	let nx = document.snake_array[0].x;
	let ny = document.snake_array[0].y;
	//This if the head cell position
	//We increase it to get the new head position
                           	
	//Here we define directions depending on movement
	if (document.d === 'right') nx++;
	else if (document.d === 'left') nx--;
	else if (document.d === 'up') ny--;
	else if (document.d === 'down') ny++;
	
	//Now we will create the ‘game over’ variables
	//The game will be restarted when the snake hits the wall
	//So we will create the code for collision of bodies
	//If the snake’s head comes into contact with its body, the game restarts
	if (nx === -1 || ny === -1 || nx === document.w/document.cw || ny === document.h/document.cw || check_collision(nx, ny, document.snake_array)) {
		//The restart function
		document.gamerunning = false;
		return;
	}

	//Here we will enable the snake consume the food
	//Through simple logic we will first determine of the new head position of the snake
	//If that position corresponds with the food, then generate new snake head instead of removing its tail
	let tail = {};
	if (nx === document.food.x && ny === document.food.y) {
		tail = {x: nx, y: ny};
		document.score++;
		//Create new food
		create_food();
	}
	else {
		tail = document.snake_array.pop(); //The last cell is popped out 
		tail.x = nx;
		tail.y = ny;
	}
	//Now the snake can consume food                   	
	document.snake_array.unshift(tail); //The tail put back as the first cell

	for (let i = 0; i < document.snake_array.length; i++) {
		let c = document.snake_array[i];
		//Lets paint 10px wide cells
		paint_cell(c.x, c.y, 'blue');
	}

	//Lets generate the food
	paint_cell(document.food.x, document.food.y, 'red');
	//Lets create the score
	let score_text = `Score: ${document.score}`;
	let level_text = `Level: ${document.level}`;
	document.ctx.fillText(score_text, 5, document.h - 5);
	document.ctx.fillText(level_text, 60, document.h - 5);
};

//Here a generic function is created to paint cells
const paint_cell = (x, y, color) => {
	document.ctx.fillStyle = color;
	document.ctx.fillRect(x * document.cw, y * document.cw, document.cw, document.cw);
	document.ctx.strokeStyle = 'white';
	document.ctx.strokeRect(x * document.cw, y * document.cw, document.cw, document.cw);
}

const check_collision = (x, y, array) => {
	//Here we check an array of cells for the existence of the x/y coordinates provided
	for (let i = 0; i < array.length; i++) {
		if (array[i].x === x && array[i].y === y)
			return true;
	}
	return false;
}
