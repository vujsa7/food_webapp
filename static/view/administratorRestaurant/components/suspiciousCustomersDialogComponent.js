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
          <div class="modal-content rate-modal-content">
            <div class="modal-header d-flex flex-column">
              <div class="d-flex flex-row align-items-center">
                <span class="align-self-center">Suspicious customers</span>
                <span class="close" @click="closeDialog">&times;</span>
              </div>
            </div>
            <div class="modal-body suspicious-customers-body">
                <div v-for="customer in suspiciousCustomers" :key="customer.username" class="suspicious-customers-style mt-3 d-flex flex-row">
                    <div class="d-flex flex-column ms-3 justify-content-center">
                        <span class="basic-title mb-1 nowrap">
                            Name & surname
                        </span>
                        <span class="me-2">{{customer.name}} {{customer.surname}}</span>
                    </div>
                    <div class="d-flex ms-5 flex-column justify-content-center">
                        <span class="basic-title mb-1">
                            Username
                        </span>
                        <span class="me-2">{{customer.username}}</span>
                    </div>
                    <div class="d-flex ms-5 flex-column justify-content-center">
                        <span class="basic-title mb-1">
                            Monthly cancellations
                        </span>
                        <span class="me-2">{{customer.suspiciousCheck.cancelledOrders}}</span>
                    </div>
                    <button type="button" class="btn btn-danger ms-5 justify-end align-items-center" @click="blockCustomer(customer.username)">
                        <img src="../assets/icons/delete.png"/>
                        <span>Block</span>
                    </button>
                </div>
            </div>
          </div>
          <message-dialog ref="messageDialogChild" :message="messageDialogData"></message-dialog>
        </div>
        `
}