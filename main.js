var step = 1;

function main() {
    initLog();
    var initTime = performance.now();
    backTracking();
    var endTime = performance.now();
    var time = endTime - initTime;
    time = time.toFixed(3);
    log("Took <b>" + time + "</b> ms to solve!");
}

//Log functions
function initLog() {
    step = 1;
    document.getElementById("log").innerHTML = '';
}

function log(string) {
    document.getElementById("log").innerHTML = document.getElementById("log").innerHTML + string + "<br>";
}


//The backtracking search
function backTracking(){
    //counter: will increment by one on each call to recursive function. Used for log purposes
    counter = 0;
    
    //get the structure and do the initial setup
    var d = createDomains();
    var v = createVariables();

    //before start, apply forward checking to all set variables
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            FC(d, v,  i, j);
        }
    }

    //start recursive backtracking search
    recursiveBacktracking(v, d, counter, 0, 0); 
    
    //print all values into the board
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            document.getElementById("cell"+i+j).innerHTML = v[i][j];
        }
    }

}

//the main backtracking function
//finds the solution to the sudoku puzzle via backtracking search
//takes in an assignment variable, the CSP , a counter variable, and the location of the next considered assignment.
function recursiveBacktracking(v, d, counter, i2, j2){
    counter ++;

    //forward checking
    FC(d, v, i2, j2);
    if(findEmptyDomains(d)){
        //if we find an empty domain, just return false
        return false;
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

    var selectedVariableIndex = mrvList[mrvListIndex];
    var selectedVariableDomain = d[selectedVariableIndex[0]][selectedVariableIndex[1]];
    
    if (step <= 3) {
        log("Step " + step + ": <br>a) Variable selected: " + selectedVariableIndex);
        log("b) Domain: {" + selectedVariableDomain + "} | Domain size: " + selectedVariableDomain.length);
        log("c) Degree of variable selected: " + maxDegreeValue + "<br>");
        step++;
    }

    //for each value in orderdomainvalues(var,assignment,csp)do
    for (var i = 0; i < selectedVariableDomain.length; i++) {
        //if value is consistent with assignment given Constraints[csp] then
        var currentValue = selectedVariableDomain[i];

        if (isConsistent(selectedVariableIndex, currentValue, d)) {

            vClone = createVariables();
            dClone = clone(d);


            //add{var = value} to assignment
            vClone[selectedVariableIndex[0]][selectedVariableIndex[1]] = currentValue;
            setCellValue(selectedVariableIndex[0], selectedVariableIndex[1], currentValue);
            dClone[selectedVariableIndex[0]][selectedVariableIndex[1]] = [1,1,1,1,1,1,1,1,1,1,1,1];      //assign a big domain so it will never be selected
            
            //result<-RecursiveBacktracking(assignment,csp)
            result = recursiveBacktracking(vClone, dClone, counter, selectedVariableIndex[0], selectedVariableIndex[1]);
            //if reulst != failure then return result
            if (result != false) {
                v = vClone;
                d = dClone;
                return result;
            }
            //remove {var = value} from assignment
            removeCellValue(selectedVariableIndex[0], selectedVariableIndex[1]);
        } 
    }   
        
    return false;
    
}

function setCellValue(row, column, val) {
    document.getElementById("cell"+row+column).value = val;
}

function removeCellValue(row, column) {
    document.getElementById("cell"+row+column).value = '';
}

//function that calculates the minimum remianing values for all the cells in the CSP, and returns a list of the smallest ones
function MRV(d) {
    
    var mrvlist = [];
    var lowestSize = 10000;
   
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            value = parseInt(document.getElementById("cell"+i+j)); 
            if (!value) {    
                if (d[i][j].length <= lowestSize) {
                    mrvlist.push([i,j]);
                    if (d[i][j].length < lowestSize) {
                        mrvlist = [];
                        mrvlist.push([i,j]);
                        lowestSize = d[i][j].length;   
                    }
                }
            }
            
        }
    }
    return mrvlist;
}

//Clones a 3d array. This will be used to pass a clone of the domains and values to the recursive function
function clone(o) {
    var cl = new Array();
    for (var i = 0; i < 9; i++) {
        cl[i] = new Array();
        for (j = 0; j < 9; j++) {
            cl[i][j] = new Array(); 
            for (k = 0; k < o[i][j].length; k++) {
                cl[i][j][k] = o[i][j][k];    
            }
        }
    }
    return cl;
}

//Check consistency of the board. returns a boolean indicating consistency
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

//checks to see if the puzzle is complete
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

//function to get the degree of any individual cell
//returns the number of other cells in the same row, column, and 3x3 square that have no assigned value
//take in the CSP, and coordinates of the cell
function getDegree(s, row, col) {
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

//parameters, the current structure, and the value to be assigned , and the row and column to put it in
//row and col are the indexes of the new added value
//Forward Checking will prune the domain of all related cells (in the the same row, column, and 3x3 square)
function FC(d, v, row, col){
    var value2 = v[row][col];
    if (value2 == '') {
        return;
    }

    var i;
    var j;

    //check column
    for (i = 0; i < 9; i++) {
        if (i == row) {
            continue;
        }
        var value = v[i][col];
        if (value) {
            continue;
        }
        var domain = d[i][col];
        var index = domain.indexOf(v[row][col]);
        if (index != -1) {
            domain.splice(index, 1);
        }
    }
    //check row
    for (j = 0; j < 9; j++) {
        if (j == col) {
            continue;
        }
        var value = v[row][j];
        if (value) {
            continue;
        }
        var domain = d[row][j];
        var index = domain.indexOf(v[row][col]);
        if (index != -1) {
            domain.splice(index, 1);
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
            var value = v[i][j];
            if (value) {
                continue;
            }
            var domain = d[i][j];
            var index = domain.indexOf(v[row][col]);
            if (index != -1) {
                domain.splice(index, 1);
            }
        }
    }
}

//function to find any empty domains in our board 
function findEmptyDomains(s){
    for (i = 0; i < 9; i++) {
        for (j = 0; j < 9; j++) { 
            if(s[i][j].length == 0){
                //log("empty domain for: " + i + ", " + j);
                return true;
            }
        }
    }
    return false;
}

//creates our CSP structure for use in solving the puzzle
function createDomains() {
    var s = new Array();
    for (i = 0; i < 9; i++) {
        s[i] = new Array();
        for (j = 0; j < 9; j++) { 
            value = parseInt(document.getElementById("cell"+i+j).value);
            if (value) {
                s[i][j] = [1,1,1,1,1,1,1,1,1,1,1,1];       //assign a big domain so it will never be selected
            }
            else {
                s[i][j] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            }
        }
    }
    return s;
}

//creates all the vriables in the CSP and sets up their domains.
function createVariables() {
    var v = new Array();
    for (i = 0; i < 9; i++) {
        v[i] = new Array();
        for (j = 0; j < 9; j++) { 
            value = parseInt(document.getElementById("cell"+i+j).value);
            if (value) {
                v[i][j] = value;
            }
            else {
                v[i][j] = 0;
            }
        }
    }
    return v;
}
