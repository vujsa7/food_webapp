var articleItemComponent = {
    data(){
      return{
        numberOfItems: 1,
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
        }
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
                <button type="button" class="btn btn-danger regular-button">{{article.price}} <span class="ms-1" style="font-weight: 300; font-size: 14px;">Add to cart</span></button>
            </div>
        </div>
    </div>
    `
}