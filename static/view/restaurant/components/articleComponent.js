var articleItemComponent = {
    data(){
      return{
        numberOfItems: 1,
        isSvgAnimationActive : false
      }
    },
    props:[
        'article'
    ],
    methods:{
        subtractArticle(){
            if(this.numberOfItems == 1)
                return;
            this.numberOfItems -= 1;
        },
        addArticle(){
            if(this.numberOfItems == 200)
                return;
            this.numberOfItems += 1;
        },
        addArticleToCart(){
            this.$parent.addArticleToCart(this.article, this.numberOfItems);
            this.isSvgAnimationActive = true;
            setTimeout(() => {
                this.isSvgAnimationActive = false;
              }, 2000);
        }
    },
    computed:{
        
    },
    template:
    `
    <div>
        <div class="card-img-top-container">
            <img class="card-img-top img-fluid" :src="article.image" alt="Article image">
        </div>
        
        <div class="card-body">
            <h5 class="card-title fw-bold mt-3">{{article.name}}</h5>
            <p class="card-text">{{article.description}}</p>
            <div class="d-flex justify-content-between">
                <div class="article-plus-minus-container d-flex me-2">
                    <div @click="subtractArticle()" class="article-minus-container d-flex justify-content-center align-items-center">
                        <img class="plus-minus-img" src="../assets/icons/minus.png" alt="Remove article">
                    </div>
                    <div class="number-of-adding-articles d-flex justify-content-center align-items-center">
                        <span class="fw-bold">{{numberOfItems}}</span>
                    </div>
                    <div @click="addArticle()" class="article-plus-container d-flex justify-content-center align-items-center">
                        <img class="plus-minus-img" src="../assets/icons/plus.png" alt="Add article">
                    </div>
                </div> <!--&#36;-->
                <button type="button" :class="{'open': isSvgAnimationActive, 'zero-font-size': isSvgAnimationActive}" class="btn btn-danger regular-button" @click="addArticleToCart">
                    {{article.price}} <span class="ms-1" :class="{'zero-font-size': isSvgAnimationActive}" style="font-weight: 300; font-size: 14px;">Add to cart</span>
                    <svg class="mt-1 me-1" version="1.1" width="30px" height="30px" x="0px" y="0px"
                        viewBox="0 0 56.7 57" enable-background="new 0 0 56.7 57" xml:space="preserve">
                    <polyline class="tick" fill="none" stroke="#ffffff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" points="
                        20.3,25.4 28.6,33.9 46.7,8.3 "/>
                    </svg>
                </button>
            </div>
        </div>
    </div>
    `
}