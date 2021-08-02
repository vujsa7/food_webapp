
let restaurantSearchResultsComponent = {
  template:'#restaurant-search-results-template',
  data(){
    return {
      restaurants : [], // restaurants fetched from backend
      filteredRestaurants: [],
      searchedRestaurants: [],
      displayRestaurants: [],
    }
  },
  props:[
    'cuisinesToDisplay',
    'openRestaurantsToDisplay',
    'sortRestaurantsBy',
    'sortOrders',
    'sortOrdersIndex',
    'searchParameters',
    'displayMode'
  ],
  mounted(){
    // Get all restaurants from server
    axios.get("http://localhost:8081/rest/restaurants/")
    .then(response => {
      this.restaurants = response.data;
      this.restaurants = this.restaurants.sort(this.compareByOpenRestaurants);
      this.displayRestaurants = this.restaurants;
    })
    .catch(function(error){
      console.log(error);
    })
  },
  watch: { 
    displayMode: function(){
      if(this.displayMode == "normal"){
        this.displayRestaurants = this.restaurants;
      }
    },
    cuisinesToDisplay: function(){
        if(this.displayMode == "normal")
          this.displayRestaurants = this.restaurants.filter(this.filterCusines);
        else // search mode
          this.displayRestaurants = this.searchedRestaurants.filter(this.filterCusines);
    },
    openRestaurantsToDisplay: function(){
      if(this.displayMode == "normal"){
        // Show only open restaurants
        if(this.openRestaurantsToDisplay == true){
          this.displayRestaurants = this.restaurants.filter(
            restaurant => restaurant.isOpen == this.openRestaurantsToDisplay
          );
        } else {
          // Show open & closed restaurants
          this.displayRestaurants = this.restaurants;
        }
      } else { // search mode
        // Show only open restaurants
        if(this.openRestaurantsToDisplay==true){
          this.displayRestaurants = this.searchedRestaurants.filter(
            restaurant => restaurant.isOpen == this.openRestaurantsToDisplay
          );
        } else {
          // Show open & closed restaurants
          this.displayRestaurants = this.searchedRestaurants;
        }
      }
    },
    sortRestaurantsBy: function(){
      if(this.sortRestaurantsBy == "usual")
        this.displayRestaurants = this.displayRestaurants.sort(this.compareByIdRestaurants);
      else if(this.sortRestaurantsBy == "name")
        this.displayRestaurants = this.displayRestaurants.sort(this.compareByNameRestaurants);
      else if(this.sortRestaurantsBy == "location")
        this.displayRestaurants = this.displayRestaurants.sort(this.compareByLocationRestaurants);
      else if(this.sortRestaurantsBy == "rating")
        this.displayRestaurants = this.displayRestaurants.sort(this.compareByRatingRestaurants);
    },
    sortOrders: function(){
      switch(this.sortOrdersIndex){
        case 0: 
          this.displayRestaurants = this.displayRestaurants.sort(this.compareByNameRestaurants);
          break;
        case 1:
          this.displayRestaurants = this.displayRestaurants.sort(this.compareByLocationRestaurants);
          break;
        case 2:
          this.displayRestaurants = this.displayRestaurants.sort(this.compareByRatingRestaurants);
          break;
      }
    }
  },
  methods:{
    // Filter method for returning all restaurants that meet all the criteriums specified inside search bar
    filterRestaurantsFromSearch(restaurant){
      if(this.searchParameters[0] != "")
        if(!restaurant.name.toLowerCase().includes(this.searchParameters[0].toLowerCase()))
          return false;
      if(this.searchParameters[1] != "")
        if(!restaurant.location.address.city.name.toLowerCase().includes(this.searchParameters[1].toLowerCase()) && !restaurant.location.address.street.toLowerCase().includes(this.searchParameters[1].toLowerCase()) && !(restaurant.location.address.number.toLowerCase()== this.searchParameters[1].toLowerCase()))
          return false;
      if(this.searchParameters[2] != "allCuisines")
        if(restaurant.restaurantType != this.searchParameters[2].toLowerCase())
          return false;
      if(this.searchParameters[3] != "allRatings")
        switch(this.searchParameters[3]){
          case "4-5":
            if(restaurant.rating < 4)
              return false;
            return true;
          case "3-4":
            if(restaurant.rating < 3 || restaurant.rating > 4)
              return false;
            return true;
          case "2-3":
            if(restaurant.rating < 2 || restaurant.rating > 3)
              return false;
            return true;
          case "1-2":
            if(restaurant.rating > 2)
              return false;
            return true;
        }
      return true;
    },
    // Filter method for returning all restaurants that are certain restaurantType - types to display are in cuisinesToDisplay
    filterCusines(restaurant) {
      if(this.cuisinesToDisplay.includes("showAll"))
        return true;
      for (var i = 0; i < this.cuisinesToDisplay.length; i++) {
        if (restaurant.restaurantType.indexOf(this.cuisinesToDisplay[i]) > -1) {
          return true;
        }
      }
      return false;
    },
    // Compare function that compares restaurants by their open status, returns restaurant that are open first
    compareByOpenRestaurants(r1, r2) {
      if (r1.isOpen < r2.isOpen)
        return 1;
      if (r1.isOpen > r2.isOpen)
        return -1;
      return 0;
    },
    // Compare function that compares restaurants by their ids
    compareByIdRestaurants(r1, r2){
      if(r1.id < r2.id){
        return -1;
      }
      if (r1.id > r2.id)
        return 1;
      return 0;
    },
    // Compare function that compares restaurants by their names
    compareByNameRestaurants(r1, r2){
      if(this.sortOrders[0] === "A-Z")
        switcher = -1;
      else if(this.sortOrders[0] === "Z-A")
        switcher = 1;
      if(r1.name < r2.name){
        return 1*switcher;
      }
      if (r1.name > r2.name)
        return -1*switcher;
      return 0;
    },
    // Compare function that compares restaurants by their locations
    compareByLocationRestaurants(r1, r2){
      // TODO : implement comparison and sorting based on nearest location
    },
    // Compare function that compares restaurants by their rating
    compareByRatingRestaurants(r1, r2){
      if(this.sortOrders[2] == "Asc")
        switcher = 1;
      else if(this.sortOrders[2] === "Desc")
        switcher = -1;
      if(r1.rating < r2.rating){
        return -1*switcher;
      }
      if (r1.rating > r2.rating)
        return 1*switcher;
      return 0;
    },
    searchRestaurants(){
      this.searchedRestaurants = this.restaurants.filter(this.filterRestaurantsFromSearch);
      this.displayRestaurants = this.searchedRestaurants;
    }
  }
};

new Vue({
    el: '#homepage',
    data: {
      scrolled: 0,
      searchParameters : ["","", "allCuisines", "allRatings"],
      checkedCuisines: ["showAll"],
      checkedOpenRestaurants: undefined,
      sortBy: "usual",
      sortOrders: ["A-Z", "Desc", "Desc"],
      sortOrdersIndex : undefined,
      displayMode: "normal"
    },
    components: {
      restaurantSearchResults : restaurantSearchResultsComponent
    },
    methods: {
      handleScroll() {
        this.scrolled = window.scrollY
      },
      // Method that is controling which checkbox is disabled/enabled based on some conditions
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
      },
      // Method that is controlling which sortOrder is applied to each row of "Sort by" options
      sortOrderChanged(e, index){
        e.preventDefault();
        if(index === 0){
          this.$set(this.sortOrders, index, this.sortOrders[index] == "A-Z" ? "Z-A" : "A-Z");
        } else {
          this.$set(this.sortOrders, index, this.sortOrders[index] == "Asc" ? "Desc" : "Asc");
        }
        this.sortOrdersIndex = index;
        switch(index){
          case 0:
            this.sortBy = "name";
            break;
          case 1:
            this.sortBy = "location";
            break;
          case 2:
            this.sortBy = "rating";
        }
      },
      searchRestaurants(e){
        e.preventDefault();
        if(this.searchParameters[2] != "allCuisines")
          this.checkedCuisines = [this.searchParameters[2].toLowerCase()];
        this.adjustFilterAndSortValues();
        this.displayMode = "search";
        this.$refs.child1.searchRestaurants();
      },
      // Method that is setting checkboxes and radio buttons back to start state
      adjustFilterAndSortValues(){
        this.checkedOpenRestaurants = undefined;
        this.sortBy = "usual";
        this.sortOrders = ["A-Z", "Desc", "Desc"];
        this.sortOrdersIndex = undefined;
      },
      showAllRestaurants(e){
        e.preventDefault();
        this.checkedCuisines = ["showAll"];
        this.adjustFilterAndSortValues();
        this.displayMode = "normal";
      }
    },
    created() {
      window.addEventListener('scroll', this.handleScroll)
    },
    computed: {
      // Method that returns true if window is scrolled past through certain amounts of pixels - in order to stick search menu to top
      stickySearch() { return this.scrolled > 893 },
      
    }
  })