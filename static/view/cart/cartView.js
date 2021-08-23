Vue.component( "cart-view",{
    data(){
        return {
            user: undefined,
            cart: undefined,
            cartSubtotal:  this.cart ? parseFloat(this.cart.price).toFixed(2) : undefined,
            cartTotal: this.cart ? parseFloat(this.cart.price + 5 - 0.5).toFixed(2) : undefined,
            selectedNavIndex: 0,
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
    methods:{
        logout(){
          window.localStorage.setItem('token', null);
          this.$router.push({name: 'logout'});
        },
        removeArticle(articleId){
            let index = -1;
            let cnt = 0;
            for(x of this.cart.articles){
                if(x.name == articleId){
                    index = cnt;
                    break;
                }
                cnt += 1;
            }
            if(index != -1){
                this.cart.price -= this.cart.articles[index].price;
                if(this.cart.price < 0.01)
                    this.cart.price = 0;
                this.cart.articles.splice(index, 1);
                this.saveCartOnServer();
                this.recalculateOrderInfo();
            }
                
        },
        addArticle(article){
            this.cart.price += article.price;
            this.cart.articles.push(article);
            this.saveCartOnServer();
            this.recalculateOrderInfo();
        },
        removeEntireArticle(article, numberOfItems){
            this.cart.price -= numberOfItems * article.price;
            this.cart.articles = this.cart.articles.filter(function(el){return el.name != article.name});
            this.saveCartOnServer();
            this.recalculateOrderInfo();
        },
        recalculateOrderInfo(){
            this.cartSubtotal = parseFloat(this.cart.price).toFixed(2)
            this.cartTotal = parseFloat(this.cart.price + 5 - 0.5).toFixed(2)
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
        navigateHome(){
            this.$router.push({name: 'homepage'})
        },
        navigateToOrdersView(){
          this.$router.push({name: 'orders'})
        },
        continueShopping(){
            if(this.$route.params.path)
              this.$router.push({ name: 'restaurant', params: { id: this.$route.params.path }});
            else
              this.$router.push({name: 'homepageBuyer'});
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
        isSelectedNavItem(index){
          if(index == this.selectedNavIndex)
            return true;
          return false;
        },
        changeSelectedNavItem(index){
          this.selectedNavIndex = index;
        },
        navigateToCheckout(){
          this.$router.push({name: 'checkout'})
        }
    },
    computed: {
        mutatedArticles: function() {
            var output = [];
            var keys   = [];
      
            this.cart.articles.forEach(function (article) {
                var key = article.name;
      
                if (keys.indexOf(key) === -1) {
                    keys.push(key);
                    output.push({article: article, numberOfItems: 1});
                } else {
                    output[keys.indexOf(key)].numberOfItems += 1;
                }
            });
            return output;
        }
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
                .get("http://localhost:8081/rest/cart/" + this.user.username, {
                    headers:{
                    'Authorization': 'Bearer ' + token
                    }
                })
                .then(response => {
                    this.cart = response.data;
                    this.numberOfItemsInCart = this.cart.articles.length;
                    this.recalculateOrderInfo();
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
    components:{
        cartItem : cartItemComponent
    },
    template:
    `
    <div id="cart-view">
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
                        <a class="nav-link fw-bold active mt-1 py-0" @click="changeSelectedNavItem(0)" aria-current="page">Home</a>
                        <div class="d-none d-lg-block" :class="{'selected-box' : isSelectedNavItem(0)}"></div>
                      </div>
                    </li>
                    <li v-if="user && user.accountType=='buyer'" class="nav-item">
                      <div class="nav-link-container">
                        <a class="nav-link active mt-1 py-0" @click="changeSelectedNavItem(1); navigateToOrdersView();" aria-current="page">Orders</a>
                        <div class="d-none d-lg-block" :class="{'selected-box' : isSelectedNavItem(1)}"></div>
                      </div>
                    </li>
                    <li class="nav-item">
                      <div class="nav-link-container">
                        <a class="nav-link active mt-1 py-0" @click="changeSelectedNavItem(2)" aria-current="page">About</a>
                        <div class="d-none d-lg-block" :class="{'selected-box' : isSelectedNavItem(2)}"></div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              <div v-if="user">
                <div v-if="user.accountType == 'buyer'" class="d-none d-lg-block">
                    <div class="user-info-container d-flex flex-row-reverse mt-2">
                      <div class="dropdown" style="z-index: 100">
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
        <div v-if="!cart || cart.articles.length == 0" class="d-flex flex-column justify-content-center align-items-center">
            <img class="empty-cart-img img-fluid" src="../assets/images/empty-cart.jpg">
            <div @click="continueShopping()" class="d-flex flex-row align-items-center mt-3 mb-3 continue-shopping">
                <img src="../assets/icons/arrow-left.png" class="left-arrow-img me-2">
                <span class="fw-bold">Continue shopping</span>
            </div>
        </div>
        <div class="shopping-cart-body" v-if="cart && cart.articles.length != 0">
            <div class="shopping-cart-title-container mb-3">
              <span class="shopping-cart-title">Shopping cart</span>
            </div>
            <div class="cart-body-container d-flex flex-row">
              <div class="articles-in-cart-container">
                <div v-if="cart && cart.articles.length != 0">
                    <div v-for="article in mutatedArticles" :key="article.article.name">
                        <cartItem :cartArticle="article"></cartItem>
                    </div>
                </div>
                <div @click="continueShopping()" class="d-flex flex-row align-items-center mb-3 continue-shopping-container">
                  <img src="../assets/icons/arrow-left.png" class="left-arrow-img me-2">
                  <span class="fw-bold">Continue shopping</span>
                </div>
              </div>
              <div v-if="cart" class="order-info-container d-flex flex-column">
                <span class="cart-article-title mb-3">
                  Order info
                </span>
                <div class="d-flex flex-row mb-1">
                  <div class="left">
                    Subtotal:
                  </div>
                  <div class="right text-end">
                     &#36;{{cartSubtotal}}
                  </div>
                </div>
                <div class="d-flex flex-row mb-1">
                  <div class="left">
                    Shipping:
                  </div>
                  <div v-if="cart.articles.length > 0" class="right text-end">
                    $5
                  </div>
                  <div v-if="cart.articles.length == 0" class="right text-end">
                    $0.00
                  </div>
                </div>
                <div class="d-flex flex-row mb-4">
                  <div class="left">
                    Discount:
                  </div>
                  <div v-if="cart.articles.length > 0" class="right text-end">
                    -$0.5
                  </div>
                  <div v-if="cart.articles.length == 0" class="right text-end">
                    $0.00
                  </div>
                </div>
                <div class="d-flex flex-row mb-3">
                  <div class="left fw-bold">
                    Total:
                  </div>
                  <div v-if="cart.articles.length > 0" class="right fw-bold text-end">
                    &#36;{{cartTotal}}
                  </div>
                  <div v-if="cart.articles.length == 0" class="right fw-bold text-end">
                    $0.00
                  </div>
                </div>
                <button @click="navigateToCheckout()" :disabled="cart.articles.length == 0" type="submit" class="btn btn-danger regular-button">Proceed to checkout</button>
              </div>

              <div @click="continueShopping()" class="d-flex flex-row align-items-center mt-3 mb-3 continue-shopping-bottom-container">
                <img src="../assets/icons/arrow-left.png" class="left-arrow-img me-2">
                <span class="fw-bold">Continue shopping</span>
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