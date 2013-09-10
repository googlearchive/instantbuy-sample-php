/**
 * This file contains all global variables.
 * @author niketas(Niketa Srivastava)
 */
// Page transition type.
var transitionType;
// Product image path.
var imgSrc;
// Screen sizes.
var windowHeight = window.innerHeight ||
  document.documentElement.clientHeight || document.body.clientHeight;
var WIDTH_515 = 515;
var WIDTH_495 = 495;
var WIDTH_460 = 460;
var WIDTH_360 = 360;
var WIDTH_320 = 320;
// Width of screen.
var windowWidth = window.innerWidth ||
  document.documentElement.clientWidth || document.body.clientWidth;
transitionType = (windowWidth <= WIDTH_515) ? 'slide' : 'none';
if (windowWidth <= WIDTH_320) {
  imgSrc = "img/products/320";
} else if(windowWidth <= WIDTH_460) {
  imgSrc = "img/products/460";
} else if (windowWidth <= WIDTH_495){
  imgSrc = "img/products/495";
} else {
  imgSrc = "img/products/default";
}
