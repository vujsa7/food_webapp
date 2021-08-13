function daysInMonth (month, year) {
  return new Date(year, month, 0).getDate();
}

function range(start, end) {
  return Array(end - start + 1).fill().map((_, idx) => start + idx)
}

const isSelected = (value) => value != "";
const usernameRegex = new RegExp('[^a-zA-Z0-9]');
let isUsernameValid = (value) => !usernameRegex.test(value);

var registerDialogComponent = {
    data(){
      return{
        dateOfBirthYears: range(1930, 2019),
        dateOfBirthMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        form:{
          name: "",
          surname: "",
          gender: "",
          yearOfBirth: "",
          monthOfBirth: "",
          dayOfBirth: "",
          username: "",
          password: ""
        },
        dialogInfoData:{
          infoTitle: "",
          infoMessage: "",
          infoBtn: ""
        }
      }
    },
    components:{
      infoDialog: infoDialogComponent 
    },
    validations:{
      form:{
        name:{
          required: validators.required
        },
        surname:{
          required : validators.required
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
        },
        password:{
          required: validators.required,
          minLength: validators.minLength(3)
        }
      }
    },
    computed:{
      dateOfBirthDays(){
        if(this.form.monthOfBirth == "" || this.form.yearOfBirth == "")
          return range(1, 30);
        return range(1, daysInMonth(parseInt(this.form.monthOfBirth), parseInt(this.form.yearOfBirth)))
      }
    },
    methods: {
       submitForm(){
        if(!this.$v.form.$invalid){
          var buyerCandidate = {
            "username": this.form.username,
            "password": this.form.password,
            "name": this.form.name,
            "surname": this.form.surname,
            "gender": this.form.gender,
            "dateOfBirth": new Date(this.form.yearOfBirth, this.form.monthOfBirth-1, this.form.dayOfBirth)
          }
          axios
          .post("http://localhost:8081/rest/registerBuyer", buyerCandidate)
          .then(response => {
            // location.href = "http://localhost:8081/html/manager.html";
            console.log(response.data)
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
          this.dialogInfoData.infoTitle = "Username taken";
          this.dialogInfoData.infoMessage = "User with that username already exists, please try again.";
          this.dialogInfoData.infoBtn = "Try again";
        }
        dialogInfoModal.style.display = "block";
      }
    },
    template: `
    <div style="width: 100%; height: 100%;">
      <div class="modal-content">
        <div class="modal-header d-flex flex-column">
          <div class="d-flex flex-row align-items-center">
            <span class="align-self-center">Create an account</span>
            <span class="close">&times;</span>
          </div>
          <div class="d-flex flex-row modal-buttons">
            <span class="signinspan">
              Sign in
            </span>
            <span class="fw-bold">
              Sign up
            </span>
          </div>
          <div class="border-bottom-sign-up"></div>
        </div>
        <div class="modal-body">
          <form action="http://localhost:8081/rest/registerBuyer" method="post" @submit.prevent="submitForm()" autocomplete="off">
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
            <button :disabled="$v.form.$invalid" type="submit" class="btn btn-danger regular-button">Register</button>
          </form>
        </div>
        
      </div>
      <div id="dialog-info-modal" class="info-modal">
        <infoDialog ref="child2" :dialog-info="dialogInfoData"></infoDialog>
      </div>
    </div>
    `
  }