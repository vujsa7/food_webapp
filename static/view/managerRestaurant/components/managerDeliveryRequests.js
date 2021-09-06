  var deliveryRequestsDialogComponent = {
    data() {
      return {
        messageDialogData: {
          title: "",
          message: "",
          buttonText: ""
        },
        isDeliveryRequestsDisplayed: false,
      }
    },
    props:[
        "awaitingDelivery"
    ],
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
      }
    },
    template: `
        <div class="modal" :class="{ 'display-block' : isDeliveryRequestsDisplayed }">
          <div class="modal-content">
            <div class="modal-header d-flex flex-column">
              <div class="d-flex flex-row align-items-center">
                <span class="align-self-center">Create account</span>
                <span class="close" @click="closeDialog">&times;</span>
              </div>
            </div>
            <div class="modal-body">
            <!--div v-for="order in awaitingDelivery" :key="order.id" class="review-card d-flex flex-column">
                <div class="review-card-basic-info d-flex flex-row align-items-center mb-2">
                <div class="d-flex left align-items-center">
                  <div class="image-cropper mx-2">
                    <img src="../assets/images/profile-picture.jpg" alt="avatar" class="profile-pic">
                  </div>
                  <h5 class="review-card-title m-0">{{comment.buyerId}}</h5>
                </div>
                
                <div class="right d-flex align-items-center justify-content-end me-2">
                  <img class="restaurant-view-star-icon ms-3 mb-1 me-2" src="../assets/icons/star.png" alt="Star icon">
                  <span class="fw-bold restaurant-view-rating-text">{{comment.review}}</span>
                </div>
                
                </div>
                <p class="review-card-comment m-0">{{comment.details}}</p>
                <div class="d-flex flex-row-reverse">
                  <button type="button" class="btn btn-success justify-end ms-3" @click="approveComment(comment.id)">
                    <img src="../assets/icons/checkmark16px.png"/>
                    <span>Approve</span>
                  </button>
                  <button type="button" class="btn btn-danger justify-end" @click="deleteComment(comment.id)">
                    <img src="../assets/icons/delete.png"/>
                    <span>Delete</span>
                  </button>  
                </div>
            </div>
                <button :disabled="$v.form.$invalid" type="submit" class="btn btn-danger regular-button">Create account</button-->
                OOOOOOOOOOOOKKKKKKKKKK
            </div>
          </div>
          <message-dialog ref="messageDialogChild" :message="messageDialogData"></message-dialog>
        </div>
        `
  }