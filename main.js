function main() {
	//TODO: do the search
	//document.getElementById("cell00").value = 6;

	var s = createStructure();
    evaluate(s);
    //var MRVList = MRV(s);
    BackTracking(s);

}

function MRV(s) {
    
    var mrvlist = [];
    var lowestSize = 10000;
   
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            value = parseInt(document.getElementById("cell"+i+j)); 
            if (!value) {    
                if (s[i][j].length <= lowestSize) {
                    mrvlist.push([i,j]);
                    if (s[i][j].length < lowestSize) {
                        mrvlist = [];
                        mrvlist.push([i,j]);
                        lowestSize = s[i][j].length;   
                    }
                }
            }
            
        }
    }
    //document.getElementById("test").innerHTML = mrvlist + " ";
    return mrvlist;

    
}
//The backtracking search
function BackTracking(d){
    //get the structure and do the initial setup
    counter = 0;
    var v2 = createVariables();
    recursiveBacktracking(v2, d); 
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            document.getElementById("cell"+i+j).innerHTML = v2[i][j];
        }
    }

}

function recursiveBacktracking(v, d){
    document.getElementById("test").innerHTML = document.getElementById("test").innerHTML + v + "||||||||||||||||<br>";
    counter ++;
    if (counter == 10) {
        return true;
    }



    var result =false;
    //if assignment is complete, return assignment
    if (checkCompletion(v)) {
        return true;
    }

    //var<-select unassignedvariable(variables[csp], assignment , csp)
    var mrvList = MRV(d);
    var maxDegreeValue = -100;
    var mrvListIndex;
    for (i = 0; i < mrvList.length; i++) { 
        var degree = getDegree(d, mrvList[i][0], mrvList[i][1]);
        if (degree > maxDegreeValue) {
            maxDegreeValue = degree;
            mrvListIndex = i;
        }
    }
    //document.getElementById("test").innerHTML = JSON.stringify(mrvList[mrvListIndex]);
    var selectedVariableIndex = mrvList[mrvListIndex];
    var selectedVariableDomain = d[selectedVariableIndex[0]][selectedVariableIndex[1]];
    
    //var test= " ";
    //for each value in orderdomainvalues(var,assignment,csp)do
    for (var i = 0; i < selectedVariableDomain.length; i++) { 
        //if value is consistent with assignment given Constraints[csp] then
        var currentValue = selectedVariableDomain[i];
        //print
        //document.getElementById("cell"+selectedVariableIndex[0]+selectedVariableIndex[1]).;
        //test = test + selectedVariableIndex + "| " + currentValue + "| " + isConsistent(selectedVariableIndex, currentValue, d) + "| ";
        
        if (isConsistent(selectedVariableIndex, currentValue, d)) {
            //add{var = value} to assignment
            v[selectedVariableIndex[0]][selectedVariableIndex[1]] = currentValue;
            //result<-RecursiveBacktracking(assignment,csp)
            result = recursiveBacktracking(v.slice(0), d.slice(0));
            //if reulst != failure then return result
            if (result != false) {
                return result;
            }
            //remove {var = value} from assignment  
            v[selectedVariableIndex[0]][selectedVariableIndex[1]] = 0;
        }      
    }   
    //document.getElementById("test").innerHTML = "" + test;
        
    return false;
    
}

function isConsistent(selectedVariableIndex, currentValue) {
    var i;
    var j;
    var row = selectedVariableIndex[0];
    var col = selectedVariableIndex[1];
    //check column
    for (i = 0; i < 9; i++) {
        if (i == row) {
            continue;
        }
        value = parseInt(document.getElementById("cell"+i+col).value);
        if (value == currentValue) {
            return false;
        }
    }
    //check row
    for (j = 0; j < 9; j++) {
        if (j == col) {
            continue;
        }
        value = parseInt(document.getElementById("cell"+row+j).value);
        if (value == currentValue) {
            return false;
        }
    }
    //check square
    var i_init = (Math.floor(row/3))*3;
    var j_init = (Math.floor(col/3))*3;
    for (i = i_init; i < i_init+3; i++) {
        for (j = j_init; j < j_init+3; j++) {
            if (i == row || j == col) {
                continue;
            }
            value = parseInt(document.getElementById("cell"+i+j).value);
            if (value == currentValue) {
                return false;
            }
        }
    }
    return true;
}

function checkCompletion(v) {
    for (i = 0; i < 9; i++) {
        for (j = 0; j < 9; j++) { 
            if (v[i][j] == 0) {
                return false;
            }
        }
    }
    return true;
}

function getDegree(s, row, col) {
	//if cell has a value, its degree is 0
	if (s[row][col].length == 1) {
		return 0;
	}
	var i;
	var j;
	var degree = 0;
	//check column
	for (i = 0; i < 9; i++) {
		if (i == row) {
			continue;
		}
		value = parseInt(document.getElementById("cell"+i+col).value);
		if (!value) {
			degree++;
		}
	}
	//check row
	for (j = 0; j < 9; j++) {
		if (j == col) {
			continue;
		}
		value = parseInt(document.getElementById("cell"+row+j).value);
		if (!value) {
			degree++;
		}
	}
	//check square
	var i_init = (Math.floor(row/3))*3;
	var j_init = (Math.floor(col/3))*3;
	for (i = i_init; i < i_init+3; i++) {
		for (j = j_init; j < j_init+3; j++) {
			if (i == row || j == col) {
				continue;
			}
			value = parseInt(document.getElementById("cell"+i+j).value);
			if (!value) {
				degree++;
			}
		}
	}
	return degree;
}



//so it looks like the default elimination of the values is done by MRV, so now we just need a function to 
//deal with the partial assignments
//this function takes in the current structure and the planned assignment
//returns the original structure if the value is no good and the new structure otherwise

//parameters, the current structure, and the value to be assigned
function FC(s){
    
    //var s = createStructure();
    //alright time to do some forward checking
    //lets make a new structure that we can mess with while not damaging the old one
    var z = s;
    //first we gotta eliminate the same values from the square
    
    evaluate(z);
    //check if domains are empty
    
    var t = JSON.stringify(z, null, 4);
    document.getElementById("test").innerHTML = t;
    if(!findEmptyDomains(z)){
        //if we do not find an empty array, then we have an appropriate assignment and we return the new array
        return z;
    }
    //if we find an empty domain, just return the original array
    return s;
}

//function to find any empty domains in our 
function findEmptyDomains(s){
    
    for (i = 0; i < 9; i++) {
		for (j = 0; j < 9; j++) { 
			if(s[i][j].length == 0){
                return true;
            }
		}
	}
    
    return false;

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

function createStructure() {
	var s = new Array();
	for (i = 0; i < 9; i++) {
		s[i] = new Array();
		for (j = 0; j < 9; j++) { 
			value = parseInt(document.getElementById("cell"+i+j).value);
			if (value) {
				s[i][j] = [1,1,1,1,1,1,1,1,1,1,1,1];    // workaround
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

function createVariables() {
    var v = new Array();
    for (i = 0; i < 9; i++) {
        v[i] = new Array();
        for (j = 0; j < 9; j++) { 
            value = parseInt(document.getElementById("cell"+i+j).value);
            if (value) {
                v[i][j] = value;    // workaround
            }
            else {
                v[i][j] = 0;
            }
        }
    }
    // uncomment to print data structure
    // document.getElementById("test").innerHTML = JSON.stringify(s);
    return v;
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
