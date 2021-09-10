

Vue.component("manager-customers-view", {
    data() {
      return {
        user: undefined,
        customers: undefined,
        searchedCustomers: [],
        displayCustomers: [],
        scrolled: 0,
        selectedNavIndex: 3,
        searchCustomersPosition: 10000,
        checkedCustomersTypes: ["showAll"],
        sortBy: "usual",
        sortOrders: ["A-Z", "A-Z", "A-Z", "Desc"],
        sortCustomersIndex: undefined,
        displayMode: "normal",
        socialMediaLogo: [
          "../../assets/icons/linkedin-logo.png",
          "../../assets/icons/facebook-logo.png",
          "../../assets/icons/instagram-logo.png",
          "../../assets/icons/linkedin-logo.png",
          "../../assets/icons/facebook-logo.png",
          "../../assets/icons/instagram-logo.png"
        ],
        searchCustomerName: "",
        searchCustomerSurname: "",
        searchCustomerUsername: ""
      }
    },
    computed: {
      // Method that returns true if window is scrolled past through certain amounts of pixels - in order to stick search menu to top
      stickySearch() {
        return this.scrolled > this.searchCustomersPosition;
      },
      stickyCart() {
        return this.scrolled > 60;
      }
    },
    created() {
      window.addEventListener('scroll', this.handleScroll);
    },
    mounted() {
      searchOrders = document.getElementById('search-orders');
      this.searchCustomersPosition = findPos(searchOrders) + 22;
  
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
              .get("http://localhost:8081/rest/getAllUsersByRestaurant", {
                headers: {
                  'Authorization': 'Bearer ' + token
                }
              })
              .then(response => {
                this.customers = response.data;
                this.displayCustomers = this.customers;
              })
              .catch(error => {
                console.log(response.data);
              });
          })
          .catch(error => {
            // TODO session probably expired, jwt invalid
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
        this.sortOrders = ["A-Z","A-Z", "A-Z", "Desc"];
        this.sortCustomersIndex = undefined;
        this.checkedCustomersTypes = ["showAll"];
      },
      showAllOrders(e) {
        e.preventDefault();
        this.displayMode = "normal";
        this.adjustFilterAndSortValues();
      },
      filterCustomersTypes(val) {
        if (val == "showAll") {
          this.checkedCustomersTypes = ["showAll"];
        } else {
          for (var i = 0; i < this.checkedCustomersTypes.length; i++) {
            if (this.checkedCustomersTypes[i] === "showAll") {
              this.checkedCustomersTypes.splice(i, 1);
            }
          }
        }
        if (this.checkedCustomersTypes.length == 0) {
          this.checkedCustomersTypes = ["showAll"]
        }
      },
      filterCustomers(customer) {
        if (this.checkedCustomersTypes.includes("showAll")) {  // show all order statuses
          return true;
        } else {
            for (var i = 0; i < this.checkedCustomersTypes.length; i++) {
              if (customer.buyerType.indexOf(this.checkedCustomersTypes[i]) > -1) {
                return true;
              }
            }
            return false;
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
      searchOrders() {
        this.displayMode = "search";
        this.adjustFilterAndSortValues();
        this.searchedCustomers = this.customers.filter(this.filterCustomersFromSearch);
        this.displayCustomers = this.searchedCustomers;
      },
      filterCustomersFromSearch(customer) {
        if(this.searchCustomerName != "")
          if(!customer.name.toLowerCase().includes(this.searchCustomerName.toLowerCase()))
            return false;
        if(this.searchCustomerSurname != "")
          if(!customer.surname.toLowerCase().includes(this.searchCustomerSurname.toLowerCase()))
            return false;
        if(this.searchCustomerUsername != "")
          if(!customer.username.toLowerCase().includes(this.searchCustomerUsername.toLowerCase()))
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
      navigateToOrdersView(){
        if(this.user.accountType == "buyer"){
          this.$router.push({name: 'orders'})
        }else if(this.user.accountType == "manager"){
          this.$router.push({name: 'managerOrders'})
        }  
      },
      navigateToRestaurantView(){
        this.$router.push({name: 'managerRestaurant'})
      },
      navigateToEditProfileView(){
        this.$router.push({name: 'editProfile'});
      },
    },
    watch: {
      checkedCustomersTypes: function () {
        if (this.displayMode == "normal") {
          this.displayCustomers = this.customers.filter(this.filterCustomers);
        }
        else {  // search mode
          this.displayCustomers = this.searchedCustomers.filter(this.filterCustomers);
        }
      },
      sortBy: function(){
        if(this.sortBy == "usual")
          this.displayCustomers = this.displayCustomers.sort(this.compareByUsernameCustomers);
        else if(this.sortBy == "name")
          this.displayCustomers = this.displayCustomers.sort(this.compareByNameCustomers);
        else if(this.sortBy == "surname")
          this.displayCustomers = this.displayCustomers.sort(this.compareBySurnameCustomers);
        else if(this.sortBy == "username")
          this.displayCustomers = this.displayCustomers.sort(this.compareByUsernameCustomers);
        else if(this.sortBy == "points")
          this.displayCustomers = this.displayCustomers.sort(this.compareByPointsCustomers);
      },
      sortOrders: function(){
        switch(this.sortCustomersIndex){
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
    components: {
      customer: managerCustomerComponent
    },
    template:
      `
      <div id="manager-customers-view">
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
                  <li v-if="user && (user.accountType=='buyer' || user.accountType=='manager')" class="nav-item">
                    <div class="nav-link-container">
                      <a class="nav-link mt-1 py-0" @click="changeSelectedNavItem(2); navigateToOrdersView()" aria-current="page">Orders</a>
                      <div class="d-none d-lg-block" :class="{'selected-box' : isSelectedNavItem(2)}"></div>
                    </div>
                  </li>
                  <li v-if="user && (user.accountType=='administrator' || user.accountType=='manager')" class="nav-item">
                    <div class="nav-link-container">
                      <a class="nav-link fw-bold active mt-1 py-0" @click="changeSelectedNavItem(3)" aria-current="page">Customers</a>
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
            <div v-if="user.accountType == 'manager'" class="d-none d-lg-block">
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
          <!--Search container-->
          <div class="orders-search-container d-flex flex-column">
              <span id="search-orders" class="orders-title mb-2">Search customers</span>
              <div v-bind:class="{'absolute-orders-sticky-search' : stickySearch}">
                <div class="orders-fields-container" v-bind:class="{'orders-sticky-search' : stickySearch}">
                    <div class="orders-fields d-flex flex-row">
                      <div class="orders-restaurant-container column-prop">
                          <input type="text" v-model="searchCustomerName" class="form-control" placeholder="Name...">
                      </div>
                      <div class="orders-restaurant-container column-prop">
                          <input type="text" v-model="searchCustomerSurname" class="form-control" placeholder="Surname...">
                      </div>
                      <div class="orders-restaurant-container column-prop">
                          <input type="text" v-model="searchCustomerUsername" class="form-control" placeholder="Username...">
                      </div>
                    </div>
                    <button class="btn btn-danger orders-regular-button regular-button" :disabled="searchCustomerName == '' && searchCustomerSurname == '' && searchCustomerUsername == ''" @click="searchOrders">Search</button>
                </div>
              </div>
          </div>
          
          <div class="d-flex flex-row">
              <div class="customers-shrinking-margin"></div>
              <div class="center-container">
                  <div class="search-body-container d-flex">
                      <div id="orders-big-filter-sort-container" class="customers-big-filter-sort-container">
                        <div class="d-none d-lg-block filter-sort-wrapper" id="filter-sort-wrapper" v-bind:class="{'filter-sort-wrapper-sticky': stickySearch}">
                          <div v-bind:class="{'empty-filter-sort' : stickySearch}"></div>
                          <!-- Filter container -->
                          <div class="row customers-filter-sort-container">
                            <h1 class="basic-title px-0">Order status</h1>
                            <div class="mb-3">
                                <div class="form-check">
                                  <input class="form-check-input m-0" :disabled="checkedCustomersTypes[0] == 'showAll'" v-on:change="filterCustomersTypes('showAll')" v-model="checkedCustomersTypes" type="checkbox" value="showAll" id="flexCheckAll">
                                  <label class="form-check-label" for="flexCheckAll">
                                    Show all
                                  </label>
                                </div>
                                <div class="form-check">
                                  <input class="form-check-input m-0" :disabled="checkedCustomersTypes.includes('delivered')" type="checkbox" v-model="checkedCustomersTypes" v-on:change="filterCustomersTypes()" value="bronze" id="flexCheckBronze">
                                  <label class="form-check-label" for="flexCheckBronze">
                                    Bronze
                                  </label>
                                </div>
                                <div class="form-check">
                                  <input class="form-check-input m-0" type="checkbox" :disabled="checkedCustomersTypes.includes('undelivered')" v-model="checkedCustomersTypes" v-on:change="filterCustomersTypes()" value="silver" id="flexCheckSilver">
                                  <label class="form-check-label" for="flexCheckSilver">
                                    Silver
                                  </label>
                                </div>
                                <div class="form-check">
                                  <input class="form-check-input m-0" type="checkbox" :disabled="checkedCustomersTypes.includes('undelivered')" v-model="checkedCustomersTypes" v-on:change="filterCustomersTypes()" value="gold" id="flexCheckGold">
                                  <label class="form-check-label" for="flexCheckGold">
                                    Gold
                                  </label>
                                </div>
                            </div>
                            
                          </div>
                          <!-- Sort container -->
                          <div class="row customers-filter-sort-container">
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
                                      Name
                                    </label>
                                  </div>
                                  <div class="form-check">
                                    <input class="form-check-input m-0" type="radio" name="flexRadioDefault" value="surname" v-model="sortBy" id="flexRadioSurname">
                                    <label class="form-check-label" for="flexRadioSurname">
                                      Surname
                                    </label>
                                  </div>
                                  <div class="form-check">
                                    <input class="form-check-input m-0" type="radio" name="flexRadioDefault" value="username" v-model="sortBy" id="flexRadioUsername">
                                    <label class="form-check-label" for="flexRadioUsername">
                                      Username
                                    </label>
                                  </div>
                                  <div class="form-check">
                                    <input class="form-check-input m-0" type="radio" name="flexRadioDefault" value="points" v-model="sortBy" id="flexRadioPoints">
                                    <label class="form-check-label" for="flexRadioPoints">
                                      Points
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
                      <div class="d-flex flex-column search-customer-cards-container" v-bind:class="{'search-order-cards-container-margin' : stickySearch}">
                          <div class="d-flex flex-row">
                              <h5 class="order-search-results-header" :hidden="displayMode!='search'">Search results</h5>
                              <a class="nav-link" href="#" :hidden="displayMode!='search'" @click="showAllOrders">Show all orders</a>
                          </div>
                          <div v-for="customer in displayCustomers">
                              <customer :customer="customer"></customer>
                          </div>
                      </div>
                  </div>
              </div>
              <div class="customers-shrinking-margin"></div>
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