// script for options.html

/***

	save info 

***/
function save_options(){

	// get num workers
	var workers = parseInt( document.getElementById('numWorkers').value );
	
	// get quality
	var quality = parseInt( document.getElementById('quality').value );
	
	// get frame rate (limit to <= 30)
	var frameRate = parseInt( document.getElementById('frameRate').value );
	if(frameRate < 1){
		frameRate = 1;
	}else if(frameRate > 20){
		frameRate = 20;
	}
	
	// get length to record (limit to max 15 seconds)
	var recordTime = parseInt( document.getElementById('recordTime').value );
	if(recordTime > 15){
		recordTime = 15;
	}else if(recordTime < 1){
		recordTime = 1;
	}
	
	/***
		verify valid values here?
	***/
	
	// save data to chrome storage 
	chrome.storage.sync.set({
	
		'numWorkers': workers,
		'quality': quality,
		'frameRate': frameRate,
		'recordTime': recordTime
	
	}, function(){
	
		// update status 
		var status = document.getElementById('status');
		status.style.color = '#3ccc3c';
		status.textContent = "Successfully saved your options!";
		setTimeout(function(){ status.textContent = '' }, 3000);
	
	});	
}

// bind save_options to save button 
document.getElementById('save').addEventListener('click', save_options);


/***

	display/hide info for parameters

***/
// function to change display type so that information shows for each input type. 
function displayInfo(el){
	var info = document.getElementById( el + 'Info' );
	var sectionHead = document.getElementById(el);
	
	if(info.style.display === 'block'){
		info.style.display = 'none';
		sectionHead.textContent = '▷ show information';
	}else{
		info.style.display = 'block';
		sectionHead.textContent = '▽ hide information';
	}
	
}


// bind the above to all class='info' elements 
var elements = document.querySelectorAll('.section');

for(var i = 0; i < elements.length; i++){
	elements[i].addEventListener('click', function(){ displayInfo(this.id) });
}

/***

	validate values 

***/
// validate values, return boolean
function validValues(){
}

/***

	display current values for parameters 

***/
chrome.storage.sync.get(['numWorkers', 'quality', 'frameRate', 'recordTime'], function(data){
		document.getElementById('numWorkers').value = data.numWorkers || 2;
		document.getElementById('quality').value = data.quality || 10;
		document.getElementById('frameRate').value = data.frameRate || 5; // default frame rate of 5 frames/sec 
		document.getElementById('recordTime').value = data.recordTime || 3; // record for 3 seconds
});






