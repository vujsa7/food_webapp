function daysInMonth(month, year) {
  return new Date(year, month, 0).getDate();
}

function range(start, end) {
  return Array(end - start + 1).fill().map((_, idx) => start + idx)
}

var createWorkerDialogComponent = {
  data() {
    return {
      dateOfBirthYears: range(1930, 2019),
      dateOfBirthMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      form: {
        name: "",
        surname: "",
        accountType: "",
        gender: "",
        yearOfBirth: "",
        monthOfBirth: "",
        dayOfBirth: "",
        username: "",
        password: "",
        image: "",
        backendImage: ""
      },
      messageDialogData: {
        title: "",
        message: "",
        buttonText: ""
      },
      isAddUserModalDisplayed: false,
    }
  },
  components: {
    messageDialog: messageDialogComponent
  },
  validations: {
    form: {
      name: {
        required: validators.required
      },
      surname: {
        required: validators.required
      },
      accountType: {
        isSelected
      },
      gender: {
        isSelected
      },
      yearOfBirth: {
        isSelected
      },
      monthOfBirth: {
        isSelected
      },
      dayOfBirth: {
        isSelected
      },
      username: {
        required: validators.required,
        isUsernameValid
      },
      password: {
        required: validators.required,
        minLength: validators.minLength(3)
      }
    }
  },
  computed: {
    dateOfBirthDays() {
      if (this.form.monthOfBirth == "" || this.form.yearOfBirth == "")
        return range(1, 30);
      return range(1, daysInMonth(parseInt(this.form.monthOfBirth), parseInt(this.form.yearOfBirth)))
    }
  },
  methods: {
    submitForm() {
      if (!this.$v.form.$invalid) {
        var newEmployee = {
          "username": this.form.username,
          "password": this.form.password,
          "name": this.form.name,
          "surname": this.form.surname,
          "gender": this.form.gender,
          "dateOfBirth": new Date(this.form.yearOfBirth, this.form.monthOfBirth - 1, this.form.dayOfBirth),
          "accountType": this.form.accountType,
          "image": this.form.backendImage
        }
        let token = window.localStorage.getItem('token');
        axios
          .post("http://localhost:8081/rest/registerNewEmployee", JSON.stringify(newEmployee), {
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
        this.messageDialogData.title = "Username taken";
        this.messageDialogData.message = "User with that username already exists, please try again.";
        this.messageDialogData.buttonText = "Try again";
        this.$refs.messageDialogChild.displayDialog();
      }
    },
    displayAddUserModal(val) {
      if(val == "manager"){
        this.form.accountType = "manager";
      }
      this.isAddUserModalDisplayed = true;
    },
    closeDialog() {
      this.isAddUserModalDisplayed = false;
      this.$parent.reload();
    },
    imageAdded(e) {
      const file = e.target.files[0];
      this.createBase64Image(file);
      this.form.image = URL.createObjectURL(file);
    },
    createBase64Image(file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        let img = e.target.result;
        //img.replace("data:image\/(png|jpg|jpeg);base64", "");
        console.log(img);
        this.form.backendImage = img;
      }
      reader.readAsDataURL(file);
    }
  },
  template: `
      <div class="modal" :class="{ 'display-block' : isAddUserModalDisplayed }">
        <div class="modal-content">
          <div class="modal-header d-flex flex-column">
            <div class="d-flex flex-row align-items-center">
              <span class="align-self-center">Create account</span>
              <span class="close" @click="closeDialog">&times;</span>
            </div>
          </div>
          <div class="modal-body">
            <form action="http://localhost:8081/rest/registerNewEmployee" method="post" @submit.prevent="submitForm()" autocomplete="off">
              <div class="d-flex flex-row">
                <div class="d-flex left justify-end">
                    <div>
                      <button type="button" id="loadFileXml" class="btn btn-light shadow-none add-article-button" onclick="document.getElementById('image').click();">
                        <img v-if="this.form.image" :src="this.form.image" class= "add-article-image" alt = "Profile picture">
                        <img v-if="!this.form.image" src="../assets/icons/add128px.png" alt = "Add Image">
                      </button>
                      <input type="file" style="display:none;border:none;" @change="imageAdded" id="image" name="image"/>
                      <label>Profile picture</label>
                    </div>
                </div>
                <div class="d-flex ms-1 right justify-end">
                  <div>
                    <div class="mb-1">
                      <label class="form-control-label">Account role</label>
                      <select @blur="$v.form.accountType.$touch()" v-model="form.accountType" :class="{'field-invalid': $v.form.accountType.$dirty, 'field-valid': (!$v.form.accountType.$invalid && form.accountType != '')}" class="form-select">
                        <option value="" disabled selected>Select role...</option>
                        <option value="manager">Manager</option>
                        <option value="deliveryWorker">Delivery</option>
                      </select>
                      <div v-if="$v.form.accountType.$dirty">
                        <span class="error-message" v-if="$v.form.accountType.$invalid">Account role is required.</span>
                      </div>
                    </div>
                    <div class="mb-1">
                      <label class="form-control-label">Name</label>
                      <input v-model="form.name" @blur="$v.form.name.$touch()" type="text" :class="{'field-invalid': $v.form.name.$dirty, 'field-valid': (!$v.form.name.$invalid && form.name != '')}" class="form-control">
                      <div v-if="$v.form.name.$dirty">
                        <span class="error-message" v-if="$v.form.name.$invalid">Name is required.</span>
                      </div>
                    </div>
                    <div class="mb-1">
                      <label class="form-control-label">Surname</label>
                      <input v-model="form.surname" @blur="$v.form.surname.$touch()" type="text" :class="{'field-invalid': $v.form.surname.$dirty, 'field-valid': (!$v.form.surname.$invalid && form.surname != '')}" class="form-control" >
                      <div v-if="$v.form.surname.$dirty">
                        <span class="error-message" v-if="$v.form.surname.$invalid">Surname is required.</span>
                      </div>
                    </div>
                    <div class="mb-1">
                      <label class="form-control-label">Gender</label>
                      <select @blur="$v.form.gender.$touch()" v-model="form.gender" :class="{'field-invalid': $v.form.gender.$dirty, 'field-valid': (!$v.form.gender.$invalid && form.gender != '')}" class="form-select">
                        <option value="" disabled selected>Select gender...</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                      <div v-if="$v.form.gender.$dirty">
                        <span class="error-message" v-if="$v.form.gender.$invalid">Gender is required.</span>
                      </div>
                    </div>
                    <label class="form-control-label">Date of Birth</label>
                    <div class="d-flex d-row mb-1 justify-content-between date-of-birth-holder">
                      <div class="me-3">
                        <select v-model="form.yearOfBirth" class="form-select">
                          <option value="" disabled selected>YYYY</option>
                          <option v-for="x in dateOfBirthYears">
                            {{x}}
                          </option>
                        </select>
                      </div>
                      <div class="me-3">
                        <select :disabled="form.yearOfBirth == ''" v-model="form.monthOfBirth" class="form-select" >
                          <option value="" disabled selected>MM</option>
                          <option v-for="x in dateOfBirthMonths">
                            {{x}}
                          </option>
                        </select>
                      </div>
                      <div>
                        <select :disabled="form.monthOfBirth == ''" @blur="$v.form.dayOfBirth.$touch()" v-model="form.dayOfBirth" class="form-select">
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
                    <div class="mb-1">
                      <label class="form-control-label">Username</label>
                      <input @blur="$v.form.username.$touch()" v-model="form.username" type="text" :class="{'field-invalid': $v.form.username.$dirty, 'field-valid': (!$v.form.username.$invalid && form.username != '')}" class="form-control">
                      <div v-if="$v.form.username.$dirty">
                        <span class="error-message" v-if="!$v.form.username.required">Username is required.</span>
                        <span class="error-message" v-if="!$v.form.username.isUsernameValid">Special characters aren't allowed.</span>
                      </div>
                    </div>
                    <div class="mb-4">
                      <label class="form-control-label">Password</label>
                      <input @blur="$v.form.password.$touch()" v-model="form.password" type="password" :class="{'field-invalid': $v.form.password.$dirty, 'field-valid': (!$v.form.password.$invalid && form.password != '')}" class="form-control">
                      <div v-if="$v.form.password.$dirty">
                        <span class="error-message" v-if="$v.form.password.$invalid">Password must contain at least 3 characters.</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <button :disabled="$v.form.$invalid" type="submit" class="btn btn-danger regular-button">Create account</button>
            </form>
          </div>
        </div>
        <message-dialog ref="messageDialogChild" :message="messageDialogData"></message-dialog>
      </div>
      `
}