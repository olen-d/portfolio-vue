<template>
  <form id="loginForm">
    <label for="name">Username</label>
    <input type="text" class="u-full-width" id="name" placeholder="Your Username" required>
    <label for="password">Password</label>
    <input type="password" class="u-full-width" id="password" placeholder="Your Password" required>
    <button v-on:click.prevent="signIn" type="submit" class="button-primary" id="signIn">Sign In</button>
  </form>
</template>
