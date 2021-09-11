let administratorCustomerComponent = {
    data(){
        return{
            //date: this.order.dateOfOrder.match(/[^,]+,[^,]+/g)
            messageDialogData: {
                title: "",
                message: "",
                buttonText: ""
            }
        }
    },
    components: {
        messageDialog: messageDialogComponent
    },
    props:[
        'user'
    ],
    methods:{
        blockUser(userId){
          let token = window.localStorage.getItem('token');
          axios
          .put("http://localhost:8081/rest/blockUser/" + userId)
          .then(response => {
            this.$parent.reload();
          })
          .catch(error => {
            if(error.response){
              this.showServerResponse(error);
            }
          });
        },
        unblockUser(userId){
          let token = window.localStorage.getItem('token');
          axios
          .put("http://localhost:8081/rest/unblockUser/" + userId)
          .then(response => {
            this.$parent.reload();
          })
          .catch(error => {
            if(error.response){
              this.showServerResponse(error);
            }
          });
        },
        showServerResponse(error) {
            if (error.response.status == "409") {
              this.messageDialogData.title = "Username taken";
              this.messageDialogData.message = "User with that username already exists, please try again.";
              this.messageDialogData.buttonText = "Try again";
              this.$refs.messageDialogChild.displayDialog();
            }
        },
        deleteUser(username){
            let token = window.localStorage.getItem('token');
            axios
            .put("http://localhost:8081/rest/deleteUser/" + username,username,{
            headers: {
                'Authorization': 'Bearer ' + token
            }
            })
            .then(response => {
                this.$parent.reload();
            })
            .catch(error => {
            if(error.response){
                console.log(error);
            }
            });
        }
    },
    template:
    `
    <div class="order-cards-container" v-if="user">
        <div class="user-card box-shadow">
            <div class="d-flex flex-column justify-content-start">
                <img class="customer-img" :src="user.image"/>
            </div>
            <div class="d-flex flex-column justify-content-start">
                <span class="basic-title mb-1 ms-3 admin-customers-margin nowrap">
                    Name & surname
                </span>
                <span class="me-2 ms-3">{{user.name}} {{user.surname}}</span>
                <a v-if="!user.isBlocked && !(user.accountType=='administrator')" class="red-link ms-3" v-on:click="blockUser(user.username)">Block user</a>
                <a v-if="user.isBlocked && !(user.accountType=='administrator')" class="red-link ms-3" v-on:click="unblockUser(user.username)">Unblock user</a>
                <a v-if="!(user.accountType=='administrator')" class="red-link ms-3" v-on:click="deleteUser(user.username)">Delete user</a>
            </div>
            <div class="d-flex order-two flex-column justify-content-start">
                <span class="basic-title mb-1 admin-customers-margin">
                    Username
                </span>
                <span class="me-2">{{user.username}}</span>
            </div>
            <div class="d-flex order-two flex-column justify-content-start">
                <span class="basic-title mb-1 admin-customers-margin">
                    Role
                </span>
                <span v-if="user.accountType == 'manager'">Manager</span>
                <span v-if="user.accountType == 'administrator'">Administrator</span>
                <span v-if="user.accountType == 'deliveryWorker'">Delivery</span>
                <span v-if="user.accountType == 'buyer'">Buyer</span>
            </div>
            <div class="d-flex flex-row align-items-center" v-if="user.accountType == 'buyer'">
                <div class="d-flex me-3 justify-content-center align-items-center">
                    <img v-if="user.buyerType == 'Golden buyer'" src="../assets/icons/gold-icon.png" class="order-details-img">
                    <img v-if="user.buyerType == 'Silver buyer'" src="../assets/icons/silver-icon.png" class="order-details-img">
                    <img v-if="user.buyerType == 'Bronze buyer'" src="../assets/icons/bronze-icon.png" class="order-details-img">
                </div>
                <div class="d-flex flex-column justify-content-start">
                    <span class="basic-title mb-1 mt-2">
                        Status
                    </span>
                    <span v-if="user.buyerType == 'Golden buyer'">Golden buyer</span>
                    <span v-if="user.buyerType == 'Silver buyer'">Silver buyer</span>
                    <span v-if="user.buyerType == 'Bronze buyer'">Bronze buyer</span>
                </div>
            </div>
        </div>
    </div>
    `
}