# gifCatch_extension
a gif-capturing Chrome extension. it's fun!    
    
## how to use:    
### step 1: check the options and adjust settings    
These settings are properties you give to a Gif object, created with the gif.js library. Please visit the [gif.js docs](https://github.com/jnordberg/gif.js/) to learn more about how these settings apply to the gif making process! It may take a bit of experimenting to get the result you want.    
    
Here is what the options page looks like (sorry it's so small!). When you update the settings, a green success message will appear. Currently there is no input validation, so please only enter positive integers!    
    
![options page for gifCatch](/screenshots/options.png)
### step 2: click on this extension's icon in the browser (a camera icon) while you're in the tab with the content you want to capture.    
A slightly dark layer should cover the viewable area. Pick a point, click, and then drag to create an area that you want to capture. The selected area will become clear as you move your cursor like so (the cursor is not visible here, but should be at the lower right corner of the selected area):    
    
![step 2 of gifCatch](/screenshots/step1.png)   
### step 3: decide whether your selection is ok and wait a few seconds.    
After you select an area, a confirm box will show up so you can decide if you want to redo the selection. If ok, the extension icon will turn green to indicate that the frames for the gif are being collected.    

The duration in which the icon is green is proportional to how many frames are being collected and the time delay specified between each frame capture. When it's done, the green will go away and in a few seconds (generally), the gif should show up in a new tab for you to save if you're satisfied.    
    
![step 3 of gifCatch](/screenshots/step2.png)    

## wait a little...    
![step4 of gifCatch](/screenshots/step3.png)    

## and the result:    
![result of gifCatch](/screenshots/berliner%20phil%20-%20alpine%20symphony.gif)

