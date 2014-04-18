
var branchImage = chrome.extension.getURL("branch.gif");
var branchBottomImage = chrome.extension.getURL("branchbottom.gif");
var branchOpened = chrome.extension.getURL("opened.png");
var branchClosed = chrome.extension.getURL("closed.png");

var hideClasses = function(data){
  var selectedQuarterCode = computeQuarterCode(data.currentQuarter);
  var QUARTERS = {};
  var RHITmoodleDiv = generateRHITmoodleDiv();
  var mainTag = document.getElementById("objTreeMenu_1_node_1");
  var parentNode =  mainTag.parentNode;
  insertAfter(parentNode, RHITmoodleDiv);
  var childNodes = parentNode.getElementsByTagName('div');
  selectedQuarterClasses = [];
  otherClasses = [];
  childNodes[0].remove();//the one with the title;
  while(childNodes.length != 0){
    var child = childNodes[0];
    var titleContainerElement = child.getElementsByTagName('a')[0];
    var title = titleContainerElement.getAttribute("title");
    var quarterSubstring = title.substring(0,title.indexOf(" "));
    if(! QUARTERS[quarterSubstring]){
      QUARTERS[quarterSubstring] = [];
    }
    QUARTERS[quarterSubstring].push(child);
    child.remove();
  }
  /*if(!data.showPastQuarters && !data.showFutureQuarters){
    $("#RHITmoodleDiv").append(generateQuarterBlock(selectedQuarterCode, QUARTERS[selectedQuarterCode]));
  }else{
    generateQuartersTree(selectedQuarterCode, QUARTERS, data);
  }*/
  generateQuartersTree(selectedQuarterCode, QUARTERS, data);
  parentNode.remove();
  toggle();
  appendCSS();
};

var generateQuarterBlock = function(name, children){
  var div = document.createElement('div');
  var a = document.createElement('a');
  a.setAttribute("id", name);
  a.setAttribute("class", "classgroup");
  var img = document.createElement('img');
  img.setAttribute('src', branchOpened);
  var parent = document.createElement("span");
  parent.innerHTML = name;
  a.appendChild(img);
  a.appendChild(parent);
  div.appendChild(a);
  var classes = document.createElement('div');
  classes.setAttribute("id",name+"classes" );
  for(var i in children){
    var c = children[i];
    children[i].firstChild.firstChild.setAttribute("src", branchImage);
    classes.appendChild(children[i]);
  }
  classes.children[classes.childElementCount-1].firstChild.firstChild.setAttribute("src", branchBottomImage);
  div.appendChild(classes);
  return div;
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
      $("#RHITmoodleDiv").append(past);
    }
    $("#RHITmoodleDiv").append(current);
    if(data.showFutureQuarters){
      $("#RHITmoodleDiv").append(future);
    }
  }else{
    if(data.showFutureQuarters){
      $("#RHITmoodleDiv").append(future.reverse());
    }
    $("#RHITmoodleDiv").append(current.reverse());
    if(data.showPastQuarters){
      $("#RHITmoodleDiv").append(past.reverse());
    }
  }
};

var generateRHITmoodleDiv = function(){
  var RHITmoodleDiv = document.createElement('div');
  RHITmoodleDiv.setAttribute("id", "RHITmoodleDiv");
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

$(document).ready( function () {
  //I do the data load first, because we don't want to run the function before we aquire needed data.
  chrome.storage.sync.get(null, function(obj){
        if(obj){
          hideClasses(obj);
        }
      });
},true); 