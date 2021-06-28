
let restaurantSearchResultsComponent = {
  template:'#restaurant-search-results-template',
  data(){
    return {
      restaurants : [],
      filteredRestaurants: [],
    }
  },
  props:[
    'cuisinesToDisplay',
    'openRestaurantsToDisplay'
  ],
  mounted(){
    axios.get("http://localhost:8081/rest/restaurants/")
    .then(response => {
      this.restaurants = response.data;
      this.filteredRestaurants = this.restaurants.filter(
        restaurant => restaurant.isOpen == true
      );
    })
    .catch(function(error){
      console.log(error);
    })
    
  },
  watch: { 
    cuisinesToDisplay: function(){
      if(this.cuisinesToDisplay.includes("showAll"))
        this.filteredRestaurants = this.restaurants;
      this.filteredRestaurants = this.restaurants.filter(this.filterCusinesFunction);
    },
    openRestaurantsToDisplay: function(){
      // Show only open restaurants
      if(this.openRestaurantsToDisplay==true){
        this.filteredRestaurants = this.restaurants.filter(
          restaurant => restaurant.isOpen == this.openRestaurantsToDisplay
        );
      } else {
        // Show open & closed restaurants
        this.filteredRestaurants = this.restaurants;
      }
      
    }
  },
  methods:{
    filterCusinesFunction(restaurant) {
      for (var i = 0; i < this.cuisinesToDisplay.length; i++) {
        if (restaurant.restaurantType.indexOf(this.cuisinesToDisplay[i]) > -1) {
          return true;
        }
      }
      return false;
    },
    
  },
  // computed: {
  //   filteredRestaurants: function(){
  //     if(this.cuisinesToDisplay.includes("showAll"))
  //       return this.restaurants;
  //     return this.restaurants.filter(this.filterFunction);
  //   }
  // }
};

new Vue({
    el: '#homepage',
    data: {
      scrolled: 0,
      checkedCuisines: ["showAll"],
      checkedOpenRestaurants: "true"
    },
    components: {
      restaurantSearchResults : restaurantSearchResultsComponent
    },
    methods: {
      handleScroll() {
        this.scrolled = window.scrollY
      },
      filterCuisines(val){
        if(val == "showAll"){
          this.checkedCuisines = ["showAll"];
        } else {
          for( var i = 0; i < this.checkedCuisines.length; i++){ 
            if ( this.checkedCuisines[i] === "showAll") { 
              this.checkedCuisines.splice(i, 1); 
            }
          }
        }
        if(this.checkedCuisines.length == 0){
          this.checkedCuisines = ["showAll"]
        }
          
      }
    },
    created() {
      window.addEventListener('scroll', this.handleScroll)
    },
    computed: {
      stickySearch() { return this.scrolled > 1060 }
    }
  })