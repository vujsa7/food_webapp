var messageDialogComponent = {
    data(){
      return{
        isModalDisplayed: false,
        callbackFunction: undefined
      }
    },
    props: [
      'message'
    ],
    methods: {
      hideDialog(){
        this.isModalDisplayed = false;
        if(this.callbackFunction){
          this.callbackFunction();
        }
      },
      displayDialog(){
        this.isModalDisplayed = true;
      },
      displayDialogWithCallback(func){
        this.isModalDisplayed = true;
        this.callbackFunction = func
      }
    },
    template: `
    <div class="modal" :class="{ 'display-block' : isModalDisplayed }" @click="hideDialog">
      <div class="modal-content modal-padding">
          <div class="modal-simple-header d-flex flex-column">
              <div class="d-flex flex-row align-items-center">
              <span class="align-self-center">{{message.title}}</span>
              </div>
          </div>
          <div class="d-flex flex-column mt-2">
              <span >{{message.message}}</span>
              <div class="d-flex justify-content-end mt-4">
                <button @click="hideDialog" type="button" class="btn btn-danger regular-button">{{message.buttonText}}</button>
              </div>
          </div>
      </div>
    </div>
    `
}