const allowedNewCharactersRegex = /[`@#%^&*_+\-=\[\]{};'"\\|<>\/~]/;
var allowedNewCharactersValid = (value) => !allowedNewCharactersRegex.test(value);

let reviewOrderDialogComponent = {
    data(){
        return {
            isModalDisplayed : false,
            numberOfStarsSelected: 0,
            form:{
                comment : ""
            },
            messageDialogData:{
                title: "",
                message: "",
                buttonText: ""
            },
        }
    },
    validations:{
        form:{
            comment:{
                allowedNewCharactersValid,
                maxLength: validators.maxLength(566)
            }
        }
    },
    props:[
        'order'
    ],
    methods:{
        displayDialog(){
            this.isModalDisplayed = true;
        },
        isStarChecked(index){
            if(index < this.numberOfStarsSelected){
                return true;
            }
            return false;
        },
        updateNumberOfStarsSelected(number){
            this.numberOfStarsSelected = number + 1;
        },
        cancelReview(){
            this.$parent.reviewOrder = undefined;
            this.form.comment = "";
            this.numberOfStarsSelected = 0;
            this.isModalDisplayed = false;
        },
        submitForm(){
            let comment = {
                details: this.form.comment,
                review: this.numberOfStarsSelected,
                restaurantId: this.order.restaurantId,
                buyerId: this.order.buyerId
            } 
            let token = window.localStorage.getItem('token');
            axios
            .post("http://localhost:8081/rest/newComment/" + this.order.id , comment, {
                headers:{
                'Authorization': 'Bearer ' + token
                }
            })
            .then(response => {
                if(response.status == 200){
                    this.messageDialogData.title = "Done";
                    this.messageDialogData.message = response.data;
                    this.messageDialogData.buttonText = "Ok";
                    var self = this;
                    function callback(){
                        self.isModalDisplayed = false;
                    }
                    this.$refs.messageDialogChild.displayDialogWithCallback(callback);
                    this.$emit('createdComment');
                }
            })
            .catch(error => {
                if(error.response){
                    console.log(error.response.status)
                }
            });
        }
    },
    components:{
        messageDialog: messageDialogComponent 
    },
    computed:{
        isReviewButtonDisabled(){
            if(this.numberOfStarsSelected == 0  || this.$v.form.$invalid || this.form.comment==""){
                return true;
            }
            return false;
        }
    },
    template:
    `
    <div class="modal" :class="{ 'display-block' : isModalDisplayed }">
        <message-dialog ref="messageDialogChild" :message="messageDialogData"></message-dialog>
        <div class="modal-content rate-modal-content modal-padding">
            <div class="modal-simple-header d-flex flex-column">
                <div class="d-flex align-self-start flex-row">
                    <span class="align-self-start fw-bold rate-header-text">Rate restaurant</span>
                </div>
            </div>
            <form action="http://localhost:8081/rest/newComment/" method="post" @submit.prevent="submitForm()" autocomplete="off">
                <div class="d-flex flex-column mt-2">
                    <span>How would you rate your experience?</span>
                    <div class="d-flex flex-row">
                        <span class="fa fa-star first-star" @click="updateNumberOfStarsSelected(0)" :class="{'checked' : isStarChecked(0)}"></span>
                        <span class="fa fa-star star" @click="updateNumberOfStarsSelected(1)" :class="{'checked' : isStarChecked(1)}"></span>
                        <span class="fa fa-star star" @click="updateNumberOfStarsSelected(2)" :class="{'checked' : isStarChecked(2)}"></span>
                        <span class="fa fa-star star" @click="updateNumberOfStarsSelected(3)" :class="{'checked' : isStarChecked(3)}"></span>
                        <span class="fa fa-star star" @click="updateNumberOfStarsSelected(4)" :class="{'checked' : isStarChecked(4)}"></span>
                    </div>
                    <div class="note-for-delivery-container d-flex flex-column">
                        <div class="d-flex flex-column column-wrapper">
                            <span class="checkout-label-title">
                                Leave a comment
                            </span>
                            <textarea @blur="$v.form.comment.$touch()" v-model="form.comment" type="text" class="form-control expanded" :class="{'field-invalid': ($v.form.comment.$invalid && form.comment != ''), 'field-valid': (!$v.form.comment.$invalid && form.comment != '')}"></textarea>
                            <div v-if="$v.form.comment.$invalid">
                                <span class="error-message" v-if="!$v.form.comment.maxLength">Exceeded maximum number of characters.</span>
                                <span class="error-message" v-if="!$v.form.comment.allowedNewCharactersValid">Special characters forbidden.</span>
                            </div>
                        </div>
                        <div class="characters-left align-self-end mt-1">
                            0/566
                        </div>
                    </div>
                </div>
                <div class="d-flex flex-row justify-content-end mt-3">
                <button @click="cancelReview" type="button" class="btn btn-secondary gray-button me-3">Cancel</button>
                <button :disabled="isReviewButtonDisabled" type="submit" class="btn btn-danger option-regular-button">Rate</button>
                </div>
            </form>
            </div>
        </div>
    </div>
    `
}