import Vue from 'vue';
import App from './App.vue';

new Vue({
    el: '#app', 
    render: handler => handler(App)
});