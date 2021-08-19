const allowedCharactersRegex = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
var allowedCharactersValid = (value) => !allowedCharactersRegex.test(value);

const numberRegex = new RegExp("[0-9]");
var notNumberValid = (value) => !numberRegex.test(value);

validExpiryDate = (value) => {
    if(value.substring(0,2) != NaN && value.substring(2,4) != NaN){
        if(parseInt(value.substring(0,2)) > 12 || parseInt(value.substring(2,4)) < 21)
            return false;
        if(parseInt(value.substring(2,4)) == 21 && parseInt(value.substring(0,2)) < 9) // expires in september
            return false;
        return true;
    }
        return false;
}

Vue.component("checkout-view",{
    data(){
        return {
            user: undefined,
            cart: undefined,
            restaurantId: undefined,
            selectedNavIndex: 0,
            socialMediaLogo: [
              "../../assets/icons/linkedin-logo.png",
              "../../assets/icons/facebook-logo.png",
              "../../assets/icons/instagram-logo.png",
              "../../assets/icons/linkedin-logo.png",
              "../../assets/icons/facebook-logo.png",
              "../../assets/icons/instagram-logo.png"
            ],
            form:{
                street: "",
                streetNumber: "",
                city: "",
                postalCode: "",
                phoneNumber: "",
                note: "",
                cardNumber: "",
                expiryDate: "",
                cardHolder: "",
                cvv: "",
            },
            messageDialogData:{
                title: "",
                message: "",
                buttonText: ""
            },
            paymentMethodRadio: "cash",
        }
    },
    components:{
        messageDialog: messageDialogComponent 
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
          isSelectedNavItem(index){
            if(index == this.selectedNavIndex)
              return true;
            return false;
          },
          changeSelectedNavItem(index){
            this.selectedNavIndex = index;
          },
          updateValueCard(e){
            this.form.cardNumber = e.target.value.replace(/ /g,'');
          },
          updateValueExpiry(e){
            this.form.expiryDate = e.target.value.replace("/",'');
          },
          submitForm(){
              if(!this.isMakeOrderBtnDisabled){
                var order = {
                    "price": this.cart.price,
                    "articles": this.cart.articles,
                    "restaurantId" : this.restaurantId,
                    "buyerId" : this.cart.buyerId,
                }
                let token = window.localStorage.getItem('token');
                axios
                .post("http://localhost:8081/rest/createOrder", order, {
                    headers:{
                    'Authorization': 'Bearer ' + token
                    }
                })
                .then(response => {
                    if(response.status == 200){
                        this.messageDialogData.title = "Order created";
                        this.messageDialogData.message = "You have successfully created an order. Check it out on order page.";
                        this.messageDialogData.buttonText = "Ok";
                        function navigateToHomePage(){
                            this.$router.push({name: 'homepageBuyer'});
                        }
                        this.$refs.messageDialogChild.displayDialogWithCallback(navigateToHomePage);
                        this.cart.articles = [];
                        this.cart.price = 0;
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
                })
                .catch(error => {
                    if(error.response){
                        // TODO If username and password are wrong
                        console.log(error.response.status)
                    }
                });
             }
          },
          navigateToCartView(){
              this.$router.push({name: 'cart'});
          }
    },
    computed:{
        formatCardNumber(){
            return this.form.cardNumber ? this.form.cardNumber.match(/.{1,4}/g).join('   ') : '';
        },
        formatExpiryDate(){
            return this.form.expiryDate ? this.form.expiryDate.match(/.{1,2}/g).join('/') : '';
        },
        isMakeOrderBtnDisabled(){
            if(this.paymentMethodRadio == "card"){
                return this.$v.form.$invalid;
            } else {
                return this.$v.form.street.$invalid || this.$v.form.streetNumber.$invalid || this.$v.form.city.$invalid || this.$v.form.postalCode.$invalid || this.$v.form.phoneNumber.$invalid || this.$v.form.note.$invalid;
            }
        }
    },
    validations:{
        form:{
            street:{
                required: validators.required,
                allowedCharactersValid
            },
            streetNumber:{
                required : validators.required,
                maxLength: validators.maxLength(5),
                allowedCharactersValid
            },
            city:{
                required : validators.required,
                allowedCharactersValid
            },
            postalCode:{
                required : validators.required,
                numeric: validators.numeric
            },
            phoneNumber:{
                required : validators.required,
                numeric: validators.numeric,
                allowedCharactersValid
            },
            note:{
                allowedCharactersValid,
                maxLength: validators.maxLength(566)
            },
            cardNumber:{
                required : validators.required,
                numeric: validators.numeric,
                minLength: validators.minLength(16),
                maxLength: validators.maxLength(16),
            },
            expiryDate:{
                required : validators.required,
                numeric: validators.numeric,
                minLength: validators.minLength(4),
                maxLength: validators.maxLength(4),
                validExpiryDate
            },
            cardHolder:{
                required : validators.required,
                allowedCharactersValid,
                notNumberValid
            },
            cvv:{
                required : validators.required,
                numeric: validators.numeric,
                minLength: validators.minLength(3),
                maxLength: validators.maxLength(3)
            },
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
                    if(this.cart.articles.length == 0)
                        this.$router.push({name: 'homepage'});
                    else
                        this.restaurantId = this.cart.articles[0].restaurantId;
                })
            })
            .catch(error => {
                // TODO session probably expired, jwt invalid
                this.$router.push({name: 'homepage'});
            })
        }
    },
    template:
    `
    <div id="checkout-view">
    <div v-if="cart && cart.articles.length != 0">
    <message-dialog ref="messageDialogChild" :message="messageDialogData"></message-dialog>
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
                    <a class="nav-link active mt-1 py-0" @click="changeSelectedNavItem(0)" aria-current="page" href="#">Home</a>
                    <div class="d-none d-lg-block" :class="{'selected-box' : isSelectedNavItem(0)}"></div>
                </div>
                </li>
                <li v-if="user && user.accountType=='buyer'" class="nav-item">
                <div class="nav-link-container">
                    <a class="nav-link active mt-1 py-0" @click="changeSelectedNavItem(1)" aria-current="page" href="#">Orders</a>
                    <div class="d-none d-lg-block" :class="{'selected-box' : isSelectedNavItem(1)}"></div>
                </div>
                </li>
                <li class="nav-item">
                <div class="nav-link-container">
                    <a class="nav-link active mt-1 py-0" @click="changeSelectedNavItem(2)" aria-current="page" href="#">About</a>
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
        <form action="http://localhost:8081/rest/registerBuyer" method="post" @submit.prevent="submitForm()" autocomplete="off">
            <div class="checkout-body d-flex flex-row">
                <div class="shipping-details-container d-flex flex-column">
                    <span class="checkout-title mb-3">Shipping details</span>
                    <div class="shipping-info d-flex flex-column">
                        <div class="row-wrapper d-flex flex-row mb-3">
                            <div class="d-flex flex-column me-2 column-wrapper">
                                <span class="checkout-label-title">
                                    Street
                                </span>
                                <input @blur="$v.form.street.$touch()" v-model="form.street" type="text" class="form-control" :class="{'field-invalid': $v.form.street.$dirty, 'field-valid': (!$v.form.street.$invalid && form.street != '')}">
                                <div v-if="$v.form.street.$dirty">
                                    <span class="error-message" v-if="!$v.form.street.required">Street is required.</span>
                                    <span class="error-message" v-if="!$v.form.street.allowedCharactersValid">Special characters forbidden.</span>
                                </div>
                            </div>
                            <div class="d-flex flex-column ms-2 column-wrapper">
                                <span class="checkout-label-title">
                                    Street number
                                </span>
                                <input maxlength="5" @blur="$v.form.streetNumber.$touch()" v-model="form.streetNumber" type="text" class="form-control" :class="{'field-invalid': $v.form.streetNumber.$dirty, 'field-valid': (!$v.form.streetNumber.$invalid && form.streetNumber != '')}">
                                <div v-if="$v.form.streetNumber.$dirty">
                                    <span class="error-message" v-if="!$v.form.streetNumber.required">Street number is required.</span>
                                    <span class="error-message" v-if="!$v.form.streetNumber.maxLength">Maximum length is 5.</span>
                                    <span class="error-message" v-if="!$v.form.streetNumber.allowedCharactersValid">Special characters forbidden.</span>
                                </div>
                            </div>
                        </div>
                        <div class="row-wrapper d-flex flex-row mb-3">
                            <div class="d-flex flex-column me-2 column-wrapper">
                                <span class="checkout-label-title">
                                    City
                                </span>
                                <input @blur="$v.form.city.$touch()" v-model="form.city" type="text" class="form-control" :class="{'field-invalid': $v.form.city.$dirty, 'field-valid': (!$v.form.city.$invalid && form.city != '')}">
                                <div v-if="$v.form.city.$dirty">
                                    <span class="error-message" v-if="!$v.form.city.required">City is required.</span>
                                    <span class="error-message" v-if="!$v.form.city.allowedCharactersValid">Special characters forbidden.</span>
                                </div>
                            </div>
                            <div class="d-flex flex-column ms-2 column-wrapper">
                                <span class="checkout-label-title">
                                    Postal code
                                </span>
                                <input maxlength="10" @blur="$v.form.postalCode.$touch()" v-model="form.postalCode" type="text" class="form-control" :class="{'field-invalid': $v.form.postalCode.$dirty, 'field-valid': (!$v.form.postalCode.$invalid && form.postalCode != '')}">
                                <div v-if="$v.form.postalCode.$dirty">
                                    <span class="error-message" v-if="!$v.form.postalCode.required">Postal code is required.</span>
                                    <span class="error-message" v-if="!$v.form.postalCode.numeric">Only numbers allowed.</span>
                                </div>
                            </div>
                        </div>
                        <div class="row-wrapper d-flex flex-row mb-3">
                            <div class="d-flex flex-column  column-wrapper">
                                <span class="checkout-label-title">
                                    Phone number
                                </span>
                                <input @blur="$v.form.phoneNumber.$touch()" maxlength="12" v-model="form.phoneNumber" type="text" class="form-control" :class="{'field-invalid': $v.form.phoneNumber.$dirty, 'field-valid': (!$v.form.phoneNumber.$invalid && form.phoneNumber != '')}">
                                <div v-if="$v.form.phoneNumber.$dirty">
                                    <span class="error-message" v-if="!$v.form.phoneNumber.required">Phone number is required.</span>
                                    <span class="error-message" v-if="!$v.form.phoneNumber.numeric || !$v.form.phoneNumber.allowedCharactersValid">Enter a valid phone number.</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="note-for-delivery-container d-flex flex-column">
                        <div class="d-flex flex-column column-wrapper">
                            <span class="checkout-label-title">
                                Leave a note for a delivery worker
                            </span>
                            <textarea @blur="$v.form.note.$touch()" v-model="form.note" type="text" class="form-control expanded" :class="{'field-invalid': ($v.form.note.$dirty && form.note != ''), 'field-valid': (!$v.form.note.$invalid && form.note != '')}"></textarea>
                            <div v-if="$v.form.note.$dirty">
                                <span class="error-message" v-if="!$v.form.note.maxLength">Exceeded maximum number of characters.</span>
                                <span class="error-message" v-if="!$v.form.note.allowedCharactersValid">Special characters forbidden.</span>
                            </div>
                        </div>
                        <div class="characters-left align-self-end">
                            0/566
                        </div>
                    </div>
                </div>
                <div class="payment-method-container d-flex flex-column">
                    <span class="checkout-title mb-3">Payment method</span>
                    <div class="payment-info d-flex flex-column">
                        <div class="form-check">
                            <input class="form-check-input m-0" type="radio" name="flexRadioCash" v-model="paymentMethodRadio" value="cash" id="flexRadioCash">
                            <label class="form-check-label" for="flexRadioCash">
                                Cash
                            </label>
                        </div>
                        <span class="help-text mb-3">Pay in cash when the food arrives</span>
                        <div class="form-check">
                            <input class="form-check-input m-0" type="radio" name="flexRadioCard" v-model="paymentMethodRadio" value="card" id="flexRadioCard">
                            <label class="form-check-label" for="flexRadioCard">
                                Credit/Debit card
                            </label>
                        </div>
                        <div class="d-flex flex-row mb-3">
                            <div class="left">
                                <span class="help-text mb-3">Enter card info</span>
                            </div>
                            <div class="left visually-hidden">
                                <span class="help-text mb-3">Select card</span>
                            </div>
                            <div class="right text-end">
                                <span class="select-existing-one" :class="{'select-existing-one-disabled': paymentMethodRadio == 'cash'}">Select existing one</span>
                            </div>
                        </div>
                        <div class="credit-debit-card-new">
                            <div class="row-wrapper d-flex flex-row mb-3">
                                <div class="d-flex flex-column  column-wrapper">
                                    <span class="checkout-label-title">
                                        Card number
                                    </span>
                                    <input :disabled="paymentMethodRadio == 'cash'" maxlength="25" @blur="$v.form.cardNumber.$touch()" :value="formatCardNumber" @input="updateValueCard" type="text" class="form-control" :class="{'field-invalid': ($v.form.cardNumber.$dirty && paymentMethodRadio != 'cash'), 'field-valid': (!$v.form.cardNumber.$invalid && form.cardNumber != '' && paymentMethodRadio != 'cash')}">
                                    <div v-if="$v.form.cardNumber.$dirty">
                                        <span class="error-message" v-if="!$v.form.cardNumber.required">Card number is required.</span>
                                        <span class="error-message" v-if="!$v.form.cardNumber.maxLength || !$v.form.cardNumber.minLength || !$v.form.cardNumber.numeric">Please enter valid card number.</span>
                                    </div>
                                </div>
                            </div>
                            <div class="row-wrapper d-flex flex-row mb-3">
                                <div class="d-flex flex-column  column-wrapper">
                                    <span class="checkout-label-title">
                                        Expiry date
                                    </span>
                                    <input :disabled="paymentMethodRadio == 'cash'" maxlength="5" @blur="$v.form.expiryDate.$touch()" :value="formatExpiryDate" @input="updateValueExpiry" type="text" class="form-control" placeholder="MM/YY" :class="{'field-invalid': ($v.form.expiryDate.$dirty && paymentMethodRadio != 'cash'), 'field-valid': (!$v.form.expiryDate.$invalid && form.expiryDate != '' && paymentMethodRadio != 'cash')}">
                                    <div v-if="$v.form.expiryDate.$dirty">
                                        <span class="error-message" v-if="!$v.form.expiryDate.required">Expiry date is required.</span>
                                        <span class="error-message" v-if="!$v.form.expiryDate.maxLength || !$v.form.expiryDate.minLength || !$v.form.expiryDate.numeric">Enter valid expiry date.</span>
                                        <span class="error-message" v-if="!$v.form.expiryDate.validExpiryDate">Invalid expiry date.</span> 
                                    </div>
                                </div>
                            </div>
                            <div class="d-flex flex-row mb-3">
                                <div class="left-70 me-2">
                                    <div class="row-wrapper d-flex flex-row">
                                        <div class="d-flex flex-column  column-wrapper">
                                            <span class="checkout-label-title">
                                                Card holder
                                            </span>
                                            <input :disabled="paymentMethodRadio == 'cash'" maxlength="30" @blur="$v.form.cardHolder.$touch()" v-model="form.cardHolder" type="text" class="form-control" :class="{'field-invalid': ($v.form.cardHolder.$dirty && paymentMethodRadio != 'cash'), 'field-valid': (!$v.form.cardHolder.$invalid && form.cardHolder != '' && paymentMethodRadio != 'cash')}">
                                            <div v-if="$v.form.cardHolder.$dirty">
                                                <span class="error-message" v-if="!$v.form.cardHolder.required">Card holder is required.</span>
                                                <span class="error-message" v-if="!$v.form.cardHolder.allowedCharactersValid || !$v.form.cardHolder.notNumberValid">Only alphabet characters.</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="right-30 ms-2">
                                    <div class="row-wrapper d-flex flex-row">
                                        <div class="d-flex flex-column  column-wrapper">
                                            <span class="checkout-label-title">
                                                CVV
                                            </span>
                                            <input :disabled="paymentMethodRadio == 'cash'" maxlength="3" @blur="$v.form.cvv.$touch()" v-model="form.cvv" type="text" class="form-control" :class="{'field-invalid': ($v.form.cvv.$dirty && paymentMethodRadio != 'cash'), 'field-valid': (!$v.form.cvv.$invalid && form.cvv != '' && paymentMethodRadio != 'cash')}">
                                            <div v-if="$v.form.cvv.$dirty">
                                                <span class="error-message" v-if="!$v.form.cvv.required">CVV is required.</span>
                                                <span class="error-message" v-if="!$v.form.cvv.numeric">Only numbers allowed.</span>
                                                <span class="error-message" v-if="!$v.form.cvv.minLength || !$v.form.cvv.maxLength">Enter 3 numbers.</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input m-0" type="checkbox" :disabled="paymentMethodRadio == 'cash'" value="showAll" id="flexCheckShowAll">
                                <label class="form-check-label" for="flexCheckShowAll">
                                Remember credit card
                                </label>
                            </div>
                        </div>
                        <div class="credit-debit-card-existing  visually-hidden">
                            <!-- Picking credit card with animations-->
                        </div>
                    </div>
                </div>
            </div>
            <div class="checkout-actions-container align-items-center d-flex flex-row mt-4">
                <div class="left">
                    <div @click="navigateToCartView()" class="d-flex flex-row align-items-center return-to-cart-container">
                        <img src="../assets/icons/arrow-left.png" class="left-arrow-img me-2">
                        <span class="fw-bold">Return to cart</span>
                    </div>
                </div>
                <div class="right text-end">
                    <button :disabled="isMakeOrderBtnDisabled" type="submit" class="btn btn-danger regular-button">Make order</button>
                </div>
            </div>
        </form>
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
    
    </div>
    `
});