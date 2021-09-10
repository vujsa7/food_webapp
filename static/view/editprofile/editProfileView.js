Vue.component( "edit-profile-view",{
    data(){
        return {
            user: undefined,
            cart: undefined,
            dateOfBirthYears: range(1930, 2019),
            dateOfBirthMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            dateOfBirth: undefined,
            selectedNavIndex: -1,
            form:{
                name: "",
                surname: "",
                gender: "",
                yearOfBirth: "",
                monthOfBirth: "",
                dayOfBirth: "",
                username: "",
                image: undefined,
                backendImage: undefined
            },
            formCopy : undefined,
            socialMediaLogo: [
              "../../assets/icons/linkedin-logo.png",
              "../../assets/icons/facebook-logo.png",
              "../../assets/icons/instagram-logo.png",
              "../../assets/icons/linkedin-logo.png",
              "../../assets/icons/facebook-logo.png",
              "../../assets/icons/instagram-logo.png"
            ],
            messageDialogData: {
              title: "",
              message: "",
              buttonText: ""
            },
        }
    },
    components:{
      changePasswordDialog: changePasswordDialogComponent,
      messageDialog: messageDialogComponent,
    },
    validations:{
        form:{
          name:{
            required: validators.required,
            allowedCharactersValid
          },
          surname:{
            required : validators.required,
            allowedCharactersValid
          },
          gender:{
            isSelected
          },
          yearOfBirth:{
            isSelected
          },
          monthOfBirth:{
            isSelected
          },
          dayOfBirth:{
            isSelected
          },
          username:{
            required: validators.required,
            isUsernameValid
          }
        }
      },
    methods:{
      navigateToCartView(){
        this.$router.push({name: 'cart'});
      },
      navigateToOrdersView(){
        this.$router.push({name: 'orders'})
      },
      navigateToOrdersView(){
        if(this.user.accountType == "buyer"){
          this.$router.push({name: 'orders'})
        }else if(this.user.accountType == "manager"){
          this.$router.push({name: 'managerOrders'})
        }
      },
      logout(){
        window.localStorage.setItem('token', null);
        this.$router.push({name: 'logout'});
      },
      isSelectedNavItem(index){
        if(index == this.selectedNavIndex)
          return true;
        return false;
      },
      changeSelectedNavItem(index){
        this.selectedNavIndex = index;
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
      openFile(){
        document.getElementById('profileImageFile').click();
      },
      imageAdded(e){
        const file = e.target.files[0];
        if(file && (file.type == "image/jpeg" || file.type == "image/jpg")){
         this.createBase64Image(file);
        }
      },
      createBase64Image(file){
        const reader = new FileReader();
        reader.onload = (e) => {
            this.form.backendImage = e.target.result;
            this.updateProfileImageOnBackend(file);
        }
        reader.readAsDataURL(file);
      },
      updateProfileImageOnBackend(file){
        let token = window.localStorage.getItem('token');
        let object = {
          "image" : this.form.backendImage
        }
        axios
        .put("http://localhost:8081/rest/uploadProfileImage/" + this.user.username, object, {
            headers:{
                'Authorization': 'Bearer ' + token
            }
        })
        .then(response => {
            if(response.status == 200){
              this.form.image = URL.createObjectURL(file);
              this.user.image = response.data.image + "?" + new Date().getTime();;
            }
        })
        .catch(error => {
            if(error.response){
                console.log(error.response)
            }
        });
      },
      submitFormPersonal(){
        if(!this.$v.form.$invalid){
          var updatedUser = {
            "name": this.form.name,
            "surname": this.form.surname,
            "gender": this.form.gender,
            "dateOfBirth": new Date(this.form.yearOfBirth, this.form.monthOfBirth-1, this.form.dayOfBirth)
          }
          this.formCopy = JSON.parse(JSON.stringify(this.form));
          let token = window.localStorage.getItem('token');
          axios
          .put("http://localhost:8081/rest/updatePersonalInfo/" + this.user.username, updatedUser, {
            headers:{
              'Authorization': 'Bearer ' + token
            }
          })
          .then(response => {
            console.log(response.data)
            this.user.name = this.form.name;
            this.user.surname = this.form.surname;
          })
          .catch(error => {
            if(error.response){
              console.log(error.response.data)
            }
          });
        }
      },
      showChangePasswordDialog(){
        this.$refs.changePasswordDialogChild.displayDialog();
      },
      showWrongPasswordErrorMessage(){
        this.messageDialogData.title = "Wrong password";
        this.messageDialogData.message = "Wrong password attempt, enter your valid current password!";
        this.messageDialogData.buttonText = "Try again";
        this.$refs.messageDialogChild.displayDialog();
      },
      navigateHome(){
        this.$router.push({name: 'homepage'})
      },
      submitFormChangeUsername(){
        let token = window.localStorage.getItem('token');
        axios
        .put("http://localhost:8081/rest/updateUsername/" + this.user.username, this.form.username, {
            headers:{
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'text/plain',
            }
        })
        .then(response => {
            if(response.status == 200){
              this.user.username = this.form.username;
              this.formCopy = JSON.parse(JSON.stringify(this.form));
              window.localStorage.setItem('token', response.data)
            }
        })
        .catch(error => {
            if(error.response){
              this.messageDialogData.title = "Forbidden action";
              this.messageDialogData.message = error.response.data;
              this.messageDialogData.buttonText = "Try another username";
              console.log(error.response);
            }
        });
      },
      
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
          this.form.name = this.user.name;
          this.form.surname = this.user.surname;
          this.form.gender = this.user.gender;
          this.dateOfBirth = new Date(this.user.dateOfBirth);
          this.form.yearOfBirth = this.dateOfBirth.getFullYear();
          this.form.monthOfBirth = this.dateOfBirth.getMonth()+1;
          this.form.dayOfBirth = this.dateOfBirth.getDate();
          this.form.username = this.user.username;
          this.form.image = this.user.image;
          this.formCopy = JSON.parse(JSON.stringify(this.form));
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
    computed:{
      dateOfBirthDays(){
        if(this.form.monthOfBirth == "" || this.form.yearOfBirth == "")
          return range(1, 30);
        return range(1, daysInMonth(parseInt(this.form.monthOfBirth), parseInt(this.form.yearOfBirth)))
      },
      stickyCart() {
        return this.scrolled > 60;
      },
      canUpdatePersonalInfo(){
        if(this.form && this.formCopy){
          if(this.$v.form.$invalid)
            return true;
          if(this.form.name != this.formCopy.name || this.form.surname != this.formCopy.surname || this.form.gender != this.formCopy.gender ||
            this.form.dayOfBirth != this.formCopy.dayOfBirth || this.form.monthOfBirth != this.formCopy.monthOfBirth || this.form.yearOfBirth != this.formCopy.yearOfBirth)
            return false;
          return true;
        }
        return false;
      },
      canChangeUsername(){
        if(this.form.username != this.formCopy.username)
          return false;
        return true;
      }
    },
    template:
    `
    <div id="edit-profile-view">
      <message-dialog ref="messageDialogChild" :message="messageDialogData"></message-dialog>
      <change-password-dialog ref="changePasswordDialogChild"></change-password-dialog>
        <div class="container-fluid navigation-container pt-3 px-0">
            <div class="container-fluid d-none d-lg-block px-0">
              <img @click="navigateHome()" src="../assets/images/logos/foodly-logos/full-logo.png" alt="Brand logo" class="full-logo">
            </div>
            <div class="container d-lg-none px-0">
              <img @click="navigateHome()" src="../assets/images/logos/foodly-logos/foodly-logo.png" alt="Brand logo" class="foodly-logo">
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
                          <a class="nav-link mt-1 py-0" @click="changeSelectedNavItem(0)" aria-current="page">Home</a>
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
                      <img :src="user.image" alt="avatar" class="profile-pic">
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
        <div class="edit-profile-view-body">
            <span v-if="user" class="cool-name-and-surname">{{user.name}} {{user.surname}}</span>
            <div class="edit-profile-view-three-parts justify-content-between">
                <div class="profile-picture-container">
                  <div class="d-flex flex-column">
                    <div class="relative-picture-container">
                      <div class="second-relative-picture-container">
                        <img v-if="this.form.image" :src="this.form.image" class="profile-img-display" alt="Profile image">
                        <button class="round-button d-xl-none">A</button>
                      </div>
                    </div>
                    <button @click="openFile" class="btn btn-danger regular-button change-profile-pic-button">Change profile picture</button>
                    <input type="file" @change="imageAdded" hidden id="profileImageFile"/>
                  </div>
                </div>
                <div class="changing-info-container">
                  <div class="personal-info-container">
                    <span class="edit-profile-title">
                      Personal info
                    </span>
                    <form action="http://localhost:8081/rest/updatePersonalInfo/:id" method="put" @submit.prevent="submitFormPersonal()" autocomplete="off">
                      <div class="edit-profile-field-container mt-2">
                        <label class="form-control-label">Name</label>
                        <input v-model="form.name" @blur="$v.form.name.$touch()" type="text" :class="{'field-invalid': $v.form.name.$invalid}" class="form-control">
                        <div v-if="$v.form.name.$dirty">
                          <span class="error-message" v-if="!$v.form.name.required">Name is required.</span>
                          <span class="error-message" v-if="!$v.form.name.allowedCharactersValid">Special characters forbidden.</span>
                        </div>
                      </div>
                      <div class="edit-profile-field-container">
                        <label class="form-control-label">Surname</label>
                        <input v-model="form.surname" @blur="$v.form.surname.$touch()" type="text" :class="{'field-invalid': $v.form.surname.$invalid}" class="form-control">
                        <div v-if="$v.form.surname.$dirty">
                          <span class="error-message" v-if="!$v.form.surname.required">Surname is required.</span>
                          <span class="error-message" v-if="!$v.form.surname.allowedCharactersValid">Special characters forbidden.</span>
                        </div>
                      </div>
                      <div class="edit-profile-field-container">
                        <label class="form-control-label">Gender</label>
                        <select @blur="$v.form.gender.$touch()" v-model="form.gender" :class="{'field-invalid': $v.form.gender.$invalid}" class="form-select">
                          <option value="" disabled selected>Select gender...</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                        </select>
                        <div v-if="$v.form.gender.$dirty">
                          <span class="error-message" v-if="$v.form.gender.$invalid">Gender is required.</span>
                        </div>
                      </div>
                      <label class="form-control-label">Date of Birth</label>
                      <div class="d-flex d-row justify-content-between date-of-birth-holder">
                        <div class="me-3">
                          <select v-model="form.yearOfBirth" class="form-select">
                            <option value="" disabled selected>YYYY</option>
                            <option v-for="x in dateOfBirthYears">
                              {{x}}
                            </option>
                          </select>
                        </div>
                        <div class="me-3">
                          <select v-model="form.monthOfBirth" class="form-select" >
                            <option value="" disabled selected>MM</option>
                            <option v-for="x in dateOfBirthMonths">
                              {{x}}
                            </option>
                          </select>
                        </div>
                        <div>
                          <select v-model="form.dayOfBirth" class="form-select">
                            <option value="" disabled selected>DD</option>
                            <option v-for="x in dateOfBirthDays">
                              {{x}}
                            </option>
                          </select>
                        </div>
                      </div>
                      <div v-if="$v.form.dayOfBirth.$dirty">
                        <span class="error-message" v-if="$v.form.dayOfBirth.$invalid">Please select a full date of birth.</span>
                      </div>
                      <button type="submit" :disabled="canUpdatePersonalInfo" class="btn btn-light border-button">Update personal info</button>
                    </form>
                  </div>
                  <div v-if="user" class="account-info-container">
                    <span class="edit-profile-title">
                      Account info
                    </span>
                    <form action="http://localhost:8081/rest/changeUsername/:id" method="put" @submit.prevent="submitFormChangeUsername()" autocomplete="off">
                      <div class="edit-profile-field-container mt-2">
                        <label class="form-control-label">Username</label>
                        <input v-model="form.username" type="text" class="form-control">
                        <div v-if="$v.form.username.$dirty">
                          <span class="error-message" v-if="!$v.form.username.required">Username is required.</span>
                          <span class="error-message" v-if="!$v.form.username.isUsernameValid">Special characters aren't allowed.</span>
                        </div>
                      </div>
                      <div class="d-flex flex-column edit-profile-password-container">
                        <label class="form-control-label">Password</label>
                        <div class="input-icons">
                          <i class="fa fa-lock icon"></i>
                          <input disabled placeholder="●●●●●●●●●●●●●●" type="password" class="form-control">
                        </div>
                        <a @click="showChangePasswordDialog" class="align-self-end blue-link">Change password</a>
                      </div>
                      <button :disabled="canChangeUsername" class="btn btn-danger regular-button">Update account info</button>
                    </form>
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