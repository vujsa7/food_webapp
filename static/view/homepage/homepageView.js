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

Vue.component("homepage-view", {
  data(){
    return{
        user: undefined,
        cart: undefined,
        scrolled: 0,
        selectedNavIndex: 0,
        searchParameters : ["", "", "", ""],
        checkedCuisines: ["showAll"],
        checkedOpenRestaurants: undefined,
        sortBy: "usual",
        sortOrders: ["A-Z", "A-Z", "Desc"],
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
    }
},
components: {
    restaurants: restaurantsComponent,
    registerDialog: registerDialogComponent,
    loginDialog: loginDialogComponent,
    addRestaurantDialog: addRestaurantDialogComponent
},
methods: {
    handleScroll() {
        this.scrolled = window.scrollY;
        this.checkOffset();
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
        if(index === 0 || index === 1){
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
        if(this.searchParameters[2] != "")
          this.checkedCuisines = [this.searchParameters[2].toLowerCase()];
        this.adjustFilterAndSortValues();
        this.displayMode = "search";
        this.$refs.restaurantsChild.searchRestaurants();
    },
    // Method that is setting checkboxes and radio buttons back to start state
    adjustFilterAndSortValues(){
        this.checkedOpenRestaurants = undefined;
        this.sortBy = "usual";
        this.sortOrders = ["A-Z", "A-Z", "Desc"];
        this.sortOrdersIndex = undefined;
    },
    showAllRestaurants(e){
        e.preventDefault();
        this.checkedCuisines = ["showAll"];
        this.adjustFilterAndSortValues();
        this.displayMode = "normal";
        this.searchParameters[0] = "";
        this.searchParameters[1] = "";
        this.searchParameters[2] = "";
        this.searchParameters[3] = "";
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
        if(!document.getElementById("filter-sort-wrapper")) return
        if(!document.getElementById("footer")) return
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
    },
    displaySignInModal(){
      this.$refs.loginChild.displaySignInModal();
    },
    displaySignUpModal(){
      this.$refs.registerChild.displaySignUpModal();
    },
    navigateToCartView(){
      this.$router.push({name: 'cart'})
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
    navigateToCustomersView(){
      if(this.user.accountType == "manager"){
        this.$router.push({name: 'managerCustomers'})
      }else if(this.user.accountType == "administrator"){
        this.$router.push({name: 'administratorCustomers'})
      }
    },
    navigateToEditProfileView(){
      this.$router.push({name: 'editProfile'});
    },
    logout(){
      window.localStorage.setItem('token', null);
      this.$router.push({name: 'logout'});
    },
    displayAddRestaurantModal(){
      this.$refs.addRestaurantChild.displayAddRestaurantModal();
    },
    reloadRestaurants(){
      this.$refs.restaurantsChild.reloadRestaurants();
    }
},
created() {
  window.addEventListener('scroll', this.handleScroll);
},
mounted(){
  searchWrapper = document.getElementById('search-wrapper');
  this.searchWrapperPosition = findPos(searchWrapper);
  let token = window.localStorage.getItem('token');
  if(token){
    axios
    .get("http://localhost:8081/rest/accessUserWithJwt", {
        headers:{
        'Authorization': 'Bearer ' + token
        }
    })
    .then(response => {
      this.user = response.data;
      if(this.user.accountType == "buyer"){
        axios
        .get("http://localhost:8081/rest/cart/" + this.user.username, {
            headers:{
            'Authorization': 'Bearer ' + token
            }
        })
        .then(response => {
            this.cart = response.data;
        })
        .catch(error => {
            console.log(response.data);
        });
      }
    })
    .catch(error => {
        // TODO session probably expired, jwt invalid
    })
  }
},
computed: {
    // Method that returns true if window is scrolled past through certain amounts of pixels - in order to stick search menu to top
    stickySearch() {
        return this.scrolled > this.searchWrapperPosition;
    },
    stickyCart() {
      return this.scrolled > 60;
    }
},
template: `
<div id="homepage">

  <register-dialog ref="registerChild"></register-dialog>
  <login-dialog ref="loginChild"></login-dialog>
  <add-restaurant-dialog ref="addRestaurantChild"></add-restaurant-dialog>
  <transition name="fade">
    <div v-if="cart && stickyCart" id="floating-cart-container">
      <div @click="navigateToCartView()" class="floating-cart-container d-flex align-items-center justify-content-center mb-1">
        <div v-if="cart.articles.length > 0" class="homepage-floating-cart-article-number d-flex justify-content-center align-items-center">
          {{cart.articles.length}}
        </div>
        <img src="../assets/icons/cart.png" alt="shopping-cart" class="shopping-cart-pic">
      </div>
    </div>
  </transition>
  <div id="homepage-content">
    <!--Visible only on xl-->
    <img class="img-fluid d-none d-xl-block" src="../assets/images/hero-image.png" id="hero-image">
    <!--Visible only on lg-->
    <img class="img-fluid d-xl-none d-none d-lg-block" src="../assets/images/hero-image-xl-lg.png" id="hero-image">
    <!--Visible only on md-->
    <img class="img-fluid d-lg-none d-none d-md-block" src="../assets/images/hero-image-md.png" id="hero-image">

    <!--Navigation container-->
    <div class="container-fluid navigation-container pt-3 px-0">
      <div class="container-fluid d-none d-lg-block px-0">
        <img src="../assets/images/logos/foodly-logos/full-logo.png" alt="Brand logo" class="full-logo">
      </div>
      <div class="container d-lg-none px-0">
        <img src="../assets/images/logos/foodly-logos/foodly-logo.png" alt="Brand logo" class="foodly-logo">
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
                    <a class="nav-link fw-bold active mt-1 py-0" @click="changeSelectedNavItem(0)" aria-current="page">Home</a>
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
                    <a class="nav-link mt-1 py-0" @click="changeSelectedNavItem(2); navigateToOrdersView();" aria-current="page">Orders</a>
                    <div class="d-none d-lg-block" :class="{'selected-box' : isSelectedNavItem(2)}"></div>
                  </div>
                </li>
                <li v-if="user && (user.accountType=='administrator' || user.accountType=='manager')" class="nav-item">
                  <div class="nav-link-container">
                    <a class="nav-link mt-1 py-0" @click="changeSelectedNavItem(3); navigateToCustomersView();" aria-current="page">Customers</a>
                    <div class="d-none d-lg-block" :class="{'selected-box' : isSelectedNavItem(3)}"></div>
                  </div>
                </li>
                <li class="nav-item">
                  <div class="nav-link-container">
                    <a class="nav-link mt-1 py-0" @click="changeSelectedNavItem(4)">About us</a>
                    <div class="d-none d-lg-block" :class="{'selected-box' : isSelectedNavItem(4)}"></div>
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
          <div class="d-none d-lg-block">
            <div class="homepage-user-info-container d-flex flex-row-reverse mt-2">
              <div class="dropdown" style="z-index: 100">
                <a id="imageDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                  <img src="../assets/icons/arrow.png" alt="arrow" class="arrow-pic mx-2">
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
              <div v-if="cart && !stickyCart" @click="navigateToCartView()" class="cart-container mb-1 me-2 d-flex align-items-center justify-content-center">
                <div v-if="cart.articles.length > 0" class="dot cart-article-number d-flex justify-content-center align-items-center">
                  {{cart.articles.length}}
                </div>
                <img src="../assets/icons/cart.png" alt="shopping-cart" class="shopping-cart-pic mx-1">
              </div>
            </div> 
          </div>
        </div>
      </nav>
    </div>

    
    <!-- Hero container -->
    <div class="container-fluid hero-container px-0">
        <h1 class="fw-bold"> 
          Order fresh &<br>
          delicious food in<br>
          just <span id="red-hero-text">5 minutes!</span>
        </h1>
        <p class="display-6 m-0 mt-3" id="hero-paragraph">What are you waiting?</p>
        <button type="button" onclick="smoothScroll('search-container')" class="btn btn-danger regular-button mt-3">Order now</button>
    </div>
    <div class="container-fluid px-0" id="search-container">
      <div>
        <h1 class="fw-bold mt-4"> 
          Where to eat?
        </h1>
      </div>
      
      <div v-bind:class="{'sticky-search' : stickySearch}" > 
        <div class="search-wrapper" id="search-wrapper" v-bind:class="{'sticky-search-wrapper' : stickySearch}">
          <div id="search-fields-wrapper">
            <div>
              <input type="text" class="form-control" placeholder="Restaurant name..." v-model="searchParameters[0]">
            </div>
            <div>
              <input type="text" class="form-control" placeholder="Location..." v-model="searchParameters[1]">
            </div>
            <div>
              <select class="form-select" v-model="searchParameters[2]">
                <option value="" disabled selected>Cuisine...</option>
                <option value="Barbecue">Barbecue</option>
                <option value="Italian">Italian</option>
                <option value="Chinese">Chinese</option>
              </select>
            </div>
            <div>
              <select class="form-select" v-model="searchParameters[3]">
                <option value="" disabled selected>Rating...</option>
                <option value="4-5">4-5 stars</option>
                <option value="3-4">3-4 stars</option>
                <option value="2-3">2-3 stars</option>
                <option value="1-2">1-2 stars</option>
              </select>
            </div>
          </div>
          <div>
            <button type="button" class="btn btn-danger regular-button" :disabled="searchParameters[0] == '' && searchParameters[1] == '' && searchParameters[2] == '' && searchParameters[3]==''" @click="searchRestaurants">Search</button>
          </div>
        </div>
      </div>
    </div>

    <div v-bind:class="{'sticky-empty-div' : stickySearch}"></div>

    <div class="d-flex flex-row">
      <div class="shrinking-margin"></div>
      <div class="center-div">
        <div class="search-body-container d-flex">
          <div id="big-filter-sort-container" class="big-filter-sort-container">
            <div class="d-none d-lg-block filter-sort-wrapper" id="filter-sort-wrapper" v-bind:class="{'filter-sort-wrapper-sticky': stickySearch}">
              <div v-bind:class="{'empty-filter-sort' : stickySearch}"></div>
              <!-- Filter container -->
              <div class="row filter-sort-container">
                <span class="basic-title p-0">Cuisine</span>
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
                <div class="form-check last-form-check">
                  <input class="form-check-input m-0" type="checkbox" value="chinese" v-model="checkedCuisines" v-on:change="filterCuisines()" id="flexCheckChinese">
                  <label class="form-check-label" for="flexCheckChinese">
                    Chinese
                  </label>
                </div>
                <h1 class="basic-title px-0">Status</h1>
                <div class="form-check last-form-check">
                  <input class="form-check-input m-0" type="checkbox" value="true" v-model="checkedOpenRestaurants" id="flexCheckStatus">
                  <label class="form-check-label" for="flexCheckStatus">
                    Show only open restaurants
                  </label>
                </div>
              </div>
              <!-- Sort container -->
              <div class="row filter-sort-container">
                <span class="basic-title p-0">Sort by</span>
                <div class="row">
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
                      <input class="form-check-input m-0" type="radio" name="flexRadioDefault" value="location" v-model="sortBy" id="flexRadioLocation">
                      <label class="form-check-label" for="flexRadioLocation">
                        Nearest location
                      </label>
                    </div>
                    <div class="form-check last-form-check">
                      <input class="form-check-input m-0" type="radio" name="flexRadioDefault" value="rating" v-model="sortBy" id="flexRadioRating">
                      <label class="form-check-label" for="flexRadioRating">
                        Rating
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
          <div class="d-flex flex-column" >
            <div class="d-flex flex-row search-results">
              <h5 class="search-results-header" :hidden="displayMode!='search'">Search results</h5>
              <a class="nav-link" href="#" :hidden="displayMode!='search'" @click="showAllRestaurants">Show all restaurants</a>
              <div v-if="user && user.accountType=='administrator'" class="d-flex ms-auto p-2 bd-highlight">
                <button type="button" style="background:white" class="btn btn-light shadow-none" @click="displayAddRestaurantModal()">
                  <img src="../assets/icons/plus16px.png"/>
                  <span class="fw-bold">Create new restaurant</span>
                </button>
              </div>
            </div>
            <restaurants ref="restaurantsChild" :cuisines-to-display="checkedCuisines" :open-restaurants-to-display="checkedOpenRestaurants" :sort-restaurants-by="sortBy" :sort-orders="sortOrders" :sort-orders-index="sortOrdersIndex" :search-parameters="searchParameters" :display-mode="displayMode"></restaurants>
          </div>
        </div>
      </div>
      <div class="shrinking-margin"></div>
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