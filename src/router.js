import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";

const Admin = () => import("./views/Admin.vue");
const AdminLogin = () => import("./views/AdminLogin.vue");
const AdminSignUp = () => import("./views/AdminSignUp.vue");
const AdminDashboard = () => import("./views/AdminDashboard.vue");

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
      alias: "/home"
    },
    {
      path: "/admin",
      component: Admin,
      children: [
        {
          path: "",
          name: "adminLogin",
          component: AdminLogin,
          alias: "login"
        },
        {
          path: "signup",
          name: "adminSignUp",
          component: AdminSignUp
        },
        {
          path: "dashboard",
          name: "adminDashboard",
          component: AdminDashboard
        }
      ]
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "about" */ "./views/About.vue")
    },
    {
      path: "/projects",
      name: "projects",
      component: () =>
        import(/* webpackChunkName: "projects" */ "./views/Projects.vue")
    },
    {
      path: "/contact",
      name: "contact",
      // component: Contact
      component: () =>
        import(/* webpackChunkName: "contact" */ "./views/Contact.vue")
    }
  ]
});
