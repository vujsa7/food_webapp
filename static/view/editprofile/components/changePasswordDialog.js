var changePasswordDialogComponent = {
    data(){
      return{
        isModalDisplayed: false,
        form : {
            oldPassword: "",
            newPassword: "",
            newPasswordConfirmed: "",
        }
      }
    },
    validations:{
        form:{
            oldPassword:{
                required: validators.required,
                minLength: validators.minLength(3)
            },
            newPassword:{
                required: validators.required,
                minLength: validators.minLength(3)
            },
            newPasswordConfirmed:{
                required: validators.required,
                minLength: validators.minLength(3)
            }
        }
    },
    methods: {
        hideDialog(){
            this.isModalDisplayed = false;
        },
        displayDialog(){
            this.isModalDisplayed = true;
        },
        submitForm(){
            let passwordChangeAttempt = {
                "currentPassword" : this.form.oldPassword,
                "newPassword" : this.form.newPassword
            }
            let token = window.localStorage.getItem('token');
            axios
            .put("http://localhost:8081/rest/changePassword/" + this.$parent.user.username, passwordChangeAttempt, {
                headers:{
                    'Authorization': 'Bearer ' + token,
                }
            })
            .then(response => {
                if(response.status == 200)
                    this.hideDialog();
            })
            .catch(error => {
                if(error.response){
                    console.log(error.response);
                    this.hideDialog();
                    if(error.response.status == 400){
                        this.$parent.showWrongPasswordErrorMessage();
                    }
                }
            });
        }
    },
    computed:{
        passwordsNotMatch(){
            if(this.form.newPassword != this.form.newPasswordConfirmed)
                return true;
            return false;
        }
    },
    template: `
    <div class="modal" :class="{ 'display-block' : isModalDisplayed }">
        <div class="modal-content modal-padding">
            <div class="modal-header d-flex" style="padding-top:0">
                <div class="d-flex" style="width:90%;">
                    <span>Change password</span>
                </div>
                <div class="d-flex align-items-end justify-content-center" style="width:10%;">
                    <span class="change-profile-close" @click="hideDialog">&times;</span>
                </div>     
            </div>
            <form action="http://localhost:8081/rest/login" method="post" @submit.prevent="submitForm()" >
                <div class="d-flex flex-column mt-2">
                        <label class="form-control-label">Current password</label>
                    <input @blur="$v.form.oldPassword.$touch()" v-model="form.oldPassword" type="password" class="form-control" :class="{'field-invalid': $v.form.oldPassword.$error}">
                    <div v-if="$v.form.oldPassword.$dirty">
                        <span class="error-message" v-if="!$v.form.oldPassword.required || !$v.form.oldPassword.minLength">Password must contain at least 3 characters.</span>
                    </div>
                    <label class="form-control-label mt-1">New password</label>
                    <input @blur="$v.form.newPassword.$touch()" v-model="form.newPassword" type="password" class="form-control" :class="{'field-invalid': $v.form.newPassword.$error}">
                    <div v-if="$v.form.newPassword.$dirty">
                        <span class="error-message" v-if="!$v.form.newPassword.required || !$v.form.newPassword.minLength">Password must contain at least 3 characters.</span>
                    </div>
                    <label class="form-control-label mt-1">Confirm new password</label>
                    <input @blur="$v.form.newPasswordConfirmed.$touch()" v-model="form.newPasswordConfirmed" type="password" class="form-control" :class="{'field-invalid': $v.form.newPasswordConfirmed.$error}">
                    <div v-if="$v.form.newPasswordConfirmed.$dirty">
                        <span class="error-message" v-if="!$v.form.newPasswordConfirmed.required || !$v.form.newPasswordConfirmed.minLength">Password must contain at least 3 characters.</span>
                    </div>
                    <button type="submit" :disabled="$v.form.$invalid || passwordsNotMatch" class="btn btn-danger regular-button mt-4">Update password</button>
                </div>
            </form>
      </div>
    </div>
    `
}