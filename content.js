
var branchImage = chrome.extension.getURL("branch.gif");
var branchBottomImage = chrome.extension.getURL("branchbottom.gif");
var branchOpened = chrome.extension.getURL("opened.png");
var branchClosed = chrome.extension.getURL("closed.png");

var hideClasses = function(data, myCourses){
  var selectedQuarterCode = computeQuarterCode(data.currentQuarter);
  var QUARTERS = {};
  var RHITmoodleDiv = generateRHITmoodleDiv();
  var contentSection = document.getElementById('block-region-side-pre');
  var contentSectionFirstChild = contentSection.firstChild;

  //the aa, ss elements are needed to make our div act like a native one (so the moodle scripts will operate on it too)
  var aa = document.createElement('a');
  aa.setAttribute('href', '#sb-9');
  aa.setAttribute('class', 'skip-block');
  aa.innerHTML = 'Skip RHITmoodle';

  var ss = document.createElement('span');
  ss.setAttribute('id', 'sb-9');
  ss.setAttribute('class', 'skip-block-to');

  contentSection.insertBefore(ss, contentSectionFirstChild.nextSibling.nextSibling.nextSibling);//the nesting is to add our div after the native navigation div
  contentSection.insertBefore(RHITmoodleDiv, ss);
  contentSection.insertBefore(aa, RHITmoodleDiv);


  selectedQuarterClasses = [];
  otherClasses = [];
  for(var i = 0; i < myCourses.length; i++){
    var child = myCourses[i];
    var title = child.name;
    var quarterSubstring = title.substring(0,title.indexOf(" "));
    if(! QUARTERS[quarterSubstring]){
      QUARTERS[quarterSubstring] = [];
    }
    QUARTERS[quarterSubstring].push(child);
  }
  generateQuartersTree(selectedQuarterCode, QUARTERS, data);
  toggle();
  appendCSS();
};

var generateQuarterBlock = function(name, children){
  var quarterDiv = document.createElement('div');
  var a = document.createElement('a');
  a.setAttribute("id", name);
  a.setAttribute("class", "classgroup");
  var img = document.createElement('img');
  img.setAttribute('src', branchOpened);
  var parent = document.createElement("span");
  parent.innerHTML = name;
  a.appendChild(img);
  a.appendChild(parent);
  quarterDiv.appendChild(a);
  var classes = document.createElement('ul');
  classes.setAttribute("id",name+"classes" );
  for(var i in children){
    var child = children[i];
    var courseNameLi = document.createElement('li');
    courseNameLi.innerHTML = child.title;
    var course = document.createElement('a');
    course.setAttribute('href', child.link);
    course.appendChild(courseNameLi);
    classes.appendChild(course);
  }
  quarterDiv.appendChild(classes);
  return quarterDiv;
};

var generateQuartersTree = function(selectedQuarterCode, QUARTERS, data){ 
  var date = new Date();
  var quartersInOrder = ["F", "W", "S", "SU"];
  var selectedQuarterLetter = selectedQuarterCode.substring(4);
  var startYear = 12;
  var endYear = date.getYear()-100+1;
  var past = [];
  var current = [];
  var future = [];
  var state = 0;
  for(; startYear <= endYear; startYear++){
    for(var q = 0; q<quartersInOrder.length; q++){
      var code = startYear +""+ (startYear+1) + quartersInOrder[q];
      if(QUARTERS[code] ){
        if(code == selectedQuarterCode){
          state++;
        }
        if(state == 0){
          past.push(generateQuarterBlock(code, QUARTERS[code]));
        }else if(state == 1){
          if(data.CHE411Lab && QUARTERS['CHE']){
            QUARTERS[code][QUARTERS[code].length] = QUARTERS['CHE'][0];
          }
          if( QUARTERS['2014']){
            QUARTERS[code][QUARTERS[code].length] = QUARTERS['2014'][0];
          }
          current.push(generateQuarterBlock(code, QUARTERS[code]));
          state++;
        }else if (state == 2){
          future.push(generateQuarterBlock(code, QUARTERS[code]));
        }
      }
    } 
  }
  
  if(data.ascending){
    if(data.showPastQuarters){
      $("#RHITmoodleContentDiv").append(past);
    }
    $("#RHITmoodleContentDiv").append(current);
    if(data.showFutureQuarters){
      $("#RHITmoodleContentDiv").append(future);
    }
  }else{
    if(data.showFutureQuarters){
      $("#RHITmoodleContentDiv").append(future.reverse());
    }
    $("#RHITmoodleContentDiv").append(current.reverse());
    if(data.showPastQuarters){
      $("#RHITmoodleContentDiv").append(past.reverse());
    }
  }
};

var generateRHITmoodleDiv = function(){
  var RHITmoodleDiv = document.createElement('div');
  //Note: the weird attributes and structure are set to make our div act like a native moodle div, and have moodle's javascripts process it.
  RHITmoodleDiv.innerHTML = '<div class="header"><div class="title"><div class="block_action"><input type="image" class="moveto customcommand requiresjs" alt="Move this to the dock" title="Dock RHITmoodle block" src="http://moodle.rose-hulman.edu/theme/image.php/clean/core/1401827230/t/block_to_dock"></div><h2 id="instance-9-header">RHITmoodle</h2></div></div>'
  RHITmoodleDiv.setAttribute("id", "inst9");
  RHITmoodleDiv.className += RHITmoodleDiv.className ? ' block_navigation  block' : 'block_navigation  block';
  RHITmoodleDiv.setAttribute('data-dockable', 1);
  RHITmoodleDiv.setAttribute('role', 'RHITmoodle');
  RHITmoodleDiv.setAttribute('data-block', 'RHITmoodle');
  RHITmoodleDiv.setAttribute('data-instanceid', 9);
  RHITmoodleDiv.setAttribute('aria-labelledby', 'instance-9-header');
  var contentDiv = document.createElement('div');
  contentDiv.setAttribute('class', 'content');
  contentDiv.setAttribute('id', 'RHITmoodleContentDiv');
  RHITmoodleDiv.appendChild(contentDiv);
  return RHITmoodleDiv;
};

var insertAfter = function(referenceNode, newNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
};

var computeQuarterCode = function(quarter){
  var result;
  var date = new Date();
  var year = date.getYear()-100; //
  var month = date.getMonth() + 1;//note, months are adjusted  
  if(!quarter){
    if((1 <= month && month <= 2 )|| month == 12){
      quarter = "Winter";
    }else if(3<= month && month <= 5){
      quarter = "Spring";
    }else if(6<= month && month <= 8){
      quarter = "Summer";
    }else if(9<= month && month <= 11){
      quarter = "Fall";
    }
  }
  if(quarter == "Fall"){
    if(1 <= month <= 5){
      //between january and may, the student is probably referring to the previous fall quarter. 
      result =  (year-1) + "" + year + "F";
    }else{
      result = year + "" + (year+1) + "F";
    }
  }else if(quarter == 'Winter'){
    if(month == 12){
      //December
      result = year + "" + (year+1);
    }else{
      //January or Feb
      result = (year-1) + "" + year;
    }
    result = result +  "W";
  }else if (quarter == "Spring"){
    result = (year-1) + "" + year + "S";
  }else if (quarter == "Summer"){
    result = (year-1) + "" + year + "SU";
  }
  return result;
};

var appendCSS = function(){
  var link = document.createElement("link");
  link.href = chrome.extension.getURL("content.css");
  link.type = "text/css";
  link.rel = "stylesheet";
  document.getElementsByTagName("head")[0].appendChild(link);
};

var removeNodeChildren = function (node){
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
};

var toggle = function (){
  $('.classgroup').click(function(){
    var id = '#' + $("#"+this.id).next().attr('id');
    if($(id).is(":visible")){
        $(id).hide();
        this.childNodes[0].setAttribute('src', branchClosed);
     }else{
         $(id).show();
         this.childNodes[0].setAttribute('src', branchOpened);
     }
   });
};

var getMyCourses = function (data) {
  var http = new XMLHttpRequest();
  var url = "http://moodle.rose-hulman.edu/lib/ajax/getnavbranch.php";
  var params = "id=mycourses&type=0";
  http.open("POST", url, true);
  http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  http.onreadystatechange = function() {//Call a function when the state changes.
      if(http.readyState == 4 && http.status == 200) {
          var myCourses = JSON.parse(http.responseText).children;
          hideClasses(data, myCourses);
      }
  };
  http.send(params);
};

//run
chrome.storage.sync.get(null, function(data){
      if(data){
        getMyCourses(data);
      }
  });