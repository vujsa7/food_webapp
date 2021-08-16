var messageDialogComponent = {
    data(){
      return{
        isMessageModalDisplayed: false
      }
    },
    props: [
      'message'
    ],
    methods: {
      hideDialog(){
        this.isMessageModalDisplayed = false;
      },
      displayDialog(){
        this.isMessageModalDisplayed = true;
      }
    },
    template: `
    <div class="info-modal" :class="{ 'display-block' : isMessageModalDisplayed }" @click="hideDialog">
      <div class="info-modal-content">
          <div class="modal-header d-flex flex-column">
              <div class="d-flex flex-row align-items-center">
              <span class="align-self-center">{{message.title}}</span>
              </div>
          </div>
          <div class="modal-body">
              <span >{{message.message}}</span>
              <div class="d-flex justify-content-end mt-4">
                <button @click="hideDialog" type="button" class="btn btn-danger regular-button">{{message.buttonText}}</button>
              </div>
          </div>
      </div>
    </div>
    `
}