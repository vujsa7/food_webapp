Vue.use(vuelidate.default);

smoothScroll = function(elementId) {
    var elmntToView = document.getElementById(elementId);
    elmntToView.scrollIntoView(); 
}
