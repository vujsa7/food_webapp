var suspiciousCustomersDialogComponent = {
    data() {
        return {
            messageDialogData: {
                title: "",
                message: "",
                buttonText: ""
            },
            isSuspiciousCustomersDisplayed: false,
            suspiciousCustomers: undefined
        }
    },
    mounted() {
        let token = window.localStorage.getItem('token');
        axios
            .get("http://localhost:8081/rest/getSuspicious", {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            })
            .then(response => {
                this.suspiciousCustomers = response.data;
            })
            .catch(error => {
                console.log(response.data);
            });
    },
    components: {
        messageDialog: messageDialogComponent
    },
    methods: {
        showServerResponse(error) {
            if (error.response.status == "409") {
                this.messageDialogData.title = "Username taken";
                this.messageDialogData.message = "User with that username already exists, please try again.";
                this.messageDialogData.buttonText = "Try again";
                this.$refs.messageDialogChild.displayDialog();
            }
        },
        displaySuspiciousCustomersModal() {
            this.isSuspiciousCustomersDisplayed = true;
        },
        closeDialog() {
            this.isSuspiciousCustomersDisplayed = false;
            this.$parent.reload();
        },
        blockCustomer(userId) {
            let token = window.localStorage.getItem('token');
            axios
                .put("http://localhost:8081/rest/blockUser/" + userId)
                .then(response => {
                    this.reloadSuspicious();
                })
                .catch(error => {
                    if (error.response) {
                        this.showServerResponse(error);
                    }
                });
        },
        reloadSuspicious() {
            token = window.localStorage.getItem('token');
            axios
                .get("http://localhost:8081/rest/getSuspicious", {
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                })
                .then(response => {
                    this.suspiciousCustomers = response.data;
                    alert(this.suspiciousCustomers.length);
                })
                .catch(error => {
                    console.log(response.data);
                });
        }
    },
    template: `
        <div class="modal" :class="{ 'display-block' : isSuspiciousCustomersDisplayed }">
          <div class="modal-content">
            <div class="modal-header d-flex flex-column">
              <div class="d-flex flex-row align-items-center">
                <span class="align-self-center">Suspicious customers</span>
                <span class="close" @click="closeDialog">&times;</span>
              </div>
            </div>
            <div class="modal-body">
            <div v-for="customer in suspiciousCustomers" :key="customer.username" class="review-card d-flex flex-column">
                <div class="review-card-basic-info d-flex flex-row align-items-center mb-2">
                <div class="d-flex left align-items-center">
                  <div class="image-cropper mx-2">
                    <img src="../assets/images/profile-picture.jpg" alt="avatar" class="profile-pic">
                  </div>
                  <h5 class="review-card-title m-0">{{customer.username}}</h5>
                </div>
                </div>
                <p class="review-card-comment m-0">{{customer.suspiciousCheck.cancelledOrders}}</p>
                <div class="d-flex flex-row-reverse">
                  <button type="button" class="btn btn-danger justify-end" @click="blockCustomer(customer.username)">
                    <img src="../assets/icons/delete.png"/>
                    <span>Delete</span>
                  </button>  
                </div>
            </div>
            </div>
          </div>
          <message-dialog ref="messageDialogChild" :message="messageDialogData"></message-dialog>
        </div>
        `
}