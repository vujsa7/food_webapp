

Vue.component('restaurant-card', {
  template:'#restaurant-template'
})


new Vue({
    el: '#restaurant-search',
    data: {
      scrolled: 0,
    },
    methods: {
      handleScroll() {
        this.scrolled = window.scrollY
      }
    },
    created() {
      window.addEventListener('scroll', this.handleScroll)
    },
    computed: {
      stickySidebar() { return this.scrolled > 1060 }
    }
  })