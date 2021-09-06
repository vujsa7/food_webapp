Vue.component("manager-restaurant-view", {
    data(){
      return{
          restaurant: undefined,
          user: undefined,
          comments: [],
          scrolled: 0,
          selectedNavIndex: 1,
          displayApproved: true,
          numberOfItems: 1,
          socialMediaLogo: [
            "../../assets/icons/linkedin-logo.png",
            "../../assets/icons/facebook-logo.png",
            "../../assets/icons/instagram-logo.png",
            "../../assets/icons/linkedin-logo.png",
            "../../assets/icons/facebook-logo.png",
            "../../assets/icons/instagram-logo.png"
          ],
          messageDialogData:{
            title: "",
            message: "",
            buttonText: ""
          },
          restaurantId: undefined
      }
    },
    components:{
      articleItem: managerRestaurantArticleItemComponent,
      registerDialog: registerDialogComponent,
      loginDialog: loginDialogComponent,
      messageDialog: messageDialogComponent,
      addArticleDialog: addArticleDialogComponent,
    },
    methods:{
      logout(){
        window.localStorage.setItem('token', null);
        this.$router.push({name: 'logout'});
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
      handleScroll() {
        this.scrolled = window.scrollY;
      },
      displaySignInModal(){
        this.$refs.loginChild.displaySignInModal();
      },
      displaySignUpModal(){
        this.$refs.registerChild.displaySignUpModal();
      },
      displayAddArticleModal(){
        this.$refs.addArticleChild.displayAddArticleModal();
      },
      navigateHome(){
        this.$router.push({name: 'homepage'})
      },
      navigateToOrdersView(){
        if(this.user.accountType == "buyer"){
          this.$router.push({name: 'orders'})
        }else if(this.user.accountType == "manager"){
          this.$router.push({name: 'managerOrders'})
        }  
      },
      navigateToCustomersView(){
        this.$router.push({name: 'managerCustomers'})
      },
      isSelectedNavItem(index){
        if(index == this.selectedNavIndex)
          return true;
        return false;
      },
      logout(){
        window.localStorage.setItem('token', null);
        this.$router.push({name: 'logout'});
      },
      changeSelectedNavItem(index){
        this.selectedNavIndex = index;
      },
      approveComment(id){
        axios
        .put("http://localhost:8081/rest/approveComment/" + id)
          .then(response => {
            axios
            .get("http://localhost:8081/rest/commentsForManager/" + this.restaurant.id)
            .then(response => {
              this.comments = response.data;
            })
            .catch(error => {
              this.comments = []
            })
          })
          .catch(error => {
            console.log(response.data);
          })
      },
      deleteComment(id){
        axios
        .put("http://localhost:8081/rest/deleteComment/" + id)
        .then(response => {
          axios
          .get("http://localhost:8081/rest/commentsForManager/" + this.restaurant.id)
          .then(response => {
            this.comments = response.data;
          })
          .catch(error => {
            this.comments = []
          })
        })
        .catch(error => {
          console.log(response.data);
        })
      },
      reloadRestaurant(){
        let token = window.localStorage.getItem('token');
        axios
        .get("http://localhost:8081/rest/accessUserWithJwt", {
            headers:{
            'Authorization': 'Bearer ' + token
            }
        })
        .then(response => {
            this.user = response.data;
            axios
          .get("http://localhost:8081/rest/managerRestaurant/" + this.user.username)
          .then(response => {
            this.restaurant = response.data;
            axios
            .get("http://localhost:8081/rest/commentsForManager/" + this.restaurant.id)
            .then(response => {
                this.comments = response.data;
                this.restaurantId = this.restaurant.id;
            })
            .catch(error => {
                // Failed to fetch comments
                this.comments = []
            })
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
    created(){
      window.addEventListener('scroll', this.handleScroll);
    },
    mounted(){

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
            axios
          .get("http://localhost:8081/rest/managerRestaurant/" + this.user.username)
          .then(response => {
            this.restaurant = response.data;
            axios
            .get("http://localhost:8081/rest/commentsForManager/" + this.restaurant.id)
            .then(response => {
                this.comments = response.data;
                this.restaurantId = this.restaurant.id;
            })
            .catch(error => {
                // Failed to fetch comments
                this.comments = []
            })
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
    template: 
    `
    <div id="restaurantView">
      <register-dialog ref="registerChild"></register-dialog>
      <login-dialog ref="loginChild"></login-dialog>
      <message-dialog ref="messageDialogChild" :message="messageDialogData"></message-dialog>
      <add-article-dialog ref="addArticleChild" :restaurantId="restaurantId"></add-article-dialog>
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
                    <a class="nav-link fw-bold active mt-1 py-0" @click="changeSelectedNavItem(1); navigateToRestaurantView();" aria-current="page">Restaurant</a>
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
                    <a class="nav-link mt-1 py-0" @click="changeSelectedNavItem(3); navigateToCustomersView()" aria-current="page">Customers</a>
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
                  <a class="nav-link py-0" href="#" @click="displaySignInModal()">Sing in</a>
                </li>
                <li v-if="!user" class="nav-item d-lg-none">
                  <a class="nav-link py-0" href="#" @click="displaySignUpModal()">Sign up</a>
                </li>
              </ul>
            </div>
          </div>
          <div v-if="!user" class="d-none d-lg-block">
            <div class="signin-signup-container mt-2">
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
              <div class="dropdown arrow-container" style="z-index: 100">
                <a id="imageDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                  <img src="../assets/icons/arrow-dark.png" alt="arrow" class="arrow-pic mx-2">
                </a>
                <ul class="dropdown-menu" role="menu" aria-labelledby="imageDropdown">
                  <li><a class="dropdown-item">Edit profile</a></li>
                  <li><a class="dropdown-item" @click="logout()">Logout</a></li>
                </ul>
              </div>
                <span>
                  {{user.name}} {{user.surname}}
                </span>
                <div class="image-cropper mx-2">
                  <img src="../assets/images/profile-picture.jpg" alt="avatar" class="profile-pic">
                </div>
              </div> 
            </div>
          </div>
        </nav>
      </div>
      <div class="restaurant-container">
        <div v-if="restaurant" id="cover-image" class="restaurant-cover-container">
          <img class="img-fluid" :src="restaurant.coverImage" alt="Cover image">
        </div>
        <div class="d-flex restaurant-view-title-container">
          <div v-if="restaurant" class="d-flex left align-items-center">
            <div class="restaurant-view-restaurant-logo-container">
              <img class="img-fluid restaurant-view-restaurant-logo" :src="restaurant.logo" alt="Brand logo">
            </div>
            <span class="ms-3 restaurant-view-restaurant-name display-6">
              {{restaurant.name}}
            </span>
          </div>
          <div v-if="restaurant" class="d-flex right align-items-center justify-content-end">
            <img id="fork-and-knife" class="me-2" src="../assets/icons/fork-and-knife.png" alt="Restaurant type">
            <span class=" fw-bold">{{restaurant.restaurantType.charAt(0).toUpperCase() + restaurant.restaurantType.substring(1)}}</span>
          </div>
        </div>
        <div v-if="restaurant" class="restaurant-view-foods mt-4 d-flex flex-column">
          <div class="d-flex">
            <span class="title left">Foods</span>
            <div v-if="restaurant" class="d-flex right justify-content-end">
              <button type="button" style="background:white" class="btn btn-light shadow-none" @click="displayAddArticleModal()">
                <img src="../assets/icons/plus16px.png"/>
                <span class="fw-bold">Add new article</span>
              </button>
            </div>
          </div>
          <div class="article-container mt-2">
            <div v-for="article in restaurant.articles" v-if="article.articleType=='meal'" class="article-card">
              <articleItem :article="article"></articleItem>
            </div>
          </div>
        </div>
        <div v-if="restaurant" class="restaurant-view-drinks mt-4 d-flex flex-column">
          <div class="d-flex">
            <span class="title left">Drinks</span>
            <div v-if="restaurant" class="d-flex right justify-content-end">
              <button type="button" style="background:white" class="btn btn-light shadow-none" @click="displayAddArticleModal()">
                  <img src="../assets/icons/plus16px.png"/>
                  <span class=" fw-bold">Add new article</span>
              </button>
            </div>
          </div>
          <div class="article-container mt-2">
            <div v-if="article.articleType=='drink'" v-for="article in restaurant.articles" class="article-card">
              <articleItem :article="article"></articleItem>
            </div>
          </div>
        </div>

        <div v-if="restaurant" class="restaurant-view-location-container d-flex flex-column">
          <span class="title fw-bold">Visit us at location</span>
          <div class="d-flex restaurant-view-location-info">
            <div class="d-flex left align-items-center">
              <img class="img-fluid restaurant-view-restaurant-location-pin" src="../assets/icons/location-pin-red.png" alt="Brand logo">
              <span class="ms-3 restaurant-view-restaurant-location-address">
              Serbia, {{restaurant.location.address.city.name}}, {{restaurant.location.address.street}} {{restaurant.location.address.number}}, {{restaurant.location.address.city.postalCode}}
              </span>
            </div>
            <div class="d-flex right align-items-center justify-content-end">
              <div class="dot me-2"></div>
              <span class="restaurant-status-text">Restaurant is open</span>
            </div>
          </div>
          <div class="restaurant-map-container">
            <img class="img-fluid" src="../assets/images/location.jpg" alt="Map location">
          </div>
        </div>

        <div class="restaurant-view-reviews-container d-flex flex-column">
          <div class="d-flex">
            <div v-if="restaurant" class="d-flex left align-items-center">
              <span class="title fw-bold">Restaurant reviews</span>
              <img class="restaurant-view-star-icon ms-3 mb-1 me-2" src="../assets/icons/star.png" alt="Star icon">
              <span class="fw-bold restaurant-view-rating-text">{{restaurant.rating}}</span>
            </div>
            <div v-if="restaurant" class="d-flex right justify-content-end">
              <button type="button" v-on:click="displayApproved = !displayApproved" style="background:white" class="btn btn-light shadow-none">
                <template v-if="displayApproved">
                  <img src="../assets/icons/info.png"/>
                  <span class=" fw-bold">Approve new comments</span>
                </template>
                <template v-else>
                <img src="../assets/icons/resize.png"/>
                <span class=" fw-bold">Show approved reviews</span>
                </template>
              </button>
            </div>
          </div>
          <div class="restaurant-view-reviews">
          <template v-if="!displayApproved">
            <div v-for="comment in comments" :key="comment.id" v-if="!comment.isApproved" class="review-card d-flex flex-column">
                <div class="review-card-basic-info d-flex flex-row align-items-center mb-2">
                <div class="d-flex left align-items-center">
                  <div class="image-cropper mx-2">
                    <img src="../assets/images/profile-picture.jpg" alt="avatar" class="profile-pic">
                  </div>
                  <h5 class="review-card-title m-0">{{comment.buyerId}}</h5>
                </div>
                
                <div class="right d-flex align-items-center justify-content-end me-2">
                  <img class="restaurant-view-star-icon ms-3 mb-1 me-2" src="../assets/icons/star.png" alt="Star icon">
                  <span class="fw-bold restaurant-view-rating-text">{{comment.review}}</span>
                </div>
                
                </div>
                <p class="review-card-comment m-0">{{comment.details}}</p>
                <div class="d-flex flex-row-reverse">
                  <button type="button" class="btn btn-success justify-end ms-3" @click="approveComment(comment.id)">
                    <img src="../assets/icons/checkmark16px.png"/>
                    <span>Approve</span>
                  </button>
                  <button type="button" class="btn btn-danger justify-end" @click="deleteComment(comment.id)">
                    <img src="../assets/icons/delete.png"/>
                    <span>Delete</span>
                  </button>  
                </div>
            </div>
          </template>
          <template v-else>
            <div v-for="comment in comments" :key="comment.id" v-if="comment.isApproved" class="review-card d-flex flex-column">
                <div class="review-card-basic-info d-flex flex-row align-items-center mb-2">
                <div class="d-flex left align-items-center">
                  <div class="image-cropper mx-2">
                    <img src="../assets/images/profile-picture.jpg" alt="avatar" class="profile-pic">
                  </div>
                  <h5 class="review-card-title m-0">{{comment.buyerId}}</h5>
                </div>
                
                <div class="right d-flex align-items-center justify-content-end me-2">
                  <img class="restaurant-view-star-icon ms-3 mb-1 me-2" src="../assets/icons/star.png" alt="Star icon">
                  <span class="fw-bold restaurant-view-rating-text">{{comment.review}}</span>
                </div>
                
                </div>
                <p class="review-card-comment m-0">{{comment.details}}</p>
            </div>
          </template>
          </div>
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