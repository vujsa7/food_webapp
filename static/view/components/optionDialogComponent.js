var optionDialogComponent = {
    data(){
      return{
        isModalDisplayed: false
      }
    },
    props: [
      'message'
    ],
    methods: {
      hideDialog(){
        this.isModalDisplayed = false;
        this.$emit('hidden');
      },
      displayDialog(){
        this.isModalDisplayed = true;
      },
      callbackFunction(){
        this.$emit('callback');
      }
    },
    template: `
    <div class="modal" :class="{ 'display-block' : isModalDisplayed }">
      <div class="modal-content modal-padding">
          <div class="modal-simple-header d-flex flex-column">
              <div class="d-flex align-self-start flex-row">
                <span class="align-self-start">{{message.title}}</span>
              </div>
          </div>
          <div class="d-flex flex-column mt-2">
              <span>{{message.message}}</span>
              <div class="d-flex flex-row justify-content-end mt-4">
                <button @click="hideDialog" type="button" class="btn btn-secondary gray-button me-3">{{message.buttonText1}}</button>
                <button @click="callbackFunction" type="button" class="btn btn-danger option-regular-button">{{message.buttonText2}}</button>
              </div>
          </div>
      </div>
    </div>
    `
}