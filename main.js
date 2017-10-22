function main() {
	//TODO: do the search
	//document.getElementById("cell00").value = 6;
	createStructure();
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
	//uncomment to print data structure
	document.getElementById("test").innerHTML = JSON.stringify(s, null, 4);
}

function MRV() {
    // 1. Get structure
    // 2. Check columns / rows
    // 3. Select the square with the smallest domain 
}

