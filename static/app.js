const Loading = {template: '<loading-view></loading-view>'}
const Homepage = {template: '<homepage-view></homepage-view>'}
const Restaurant = {template: '<restaurant-view></restaurant-view>'}
const Cart = {template: '<cart-view></cart-view>'}
const Checkout = {template: '<checkout-view></checkout-view>'}

const routes = [
    {path: '/', name: 'loading', component: Loading},
    {path: '/homepage', name: 'homepage', component: Homepage},
    {path: '/homepage/buyer', name: 'homepageBuyer', component: Homepage},
    {path: '/restaurant/:id', name: 'restaurant', component: Restaurant},
    {path: '/cart', name: 'cart', component: Cart},
    {path: '/checkout', name: 'checkout', component: Checkout},
]

const router = new VueRouter({
    mode: 'hash',
    routes: routes
})

var app = new Vue({
    router,
    el: "#app"
})