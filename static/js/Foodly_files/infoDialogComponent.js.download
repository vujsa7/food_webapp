var infoDialogComponent = {
    props: [
      'dialogInfo'
    ],
    methods: {
      hideDialog(){
        dialogInfoModal.style.display = "none";
      }
    },
    template: `
      <div class="info-modal-content">
          <div class="modal-header d-flex flex-column">
              <div class="d-flex flex-row align-items-center">
              <span class="align-self-center">{{dialogInfo.infoTitle}}</span>
              </div>
          </div>
          <div class="modal-body">
              <span >{{dialogInfo.infoMessage}}</span>
              <div class="d-flex justify-content-end mt-4">
              <button @click="hideDialog" type="button" class="btn btn-danger regular-button">{{dialogInfo.infoBtn}}</button>
              </div>
          </div>
      </div>
    `
}