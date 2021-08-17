Vue.component( "cart-view",{
    data(){
        return {
            user: undefined,
            cart: undefined,
            cartSubtotal:  this.cart ? parseFloat(this.cart.price).toFixed(2) : undefined,
            cartTotal: this.cart ? parseFloat(this.cart.price + 5 - 0.5).toFixed(2) : undefined
        }
    },
    methods:{
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
                this.recalculateOrderInfo();
                this.saveCartOnServer();
            }
                
        },
        addArticle(article){
            this.cart.price += article.price;
            this.cart.articles.push(article);
            this.recalculateOrderInfo();
            this.saveCartOnServer();
        },
        removeEntireArticle(article, numberOfItems){
            this.cart.price -= numberOfItems * article.price;
            this.cart.articles = this.cart.articles.filter(function(el){return el.name != article.name});
            this.recalculateOrderInfo();
            this.saveCartOnServer();
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
              <img src="../assets/images/logos/foodly-logos/full-logo.png" alt="Brand logo" id="full-logo">
            </div>
            <div class="container d-lg-none px-0">
              <img src="../assets/images/logos/foodly-logos/foodly-logo.png" alt="Brand logo" id="foodly-logo">
            </div>
            <nav class="navbar navbar-expand-lg navbar-light">
              <div class="container-fluid px-0">
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                  <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNavDropdown">
                  <ul class="navbar-nav">
                    <li class="nav-item">
                      <a class="nav-link active py-0" aria-current="page" href="#">Home</a>
                    </li>
                    <li v-if="user && user.accountType=='buyer'" class="nav-item">
                        <a class="nav-link py-0" href="#">Orders</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link py-0" href="#">About us</a>
                      </li>
                  </ul>
                </div>
              </div>
              <div v-if="user">
                <div v-if="user.accountType == 'buyer'" class="d-none d-lg-block">
                    <div class="user-info-container d-flex flex-row-reverse mt-2">
                        <div>
                            <img src="../assets/icons/arrow-dark.png" alt="arrow" class="arrow-pic mx-2">
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
            <div class="d-flex flex-row align-items-center mt-3 continue-shopping">
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
                <div class="d-flex flex-row align-items-center continue-shopping-container">
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
                <button :disabled="cart.articles.length == 0" type="submit" class="btn btn-danger regular-button">Proceed to checkout</button>
              </div>

              <div class="d-flex flex-row align-items-center mt-3 continue-shopping-bottom-container">
                <img src="../assets/icons/arrow-left.png" class="left-arrow-img me-2">
                <span class="fw-bold">Continue shopping</span>
              </div>
            </div>
        </div>
    </div>
    `
});