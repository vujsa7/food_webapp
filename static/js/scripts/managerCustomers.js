var searchWrapper = undefined;

function findPos(obj) {
	var curleft = curtop = 0;
  if (obj && obj.offsetParent) {
    do {
			curleft += obj.offsetLeft;
			curtop += obj.offsetTop;
    } while (obj = obj.offsetParent);
    return curtop
  }
}

let customerSearchResultsComponent = {
    template:'#customers-search-results-template',
    data(){
      return {
        customers : [], 
        filteredCustomers: [],
        searchedCustomers: [],
        displayCustomers: [],
      }
    },
    props:[
      'customersToDisplay',
      'sortCustomersBy',
      'sortOrders',
      'sortOrdersIndex',
      'searchParameters',
      'displayMode'
    ],
    mounted(){
      // Get all restaurants from server
      axios.get("http://localhost:8081/restaurants/getAllUsersByRestaurant/")
      .then(response => {
        this.customers = response.data;
        this.customers = this.customers.sort(this.compareByNameCustomers);
        this.displayCustomers = this.customers;
      })
      .catch(function(error){
        console.log(error);
      })
    },
    watch: { 
      displayMode: function(){
        if(this.displayMode == "normal"){
          this.displayCustomers = this.customers;
        }
      },
      customersToDisplay: function(){
          if(this.displayMode == "normal")
            this.displayCustomers = this.customers.filter(this.filterCustomersByType);
          else // search mode
            this.displayCustomers = this.searchedCustomers.filter(this.filterCustomersByType);
      },
      sortCustomersBy: function(){
        if(this.sortCustomersBy == "usual")
          this.displayCustomers = this.displayCustomers.sort(this.compareByUsernameCustomers);
        else if(this.sortCustomersBy == "name")
          this.displayCustomers = this.displayCustomers.sort(this.compareByNameCustomers);
        else if(this.sortCustomersBy == "surname")
          this.displayCustomers = this.displayCustomers.sort(this.compareBySurnameCustomers);
        else if(this.sortCustomersBy == "username")
          this.displayCustomers = this.displayCustomers.sort(this.compareByUsernameCustomers);
        else if(this.sortCustomersBy == "points")
          this.displayCustomers = this.displayCustomers.sort(this.compareByPointsCustomers);
      },
      sortOrders: function(){
        switch(this.sortOrdersIndex){
          case 0: 
          this.displayCustomers = this.displayCustomers.sort(this.compareByNameCustomers);
            break;
          case 1:
            this.displayCustomers = this.displayCustomers.sort(this.compareBySurnameCustomers);
            break;
          case 2:
            this.displayCustomers = this.displayCustomers.sort(this.compareByUsernameCustomers);
            break;
          case 3:
            this.displayCustomers = this.displayCustomers.sort(this.compareByPointsCustomers);
            break;
        }
      }
    },
    methods:{
      // Filter method for returning all restaurants that meet all the criteriums specified inside search bar
      filterCustomersFromSearch(customer){
        if(this.searchParameters[0] != "")
          if(!customer.name.toLowerCase().includes(this.searchParameters[0].toLowerCase()))
            return false;
        if(this.searchParameters[1] != "")
          if(!customer.surname.toLowerCase().includes(this.searchParameters[1].toLowerCase()))
            return false;
        if(this.searchParameters[2] != "")
          if(!customer.username.toLowerCase().includes(this.searchParameters[2].toLowerCase()))
            return false;
        return true;
      },
      filterCustomersByType(customer) {
        if(this.customersToDisplay.includes("showAll"))
          return true;
        for (var i = 0; i < this.customersToDisplay.length; i++) {
          if (customer.buyerType.indexOf(this.customersToDisplay[i]) > -1) {
            return true;
          }
        }
        return false;
      },
      compareByNameCustomers(c1, c2){
        if(this.sortOrders[0] === "A-Z")
          switcher = -1;
        else if(this.sortOrders[0] === "Z-A")
          switcher = 1;
        if(c1.name < c2.name){
          return 1*switcher;
        }
        if (c1.name > c2.name)
          return -1*switcher;
        return 0;
      },
      compareBySurnameCustomers(c1, c2){
        if(this.sortOrders[0] === "A-Z")
          switcher = -1;
        else if(this.sortOrders[0] === "Z-A")
          switcher = 1;
        if(c1.surname < c2.surname){
          return 1*switcher;
        }
        if (c1.surname > c2.surname)
          return -1*switcher;
        return 0;
      },
      compareByUsernameCustomers(c1, c2){
        if(this.sortOrders[0] === "A-Z")
          switcher = -1;
        else if(this.sortOrders[0] === "Z-A")
          switcher = 1;
        if(c1.username < c2.username){
          return 1*switcher;
        }
        if (c1.username > c2.username)
          return -1*switcher;
        return 0;
      },
      compareByPointsCustomers(c1, c2){
        if(this.sortOrders[2] == "Asc")
          switcher = 1;
        else if(this.sortOrders[2] === "Desc")
          switcher = -1;
        if(c1.points < c2.points){
          return -1*switcher;
        }
        if (c1.points > c2.points)
          return 1*switcher;
        return 0;
      },
      searchCustomers(){
        this.searchedCustomers = this.customers.filter(this.filterCustomersFromSearch);
        this.displayCustomers = this.searchedCustomers;
      }
    }
  };
  
new Vue({
      el: '#managerCustomers',
      data: {
        scrolled: 0,
        searchParameters : ["", "", ""],
        checkedCustomers: ["showAll"],
        sortBy: "usual",
        sortOrders: ["A-Z", "A-Z", "A-Z", "Desc"],
        sortOrdersIndex : undefined,
        displayMode: "normal",
        searchWrapperPosition: 10000,
        socialMediaLogo: [
          "../../assets/icons/linkedin-logo.png",
          "../../assets/icons/facebook-logo.png",
          "../../assets/icons/instagram-logo.png",
          "../../assets/icons/linkedin-logo.png",
          "../../assets/icons/facebook-logo.png",
          "../../assets/icons/instagram-logo.png"
        ],
      },
      components: {
        customerSearchResults : customerSearchResultsComponent
      },
      methods: {
          handleScroll() {
          this.scrolled = window.scrollY;
          this.checkOffset();
        },
        // Method that is controling which checkbox is disabled/enabled based on some conditions
        filterCustomers(val){
          if(val == "showAll"){
            this.checkedCustomers = ["showAll"];
          } else {
            for( var i = 0; i < this.checkedCustomers.length; i++){ 
              if ( this.checkedCustomers[i] === "showAll") { 
                this.checkedCustomers.splice(i, 1); 
              }
            }
          }
          if(this.checkedCustomers.length == 0){
            this.checkedCustomers = ["showAll"]
          }
        },
        // Method that is controlling which sortOrder is applied to each row of "Sort by" options
        sortOrderChanged(e, index){
          e.preventDefault();
          if(index === 3){
            this.$set(this.sortOrders, index, this.sortOrders[index] == "Asc" ? "Desc" : "Asc");    
          } else {
            this.$set(this.sortOrders, index, this.sortOrders[index] == "A-Z" ? "Z-A" : "A-Z");
          }
          this.sortOrdersIndex = index;
          switch(index){
            case 0:
              this.sortBy = "name";
              break;
            case 1:
              this.sortBy = "surname";
              break;
            case 2:
              this.sortBy = "username";
              break;
            case 3:
              this.sortBy = "points";
          }
        },
        searchCustomers(e){
          e.preventDefault();
          this.adjustFilterAndSortValues();
          this.displayMode = "search";
          this.$refs.child1.searchCustomers();
        },
        // Method that is setting checkboxes and radio buttons back to start state
        adjustFilterAndSortValues(){
          this.sortBy = "usual";
          this.sortOrders = ["A-Z", "A-Z", "A-Z", "Desc"];
          this.sortOrdersIndex = undefined;
        },
        showAllCustomers(e){
          e.preventDefault();
          this.checkedCustomers = ["showAll"];
          this.adjustFilterAndSortValues();
          this.displayMode = "normal";
        },
        changeToDarkLogo(index){
        if(index == 0 || index == 3)
          Vue.set(this.socialMediaLogo, index, "../../assets/icons/linkedin-logo-dark.png");
        else if(index == 1 || index == 4)
          Vue.set(this.socialMediaLogo, index, "../../assets/icons/facebook-logo-dark.png");
        else
          Vue.set(this.socialMediaLogo, index, "../../assets/icons/instagram-logo-dark.png");
        },
        changeToLightLogo(index){
          if(index == 0 || index == 3)
            Vue.set(this.socialMediaLogo, index, "../../assets/icons/linkedin-logo.png");
          else if(index == 1 || index == 4)
            Vue.set(this.socialMediaLogo, index, "../../assets/icons/facebook-logo.png");
          else
            Vue.set(this.socialMediaLogo, index, "../../assets/icons/instagram-logo.png");
        },
        checkOffset(){

        if(document.getElementById("filter-sort-wrapper").getBoundingClientRect().top + this.scrolled + document.getElementById("filter-sort-wrapper").offsetHeight
          >= document.getElementById("footer").offsetTop){
          document.getElementById("filter-sort-wrapper").style.position = 'absolute';
          document.getElementById("filter-sort-wrapper").style.top = 'auto';
          document.getElementById("filter-sort-wrapper").style.bottom = '0px';
        } 

        // restore if location is above footer and when if should not stick
        if(this.scrolled + document.getElementById("filter-sort-wrapper").offsetHeight + 130 <= document.getElementById("footer").offsetTop){
            document.getElementById("filter-sort-wrapper").style.position = 'static';
        }

        // restore to sticky when scrolling above
        if((this.scrolled + document.getElementById("filter-sort-wrapper").offsetHeight + 130 <= document.getElementById("footer").offsetTop ) && this.stickySearch){
          document.getElementById("filter-sort-wrapper").style.position = 'fixed'; 
          document.getElementById("filter-sort-wrapper").style.top = '120px';
          document.getElementById("filter-sort-wrapper").style.bottom = 'auto';
        }
      },
      isSelectedNavItem(index){
        if(index == this.selectedNavIndex)
          return true;
        return false;
      },
      changeSelectedNavItem(index){
        this.selectedNavIndex = index;
      }
    },
    created() {
      window.addEventListener('scroll', this.handleScroll);
      this.searchWrapperPosition = findPos(searchWrapper);
    },
    computed: {
      // Method that returns true if window is scrolled past through certain amounts of pixels - in order to stick search menu to top
      stickySearch() {
        return this.scrolled > this.searchWrapperPosition;
      }
    }
    })