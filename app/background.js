// chrome extension 
	
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
	
	// verify request 
	if(request.check === 'confirm'){
		// get data from storage
		chrome.storage.sync.get(['numWorkers', 'quality', 'numFrames', 'delay', 'gifDelay'], function(data){
			// change icon to indicate in progress
			chrome.browserAction.setIcon({path: 'icon_green.png'}, function(){
				// added some default values just in case user does not touch options 
				var numWorkers = data.numWorkers || 2;
				var gifQuality = data.quality || 10;
				var numFrames = data.numFrames || 10;   // number of frames 
				var timeDelay = data.delay || 200;    // delay in ms when recording 
				var gifDelay = data.gifDelay || 200;  // delay for frames during gif creation
				
				var images = [];
				
				var promise = new Promise(function(resolve, reject){
					(function getImages(numTimes){
						if(numTimes < numFrames){
							// capture tab screenshot
							chrome.tabs.captureVisibleTab(null, {'format': 'png'}, function(img){	
								images.push( addImage(img) );
								
								// recursively call this function but with the arg incremented by 1
								setTimeout(function(){ getImages(numTimes + 1) }, timeDelay);
							});
						}else{
							resolve("done!");
							return;
						}
					})(0); // pass in 0 as initial arg
				});

				promise.then(function(successMsg){

					// change icon back to default to indicate finished and get gif 
					chrome.browserAction.setIcon({path: 'icon.png'}, function(){
						
						// tell content_script (areaSelection.js) that frame collection is done 
						sendResponse({'status': 'done'});
						
						// make gif here 		
						var gif = new GIF({
							workers: numWorkers,
							quality: gifQuality 
						});
						
						// add frames
						for(var i = 0; i < images.length; i++){
							
							// take img data, put it into canvas element, crop, add that to gif 
							var canvas = document.createElement('canvas');
							canvas.width = images[i].width;
							canvas.height = images[i].height;

							// put image on canvas so it can be cropped
							var ctx = canvas.getContext('2d');
							ctx.drawImage(images[i], 0, 0);
							
							// get image data of user-selected area and put it back on the same canvas 
							var selectedData = ctx.getImageData(request.startX, request.startY, (request.endX - request.startX), (request.endY - request.startY));
							canvas.width = request.endX - request.startX;
							canvas.height = request.endY - request.startY;
							ctx.putImageData(selectedData, 0, 0);
							
							gif.addFrame(canvas, {delay: gifDelay});
						}
						
						gif.on('finished', function(blob){
							var newGif = URL.createObjectURL(blob);
							window.open( newGif );
						});
						
						gif.render();	
						
					});
				});
			});
		});
		
		return true;
	}
});

function addImage(img){
	var image = document.createElement('img');
	image.src = img;
	return image;
}


