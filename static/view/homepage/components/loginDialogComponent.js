var loginDialogComponent = {
    data(){
      return{
        form:{
          username: "",
          password: ""
        }
      }
    },
    validations:{
      form:{
        username:{
          required: validators.required,
          isUsernameValid
        },
        password:{
          required: validators.required,
          minLength: validators.minLength(3)
        }
      }
    },
    methods: {
        submitForm(){
            if(!this.$v.form.$invalid){
                var loginAttempt = {
                "username": this.form.username,
                "password": this.form.password,
                }
                axios
                .post("http://localhost:8081/rest/login", loginAttempt)
                .then(response => {
                    window.localStorage.setItem('token', response.data);
                    location.reload();
                })
                .catch(error => {
                if(error.response){
                    this.showServerResponse(error);
                }
                });
            }
        },
        showServerResponse(error){
            if(error.response.status == "401"){
                this.dialogInfoData.infoTitle = "Username taken";
                this.dialogInfoData.infoMessage = "User with that username already exists, please try again.";
                this.dialogInfoData.infoBtn = "Try again";
            }
            dialogInfoModal.style.display = "block";
        }
    },
    template: `
        <div class="modal-content">
            <div class="modal-header d-flex flex-column">
                <div class="d-flex flex-row align-items-center">
                <span class="align-self-center">Login to your account</span>
                <span class="close">&times;</span>
                </div>
                <div class="d-flex flex-row modal-buttons">
                <span class="fw-bold">
                    Sign in
                </span>
                <span class="signupspan">
                    Sign up
                </span>
                </div>
                <div class="border-bottom-sign-in"></div>
            </div>
            <div class="modal-body">
                <form action="http://localhost:8081/rest/login" method="post" @submit.prevent="submitForm()" >
                <div class="mb-1">
                    <label class="form-control-label">Username</label>
                    <input @blur="$v.form.username.$touch()" v-model="form.username" type="text" class="form-control" :class="{'field-invalid': $v.form.username.$dirty, 'field-valid': (!$v.form.username.$invalid && form.username != '')}">
                    <div v-if="$v.form.username.$dirty">
                    <span class="error-message" v-if="!$v.form.username.required">Username is required.</span>
                    </div>
                </div>
                <div class="mb-4">
                    <label class="form-control-label">Password</label>
                    <input @blur="$v.form.password.$touch()" v-model="form.password" type="password" class="form-control" :class="{'field-invalid': $v.form.password.$dirty, 'field-valid': (!$v.form.password.$invalid && form.password != '')}">
                    <div v-if="$v.form.password.$dirty">
                    <span class="error-message" v-if="!$v.form.password.required">Password must contain at least 3 characters.</span>
                    </div>
                </div>
                <button type="submit" :disabled="$v.form.$invalid" class="btn btn-danger regular-button">Login</button>
                </form>
            </div>
        </div>
    `
}