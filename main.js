function main() {
	//TODO: do the search
	//document.getElementById("cell00").value = 6;
	createStructure();
}

function MRV() {
    
    // 1. Get structure
    var s = createStructure();
    
    // 2. Check columns / rows
    evaluate(s);
    
    // Gets domain of all blocks
    var t = JSON.stringify(s, null, 4);
    document.getElementById("test").innerHTML = t;
    
}

function pruneColumn(s, i, col) {
    for (var row = 0; row < 9; row++) {
        /* Maybe a document.getelementbyid selection would be better? */
        if (s[row][col].length == 1) {
            var number = s[row][col][0];
            var index = s[i][col].indexOf(number);
            if (index > -1)
                s[i][col].splice(index, 1);
        }
    }
    return s;
}

function pruneRow(s, row, j) {
    for (var col = 0; col < 9; col++) {
        if (s[row][col].length == 1) {
            var number = s[row][col][0];
            var index = s[row][j].indexOf(number);
            if (index > -1)
                s[row][j].splice(index, 1);
        }
    }
    return s;
}

function pruneSquare(s) {
    // 1. Find location in square (center, top, topright, right, etc.)
    // 2. Evaluate based on that location 
    
    /*
    Create lists of these coordinates
    Check if i,j is equal to one of these and evaluate accordingly
    Top-Left: (0,0) (0,3) (0,6) (3,0) (3,3) (3,6) (6,0) (6,3) (6,6)
    Top: (0,1) (0,4) (0,7) (3,1) (3,4) (3,7) (6,1) (6,4) (6,7)
    Top-Right: (0,2) (0,5) (0,8) (3,2) (3,5) (3,8) (6,2) (6,5) (6,8)
    Left: (1,0) (1,3) (1,6) (4,0) (4,3) (4,6) (7,0) (7,3) (7,6)
    Middle: (1,1) (1,4) (1,7) (4,1) (4,4) (4,7) (7,1) (7,4) (7,7)
    Right: (1,2) (1,5) (1,8) (4,2) (4,5) (4,8) (7,2) (7,5) (7,8)
    Bot-Left: (2,0) (2,3) (2,6) (5,0) (5,3) (5,6) (8,0) (8,3) (8,6)
    Bot: (2,1) (2,4) (2,7) (5,1) (5,4) (5,7) (8,1) 8,4) (8,7)
    Bot-Right: (2,2) (2,5) (2,8) (5,2) (5,5) (5,8) (8,2) (8,5) (8,8)
    */
    
    // Arrays:
    var topLeft = [[0,0],[0,3],[0,6],[3,0],[3,3],[3,6][6,0],[6,3][6,6]];
    var top = [[0,1],[0,4],[0,7],[3,1],[3,4],[3,7][6,1],[6,4][6,7]];
    var topRight = [[0,2],[0,5],[0,8],[3,2],[3,5],[3,8][6,2],[6,5][6,8]];
    var left = [[1,0],[1,3],[1,6],[4,0],[4,3],[4,6][7,0],[7,3][7,6]];
    var middle = [[1,1],[1,4],[1,7],[4,1],[4,4],[4,7][7,1],[7,4][7,7]];
    var right = [[1,2],[1,5],[1,8],[4,2],[4,5],[4,8][7,2],[7,5][7,8]];
    var botLeft = [[2,0],[2,3],[2,6],[5,0],[5,3],[5,6][8,0],[8,3][8,6]];
    var bot = [[2,1],[2,4],[2,7],[5,1],[5,4],[5,7][8,1],[8,4][8,7]];
    var botRight = [[2,2],[2,5],[2,8],[5,2],[5,5],[5,8][8,2],[8,5][8,8]];
    
    return s;
}

function createStructure() {
	var s = new Array();
	for (i = 0; i < 9; i++) {
		s[i] = new Array();
		for (j = 0; j < 9; j++) { 
			value = parseInt(document.getElementById("cell"+i+j).value);
			if (value) {
				s[i][j] = [value];
			}
			else {
				s[i][j] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
			}
		}
	}
	// uncomment to print data structure
	// document.getElementById("test").innerHTML = JSON.stringify(s);
    return s;
}

function evaluate(s) {
    for (i = 0; i < 9; i++) {
        for (j = 0; j < 9; j++) {
            value = parseInt(document.getElementById("cell"+i+j).value);
            if (!value) {
                // If value is not present, prune the domain
                s = pruneRow(s, i, j);
                s = pruneColumn(s, i, j);
                s = prunesq(s, i, j);
            } 
        }
    }
    return s;
}

function prunesq(s, i, j) {
    var topLeft = [[0,0],[0,3],[0,6],[3,0],[3,3],[3,6],[6,0],[6,3],[6,6]];
    var top = [[0,1],[0,4],[0,7],[3,1],[3,4],[3,7],[6,1],[6,4],[6,7]];
    var topRight = [[0,2],[0,5],[0,8],[3,2],[3,5],[3,8][6,2],[6,5],[6,8]];
    var left = [[1,0],[1,3],[1,6],[4,0],[4,3],[4,6],[7,0],[7,3],[7,6]];
    var middle = [[1,1],[1,4],[1,7],[4,1],[4,4],[4,7],[7,1],[7,4],[7,7]];
    var right = [[1,2],[1,5],[1,8],[4,2],[4,5],[4,8],[7,2],[7,5],[7,8]];
    var botLeft = [[2,0],[2,3],[2,6],[5,0],[5,3],[5,6],[8,0],[8,3],[8,6]];
    var bot = [[2,1],[2,4],[2,7],[5,1],[5,4],[5,7],[8,1],[8,4],[8,7]];
    var botRight = [[2,2],[2,5],[2,8],[5,2],[5,5],[5,8],[8,2],[8,5],[8,8]];
    
    var item = [i, j];
    
    if (arrayinarray(topLeft, item)) s = eliminateItems("topleft", s, i, j);
    else if (arrayinarray(top, item)) s = eliminateItems("top", s, i, j);
    else if (arrayinarray(topRight, item)) s = eliminateItems("topright", s, i, j);
    else if (arrayinarray(left, item)) s = eliminateItems("left", s, i, j);
    else if (arrayinarray(middle, item)) s = eliminateItems("middle", s, i, j);
    else if (arrayinarray(right, item)) s = eliminateItems("right", s, i, j);
    else if (arrayinarray(botLeft, item)) s = eliminateItems("botleft", s, i, j);
    else if (arrayinarray(bot, item)) s = eliminateItems("bottom", s, i, j);
    else if (arrayinarray(botRight, item)) s = eliminateItems("botright", s, i, j);
    return s;
}

// if error, do index of in separate line of code
function eliminateItems(location, s, i, j) {
    var x;
    var index;
    switch(location) {
        case "topleft":
            x = valueLookUp(i, j+1);
            s = spliceS(x, s, i, j);
            x = valueLookUp(i+1, j);
            s = spliceS(x, s, i, j);
            x = valueLookUp(i+1, j+1);
            s = spliceS(x, s, i, j);
            x = valueLookUp(i, j+2);
            s = spliceS(x, s, i, j);
            x = valueLookUp(i+1, j+2);
            s = spliceS(x, s, i, j);
            x = valueLookUp(i+2, j);
            s = spliceS(x, s, i, j);
            x = valueLookUp(i+2, j+1);
            s = spliceS(x, s, i, j);
            x = valueLookUp(i+2, j+2);
            s = spliceS(x, s, i, j);
            break;
        case "top":
            x = valueLookUp(i, j-1);
            s = spliceS(x, s, i, j);
            x = valueLookUp(i, j+1);
            s = spliceS(x, s, i, j);
            x = valueLookUp(i+1, j-1);
            s = spliceS(x, s, i, j);
            x = valueLookUp(i+1, j);
            s = spliceS(x, s, i, j);
            x = valueLookUp(i+1, j+1);
            s = spliceS(x, s, i, j);
            x = valueLookUp(i+2, j-1);
            s = spliceS(x, s, i, j);
            x = valueLookUp(i+2, j);
            s = spliceS(x, s, i, j);
            x = valueLookUp(i+2, j+1);
            s = spliceS(x, s, i, j);
            break;
        case "topright":
            x = valueLookUp(i, j-1);
            s = spliceS(x, s, i, j);
            x = valueLookUp(i+1, j-1);
            s = spliceS(x, s, i, j);
            x = valueLookUp(i+1, j);
            s = spliceS(x, s, i, j);
            x = valueLookUp(i, j-2);
            s = spliceS(x, s, i, j);
            x = valueLookUp(i+1, j-2);
            s = spliceS(x, s, i, j);
            x = valueLookUp(i+2, j-2);
            s = spliceS(x, s, i, j);
            x = valueLookUp(i+2, j-1);
            s = spliceS(x, s, i, j);
            x = valueLookUp(i+2, j);
            s = spliceS(x, s, i, j);
            break;
        case "left":
            x = valueLookUp(i-1, j);
            s = spliceS(x, s, i, j);
            x = valueLookUp(i-1, j+1);
            s = spliceS(x, s, i, j);
            x = valueLookUp(i, j+1);
            s = spliceS(x, s, i, j);
            x = valueLookUp(i+1, j);
            s = spliceS(x, s, i, j);
            x = valueLookUp(i+1, j+1);
            s = spliceS(x, s, i, j);
            x = valueLookUp(i-1, j+2);
            s = spliceS(x, s, i, j);
            x = valueLookUp(i, j+2);
            s = spliceS(x, s, i, j);
            x = valueLookUp(i+1, j+2);
            s = spliceS(x, s, i, j);
            break;
        case "middle":
            x = valueLookUp(i-1, j-1);
            s = spliceS(x, s, i, j);
            x = valueLookUp(i-1, j);
            s = spliceS(x, s, i, j); 
            x = valueLookUp(i-1, j+1);
            s = spliceS(x, s, i, j);
            x = valueLookUp(i, j-1);
            s = spliceS(x, s, i, j); 
            x = valueLookUp(i, j+1);
            s = spliceS(x, s, i, j);
            x = valueLookUp(i+1, j-1);
            s = spliceS(x, s, i, j);
            x = valueLookUp(i+1, j);
            s = spliceS(x, s, i, j); 
            x = valueLookUp(i+1, j+1);
            s = spliceS(x, s, i, j); 
            break;
        case "right":
            x = valueLookUp(i-1, j-1);
            s = spliceS(x, s, i, j);
            x = valueLookUp(i-1, j);
            s = spliceS(x, s, i, j);
            x = valueLookUp(i, j-1);
            s = spliceS(x, s, i, j);
            x = valueLookUp(i+1, j-1);
            s = spliceS(x, s, i, j);
            x = valueLookUp(i+1, j);
            s = spliceS(x, s, i, j);
            x = valueLookUp(i-1, j-2);
            s = spliceS(x, s, i, j);
            x = valueLookUp(i, j-2);
            s = spliceS(x, s, i, j);
            x = valueLookUp(i+1, j-2);
            s = spliceS(x, s, i, j);
            break;
        case "botleft":
            x = valueLookUp(i-1, j);
            s = spliceS(x, s, i, j);
            x = valueLookUp(i-1, j+1);
            s = spliceS(x, s, i, j);
            x = valueLookUp(i, j+1);
            s = spliceS(x, s, i, j);
            x = valueLookUp(i-2, j);
            s = spliceS(x, s, i, j);
            x = valueLookUp(i-2, j+1);
            s = spliceS(x, s, i, j);
            x = valueLookUp(i-2, j+2);
            s = spliceS(x, s, i, j);
            x = valueLookUp(i-1, j+2);
            s = spliceS(x, s, i, j);
            x = valueLookUp(i, j+2);
            s = spliceS(x, s, i, j);
            break;
        case "bottom":
            x = valueLookUp(i-1, j-1);
            is = spliceS(x, s, i, j);
            x = valueLookUp(i-1, j);
            s = spliceS(x, s, i, j);
            x = valueLookUp(i-1, j+1);
            s = spliceS(x, s, i, j);
            x = valueLookUp(i, j-1);
            s = spliceS(x, s, i, j);
            x = valueLookUp(i, j+1);
            s = spliceS(x, s, i, j);
            x = valueLookUp(i-2, j-1);
            s = spliceS(x, s, i, j);
            x = valueLookUp(i-2, j);
            s = spliceS(x, s, i, j);
            x = valueLookUp(i-2, j+1);
            s = spliceS(x, s, i, j);
            break;
        case "botright":
            x = valueLookUp(i-1, j-1);
            s = spliceS(x, s, i, j);
            x = valueLookUp(i-1, j);
            s = spliceS(x, s, i, j);
            x = valueLookUp(i, j-1);
            s = spliceS(x, s, i, j);
            x = valueLookUp(i-2, j-2);
            s = spliceS(x, s, i, j);
            x = valueLookUp(i-2, j-1);
            s = spliceS(x, s, i, j);
            x = valueLookUp(i-2, j);
            s = spliceS(x, s, i, j);
            x = valueLookUp(i-1, j-2);
            s = spliceS(x, s, i, j);
            x = valueLookUp(i, j-2);
            s = spliceS(x, s, i, j);
            break;   
    }
    return s;
}

function spliceS(x, s, i, j) {
    var index;
    if (x != -1) {
        index = s[i][j].indexOf(x);
        if (index != -1) s[i][j].splice(index, 1);     
    }
    return s;
}

// Function to check if an element exists: return value if it exists, -1 if not
function valueLookUp(i, j) {
    value = parseInt(document.getElementById("cell"+i+j).value);
    if (value) {
        //console.log("Value " + value + " at cell " +i + " " + j);
        return value;
    }
    else return -1;
}

function arrayinarray(arr, item) {
    var itemasstring = JSON.stringify(item);
    var contains = arr.some(function(ele) {
        return JSON.stringify(ele) === itemasstring;
    })
    return contains;
}



