//============================================================================
//  Gallery 
//============================================================================

var active_element = null;
function current_gallery_element(){
  return active_element;
}

function set_gallery_image(entry_element){
  var image = document.getElementById("gallery-image");

  image.style.width= "200px";
  image.style.height= "200px";
  image.src = "img/static.gif";

  var downloadingImage = new Image();
  downloadingImage.onload = function(){
    image.style.width = "100%";
    image.style.height = "100%";
    image.style.background = "";
    image.src = this.src;   
  };
  downloadingImage.src = entry_element.getAttribute("link");
}

function set_gallery_video(entry_element){
  var video_element = document.getElementById("gallery-video");
  video_element.style.display = "block";
  video_element.src = entry_element.getAttribute("link");
}

function disable_button(element){
  element.classList.remove("osd-button");
  element.classList.add("disabled-osd-button");
}

function enable_button(element){
  element.classList.remove("disabled-osd-button");
  element.classList.add("osd-button");
}

function set_gallery(entry_element){
  var video_gallery = document.getElementById("gallery-video");
  var image_gallery = document.getElementById("gallery-image");

  var prevButton = document.getElementById("gallery-previous");
  var nextButton = document.getElementById("gallery-next");

  enable_button(prevButton);
  enable_button(nextButton);

  video_gallery.style.display = "none";
  image_gallery.style.display = "none";

  active_element = entry_element;
  var entry_type = entry_element.getAttribute("type");

  if (entry_type == "image"){
    set_gallery_image(entry_element);
    image_gallery.style.display = "block";
  }

  else if(entry_type == "video"){
    set_gallery_video(entry_element);
    video_gallery.style.display = "block";
  }

  //Now that we changed the gallery element, 
  //we check if the buttons should be enabled
  var next = next_gallery_element();
  if(!next){
    disable_button(nextButton);
  }
  var prev = previous_gallery_element();
  if(!prev){
    disable_button(prevButton);
  }

}

function next_gallery_element(){
  var next = current_gallery_element().nextElementSibling;
  if (next && next.classList.contains("entry")){
    return next;
  }
}

function previous_gallery_element(){
  var prev = current_gallery_element().previousElementSibling;
  if (prev && prev.classList.contains("entry")){
    return prev;
  }
}

function set_next_gallery_element(){
  var next = next_gallery_element();
  if (next) {
    set_gallery(next);
  }
}

function set_previous_gallery_element(){
  var prev = previous_gallery_element();
  if (prev){
    set_gallery(prev);
  }
}

function open_gallery(element){
  set_gallery(element); 
  var title_el = document.querySelector("#gallery-overlay .osd-header h1");
  title_el.innerHTML = element.parentElement.getAttribute("name");
  document.getElementById("gallery-overlay").style.display = "block";
}

function close_gallery(){
  document.getElementById("gallery-overlay").style.display = "none";
}

//============================================================================
// Resize background video to fill screen 
//============================================================================

function set_background_video_size(video_element){
  var aspectRatio = 9./16.;
  var screenHeight = document.querySelector("body").offsetHeight;
  var screenWidth = document.querySelector("body").offsetWidth;

  var height = screenHeight;
  var width = height/aspectRatio;
  if(width < screenWidth)
  {
    width = screenWidth;
    height = width*aspectRatio;
  }

  video_element.style.width = "" + width  + "px";
  video_element.style.height = "" + height + "px";
}

window.addEventListener('resize', function(event){
  set_background_video_size(document.getElementById("background_video"));
});

//============================================================================
//  OSD transitions 
//============================================================================

function close_osd(element, callback) {
  var old_height = element.offsetHeight; 
  var interval = setInterval(frame, 5);
  element.style.overflow = "hidden"; 
  function frame() {
    var frame_height = element.offsetHeight; 
    if (frame_height <= 0) {
      element.style.display = "none"; 
      element.style.overflow = "auto"; 
      element.style.height = "" + old_height + "px"; 
      clearInterval(interval);
      if (callback) callback();
    } else {
      element.style.height = "" + frame_height-10 + "px"; 
    }
  }
}

function open_osd(element, callback) {
  element.style.overflow = "hidden"; 
  element.style.visibility= "hidden"; 
  element.style.display = "block"; 
  var old_height = parseInt(element.offsetHeight); 
  element.style.height = "0px"; 
  element.style.visibility= "visible"; 
  var interval = setInterval(frame, 5);
  function frame() {
    var frame_height = element.offsetHeight; 
    if (frame_height >= old_height) {
      element.style.height = "" + old_height + "px"; 
      clearInterval(interval);
      element.style.overflow = "auto"; 
      if (callback) callback();
    } else {
      element.style.height = "" + (frame_height+10) + "px"; 
    }
  }
}

function change_osd(from, to){
  var from_el = document.getElementById(from);
  var to_el = document.getElementById(to);
  close_osd(from_el, function(){open_osd(to_el);});
}

//============================================================================
//  Startup
//============================================================================

document.addEventListener("DOMContentLoaded", function(event) { 
  var entries = document.querySelectorAll("div.album");
  for(var i=0; i<entries.length; ++i){
    var img = document.createElement("img");
    img.src = entries[i].getAttribute("thumb");
    entries[i].appendChild(img);
    entries[i].addEventListener("click", function(ev){
      open_gallery(ev.currentTarget.firstElementChild);
    });
  }

  set_background_video_size(document.getElementById("background_video"))
});
