let cartItemComponent = {
    data(){
        return {
            numberOfItems: this.cartArticle.numberOfItems
        }
    },
    props:[
        'cartArticle'
    ],
    methods:{
        addArticle(){
            this.numberOfItems += 1;
            this.$parent.addArticle(this.cartArticle.article);
        },
        subtractArticle(){
            if(this.numberOfItems-1 == 0){
                this.removeItemFromCart();
                this.$parent.removeArticle(this.cartArticle.article.name);
            } else {
                this.numberOfItems -= 1;
                this.$parent.removeArticle(this.cartArticle.article.name);
            }
        },
        removeItemFromCart(){
            var self = this;
            $('#' + this.cartArticle.article.name.split(' ').join('')).hide(500, function(){
                $(this).remove()
                self.$parent.removeArticle(self.cartArticle.article.name);
            })
            
        }
    },
    template:
    `
    <div class="collapse cart-article-card d-flex flex-row" :id="cartArticle.article.name.split(' ').join('')">
        <img class="cart-article-img" :src="cartArticle.article.image" alt="Article image">
        <div class="d-flex flex-row cart-article-info align-items-center">
        <div class="cart-article-name-container d-flex flex-column">
            <span class="cart-article-title mb-3">
               {{cartArticle.article.name}}
            </span>
            <div>
                <a @click="removeItemFromCart()" class="cart-link">Remove</a>
            </div>
        </div>
        <div class="cart-article-quantity-container d-flex flex-column">
            <span class="cart-article-title mb-2">
            Quantity
            </span>
            <div class="cart-article-plus-minus-container d-flex me-2">
            <div @click="subtractArticle()" class="article-minus-container d-flex justify-content-center align-items-center">
                <img class="plus-minus-img" src="../assets/icons/minus.png" alt="Remove article">
            </div>
            <div class="number-of-adding-articles d-flex justify-content-center align-items-center">
                <span class="fw-bold">{{numberOfItems}}</span>
            </div>
            <div @click="addArticle()" class="article-plus-container d-flex justify-content-center align-items-center">
                <img class="plus-minus-img" src="../assets/icons/plus.png" alt="Add article">
            </div>
            </div> 
        </div>
        <div class="cart-article-price-container d-flex flex-column">
            <span class="cart-article-title mb-3">
            Price
            </span>
            <span>
            &#36;{{parseFloat(numberOfItems*cartArticle.article.price).toFixed(2)}}
            </span>
        </div>
        </div>
    </div>
    `
}