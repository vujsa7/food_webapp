var restaurantsComponent = {
    data(){
      return {
        restaurants : [], // restaurants fetched from backend
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
      axios
      .get("http://localhost:8081/rest/restaurants")
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
          if(this.displayMode == "normal"){
            this.displayRestaurants = this.restaurants.filter(this.filterRestaurants);
          } 
          else { // search mode
            this.displayRestaurants = this.searchedRestaurants.filter(this.filterRestaurants);
          }
      },
      openRestaurantsToDisplay: function(){
        if(this.displayMode == "normal"){
          this.displayRestaurants = this.restaurants.filter(this.filterRestaurants);
        } 
        else { // search mode
          this.displayRestaurants = this.searchedRestaurants.filter(this.filterRestaurants);
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
        if(this.searchParameters[2] != "")
          if(restaurant.restaurantType != this.searchParameters[2].toLowerCase())
            return false;
        if(this.searchParameters[3] != "")
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
      filterRestaurants(restaurant){
        if(this.cuisinesToDisplay.includes("showAll")){ // show all cuisines
          if(this.openRestaurantsToDisplay == true){ // show open restaurants with any cuisine
            if(restaurant.isOpen == true)
              return true;
            else
              return false;
          } else { // show open and closed restaurants with any cuisine
            return true;
          }
        } else {  
          if(this.openRestaurantsToDisplay == true){ // show open restaurants
            if(restaurant.isOpen == true){
              for (var i = 0; i < this.cuisinesToDisplay.length; i++) { // show open restaurants with the right cuisine
                if (restaurant.restaurantType.indexOf(this.cuisinesToDisplay[i]) > -1) {
                  return true;
                }
              }
              return false;
            } else 
              return false;
          } else {
            for (var i = 0; i < this.cuisinesToDisplay.length; i++) {
              if (restaurant.restaurantType.indexOf(this.cuisinesToDisplay[i]) > -1) {
                return true;
              }
            }
            return false;
          }
        }
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
      },
      navigateToRestaurantView(id, restaurant){
        this.$router.push({ name: 'restaurant', params: { id: id }});
      }
    },
    computed:{
      isSearchMode(){ 
        if(this.displayMode == "normal") 
          return false;
        else
          return true;
      }
    },
    template:
    `
    <div class="restaurants-body" v-bind:class="{'restaurant-body-search-mode' : isSearchMode}">
      <div class="card restaurant-card d-flex flex-row" @click="navigateToRestaurantView(restaurant.id, restaurant)" v-for="restaurant in displayRestaurants" v-bind:key="restaurant.id">
          <img class="restaurant-img" v-bind:src="restaurant.bannerImage" alt="Restaurant image">
          <div class="d-flex flex-column restaurant-info">
            <div class="d-flex flex-row">
              <img class="restaurant-logo" v-bind:src="restaurant.logo">
              <span class="card-title pt-1 ps-3 basic-title">{{restaurant.name}}</span>
            </div>
            <div class="d-flex flex-row restaurant-cuisine-and-rating">
              <p class="restaurant-cuisine">{{restaurant.restaurantType.charAt(0).toUpperCase() + restaurant.restaurantType.substring(1)}}</p>
              <div class="d-flex flex-row me-3">
                <img class="location-pin-img" src="../assets/icons/star.png">
                <span class="fw-bold rating-text mx-2">{{restaurant.rating}}</span>
              </div>
            </div>
            <div class="d-flex flex-row me-3">
              <img class="location-pin-img" src="../assets/icons/location-pin-red.png">
              <span class="restaurant-location">Serbia, {{restaurant.location.address.city.name}}, {{restaurant.location.address.street}} {{restaurant.location.address.number}}, {{restaurant.location.address.city.postalCode}}</span>
            </div>
          </div>
      </div>
    </div>
    `
  };