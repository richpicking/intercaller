
//globals

var targetID; //the DOM ID of the html containing the numbers we want
var pinCode; //the cleaned pin from the input



function getDialStrings(confpin,ccode) {

  //interesting country codes
  //  var myCC = ["+44","+1","+49","+33"];

  //this stuff is about using the HTML location to map to country dial codes (historically needed this to find the right part of the HTML)
  //var myCC = ["+44"];
  pinCode = confpin;
  switch(ccode) {
    case "GB":
        myCC = ["+44"];
        targetID = "rowIdUK";
        break;
    default:
        myCC = ["+44"];
        targetID = "rowId"+ccode;

   }



  console.log("Conf pin is: "+pinCode+ ", looking for:"+targetID);
  //use this to go get the output from Intercall

  // this is the GAS version:
  //var text = UrlFetchApp.fetch("https://www.intercallonline.com/listNumbersByCode.action?confCode="+confpin).getContentText();
  //try jquery version !

  $.get( "https://www.intercallonline.com/listNumbersByCode.action?confCode="+confpin, outputDialButtons);


}

function outputDialButtons(data) {
  console.log('running output dial buttons..');

  $('#output').html("<h2>Nothing to see here yet..</h2>");


  //remove annoying spaces. (maybe do this after we have the correct DOM node ?)
  //text = data.replace(/\s+/g, "");

  //remove annoying images - prevent the parser from downloading all the flag images !!
  data = data.replace(/<img /gi, "<my_img ").replace(/<\/img>/gi, "</my_img>");


  //parse the intercall page into DOM nodes
  var $parsed_data = $('<div/>').append(data);

  //this bit uses jQuery selector to identify the list of nodes that holds the numbers
  var selector = "#"+targetID+" .row div ul li span";
  var found = $parsed_data.find(selector);

  console.log('numbers found = '+found.length);

  //dump to console the stuff we found in the HTML
  //console.log(found);

  var outputHTML = "";

  var cleanInput = $("#confid").val().replace(/[^0-9]+/g, "");

  //outputHTML += "Length = "+dialnumbers.length+"<br>";
  var workingNumber;
  if(found.length > 0){
    outputHTML+= "<p>Tap the link below to dial.. </p><br><table>";
    for(var i=0;i<found.length;i++){
      workingNumber = found[i].innerHTML.replace(/[^0-9]+/g, "");
      outputHTML += "<tr><td>"+workingNumber+"</td><td><a href=\"tel:"+workingNumber+",,"+cleanInput+"#\" class=\"ui-btn ui-corner-all ui-icon-phone ui-btn-icon-left\">"+workingNumber+"</a></td><td>..pause.."+cleanInput+"\#</tc></tr>"

    //<a href="index.html" class="ui-btn ui-icon-phone ui-btn-icon-left">Home</a>
    }
    outputHTML+= "</table>";
  }else{
    ouputHTML += "<h2>oops - no numbers found. Perhaps they changed the html again !</h2>"
  }

  $('#output').html(outputHTML);
}
