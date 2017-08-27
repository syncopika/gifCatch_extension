// lets user select an area to make the gif from 
// this simply gets the coordinates needed to know 
// which part of the screen to focus on 
// the info then gets sent as a message to background.js 

// make canvas selection layer 
makeSelectionLayer();

/***
	
	create and bind events to canvas selection layer 

***/
function makeSelection(){

	// log coordinates chose by user 
	var coords = {};
	
	// flag to check if new selection layer being drawn 
	var newSelect = 0;
	
	var selectionLayer = document.getElementById("getGifSelectionLayer");
	var selectionLayerContext = selectionLayer.getContext("2d");
	var height = selectionLayer.getAttribute('height');
	var width = selectionLayer.getAttribute('width');

	// prevent possible dragging of element being clicked on (i.e. the tiny picture that gets dragged) 
	selectionLayer.ondragstart = function(){ return false; }
	
	// function for mouse down
	function getFirstCorner(e){
		if(newSelect === 0){
			coords['startX'] = e.clientX;
			coords['startY'] = e.clientY;
			newSelect = 1;
		}
	}
	selectionLayer.addEventListener('mousedown', getFirstCorner);
	
	// function for mouse move
	function onDrag(e){
		if(newSelect === 1){
			var currX = e.clientX;
			var currY = e.clientY;
	
			// set canvas to original color 
			selectionLayerContext.fillStyle = "#99b5d1";
			selectionLayerContext.fillRect(0, 0, width, height);
			
			// set currently selected area to 'selected' color 
			selectionLayerContext.fillStyle = 'rgba(0, 0, 0, 0.7)';
			selectionLayerContext.fillRect(coords.startX, coords.startY, (currX - coords.startX), (currY - coords.startY));
		}
	}
	selectionLayer.addEventListener('mousemove', onDrag);

	selectionLayer.addEventListener('mouseup', function getLastCorner(e){
		
		if(newSelect === 1){
			coords['endX'] = e.clientX;
			coords['endY'] = e.clientY;
			
			// show selected area
			selectionLayerContext.fillStyle = 'rgba(0, 0, 0, 0.7)';
			selectionLayerContext.fillRect(coords.startX, coords.startY, (coords.endX - coords.startX), (coords.endY - coords.startY));
			
			// put selected area in new canvas element and show.
			var newImage = document.createElement('canvas');
			newImage.setAttribute('width', coords.endX - coords.startX);
			newImage.setAttribute('height', coords.endY - coords.startY);
			
			var newImgContext = newImage.getContext('2d');
			var selectedImage = selectionLayerContext.getImageData(coords.startX, coords.startY, (coords.endX - coords.startX), (coords.endY - coords.startY));
			newImgContext.putImageData(selectedImage, 0, 0);
		
			function check(){
				if(confirm('Is this selection ok?')){
					
					selectionLayer.removeEventListener('mousedown', getFirstCorner);
					selectionLayer.removeEventListener('mousemove', onDrag);
					selectionLayer.removeEventListener('mouseup', getLastCorner);
					
					// make selection layer clear
					selectionLayerContext.clearRect(coords.startX, coords.startY, (coords.endX - coords.startX), (coords.endY - coords.startY));
		
					// check coordinate values. if height or width = 0, set them to height and width of body 
					if(coords.endX - coords.startX == 0 || coords.endY - coords.startY == 0){
						coords.startX = 0;
						coords.startY = 0;
						coords.endX = document.documentElement.offsetWidth;
						coords.endY = document.documentElement.offsetHeight;
					}
					
					// pass data to background script 
					coords['check'] = 'confirm'; // just to ensure data got through
				
					// delay just a tiny bit so that the canvas selection layer has time to get removed and 
					// not get caught in the gif (would appear as a slightly darker frame in the gif)
					setTimeout(function(){ chrome.runtime.sendMessage(coords, function(response){
						
						// when response is received, it means that all the frames have been collected
						if(response.status === 'done'){
							// remove the selection layer 
							document.documentElement.removeChild(selectionLayer);
						}
						
					}); }, 15);
				
				}else{
					selectionLayerContext.fillStyle = "#99b5d1";
					selectionLayerContext.fillRect(0, 0, width, height);
					
					for(key in coords){
						coords[key] = 0;
					}
					
					// reset flag
					newSelect = 0;
				}
			}
			
			// add delay so that selection area shows up first before prompt 
			setTimeout(check, 200);	
		}
	});
}

/***

	dynamically create the selection layer canvas element 

***/
function makeSelectionLayer(){
	// create a light, transparent blue layer to make selection
	var selectionLayer = document.createElement('canvas');
	var width = document.documentElement.clientWidth;
	var height = document.documentElement.clientHeight;
	
	selectionLayer.style.position = "absolute";
	selectionLayer.id = "getGifSelectionLayer";
	selectionLayer.style.top = document.documentElement.scrollTop;
	selectionLayer.style.left = document.documentElement.scrollLeft;
	selectionLayer.setAttribute("height", height);
	selectionLayer.setAttribute("width", width);
	selectionLayer.style.zIndex = 1000;
	selectionLayer.style.opacity = .2;

	// fill canvas
	var selectionLayerContext = selectionLayer.getContext("2d");
	var height = selectionLayer.getAttribute("height");
	var width = selectionLayer.getAttribute("width");
	
	selectionLayerContext.fillStyle = "#99b5d1";
	selectionLayerContext.fillRect(0, 0, width, height);
	
	document.documentElement.appendChild(selectionLayer);
	makeSelection();
}