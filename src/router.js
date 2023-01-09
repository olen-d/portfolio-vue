// import Vue from "vue";
import HomePage from "@/views/HomePage.vue";

import { createRouter, createWebHistory } from "vue-router";

import { useAuthStore } from "@/store/auth.js";

const AdminRoot = () => import("@/views/AdminRoot.vue");
const AdminDashboard = () => import("@/components/AdminDashboard.vue");
const AdminPages = () => import("@/views/AdminPages.vue");
const AdminPagesProjects = () => import("@/components/AdminPagesProjects.vue");
const AdminPagesSkills = () => import("@/components/AdminPagesSkills.vue");
const AdminPagesWelcome = () => import("@/components/AdminPagesWelcome.vue");
const AdminProfile = () => import("@/components/AdminProfile.vue");
const AdminSettings = () => import("@/views/AdminSettings.vue");

// route level code-splitting
// this generates a separate chunk (about.[hash].js) for this route
// which is lazy-loaded when the route is visited.
const AboutPage = () => import("@/views/AboutPage.vue");
const ContactPage = () => import("@/views/ContactPage.vue");
const LoginRoot = () => import("@/views/LoginRoot.vue");
const LoginPage = () => import("@/views/LoginPage.vue");
const RequestPasswordResetPage = () => import("@/views/RequestPasswordResetPage.vue");
const ResetPasswordPage = () => import("@/views/ResetPasswordPage.vue");
const ProjectsPage = () => import("@/views/ProjectsPage.vue");
const ProjectLayout = () => import("@/components/ProjectLayout.vue")
const ProjectsLayout = () => import("@/components/ProjectsLayout.vue")
const SignupPage = () => import("@/views/SignupPage.vue");

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
      meta: {
        breadcrumb: {
          dynamic: false,
          text: "administration"
        }
      },
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
          component: AdminDashboard,
          meta: {
            breadcrumb: {
              dynamic: false,
              text: "dashboard"
            }
          },
        },
        {
          path: "pages",
          name: "pagesRoot",
          component: AdminPages,
          meta: {
            breadcrumb: {
              dynamic: false,
              text: "pages"
            }
          },
          children: [
            {
              path: "projects",
              name: "adminPagesProjects",
              component: AdminPagesProjects,
              meta: {
                breadcrumb: {
                  dynamic: false,
                  text: "projects"
                }
              }
            },
            {
              path: "skills",
              name: "adminPagesSkills",
              component: AdminPagesSkills,
              meta: {
                breadcrumb: {
                  dynamic: false,
                  text: "skills"
                }
              },
            },
            {
              path: "welcome",
              name: "adminPagesWelcome",
              component: AdminPagesWelcome,
              meta: {
                breadcrumb: {
                  dynamic: false,
                  text: "welcome"
                }
              },
            }
          ]
        },
        {
          path: "profile",
          name: "adminProfile",
          component: AdminProfile,
          meta: {
            breadcrumb: {
              dynamic: false,
              text: "profile"
            }
          },
        },
        {
          path: "settings",
          name: "adminSettings",
          component: AdminSettings,
          meta: {
            breadcrumb: {
              dynamic: false,
              text: "settings"
            }
          },
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
          component: LoginPage
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
      component: ProjectsPage,
      children: [
        {
          path: "",
          name: "projectList",
          component: ProjectsLayout
        },
        {
          path: ":slug",
          name: "projectDetail",
          component: ProjectLayout
        }
      ]
    },
    {
      path: "/signup",
      name: "signUp",
      component: SignupPage
    },
    {
      path: "/contact",
      name: "contact",
      component: ContactPage
    }
  ]
});

export { router }
