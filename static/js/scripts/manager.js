new Vue({
    el: '#manager',
    data: {
      restaurant: "",
      comments: [],
      user: ""
    },
    mounted() {
      	let token = window.localStorage.getItem('token');
		axios
          .get('/restaurants/getForManager', {}, {headers: {'Authorization': 'Bearer ' + token }})
          .then(response => {
          	this.restaurant = response.data;
          })
          .catch(function(error){
	      console.log(error);
	      })
	      
	    axios
          .get('/comments/GetCommentsByRestaurant/:' + restaurant.id)
          .then(response => {
          	this.comments = response.data;
          })
          .catch(function(error){
	      console.log(error);
	      })
	    
    },
    methods: {
      handleScroll() {
        this.scrolled = window.scrollY
    },
    created() {
      window.addEventListener('scroll', this.handleScroll)
    }}
  })