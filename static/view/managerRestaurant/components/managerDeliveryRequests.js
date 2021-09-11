var deliveryRequestsDialogComponent = {
    data() {
        return {
            messageDialogData: {
                title: "",
                message: "",
                buttonText: ""
            },
            isDeliveryRequestsDisplayed: false,
            orders: undefined
        }
    },
    mounted() {
        let token = window.localStorage.getItem('token');
        axios
            .get("http://localhost:8081/rest/deliveryRequests", {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            })
            .then(response => {
                this.orders = response.data;
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
        displayDeliveryModal() {
            this.isDeliveryRequestsDisplayed = true;
        },
        closeDialog() {
            this.isDeliveryRequestsDisplayed = false;
            this.$parent.reloadOrders();
        },
        approveRequest(deliveryRequest) {
            let token = window.localStorage.getItem('token');
            axios
                .put("http://localhost:8081/rest/approveRequest", JSON.stringify(deliveryRequest), {
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                })
                .then(response => {
                    this.reloadSuspicious();
                })
                .catch(error => {
                    if (error.response) {
                        this.showServerResponse(error);
                    }
                });
        },
        declineRequest(deliveryRequest) {
            let token = window.localStorage.getItem('token');
            axios
                .put("http://localhost:8081/rest/declineRequest", JSON.stringify(deliveryRequest), {
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                })
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
            let token = window.localStorage.getItem('token');
            axios
                .get("http://localhost:8081/rest/deliveryRequests", {
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                })
                .then(response => {
                    this.orders = response.data;
                })
                .catch(error => {
                    console.log(response.data);
                });
        }
    },
    template: `
  <div class="modal" :class="{ 'display-block' : isDeliveryRequestsDisplayed }">
        <div class="modal-content rate-modal-content">
          <div class="modal-header d-flex flex-column">
            <div class="d-flex flex-row align-items-center">
              <span class="align-self-center">Delivery requests</span>
              <span class="close" @click="closeDialog">&times;</span>
            </div>
          </div>
          <div class="modal-body suspicious-customers-body">
            <div v-for="order in orders">
              <div v-for="deliveryRequest in order.deliveryRequests" class="suspicious-customers-style mt-3 d-flex flex-row">
                  <div class="d-flex flex-column ms-3 justify-content-start">
                      <span class="basic-title mb-1 nowrap">
                          Order no.
                      </span>
                      <span class="me-2">{{deliveryRequest.orderId}}</span>
                  </div>
                  <div class="d-flex ms-3 me-2 flex-column justify-content-start">
                      <span class="basic-title mb-1">
                          Date
                      </span>
                      <span class="me-2">{{order.dateOfOrder}}</span>
                  </div>
                  <div class="d-flex me-1 flex-column justify-content-start">
                      <span class="basic-title mb-1">
                          Price
                      </span>
                      <span class="me-2">$ {{parseFloat(order.price).toFixed(2)}}</span>
                  </div>
                  <div class="d-flex flex-column justify-content-start">
                      <span class="basic-title mb-1">
                          Requested
                      </span>
                      <span class="me-2">{{deliveryRequest.deliveryWorkerId}}</span>
                  </div>
                  <button type="button" class="btn btn-secondary ms-3 justify-end align-items-center" @click="declineRequest(deliveryRequest)">
                      <img src="../assets/icons/delete.png"/>
                      <span>Decline</span>
                  </button>
                  <button type="button" class="btn btn-danger ms-2 me-2 justify-end align-items-center" @click="approveRequest(deliveryRequest)">
                      <img src="../assets/icons/checkmark16px.png"/>
                      <span>Approve</span>
                  </button>
              </div>
              </div>
          </div>
        </div>
        <message-dialog ref="messageDialogChild" :message="messageDialogData"></message-dialog>
      </div>
      `
}