
var signUpModal = document.getElementById("sign-up-modal");

// Get the button that opens the modal
var signUpBtn = document.getElementById("signupbtn");
var signUpLink = document.getElementsByClassName("signuplink")[0];


// When the user clicks the button, open the modal 
signUpBtn.onclick = function() {
  signUpModal.style.display = "block";
}

signUpLink.onclick = function() {
  signUpModal.style.display = "block";
}

var signInModal = document.getElementById("sign-in-modal");
var signInBtn = document.getElementById("signinbtn");
var signInLink = document.getElementsByClassName("signinlink")[0];

// When the user clicks the button, open the modal 
signInBtn.onclick = function() {
  signInModal.style.display = "block";
}

signInLink.onclick = function() {
  signInModal.style.display = "block";
}

// Get the <span> elements that closes the modal
var spanSignUp = document.getElementsByClassName("close")[0];
var spanSignIn = document.getElementsByClassName("close")[1];


// When the user clicks on <span> (x), close the modal
spanSignUp.onclick = function() {
  signUpModal.style.display = "none";
}

spanSignIn.onclick = function() {
  signInModal.style.display = "none";
}

var signUpSpan = document.getElementsByClassName("signupspan")[0];
var signInSpan = document.getElementsByClassName("signinspan")[0];

signUpSpan.onclick = function() {
  signUpModal.style.display = "block";
  signInModal.style.display = "none";
}

signInSpan.onclick = function() {
  signUpModal.style.display = "none";
  signInModal.style.display = "block";
}

var dialogInfoModal = document.getElementById("dialog-info-modal");

window.onclick = function(event) {
  if (event.target == dialogInfoModal) {
    dialogInfoModal.style.display = "none";
  }
}





