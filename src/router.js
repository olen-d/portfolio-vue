import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import { store } from "./store/store";

const AdminRoot = () => import("./views/AdminRoot.vue");
const AdminDashboard = () => import("./components/AdminDashboard.vue");
const AdminPages = () => import("./views/AdminPages.vue");
const AdminPagesProjects = () => import("./components/AdminPagesProjects.vue");
const AdminPagesProjectsRoot = () => import("./views/AdminPagesProjectsRoot.vue");
const AdminPagesProjectsAdd = () => import("./components/AdminPagesProjectsAdd.vue");
const AdminPagesProjectsEdit = () => import("./components/AdminPagesProjectsEdit.vue");
const AdminPagesSkills = () => import("./components/AdminPagesSkills.vue");
const AdminPagesWelcome = () => import("./components/AdminPagesWelcome.vue");

// route level code-splitting
// this generates a separate chunk (about.[hash].js) for this route
// which is lazy-loaded when the route is visited.
const About = () => import("./views/About.vue");
const Contact = () => import("./views/Contact.vue");
const LoginRoot = () => import("./views/LoginRoot.vue");
const Login = () => import("./components/LoginForm.vue");
const RequestPasswordResetForm = () => import("./components/RequestPasswordResetForm.vue");
const ResetPasswordForm = () => import("./components/ResetPasswordForm.vue");
const Projects = () => import("./views/Projects.vue");
const Signup = () => import("./views/SignUp.vue");

const AuthorizeStrava = () => import("./views/AuthorizeStrava.vue");
Vue.use(Router);

export default new Router({
  mode: "history",
  base: import.meta.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
      alias: "/home"
    },
    {
      path: "/admin",
      component: AdminRoot,
      beforeEnter(to, from, next) {
        if (store.getters.authorized && store.getters.administrator) {
          next();
        } else {
          next({ name: "home" });
        }
      },
      children: [
        {
          path: "/",
          name: "adminDashboard",
          component: AdminDashboard
        },
        {
          path: "pages",
          name: "pagesRoot",
          component: AdminPages,
          children: [
            {
              path: "projects",
              component: AdminPagesProjectsRoot,
              children: [
                {
                  path: "/",
                  name: "adminPagesProjects",
                  component: AdminPagesProjects
                },
                {
                  path: "add",
                  name: "adminPagesProjectsAdd",
                  component: AdminPagesProjectsAdd
                },
                {
                  path: "edit",
                  name: "adminPagesProjectsEdit",
                  component: AdminPagesProjectsEdit
                }
              ]
            },
            {
              path: "skills",
              name: "adminPagesSkills",
              component: AdminPagesSkills
            },
            {
              path: "welcome",
              name: "adminPagesWelcome",
              component: AdminPagesWelcome
            }
          ]
        }
      ]
    },
    {
      path: "/about",
      name: "about",
      component: About
    },
    {
      path: "/authorize",
      name: "authorize",
      component: AuthorizeStrava
    },
    {
      path: "/login",
      component: LoginRoot,
      children: [
        {
          path: "/",
          name: "login",
          component: Login
        },
        {
          path: "request-password-reset",
          name: "request-password-reset",
          component: RequestPasswordResetForm
        },
        {
          path: "reset-password/:token",
          name: "reset-password",
          props: true,
          component: ResetPasswordForm
        }
      ]
    },
    {
      path: "/projects",
      name: "projects",
      component: Projects
    },
    {
      path: "/signup",
      name: "signUp",
      component: Signup
    },
    {
      path: "/contact",
      name: "contact",
      component: Contact
    }
  ]
});
