alert("gggggg")
// var input = document.querySelector("#usr_phone_no");
// window.intlTelInput(input, {
//   initialCountry: "in",
//   separateDialCode: true
// });

const phoneInput = document.querySelector("#usr_phone_no");

const iti = window.intlTelInput(phoneInput, {
  initialCountry: "in",             // default to India
  separateDialCode: true,           // shows "+91" separately
  nationalMode: false,              // keeps international format (e.g., +91XXXX)
  utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js"
});