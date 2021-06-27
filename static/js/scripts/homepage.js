
Vue.component('restaurant-search-results', {
  template:'#restaurant-search-results-template',
  data() {
    return {
      restaurants: undefined
    }
  },
  mounted(){
    axios.get("http://localhost:8081/rest/restaurants/")
    .then(response => {
      this.restaurants = response.data;
    })
    .catch(function(error){
      console.log(error);
    })
  }
});

new Vue({
    el: '#homepage',
    data: {
      scrolled: 0
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
    }
  })