

Vue.component('restaurant-card', {
  template:'#restaurant-template'
})


new Vue({
    el: '#homepage',
    data: {
      scrolled: 0,
      restaurants : [],
    },
    methods: {
      handleScroll() {
        this.scrolled = window.scrollY
      }
    },
    created() {
      window.addEventListener('scroll', this.handleScroll)
    },
    computed: {
      stickySearch() { return this.scrolled > 1060 }
    },
    mounted(){
      axios.get("../rest/restaurants/")
      .then(response => {
        this.restaurants = response.data;
        this.message = "Restaurants fetched";
      })
      .catch(function(error){
        console.log(error);
      })
    }
  })