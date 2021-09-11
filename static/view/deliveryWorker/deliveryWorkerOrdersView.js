Vue.component("deliver-orders-view", {
    data() {
      return {
        user: undefined,
        orders: undefined,
        searchedOrders: [],
        displayOrders: [],
        scrolled: 0,
        selectedNavIndex: 2,
        searchOrdersPosition: 10000,
        searchRestaurantName: "",
        checkedCuisines: ["showAll"],
        checkedOrderStatuses: ["showAll"],
        sortBy: "usual",
        sortOrders: ["A-Z", "Desc", "Desc"],
        sortOrdersIndex: undefined,
        displayMode: "normal",
        socialMediaLogo: [
          "../../assets/icons/linkedin-logo.png",
          "../../assets/icons/facebook-logo.png",
          "../../assets/icons/instagram-logo.png",
          "../../assets/icons/linkedin-logo.png",
          "../../assets/icons/facebook-logo.png",
          "../../assets/icons/instagram-logo.png"
        ],
        startingPrice: "",
        limitPrice: "",
        startingDate: undefined,
        limitDate: undefined,
        datepicker1: undefined,
        datepicker2: undefined,
        awaitingDelivery: undefined,
        pickupDeliveryOrderId: undefined
      }
    },
    computed: {
      // Method that returns true if window is scrolled past through certain amounts of pixels - in order to stick search menu to top
      stickySearch() {
        return this.scrolled > this.searchOrdersPosition;
      },
      formatStartingPrice() {
        return '$' + this.startingPrice;
      },
      formatLimitPrice() {
        return '$' + this.limitPrice;
      },
    },
    created() {
      window.addEventListener('scroll', this.handleScroll);
    },
    mounted() {
      const input1 = document.getElementById('datepicker1');
      this.datepicker1 = new TheDatepicker.Datepicker(input1);
      this.datepicker1.options.onSelect(this.updateStartingDate);
      this.datepicker1.render();
  
      const input2 = document.getElementById('datepicker2');
      this.datepicker2 = new TheDatepicker.Datepicker(input2);
      this.datepicker2.options.onSelect(this.updateLimitDate);
      this.datepicker2.render();
  
      searchOrders = document.getElementById('search-orders');
      this.searchOrdersPosition = findPos(searchOrders) + 22;
  
      let token = window.localStorage.getItem('token');
      if (token) {
        // Fetch user data
        axios
          .get("http://localhost:8081/rest/accessUserWithJwt", {
            headers: {
              'Authorization': 'Bearer ' + token
            }
          })
          .then(response => {
            this.user = response.data;
            // Fetch orders data
            axios
              .get("http://localhost:8081/rest/deliveryOrders/" + this.user.username, {
                headers: {
                  'Authorization': 'Bearer ' + token
                }
              })
              .then(response => {
                this.orders = response.data;
                this.displayOrders = this.orders;
                console.log(response.data);
              })
              .catch(error => {
                console.log(error.response);
              });
          })
          .catch(error => {
            // TODO session probably expired, jwt invalid
            console.log(error.response);
          })
      }
    },
    methods: {
      handleScroll() {
        this.scrolled = window.scrollY;
        this.checkOffset();
      },
      checkOffset() {
        if (!document.getElementById("filter-sort-wrapper")) return
        if (!document.getElementById("footer")) return
        if (document.getElementById("filter-sort-wrapper").getBoundingClientRect().top + this.scrolled + document.getElementById("filter-sort-wrapper").offsetHeight
          >= document.getElementById("footer").offsetTop) {
          document.getElementById("filter-sort-wrapper").style.position = 'absolute';
          document.getElementById("filter-sort-wrapper").style.top = 'auto';
          document.getElementById("filter-sort-wrapper").style.bottom = '0px';
        }
        // restore if location is above footer and when if should not stick
        if (this.scrolled + document.getElementById("filter-sort-wrapper").offsetHeight + 130 <= document.getElementById("footer").offsetTop) {
          document.getElementById("filter-sort-wrapper").style.position = 'static';
        }
        // restore to sticky when scrolling above
        if ((this.scrolled + document.getElementById("filter-sort-wrapper").offsetHeight + 130 <= document.getElementById("footer").offsetTop) && this.stickySearch) {
          document.getElementById("filter-sort-wrapper").style.position = 'fixed';
          document.getElementById("filter-sort-wrapper").style.top = '120px';
          document.getElementById("filter-sort-wrapper").style.bottom = 'auto';
        }
      },
      updateStartingDate() {
        if (this.datepicker1.getSelectedDate())
          this.startingDate = Date.parse(this.datepicker1.getSelectedDate().toString());
        else
          this.startingDate = undefined;
      },
      updateLimitDate() {
        if (this.datepicker2.getSelectedDate())
          this.limitDate = Date.parse(this.datepicker2.getSelectedDate().toString());
        else
          this.limitDate = undefined;
      },
      isSelectedNavItem(index) {
        if (index == this.selectedNavIndex)
          return true;
        return false;
      },
      changeSelectedNavItem(index) {
        this.selectedNavIndex = index;
      },
      changeToDarkLogo(index) {
        if (index == 0 || index == 3)
          Vue.set(this.socialMediaLogo, index, "../../assets/icons/linkedin-logo-dark.png");
        else if (index == 1 || index == 4)
          Vue.set(this.socialMediaLogo, index, "../../assets/icons/facebook-logo-dark.png");
        else
          Vue.set(this.socialMediaLogo, index, "../../assets/icons/instagram-logo-dark.png");
      },
      changeToLightLogo(index) {
        if (index == 0 || index == 3)
          Vue.set(this.socialMediaLogo, index, "../../assets/icons/linkedin-logo.png");
        else if (index == 1 || index == 4)
          Vue.set(this.socialMediaLogo, index, "../../assets/icons/facebook-logo.png");
        else
          Vue.set(this.socialMediaLogo, index, "../../assets/icons/instagram-logo.png");
      },
      // Method that is setting checkboxes and radio buttons back to start state
      adjustFilterAndSortValues() {
        this.sortBy = "usual";
        this.sortOrders = ["A-Z", "Desc", "Desc"];
        this.checkedCuisines = ["showAll"];
        this.sortOrdersIndex = undefined;
        this.checkedOrderStatuses = ["showAll"];
      },
      showAllOrders(e) {
        e.preventDefault();
        this.displayMode = "normal";
        this.adjustFilterAndSortValues();
        this.restaurantName = "";
        this.startingPrice = "";
        this.limitPrice = "";
        this.startingDate = undefined;
        this.limitDate =  undefined;
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
      },
      filterOrderStatuses(val){
        if(val == "showAll"){
          this.checkedOrderStatuses = ["showAll"];
        } else {
          for( var i = 0; i < this.checkedOrderStatuses.length; i++){ 
              if ( this.checkedOrderStatuses[i] === "showAll") { 
                this.checkedOrderStatuses.splice(i, 1); 
              }
          }
        }
        if(this.checkedOrderStatuses.length == 0){
          this.checkedOrderStatuses = ["showAll"]
        }
      },
      filterOrders(order){
        if(this.checkedOrderStatuses.includes("showAll")){  // show all order statuses
          if(this.checkedCuisines.includes("showAll")){
            return true;
          }
          else{
            for (var i = 0; i < this.checkedCuisines.length; i++) {
              if (order.restaurantType.indexOf(this.checkedCuisines[i]) > -1) {
                return true;
              }
            }
            return false;
          }
        } else if(this.checkedOrderStatuses.includes("undelivered")){
          if(this.checkedCuisines.includes("showAll")){ // show all undelivered
            if (order.orderStatus.indexOf("processing") > -1 || order.orderStatus.indexOf("inPreparation") > -1 || order.orderStatus.indexOf("awaitingDelivery") > -1
            || order.orderStatus.indexOf("shipping") > -1 || order.orderStatus.indexOf("canceled") > -1) {
              return true;
            }
            return false;
          } else {
            for (var i = 0; i < this.checkedCuisines.length; i++) {
              if (order.restaurantType.indexOf(this.checkedCuisines[i]) > -1) {
                if (order.orderStatus.indexOf("processing") > -1 || order.orderStatus.indexOf("preparation") > -1 || order.orderStatus.indexOf("awaiting") > -1
                || order.orderStatus.indexOf("shipping") > -1 || order.orderStatus.indexOf("canceled") > -1) {
                  return true;
                }
                return false;
              }
            }
            return false;
          }
        } else {
          if(this.checkedCuisines.includes("showAll")){
            for (var i = 0; i < this.checkedOrderStatuses.length; i++) {
              if (order.orderStatus.indexOf(this.checkedOrderStatuses[i]) > -1) {
                return true;
              }
            }
            return false;
          } else {
            for (var i = 0; i < this.checkedCuisines.length; i++) {
              if (order.restaurantType.indexOf(this.checkedCuisines[i]) > -1) {
                for (var i = 0; i < this.checkedOrderStatuses.length; i++) {
                  if (order.orderStatus.indexOf(this.checkedOrderStatuses[i]) > -1) {
                    return true;
                  }
                }
                return false;
              }
            }
            return false;
          }
          
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
            this.sortBy = "price";
            break;
        case 2:
            this.sortBy = "date";
        }
      },
      compareByIdOrders(r1, r2){
        if(r1.id < r2.id){
          return -1;
        }
        if (r1.id > r2.id)
          return 1;
        return 0;
      },
      compareByNameOrders(r1, r2){
        if(this.sortOrders[0] === "A-Z")
          switcher = -1;
        else if(this.sortOrders[0] === "Z-A")
          switcher = 1;
        if(r1.restaurantName < r2.restaurantName){
          return 1*switcher;
        }
        if (r1.restaurantName > r2.restaurantName)
          return -1*switcher;
        return 0;
      },
      compareByPriceOrders(r1, r2){
        if(this.sortOrders[1] == "Asc")
          switcher = 1;
        else if(this.sortOrders[1] === "Desc")
          switcher = -1;
        if(r1.price < r2.price){
          return -1*switcher;
        }
        if (r1.price > r2.price)
          return 1*switcher;
        return 0;
      },
      compareByDateOrders(r1, r2){
        if(this.sortOrders[2] == "Asc")
          switcher = 1;
        else if(this.sortOrders[2] === "Desc")
          switcher = -1;
        date1 = Date.parse(r1.dateOfOrder);
        date2 = Date.parse(r2.dateOfOrder);
        console.log(date1)
        console.log(date2)
        if(date1 < date2){
          return -1*switcher;
        }
        if (date1 > date2)
          return 1*switcher;
        return 0;
      },
      searchOrders() {
        this.displayMode = "search";
        this.adjustFilterAndSortValues();
        this.searchedOrders = this.orders.filter(this.filterOrdersFromSearch);
        this.displayOrders = this.searchedOrders;
      },
      filterOrdersFromSearch(order) {
        if(this.searchRestaurantName != "")
            if(!order.restaurantName.toLowerCase().includes(this.searchRestaurantName.toLowerCase()))
              return false;
          if(this.startingPrice != "")
            if(order.price < parseFloat(this.startingPrice))
              return false;
          if(this.limitPrice != "")
            if(order.price > parseFloat(this.limitPrice))
              return false;
          if(this.startingDate != undefined)
            if(Date.parse(order.dateOfOrder) < this.startingDate)
              return false;
          if(this.limitDate != undefined)
            if(Date.parse(order.dateOfOrder) > this.limitDate)
              return false;
          return true;
      },
      navigateHome() {
        this.$router.push({ name: 'homepage' })
      },
      logout(){
        window.localStorage.setItem('token', null);
        this.$router.push({name: 'logout'});
      },
      navigateToRestaurantView() {
        this.$router.push({ name: 'managerRestaurant' })
      },
      navigateToCustomersView() {
        this.$router.push({ name: 'managerCustomers' })
      },
      navigateToEditProfileView(){
        this.$router.push({name: 'editProfile'});
      },
      updateValueStartingPrice(e) {
        this.startingPrice = e.target.value.replace("$", '');
      },
      updateValueLimitPrice(e) {
        this.limitPrice = e.target.value.replace("$", '');
      },
      pickupDelivery(id){
        let token = window.localStorage.getItem('token');
        axios
        .post("http://localhost:8081/rest/pickupDelivery/" + id, this.user.username, {
            headers:{
                'Authorization': 'Bearer ' + token,
                'Content-Type' : 'text/plain'
            }
        })
        .then(response => {
            console.log(response.data);
            return true;
        })
        .catch(error => {
            console.log(error.response)
            return false;
        });
      },
      markAsDelivered(id){
        let token = window.localStorage.getItem('token');
        axios
        .post("http://localhost:8081/rest/markAsDelivered/" + id,  this.user.username, {
            headers:{
                'Authorization': 'Bearer ' + token,
                'Content-Type' : 'text/plain'
            }
        })
        .then(response => {
            console.log(response.data);
            this.orders.find(element => element.id == id).orderStatus = "delivered";
            this.displayOrders = this.orders
        })
        .catch(error => {
            console.log(error.response)
        });
      },
    },
    watch: {
      checkedCuisines: function(){
        if(this.displayMode == "normal"){
            this.displayOrders = this.orders.filter(this.filterOrders);
        }
        else { // search mode
            this.displayOrders = this.searchedOrders.filter(this.filterOrders);
        } 
      },
      checkedOrderStatuses: function () {
        if (this.displayMode == "normal") {
          this.displayOrders = this.orders.filter(this.filterOrders);
        }
        else {  // search mode
          this.displayOrders = this.searchedOrders.filter(this.filterOrders);
        }
      },
      sortBy: function(){
        if(this.sortBy == "usual")
          this.displayOrders = this.displayOrders.sort(this.compareByIdOrders);
        else if(this.sortBy == "name")
          this.displayOrders = this.displayOrders.sort(this.compareByNameOrders);
        else if(this.sortBy == "price")
          this.displayOrders = this.displayOrders.sort(this.compareByPriceOrders);
        else if(this.sortBy == "date")
          this.displayOrders = this.displayOrders.sort(this.compareByDateOrders);
      },
      sortOrders: function(){
        switch(this.sortOrdersIndex){
          case 0: 
            this.displayOrders = this.displayOrders.sort(this.compareByNameOrders);
            break;
          case 1:
            this.displayOrders = this.displayOrders.sort(this.compareByPriceOrders);
            break;
          case 2:
            this.displayOrders = this.displayOrders.sort(this.compareByDateOrders);
            break;
        }
      }
    },
    components: {
        order: deliveryWorkerOrderComponent,
    },
    template:
      `
      <div id="orders-view">
      <!--Navigation container-->
      <div class="container-fluid navigation-container pt-3 px-0">
        <div class="container-fluid d-none d-lg-block px-0">
          <img src="../assets/images/logos/foodly-logos/full-logo.png" @click="navigateHome()" alt="Brand logo" class="full-logo">
        </div>
        <div class="container d-lg-none px-0">
          <img src="../assets/images/logos/foodly-logos/foodly-logo.png" @click="navigateHome()" alt="Brand logo" class="foodly-logo">
        </div>
        <nav class="navbar navbar-expand-lg navbar-light">
          <div class="container-fluid px-0">
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
              <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNavDropdown">
                <ul class="navbar-nav">
                  <li class="nav-item">
                    <div class="nav-link-container">
                      <a class="nav-link mt-1 py-0" @click="changeSelectedNavItem(0); navigateHome()" aria-current="page">Home</a>
                      <div class="d-none d-lg-block" :class="{'selected-box' : isSelectedNavItem(0)}"></div>
                    </div>
                  </li>
                  <li v-if="user && user.accountType=='manager'" class="nav-item">
                    <div class="nav-link-container">
                      <a class="nav-link mt-1 py-0" @click="changeSelectedNavItem(1); navigateToRestaurantView();" aria-current="page">Restaurant</a>
                      <div class="d-none d-lg-block" :class="{'selected-box' : isSelectedNavItem(1)}"></div>
                    </div>
                  </li>
                  <li v-if="user && (user.accountType=='buyer' || user.accountType=='manager' || user.accountType=='deliveryWorker')" class="nav-item">
                    <div class="nav-link-container">
                      <a class="nav-link fw-bold active mt-1 py-0" @click="changeSelectedNavItem(2);" aria-current="page">Orders</a>
                      <div class="d-none d-lg-block" :class="{'selected-box' : isSelectedNavItem(2)}"></div>
                    </div>
                  </li>
                  <li v-if="user && (user.accountType=='administrator' || user.accountType=='manager')" class="nav-item">
                    <div class="nav-link-container">
                      <a class="nav-link mt-1 py-0" @click="changeSelectedNavItem(3); navigateToCustomersView();" aria-current="page">Customers</a>
                      <div class="d-none d-lg-block" :class="{'selected-box' : isSelectedNavItem(3)}"></div>
                    </div>
                  </li>
                  <li v-if="!user" class="nav-item d-lg-none">
                    <a class="nav-link py-0" @click="displaySignInModal()">Sing in</a>
                  </li>
                  <li v-if="!user" class="nav-item d-lg-none">
                    <a class="nav-link py-0" @click="displaySignUpModal()">Sign up</a>
                  </li>
                </ul>
            </div>
          </div>
          <div v-if="!user" class="d-none d-lg-block">
            <div class="homepage-signin-signup-container mt-2">
              <div>
                <a @click="displaySignInModal()" class="nav-link">Sign in</a>
              </div>
              <div>
                <button type="button" @click="displaySignUpModal()" class="btn btn-danger regular-button">Sign up</button>
              </div>
            </div> 
          </div>
          <div v-if="user">
            <div v-if="user.accountType == 'deliveryWorker'" class="d-none d-lg-block">
              <div class="user-info-container d-flex flex-row-reverse mt-2">
                <div class="dropdown" style="z-index: 100">
                  <a id="imageDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                    <img src="../assets/icons/arrow-dark.png" alt="arrow" class="arrow-pic mx-2">
                  </a>
                  <ul class="dropdown-menu" role="menu" aria-labelledby="imageDropdown">
                    <li><a class="dropdown-item" @click="navigateToEditProfileView()">Edit profile</a></li>
                    <li><a class="dropdown-item" @click="logout()">Logout</a></li>
                  </ul>
                </div>
                <span>
                  {{user.name}} {{user.surname}}
                </span>
                <img :src="user.image" alt="avatar" class="profile-pic">
        
              </div> 
            </div>
          </div>
        </nav>
      </div>
      <div class="orders-body">
          <div class="orders-user-info">
              <div class="orders-graph-container d-none d-xl-block box-shadow">
                  <img class="img-fluid graph-img" src="../assets/images/graph.png">
              </div>
              <div class="orders-details-container d-flex flex-column">
                  <div class="card1 box-shadow d-flex flex-row align-items-center">
                      <div class="order-details-red-container ms-5 d-flex justify-content-center align-items-center">
                          <img src="../assets/icons/desk-bell.png" class="order-details-img" alt="Calenar image">
                      </div>
                      <div class="d-flex flex-column ms-4 me-2 justify-content-center">
                          <span class="mb-1">Awaiting delivery</span>
                          <span class="fw-bold">14</span>
                      </div>
                  </div>
                  <div class="card2 box-shadow d-flex flex-row align-items-center">
                      <div class="order-details-red-container ms-5 d-flex justify-content-center align-items-center">
                          <img src="../assets/icons/motor.png" class="order-details-img" alt="Bag image">
                      </div>
                      <div class="d-flex flex-column ms-4 me-2 justify-content-center">
                          <span class="mb-1">Active deliveries</span>
                          <span class="fw-bold">2</span>
                      </div>
                  </div>
              </div>
              <div class="orders-details-container d-flex flex-column">
                  <div class="card1 box-shadow d-flex flex-row align-items-center">
                      <div class="order-details-red-container ms-5 d-flex justify-content-center align-items-center">
                          <img src="../assets/icons/bag.png" class="order-details-img" alt="Dolar">
                      </div>
                      <div class="d-flex flex-column ms-4 me-2 justify-content-center">
                          <span class="mb-1">Total deliveries</span>
                          <span class="fw-bold">141</span>
                      </div>
                  </div>
                  <div class="card2 box-shadow d-flex flex-row align-items-center">
                      <div class="order-details-red-container ms-5 d-flex justify-content-center align-items-center">
                          <img src="../assets/icons/calendar.png" class="order-details-img" alt="Graph">
                      </div>
                      <div class="d-flex flex-column ms-4 me-2 justify-content-center">
                          <span class="mb-1">Deliveries this week</span>
                          <span class="fw-bold">33</span>
                      </div>
                  </div>
              </div>
          </div>
          <div class="orders-small-graph-container d-xl-none box-shadow">
              <img class="img-fluid graph-img" src="../assets/images/graph.png">
          </div>
  
          <!--Search container-->
          <div class="orders-search-container d-flex flex-column">
              <span id="search-orders" class="orders-title mb-2">Search orders</span>
              <div v-bind:class="{'absolute-orders-sticky-search' : stickySearch}">
                <div class="orders-fields-container" v-bind:class="{'orders-sticky-search' : stickySearch}">
                    <div class="orders-fields d-flex flex-row">
                        <div class="orders-restaurant-container column-prop">
                            <input type="text" v-model="searchRestaurantName" class="form-control" placeholder="Restaurant name...">
                        </div>
                        <div class="orders-price-container column-prop">
                            <div class="d-flex flex-row">
                                <div class="order-search-small-container me-3 d-flex justify-content-center align-items-center">
                                    <img src="../assets/icons/price.png" class="order-search-small-img" alt="">
                                </div>
                                <div class="d-flex flex-column order-expand-column">
                                    <span>Price</span>
                                    <div class="d-flex flex-row">
                                        <input maxlength="6" type="text" :value="formatStartingPrice" @input="updateValueStartingPrice" class="text-line" />
                                        <span class="gray-line ms-3 me-3">-</span>
                                        <input maxlength="6" :value="formatLimitPrice" @input="updateValueLimitPrice" type="text" class="text-line" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="manager-orders-date-container column-prop">
                            <div class="d-flex flex-row">
                                <div class="order-search-small-container me-3 d-flex justify-content-center align-items-center">
                                    <img src="../assets/icons/date.png" class="order-search-small-img" alt="">
                                </div>
                                <div class="d-flex flex-column order-expand-column">
                                    <span>Date</span>
                                    <div class="d-flex flex-row">
                                        <div><input id="datepicker1" type="text" class="text-line" /></div>
                                        <span class="gray-line ms-3 me-3">-</span>
                                        <div><input id="datepicker2" type="text" class="text-line" /></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button class="btn btn-danger orders-regular-button regular-button" :disabled="searchRestaurantName == '' && (startingPrice == '' || limitPrice == '') && (startingDate == undefined || limitDate == undefined)" @click="searchOrders">Search</button>
                </div>
              </div>
          </div>
          
          <div class="d-flex flex-row">
              <div class="orders-shrinking-margin"></div>
              <div class="center-container">
                  <div class="search-body-container d-flex">
                      <div id="orders-big-filter-sort-container" class="orders-big-filter-sort-container">
                        <div class="d-none d-lg-block filter-sort-wrapper" id="filter-sort-wrapper" v-bind:class="{'filter-sort-wrapper-sticky': stickySearch}">
                          <div v-bind:class="{'empty-filter-sort' : stickySearch}"></div>
                          <!-- Filter container -->
                        <div class="row filter-sort-container">
                          <span class="basic-title p-0">Cuisine</span>
                          <div class="scrolling-container1 mb-3">
                            <div class="form-check">
                                <input class="form-check-input m-0" type="checkbox" :disabled="checkedCuisines[0] == 'showAll'"  value="showAll" v-model="checkedCuisines" v-on:change="filterCuisines('showAll')" id="flexCheckShowAll">
                                <label class="form-check-label" for="flexCheckShowAll">
                                  Show all
                                </label>
                              </div>
                              <div class="form-check">
                                <input class="form-check-input m-0" type="checkbox" value="barbecue" v-model="checkedCuisines" v-on:change="filterCuisines()" id="flexCheckBarbecue">
                                <label class="form-check-label" for="flexCheckBarbecue">
                                  Barbecue
                                </label>
                              </div>
                              <div class="form-check">
                                <input class="form-check-input m-0" type="checkbox" value="italian" v-model="checkedCuisines" v-on:change="filterCuisines()" id="flexCheckItalian">
                                <label class="form-check-label" for="flexCheckItalian">
                                  Italian
                                </label>
                              </div>
                              <div class="form-check mb-2">
                                <input class="form-check-input m-0" type="checkbox" value="chinese" v-model="checkedCuisines" v-on:change="filterCuisines()" id="flexCheckChinese">
                                <label class="form-check-label" for="flexCheckChinese">
                                  Chinese
                                </label>
                              </div>
                          </div>
                          
                          <h1 class="basic-title px-0">Order status</h1>
                          <div class="scrolling-container2 mb-3">
                            <div class="form-check">
                                <input class="form-check-input m-0" :disabled="checkedOrderStatuses[0] == 'showAll'" v-on:change="filterOrderStatuses('showAll')" v-model="checkedOrderStatuses" type="checkbox" value="showAll" id="flexCheckAll">
                                <label class="form-check-label" for="flexCheckAll">
                                  Show all
                                </label>
                              </div>
                              <div class="form-check">
                                <input class="form-check-input m-0" :disabled="checkedOrderStatuses.includes('delivered')" type="checkbox" v-model="checkedOrderStatuses" v-on:change="filterOrderStatuses()" value="undelivered" id="flexCheckUndelivered">
                                <label class="form-check-label" for="flexCheckUndelivered">
                                  Show undelivered
                                </label>
                              </div>
                              <div class="form-check">
                                <input class="form-check-input m-0" type="checkbox" :disabled="checkedOrderStatuses.includes('undelivered')" v-model="checkedOrderStatuses" v-on:change="filterOrderStatuses()" value="processing" id="flexCheckProcessing">
                                <label class="form-check-label" for="flexCheckProcessing">
                                  Processing
                                </label>
                              </div>
                              <div class="form-check">
                                <input class="form-check-input m-0" type="checkbox" :disabled="checkedOrderStatuses.includes('undelivered')" v-model="checkedOrderStatuses" v-on:change="filterOrderStatuses()" value="inPreparation" id="flexCheckPreparation">
                                <label class="form-check-label" for="flexCheckPreparation">
                                  In preparation
                                </label>
                              </div>
                              <div class="form-check">
                                <input class="form-check-input m-0" type="checkbox" :disabled="checkedOrderStatuses.includes('undelivered')" v-model="checkedOrderStatuses" v-on:change="filterOrderStatuses()" value="awaitingDelivery" id="flexCheckAwaiting">
                                <label class="form-check-label" for="flexCheckAwaiting">
                                  Awaiting delivery
                                </label>
                              </div>
                              <div class="form-check">
                                <input class="form-check-input m-0" type="checkbox" :disabled="checkedOrderStatuses.includes('undelivered')" v-model="checkedOrderStatuses" v-on:change="filterOrderStatuses()" value="shipping" id="flexCheckShipping">
                                <label class="form-check-label" for="flexCheckShipping">
                                  Shipping
                                </label>
                              </div>
                              <div class="form-check">
                                <input class="form-check-input m-0" type="checkbox" :disabled="checkedOrderStatuses.includes('undelivered')" v-model="checkedOrderStatuses" v-on:change="filterOrderStatuses()" value="delivered" id="flexCheckDelivered">
                                <label class="form-check-label" for="flexCheckDelivered">
                                  Delivered
                                </label>
                              </div>
                              <div class="form-check">
                                <input class="form-check-input m-0" type="checkbox" :disabled="checkedOrderStatuses.includes('undelivered')" v-model="checkedOrderStatuses" v-on:change="filterOrderStatuses()" value="canceled" id="flexCheckCanceled">
                                <label class="form-check-label" for="flexCheckCanceled">
                                  Canceled
                                </label>
                              </div>
                          </div>
                          
                        </div>
                        <!-- Sort container -->
                        <div class="row filter-sort-container">
                          <span class="basic-title p-0">Sort by</span>
                            <div class="d-flex flex-row ps-0 pe-5">
                              <div class="col-9 p-0 ">
                                <div class="form-check">
                                    <input class="form-check-input m-0" type="radio" name="flexRadioDefault" value="usual" v-model="sortBy" id="flexRadioUsual">
                                    <label class="form-check-label" for="flexRadioUsual">
                                        Usual
                                    </label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input m-0" type="radio" name="flexRadioDefault" value="name" v-model="sortBy" id="flexRadioName">
                                    <label class="form-check-label" for="flexRadioName">
                                        Restaurant name
                                    </label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input m-0" type="radio" name="flexRadioDefault" value="price" v-model="sortBy" id="flexRadioPrice">
                                    <label class="form-check-label" for="flexRadioPrice">
                                        Price
                                    </label>
                                </div>
                                <div class="form-check last-form-check">
                                    <input class="form-check-input m-0" type="radio" name="flexRadioDefault" value="date" v-model="sortBy" id="flexRadioDate">
                                    <label class="form-check-label" for="flexRadioDate">
                                        Date
                                    </label>
                                </div>
                              </div>
                              <div class="col-3 p-0 sort-orders">
                                <div v-for="(sortOrder, index) in sortOrders">
                                  <div class="row sort-order-container">
                                    <div class="col px-0" style="text-align:end;">
                                      <img @click="sortOrderChanged($event, index)" :src="sortOrder == 'Asc' ? '../assets/icons/ascending.png' : (sortOrder =='Desc' ? '../assets/icons/descending.png' : (sortOrder =='Z-A' ? '../assets/icons/ascending.png' : '../assets/icons/descending.png'))" class="img-fluid sort-icon">
                                    </div>
                                    <div class="col p-0">
                                      <a class="nav-link" href="#" @click="sortOrderChanged($event, index)">{{sortOrder}}</a>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                        </div>
                        </div>          
                      </div>
                      <div class="d-flex flex-column search-order-cards-container" v-bind:class="{'search-order-cards-container-margin' : stickySearch}">
                          <div class="d-flex flex-row">
                              <h5 class="order-search-results-header" :hidden="displayMode!='search'">Search results</h5>
                              <a class="nav-link" href="#" :hidden="displayMode!='search'" @click="showAllOrders">Show all orders</a>
                          </div>
                          <div v-for="order in displayOrders">
                              <order :order="order"></order>
                          </div>
                      </div>
                  </div>
              </div>
              <div class="orders-shrinking-margin"></div>
          </div>
      </div>
      <footer class="text-white" id="footer">
          <div class="container p-4 pb-0">
            <section class="footer-info d-flex flex-row mb-4">
              <div class="d-flex flex-column text">
                <div class="basic-title">
                  Attributors
                </div>
                <span class="mb-3 mt-2">
                  Aleksa Vujisić
                </span>
                <span>
                  Nenad Bečanović
                </span>
              </div>
              <div class="d-flex flex-column">
                <div class="basic-title">
                  Field of expertise
                </div>
                <span class="mb-3 mt-2">
                  Frontend
                </span>
                <span>
                  Backend
                </span>
              </div>
              <div class="d-flex flex-column">
                <div class="basic-title">
                  Links
                </div>
                <div class="d-flex flex-row">
                  <a class="btn btn-outline-light btn-circle m-1" target="_blank" href="https://www.linkedin.com/in/aleksavujisic/" @mouseover="changeToDarkLogo(0)" @mouseout="changeToLightLogo(0)" role="button"><img v-bind:src="socialMediaLogo[0]" class="link-image"></a>
                  <a class="btn btn-outline-light btn-circle m-1" target="_blank" href="https://www.facebook.com/aleksa.vujisicc/" @mouseover="changeToDarkLogo(1)" @mouseout="changeToLightLogo(1)" role="button"><img v-bind:src="socialMediaLogo[1]" class="link-image"></a>
                  <a class="btn btn-outline-light btn-circle m-1" target="_blank" href="https://www.instagram.com/aleksavujisic/" @mouseover="changeToDarkLogo(2)" @mouseout="changeToLightLogo(2)" role="button"><img v-bind:src="socialMediaLogo[2]" class="link-image"></a>
                </div>
                <div class="d-flex flex-row">
                  <a class="btn btn-outline-light btn-circle m-1" target="_blank" href="https://www.linkedin.com/in/nenad-becanovic/" @mouseover="changeToDarkLogo(3)" @mouseout="changeToLightLogo(3)" role="button"><img v-bind:src="socialMediaLogo[3]" class="link-image"></a>
                  <a class="btn btn-outline-light btn-circle m-1" target="_blank" href="https://www.facebook.com/nenad.becanovic.3" @mouseover="changeToDarkLogo(4)" @mouseout="changeToLightLogo(4)" role="button"><img v-bind:src="socialMediaLogo[4]" class="link-image"></a>
                  <a class="btn btn-outline-light btn-circle m-1" target="_blank" href="https://www.instagram.com/nenad_becanovic/" @mouseover="changeToDarkLogo(5)" @mouseout="changeToLightLogo(5)" role="button"><img v-bind:src="socialMediaLogo[5]" class="link-image"></a>
                </div>
              </div>
            </section>
          </div>
          <div class="text-center p-3 copyright">
            © Copyright: Aleksa Vujisić, Nenad Bečanović
          </div>
      </footer>
  </div>
      `
  });