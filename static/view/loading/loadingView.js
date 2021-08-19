Vue.component("loading-view", {
    methods: {
        wait(ms){
            var start = new Date().getTime();
            var end = start;
            while(end < start + ms) {
              end = new Date().getTime();
           }
        }
    },
    mounted(){
        // window.localStorage.setItem('token', undefined)
        let token = window.localStorage.getItem('token');
        if(!token)
            return;
        axios
        .get("http://localhost:8081/rest/accessUserWithJwt", {
            headers:{
            'Authorization': 'Bearer ' + token
            }
        })
        .then(response => {
            this.$router.push({ name: 'homepageBuyer'})
        })
        .catch(error => {
            window.localStorage.setItem('token', null);
            this.$router.push({ name: 'homepage'})            
        })
    },
    template:
    `
    <div class="loader-screen d-flex flex-column align-items-center justify-content-center">
        <img class="full-logo full-logo-splash" src="../assets/images/logos/foodly-logos/full-logo.png" alt="Brand logo" >
        <div class="loader"></div>
    </div>
    
    `
});