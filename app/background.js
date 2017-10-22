// chrome extension 
	
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
	
	// verify request 
	if(request.check === 'confirm'){
		// get data from storage
		chrome.storage.sync.get(['numWorkers', 'quality', 'frameRate', 'recordTime'], function(data){
			// change icon to indicate in progress
			chrome.browserAction.setIcon({path: 'icon_green.png'}, function(){
				// added some default values just in case user does not touch options 
				var numWorkers = data.numWorkers || 2;
				var gifQuality = data.quality || 10;
				//var numFrames = data.numFrames || 10;   // number of frames 
				var frameRate = data.frameRate || 5;    // framerate(fps) when recording 
				var recordTime = data.recordTime || 3;  // time to record in seconds
				
				var images = [];
				
				// given the frame rate (frames per second), and the length of time to record (in seconds),
				// need to calculate delay between each frame capture in milliseconds, and convert time to record 
				// in milliseconds 
				var timeDelay = Math.floor(1000 / frameRate);
				var numFrames = Math.floor((recordTime * 1000) / 200); // 200 seems like a good number 
				
				//console.log("frameRate: " + frameRate + ", recordTime: " + recordTime);
				//console.log("timedelay: " + timeDelay + ", numFrames: " + numFrames);
				
				var promise = new Promise(function(resolve, reject){
					(function getImages(numTimes){
						if(numTimes < numFrames){
							// capture tab screenshot
							// I think this function actually takes quite a few milliseconds to execute.
							// therefore, if you want to take a snapshot every 200 ms, for example, the time
							// between snapshots is actually going to be considerably longer! 
							chrome.tabs.captureVisibleTab(null, {'format': 'png'}, function(img){
								
								//console.log(Date.now());
								images.push(addImage(img));
								
								// recursively call this function but with the arg incremented by 1
								//setTimeout(function(){ getImages(numTimes + 1) }, 1);
								getImages(numTimes + 1);
							});
						}else{
							// tell content_script (areaSelection.js) that frame collection is done 
							sendResponse({status: 'done'});
							resolve("done!");
							return;
						}
					})(0); // pass in 0 as initial arg
				});
				
				promise.then(function(successMsg){
					//console.log(images);
					
					// change icon back to default to indicate finished and get gif 
					chrome.browserAction.setIcon({path: 'icon.png'}, function(){
						
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
							
							// technically, I think this timeDelay really should be the frame rate of the video being captured 
							gif.addFrame(canvas, {delay: timeDelay});
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


