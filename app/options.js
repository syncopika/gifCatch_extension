// script for options.html

/***

	save info 

***/
function save_options(){

	// get num workers, default val = 2
	var workers = parseInt( document.getElementById('numWorkers').value );
	
	// get quality, default = 10 
	var quality = parseInt( document.getElementById('quality').value );
	
	// get num frames, default = 10 
	var frames = parseInt( document.getElementById('numFrames').value );
	
	// get time delay between frames when recording, default = 500 ms
	var delay = parseInt( document.getElementById('delay').value );
	
	// get time delay between frames for when generating the gif
	var gifDelay = parseInt( document.getElementById('gifDelay').value );

	/***
		verify valid values here?
	***/
	
	// save data to chrome storage 
	chrome.storage.sync.set({
	
		'numWorkers': workers,
		'quality': quality,
		'numFrames': frames,
		'delay': delay,
		'gifDelay': gifDelay
	
	}, function(){
	
		// update status 
		var status = document.getElementById('status');
		status.style.color = '#3ccc3c';
		status.textContent = "Successfully saved your options!";
	
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
	//elements[i].addEventListener('mouseout', function(){ hideInfo(this.id) });
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
chrome.storage.sync.get(['numWorkers', 'quality', 'numFrames', 'delay'], function(data){
		document.getElementById('numWorkers').value = data.numWorkers || 2;
		document.getElementById('quality').value = data.quality || 10;
		document.getElementById('numFrames').value = data.numFrames || 10;
		document.getElementById('delay').value = data.delay || 200;
		document.getElementById('gifDelay').value = data.gifDelay || 200;
});






