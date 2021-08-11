const Homepage = {template: '<homepage-view></homepage-view>'}

const routes = [
    {path: '/', name: 'homepage', component: Homepage},
    {path: '/restaurants', name: 'homepage', component: Homepage}
]

const router = new VueRouter({
    mode: 'history',
    routes: routes
})

var app = new Vue({
    router,
    el: "#app"
})