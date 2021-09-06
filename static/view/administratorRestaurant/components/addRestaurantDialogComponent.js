var addRestaurantDialogComponent = {
  data() {
    return {
      form: {
        restaurantName: '',
        restaurantCuisine: '',
        restaurantStreet: '',
        restaurantStreetNumber: '',
        restaurantCity: '',
        cityPostalCode: undefined,
        restaurantManager: '',
        backendLogoImage: "",
        backendBannerImage: "",
        backendCoverImage: "",
        logoImage: '',
        bannerImage: '',
        coverImage: ''
      },
      messageDialogData: {
        title: "",
        message: "",
        buttonText: ""
      },
      isAddRestaurantModalDisplayed: false,
      availableManagers: undefined
    }
  },
  components: {
    messageDialog: messageDialogComponent,
    addUserDialog: createWorkerDialogComponent
  },
  validations: {
    form: {
      restaurantName: {
        required: validators.required
      },
      restaurantStreet: {
        required: validators.required
      },
      restaurantCuisine: {
        isSelected
      },
      restaurantStreetNumber: {
        required: validators.required
      },
      restaurantCity: {
        required: validators.required
      },
      cityPostalCode: {
        required: validators.required
      },
      restaurantManager: {
        isSelected
      }
    }
  },
  mounted() {
    axios
      .get("http://localhost:8081/rest/availableManagers")
      .then(response => {
        this.availableManagers = response.data;
      })
      .catch(function (error) {
        console.log(error);
      })
  },
  methods: {
    submitForm() {
      if (!this.$v.form.$invalid) {
        var newArticle = {
          name: this.form.restaurantName,
          restaurantType: this.form.restaurantCuisine,
          logo: this.form.backendLogoImage,
          bannerImage: this.form.backendBannerImage,
          coverImage: this.form.backendCoverImage,
          street: this.form.restaurantStreet,
          streetNumber: this.form.restaurantStreetNumber,
          city: this.form.restaurantCity,
          cityPostalCode: this.form.cityPostalCode,
          manager: this.form.restaurantManager
        }
        let token = window.localStorage.getItem('token');
        axios
          .post("http://localhost:8081/rest/addRestaurant", JSON.stringify(newArticle), {
            headers: {
              'Authorization': 'Bearer ' + token
            }
          })
          .then(response => {
            this.closeDialog();
          })
          .catch(error => {
            if (error.response) {
              this.showServerResponse(error);
            }
          });
      }
    },
    showServerResponse(error) {
      if (error.response.status == "409") {
        this.messageDialogData.title = "Article name taken";
        this.messageDialogData.message = "Article with that name already exists, please try again.";
        this.messageDialogData.buttonText = "Try again";
        this.$refs.messageDialogChild.displayDialog();
      }
    },
    displayAddRestaurantModal() {
      this.isAddRestaurantModalDisplayed = true;
    },
    closeDialog() {
      this.isAddRestaurantModalDisplayed = false;
      this.$parent.reloadRestaurants();
    },
    logoImageAdded(e) {
      const file = e.target.files[0];
      this.createBase64LogoImage(file);
      this.form.logoImage = URL.createObjectURL(file);
    },
    bannerImageAdded(e) {
      const file = e.target.files[0];
      this.createBase64BannerImage(file);
      this.form.bannerImage = URL.createObjectURL(file);
    },
    coverImageAdded(e) {
      const file = e.target.files[0];
      this.createBase64CoverImage(file);
      this.form.coverImage = URL.createObjectURL(file);
    },
    createBase64LogoImage(file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        let img = e.target.result;
        //img.replace("data:image\/(png|jpg|jpeg);base64", "");
        console.log(img);
        this.form.backendLogoImage = img;
      }
      reader.readAsDataURL(file);
    },
    createBase64BannerImage(file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        let img = e.target.result;
        //img.replace("data:image\/(png|jpg|jpeg);base64", "");
        console.log(img);
        this.form.backendBannerImage = img;
      }
      reader.readAsDataURL(file);
    },
    createBase64CoverImage(file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        let img = e.target.result;
        //img.replace("data:image\/(png|jpg|jpeg);base64", "");
        console.log(img);
        this.form.backendCoverImage = img;
      }
      reader.readAsDataURL(file);
    },
    createManager() {
      this.$refs.addUserChild.displayAddUserModal("manager");
    },
    reload() {
      axios
        .get("http://localhost:8081/rest/availableManagers")
        .then(response => {
          this.availableManagers = response.data;
        })
        .catch(function (error) {
          console.log(error);
        })
    }
  },
  template: `
    <div class="modal" :class="{ 'display-block' : isAddRestaurantModalDisplayed }">
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
              <div class="d-flex left justify-end">
                <div>
                  <button type="button" id="loadFileXml" class="btn btn-light shadow-none add-article-button" onclick="document.getElementById('logoImage').click();">
                    <img v-if="this.form.logoImage" :src="this.form.logoImage" class= "add-article-image" alt = "Logo Image">
                    <img v-if="!this.form.logoImage" src="../assets/icons/add128px.png" alt = "Add Image">
                  </button>
                  <input type="file" style="display:none;border:none;" @change="logoImageAdded" id="logoImage" name="logoImage"/>
                  <label>Logo image</label>
                  <button type="button" id="loadFileXml" class="btn btn-light shadow-none add-article-button" onclick="document.getElementById('bannerImage').click();">
                    <img v-if="this.form.bannerImage" :src="this.form.bannerImage" class= "add-article-image" alt = "Banner Image">
                    <img v-if="!this.form.bannerImage" src="../assets/icons/add128px.png" alt = "Add Image">
                  </button>
                  <input type="file" style="display:none;border:none;" @change="bannerImageAdded" id="bannerImage" name="bannerImage"/>
                  <label>Banner image</label>
                  <button type="button" id="loadFileXml" class="btn btn-light shadow-none add-article-button" onclick="document.getElementById('coverImage').click();">
                    <img v-if="this.form.coverImage" :src="this.form.coverImage" class= "add-article-image" alt = "Cover Image">
                    <img v-if="!this.form.coverImage" src="../assets/icons/add128px.png" alt = "Add Image">
                  </button>
                  <input type="file" style="display:none;border:none;align:center" @change="coverImageAdded" id="coverImage" name="coverImage"/>
                  <label>Cover image</label>
                </div>
              </div>
              <div class="d-flex right justify-end">
              <div>
                <div class="mb-1">
                  <label class="form-control-label">Restaurant Name</label>
                  <input v-model="form.restaurantName" @blur="$v.form.restaurantName.$touch()" type="text" :class="{'field-invalid': $v.form.restaurantName.$dirty, 'field-valid': (!$v.form.restaurantName.$invalid && form.restaurantName != '')}" class="form-control"/>
                  <div v-if="$v.form.restaurantName.$dirty">
                      <span class="error-message" v-if="$v.form.restaurantName.$invalid">Restaurant name required!</span>
                  </div>
                </div>
                <div class="mb-1">
                  <label class="form-control-label">Cuisine</label>
                  <select @blur="$v.form.restaurantCuisine.$touch()" v-model="form.restaurantCuisine" :class="{'field-invalid': $v.form.restaurantCuisine.$dirty, 'field-valid': (!$v.form.restaurantCuisine.$invalid && form.restaurantCuisine != '')}" class="form-select">
                    <option value="" disabled selected>Select cuisine</option>
                    <option value="italian">Italian</option>
                    <option value="chinese">Chinese</option>
                    <option value="barbecue">Barbecue</option>
                  </select>
                  <div v-if="$v.form.restaurantCuisine.$dirty">
                    <span class="error-message" v-if="$v.form.restaurantCuisine.$invalid">Cuisine is required.</span>
                  </div>
                </div>
                <div class="mb-1">
                  <label class="form-control-label ">Street</label>
                  <input v-model="form.restaurantStreet" @blur="$v.form.restaurantStreet.$touch()" type="text" :class="{'field-invalid': $v.form.restaurantStreet.$dirty, 'field-valid': (!$v.form.restaurantStreet.$invalid && form.restaurantStreet != '')}" class="form-control" />
                  <div v-if="$v.form.restaurantStreet.$dirty">
                    <span class="error-message" v-if="$v.form.restaurantStreet.$invalid">Restaurant street is required.</span>
                  </div>
                </div>
                <div class="mb-1">
                  <label class="form-control-label ">Street number</label>
                  <input v-model="form.restaurantStreetNumber" @blur="$v.form.restaurantStreetNumber.$touch()" type="number" min="0" :class="{'field-invalid': $v.form.restaurantStreetNumber.$dirty, 'field-valid': (!$v.form.restaurantStreetNumber.$invalid && form.restaurantStreetNumber != '')}" class="form-control" />
                  <div v-if="$v.form.restaurantStreetNumber.$dirty">
                    <span class="error-message" v-if="$v.form.restaurantStreetNumber.$invalid">Restaurant street number is required.</span>
                  </div>
                </div>
                <div class="mb-1">
                  <label class="form-control-label ">City</label>
                  <input v-model="form.restaurantCity" @blur="$v.form.restaurantCity.$touch()" type="text" :class="{'field-invalid': $v.form.restaurantCity.$dirty, 'field-valid': (!$v.form.restaurantCity.$invalid && form.restaurantCity != '')}" class="form-control" />
                  <div v-if="$v.form.restaurantCity.$dirty">
                    <span class="error-message" v-if="$v.form.restaurantCity.$invalid">Restaurant city is required.</span>
                  </div>
                </div>
                <div class="mb-1">
                  <label class="form-control-label ">City postal code</label>
                  <input v-model="form.cityPostalCode" @blur="$v.form.cityPostalCode.$touch()" type="number" min="0" :class="{'field-invalid': $v.form.cityPostalCode.$dirty, 'field-valid': (!$v.form.cityPostalCode.$invalid && form.cityPostalCode != '')}" class="form-control" />
                  <div v-if="$v.form.cityPostalCode.$dirty">
                    <span class="error-message" v-if="$v.form.cityPostalCode.$invalid">City postal code is required.</span>
                  </div>
                </div>
                <div class="mb-3">
                  <label class="form-control-label">Manager</label>
                  <select @blur="$v.form.restaurantManager.$touch()" v-model="form.restaurantManager" :class="{'field-invalid': $v.form.restaurantManager.$dirty, 'field-valid': (!$v.form.restaurantManager.$invalid && form.restaurantManager != '')}" class="form-select">
                    <option value="" disabled selected>Select manager</option>
                    <option v-for="manager in availableManagers" :value="manager.username">{{manager.username}}</option>
                  </select>
                  <div v-if="$v.form.restaurantManager.$dirty">
                    <span class="error-message" v-if="$v.form.restaurantManager.$invalid">Manager is required.</span>
                  </div>
                  <a v-if="availableManagers && !availableManagers.length" class="red-link ms-3" v-on:click="createManager()">Create manager</a>
                </div>
                </div>
              </div>
            </div>
            <button  type="submit" class="btn btn-danger regular-button">Create restaurant</button>
          </form>
        </div>
      </div>
      <message-dialog ref="messageDialogChild" :message="messageDialogData"></message-dialog>
      <add-user-dialog ref="addUserChild"></add-user-dialog>
    </div>
    `
}