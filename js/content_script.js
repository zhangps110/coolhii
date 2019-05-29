function closeWindow () {  
	var x = new XMLHttpRequest();
	x.open('GET', 'https://mock_didi_project_xs.com/');
	x.send();
}

key('⌘+x, ctrl+x', function(event, handler){
	closeWindow();
});