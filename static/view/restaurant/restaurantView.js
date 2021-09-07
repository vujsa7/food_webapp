Vue.component("restaurant-view", {
    data(){
      return{
          restaurant: undefined,
          user: undefined,
          comments: [],
          scrolled: 0,
          selectedNavIndex: 0,
          numberOfItems : 1,
          socialMediaLogo: [
            "../../assets/icons/linkedin-logo.png",
            "../../assets/icons/facebook-logo.png",
            "../../assets/icons/instagram-logo.png",
            "../../assets/icons/linkedin-logo.png",
            "../../assets/icons/facebook-logo.png",
            "../../assets/icons/instagram-logo.png"
          ],
          cart: undefined,
          messageDialogData:{
            title: "",
            message: "",
            buttonText: ""
          },
      }
    },
    components:{
      articleItem: articleItemComponent,
      registerDialog: registerDialogComponent,
      loginDialog: loginDialogComponent,
      messageDialog: messageDialogComponent,
      mapViewComponent: mapViewComponent
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
      addArticleToCart(article, numberOfItems){
        if(this.user){
          if(!this.cart){
            let articles = [];
            for(x = 0; x < numberOfItems; x+=1){
              articles.push(article);
            }
            this.cart = {articles: articles, price: (article.price*numberOfItems), buyerId: this.user.username}
          } else {
            if(this.cart.articles.length != 0){
              if(this.cart.articles[0].restaurantId != this.restaurant.id){
                this.messageDialogData.title = "Can't add item to cart";
                this.messageDialogData.message = "You already have items from different restaurant in cart. Empty it before ordering from a new restaurant.";
                this.messageDialogData.buttonText = "Ok";
                this.$refs.messageDialogChild.displayDialog();
                return;
              }
            }
            let articles = [];
            for(x = 0; x < numberOfItems; x+=1){
              this.cart.articles.push(article);
            }
            this.cart.price += (article.price*numberOfItems);
          }
          this.saveCartOnServer();
        } else {
          this.displaySignInModal();
        }
      },
      saveCartOnServer(){
        let token = window.localStorage.getItem('token');
        if(token){
          axios
          .put("http://localhost:8081/rest/updateCart/" + this.user.username, this.cart, {
            headers:{
              'Authorization': 'Bearer ' + token 
            }
          })
          .then(response => {
            console.log(response.data);
          })
          .catch(error => {
            console.log(error.data);
          });
        }
      },
      navigateToCartView(){
        this.$router.push({name: 'cart', params: { path: this.restaurant.id }})
      },
      navigateHome(){
        this.$router.push({name: 'homepage'})
      },
      navigateToOrdersView(){
        this.$router.push({name: 'orders'})
      },
      isSelectedNavItem(index){
        if(index == this.selectedNavIndex)
          return true;
        return false;
      },
      changeSelectedNavItem(index){
        this.selectedNavIndex = index;
      },
    },
    created(){
      window.addEventListener('scroll', this.handleScroll);
    },
    computed:{
      stickyCart() {
        return this.scrolled > 60;
      }
    },
    mounted(){

      axios
      .get("http://localhost:8081/rest/restaurant/" + this.$route.params.id)
      .then(response => {
        this.restaurant = response.data;
      })
      .catch(error => {
        console.log(response.data);
      });

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
        })
        .catch(error => {
            // TODO session probably expired, jwt invalid
        })
      }

      axios
      .get("http://localhost:8081/rest/commentsForPublic/" + this.$route.params.id)
      .then(response => {
          this.comments = response.data;
      })
      .catch(error => {
          // Failed to fetch comments
          this.comments = []
      })
    },
    template: 
    `
    <div id="restaurantView">
      <register-dialog ref="registerChild"></register-dialog>
      <login-dialog ref="loginChild"></login-dialog>
      <message-dialog ref="messageDialogChild" :message="messageDialogData"></message-dialog>
      <transition name="fade">
        <div v-if="cart && stickyCart" id="floating-cart-container">
          <div @click="navigateToCartView()" class="floating-cart-container d-flex align-items-center justify-content-center mb-1">
            <div v-if="cart.articles.length > 0" class="dot floating-cart-article-number d-flex justify-content-center align-items-center">
              {{cart.articles.length}}
            </div>
            <img src="../assets/icons/cart.png" alt="shopping-cart" class="shopping-cart-pic">
          </div>
        </div>
      </transition>
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
                    <a class="nav-link active mt-1 py-0" @click="changeSelectedNavItem(0)" aria-current="page">Home</a>
                    <div class="d-none d-lg-block" :class="{'selected-box' : isSelectedNavItem(0)}"></div>
                  </div>
                </li>
                <li v-if="user && user.accountType=='buyer'" class="nav-item">
                  <div class="nav-link-container">
                    <a class="nav-link mt-1 py-0" @click="changeSelectedNavItem(1); navigateToOrdersView();" aria-current="page">Orders</a>
                    <div class="d-none d-lg-block" :class="{'selected-box' : isSelectedNavItem(1)}"></div>
                  </div>
                </li>
                <li class="nav-item">
                  <div class="nav-link-container">
                    <a class="nav-link mt-1 py-0" @click="changeSelectedNavItem(2)">About us</a>
                    <div class="d-none d-lg-block" :class="{'selected-box' : isSelectedNavItem(2)}"></div>
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
            <div v-if="user.accountType == 'buyer'" class="d-none d-lg-block">
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
                <div v-if="cart && !stickyCart" @click="navigateToCartView()" class="cart-container mb-1 me-2 d-flex align-items-center justify-content-center">
                  <div v-if="cart.articles.length > 0" class="dot cart-article-number d-flex justify-content-center align-items-center">
                    {{cart.articles.length}}
                  </div>
                  <img src="../assets/icons/cart-dark.png" alt="shopping-cart" class="shopping-cart-pic mx-1">
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
          <span class="title">Foods</span>
          <div class="article-container mt-2">
            <div v-for="article in restaurant.articles" v-if="article.articleType=='meal'" class="article-card">
              <articleItem :article="article"></articleItem>
            </div>
          </div>
        </div>
        <div v-if="restaurant" class="restaurant-view-drinks mt-4 d-flex flex-column">
          <span class="title">Drinks</span>
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
            <map-view-component></map-view-component>
          </div>
        </div>

        <div class="restaurant-view-reviews-container d-flex flex-column">
          <div v-if="restaurant" class="d-flex align-items-center">
            <span class="title fw-bold">Restaurant reviews</span>
            <img class="restaurant-view-star-icon ms-3 mb-1 me-2" src="../assets/icons/star.png" alt="Star icon">
            <span class="fw-bold restaurant-view-rating-text">{{restaurant.rating}}</span>
          </div>
          <div class="restaurant-view-reviews">

            <div v-for="comment in comments" :key="comment.id" class="review-card d-flex flex-column">
              <div class="review-card-basic-info d-flex flex-row align-items-center mb-2">
                <div class="d-flex left align-items-center">
                  <div class="image-cropper mx-2">
                    <img src="../assets/images/profile-picture.jpg" alt="avatar" class="profile-pic">
                  </div>
                  <h5 class="review-card-title m-0">{{comment.buyerNameAndSurname}}</h5>
                </div>
                
                <div class="right d-flex align-items-center justify-content-end me-2">
                  <img class="restaurant-view-star-icon ms-3 mb-1 me-2" src="../assets/icons/star.png" alt="Star icon">
                  <span class="fw-bold restaurant-view-rating-text">{{comment.review}}</span>
                </div>
                
              </div>
              <p class="review-card-comment m-0">{{comment.details}}</p>
            </div>

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