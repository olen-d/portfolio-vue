<template>
  <form id="loginForm">
    <label for="firstName">First Name</label>
    <input type="text" class="u-full-width" id="firstName" placeholder="Your First Name" required>
    <label for="lastName">Last Name</label>
    <input type="text" class="u-full-width" id="lastName" placeholder="Your Last Name" required>
    <label for="email">Email Address</label>
    <input type="email" class="u-full-width" id="email" placeholder="Your Email Address" required>
    <label for="userName">Username</label>
    <input type="text" class="u-full-width" id="userName" placeholder="Your Username" required>
    <label for="password">Password</label>
    <input type="password" class="u-full-width" id="password" placeholder="Your Password" required>
    <button v-on:click.prevent="submitSignUpForm" type="submit" class="button-primary" id="signIn">Sign Up</button>
  </form>
</template>
