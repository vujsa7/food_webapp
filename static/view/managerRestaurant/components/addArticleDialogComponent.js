    var addArticleDialogComponent = {
      data(){
        return{
          form:{
            articleName: '',
            articleDescription: '',
            articlePrice: undefined,
            articleType: '',
            articleQuantity: undefined,
            articleImage: '',
            backendImage: ""
          },
          messageDialogData:{
            title: "",
            message: "",
            buttonText: ""
          },
          isAddArticleModalDisplayed: false,
        }
      },
      props: [
        'restaurantId'
      ],
      components:{
        messageDialog: messageDialogComponent
      },
      validations:{
        form:{
          articleName:{
            required: validators.required
          },
          articleDescription:{
            required : validators.required
          },
          articleType:{
            isSelected
          },
          articlePrice:{
            required : validators.required
          },
          articleQuantity:{
            required : validators.required
          }
        }
      },
      methods: {
        submitForm(){
          if(!this.$v.form.$invalid){
            var newArticle = {
              restaurantId: this.restaurantId,
              name: this.form.articleName,
              price: this.form.articlePrice,
              articleType: this.form.articleType,
              articleQuantity: this.form.articleQuantity,
              description: this.form.articleDescription,
              image: this.form.backendImage  
            } 
            let token = window.localStorage.getItem('token');
            axios
            .post("http://localhost:8081/rest/addArticle",JSON.stringify(newArticle),{
              headers: {
                'Authorization': 'Bearer ' + token
              }
            })
            .then(response => {
              this.closeDialog();
            })
            .catch(error => {
              if(error.response){
                this.showServerResponse(error);
              }
            });
          }
        },
        showServerResponse(error){
          if(error.response.status == "409"){
            this.messageDialogData.title = "Article name taken";
            this.messageDialogData.message = "Article with that name already exists, please try again.";
            this.messageDialogData.buttonText = "Try again";
            this.$refs.messageDialogChild.displayDialog();
          }  
        },
        displayAddArticleModal(){
          this.isAddArticleModalDisplayed = true;
        },
        closeDialog(){
          this.isAddArticleModalDisplayed = false;
          this.$parent.reloadRestaurant();
        },
        imageAdded(e){
            const file = e.target.files[0];
            this.createBase64Image(file);
            this.form.articleImage=URL.createObjectURL(file);
        },
        createBase64Image(file){
            const reader= new FileReader();
            reader.onload = (e) =>{
            	let img = e.target.result;
            	//img.replace("data:image\/(png|jpg|jpeg);base64", "");
            	console.log(img);
            	this.form.backendImage = img;
            }
            reader.readAsDataURL(file);
        }
      },
      template: `
      <div class="modal" :class="{ 'display-block' : isAddArticleModalDisplayed }">
        <div class="modal-content">
          <div class="modal-header d-flex flex-column">
            <div class="d-flex flex-row align-items-center">
              <span class="align-self-center">Add new article</span>
              <span class="close" @click="closeDialog">&times;</span>
            </div>
          </div>
          <div class="modal-body">
            <form action="http://localhost:8081/rest/addArticle" method="post" @submit.prevent="submitForm()" autocomplete="off">
              <div class="d-flex row">
                <div class="d-flex left justify-end custom-file">
                  <button type="button" id="loadFileXml" class="btn btn-light shadow-none add-article-button" onclick="document.getElementById('file').click();">
                    <img v-if="this.form.articleImage" :src="this.form.articleImage" class= "add-article-image" alt = "Profile Image">
                    <img v-if="!this.form.articleImage" src="../assets/icons/add128px.png" alt = "Add Image">
                  </button>
                  <input type="file" style="display:none;border:none;" @change="imageAdded" id="file" name="file"/>
                </div>          
                <div class="d-flex right justify-end">
                  <div class="mb-1">
                    <label class="form-control-label">Article Name</label>
                    <input v-model="form.articleName" @blur="$v.form.articleName.$touch()" type="text" :class="{'field-invalid': $v.form.articleName.$dirty, 'field-valid': (!$v.form.articleName.$invalid && form.name != '')}" class="form-control"/>
                    <div v-if="$v.form.articleName.$dirty">
                        <span class="error-message" v-if="$v.form.articleName.$invalid">Article with that name already exists!</span>
                    </div>
                  </div>
                </div>
                <div class="mb-1">
                      <label class="form-control-label">Description</label>
                      <textarea v-model="form.articleDescription" @blur="$v.form.articleDescription.$touch()" type="text" :class="{'field-invalid': $v.form.articleDescription.$dirty, 'field-valid': (!$v.form.articleDescription.$invalid && form.articleDescription != '')}" class="form-control article-description-height text-wrap"></textarea>
                      <div v-if="$v.form.articleDescription.$dirty">
                        <span class="error-message" v-if="$v.form.articleDescription.$invalid">Description is required.</span>
                      </div>
                    </div>
                    <div class="d-flex">
                      <div class="mb-3 me-2">
                          <label class="form-control-label ">Price</label>
                          <input v-model="form.articlePrice" @blur="$v.form.articlePrice.$touch()" type="number" min="0" step=".01" placeholder="$" :class="{'field-invalid': $v.form.articlePrice.$dirty, 'field-valid': (!$v.form.articlePrice.$invalid && form.articlePrice != '')}" class="form-control article-price" />
                          <div v-if="$v.form.articlePrice.$dirty">
                            <span class="error-message" v-if="$v.form.articlePrice.$invalid">Price of article is required.</span>
                          </div>
                      </div>
                      <div class="mb-3">
                          <label class="form-control-label ">Quantity(g/ml)</label>
                          <input v-model="form.articleQuantity" @blur="$v.form.articleQuantity.$touch()" type="number" min="0" placeholder="$" :class="{'field-invalid': $v.form.articleQuantity.$dirty, 'field-valid': (!$v.form.articleQuantity.$invalid && form.articleQuantity != '')}" class="form-control article-quantity" />
                          <div v-if="$v.form.articleQuantity.$dirty">
                            <span class="error-message" v-if="$v.form.articleQuantity.$invalid">Quantity of article is required.</span>
                          </div>
                      </div>
                      <div class="mb-3 ms-2">
                        <label class="form-control-label">Article type</label>
                        <select @blur="$v.form.articleType.$touch()" v-model="form.articleType" :class="{'field-invalid': $v.form.articleType.$dirty, 'field-valid': (!$v.form.articleType.$invalid && form.articleType != '')}" class="form-select">
                          <option value="" disabled selected>Select type...</option>
                          <option value="meal">Meal</option>
                          <option value="drink">Drink</option>
                        </select>
                        <div v-if="$v.form.articleType.$dirty">
                          <span class="error-message" v-if="$v.form.articleType.$invalid">Type is required.</span>
                        </div>
                      </div>
                    </div>
              </div>
              <button  type="submit" class="btn btn-danger regular-button">Add article</button>
            </form>
          </div>
        </div>
        <message-dialog ref="messageDialogChild" :message="messageDialogData"></message-dialog>
      </div>
      `
    }