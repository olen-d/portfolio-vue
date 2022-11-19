// import Vue from "vue";
import HomePage from "@/views/HomePage.vue";

import { createRouter, createWebHistory } from "vue-router";

import { useAuthStore } from "@/store/auth.js";

const AdminRoot = () => import("./views/AdminRoot.vue");
const AdminDashboard = () => import("./components/AdminDashboard.vue");
const AdminPages = () => import("./views/AdminPages.vue");
const AdminPagesProjects = () => import("./components/AdminPagesProjects.vue");
const AdminPagesProjectsRoot = () => import("./views/AdminPagesProjectsRoot.vue");
const AdminPagesProjectsAdd = () => import("./components/AdminPagesProjectsAdd.vue");
const AdminPagesProjectsEdit = () => import("./components/AdminPagesProjectsEdit.vue");
const AdminPagesSkills = () => import("./components/AdminPagesSkills.vue");
const AdminPagesWelcome = () => import("./components/AdminPagesWelcome.vue");
const AdminProfile = () => import("./components/AdminProfile.vue");
const AdminSettings = () => import("./views/AdminSettings.vue");

// route level code-splitting
// this generates a separate chunk (about.[hash].js) for this route
// which is lazy-loaded when the route is visited.
const AboutPage = () => import("@/views/AboutPage.vue");
const Contact = () => import("./views/Contact.vue");
const LoginRoot = () => import("./views/LoginRoot.vue");
const Login = () => import("./components/LoginForm.vue");
const RequestPasswordResetPage = () => import("@/views/RequestPasswordResetPage.vue");
const ResetPasswordPage = () => import("@/views/ResetPasswordPage.vue");
const Projects = () => import("./views/Projects.vue");
const Signup = () => import("./views/SignUp.vue");

const AuthorizeStrava = () => import("./views/AuthorizeStrava.vue");
// Vue.use(Router);

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomePage,
      alias: "/home"
    },
    {
      path: "/admin",
      component: AdminRoot,
      beforeEnter(to, from, next) {
        const authStore = useAuthStore()
        if (authStore.authorized && authStore.administrator) {
          next();
        } else {
          next({ name: "home" });
        }
      },
      children: [
        {
          path: "",
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
                  path: "",
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
        },
        {
          path: "profile",
          name: "adminProfile",
          component: AdminProfile
        },
        {
          path: "settings",
          name: "adminSettings",
          component: AdminSettings
        }
      ]
    },
    {
      path: "/about",
      name: "about",
      component: AboutPage
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
          path: "",
          name: "login",
          component: Login
        },
        {
          path: "request-password-reset",
          name: "request-password-reset",
          component: RequestPasswordResetPage
        },
        {
          path: "reset-password",
          name: "reset-password",
          component: ResetPasswordPage,
          props: (route) => ({ token: route.query.token })
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

export { router }
