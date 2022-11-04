import { createApp } from 'vue'
import './style.scss'
import App from './ui/App.vue'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'v-calendar/dist/style.css';
import VCalendar from 'v-calendar';

createApp(App).use(VCalendar, {}).mount('#app')
