

var RHITmoodle = {
	/*
	currentQuarter: "",
	showFutureQuarters: true,
	showPastQuarters: false,
	*/
  	load: function() {
  		$('#save').click(this.storeData);
	  	this.loadData();
	},

	loadData: function(){
		chrome.storage.sync.get(null, function(obj){
	      if(obj.currentQuarter){
	        $("#quartersList").val(obj.currentQuarter);
	      }
	      if(obj.showPastQuarters){
	      	$("#showPastQuarters").attr("checked", obj.showPastQuarters);
	      }else{
			$("#showPastQuarters").attr("checked", obj.showPastQuarters);
	      }
	      if(obj.showFutureQuarters){
	      	$("#showFutureQuarters").attr("checked", obj.showFutureQuarters);
	      }else{
	      	$("#showFutureQuarters").attr("checked", obj.showFutureQuarters);
	      }
	      if(obj.showFutureQuarters){
	      	$("#ascending").attr("checked", obj.ascending);
	      }else{
	      	$("#ascending").attr("checked", obj.ascending);
	      }

	    });
	},

	storeData: function(){
		var selected = $('#quartersList').find(":selected").text();
		var showPastQuartersChecked = document.getElementById("showPastQuarters").checked;
		var showFutureQuartersChecked  = document.getElementById("showFutureQuarters").checked;
		var ascendingChecked  = document.getElementById("ascending").checked;
		var data = {currentQuarter : selected,
	    			showPastQuarters : showPastQuartersChecked,
	    			showFutureQuarters : showFutureQuartersChecked,
	    			ascending: ascendingChecked};
	    chrome.storage.sync.set(data, function() {console.log("Quarter info stored")});
	    window.close();
	}


};



// Run our kitten generation script as soon as the document's DOM is ready.
document.addEventListener('DOMContentLoaded', function () {
  RHITmoodle.load();
});
