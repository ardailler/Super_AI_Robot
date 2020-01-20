<template>
    <div :class="['sign-pages', isClose]">
        <div class="top">
            <transition name="app-name-login-anim" enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
                <p class="subtitle_1" v-if="close">SUPER IA ROBOT</p>
            </transition>
        </div>
        <div class="center">
            <transition mode="out-in" name="forms-login-anim" enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
                <!--SignIn-->
                <form autocomplete="off" key="'SignIn'" @submit.prevent="login" method="post" v-if="close && signin">
                    <div class="alert alert-danger" v-if="has_error">
                        <p class="body_2">Erreur, impossible de se connecter avec ces identifiants.</p>
                    </div>
                    <div class="form-group">
                        <!--<label for="email" class="subtitle_2">E-mail</label>-->
                        <input type="email" id="email" class="form-control body_2" placeholder="E-MAIL" v-model="email" required>
                    </div>
                    <div class="form-group">
                        <!--<label for="password" class="subtitle_2">Mot de passe</label>-->
                        <input type="password" id="password" class="form-control body_2" placeholder="MOT DE PASSE" v-model="password" required>
                    </div>
                    <button type="submit" class="btn btn-default">Connexion</button>
                </form>
                <!--SignUp-->
                <form autocomplete="off" key="'SignUp'" @submit.prevent="register" method="post" v-if="close && !signin">
                    <div class="alert alert-danger" v-if="has_error_signup">
                        <p v-if="error === 'registration_validation_error'" class="body_2">Erreur(s) de validation, veuillez consulter le(s) message(s) ci-dessous.</p>
                        <p v-else class="body_2">Erreur, impossible de s'inscrire pour le moment. Si le problème persiste, veuillez contacter un administrateur.</p>
                    </div>

                    <div class="form-group" v-bind:class="{ 'has-error': has_error_signup && errors.name }">
                        <input type="text" id="name_signup" class="form-control body_2" placeholder="NOM" v-model="name">
                        <span class="help-block body_2" v-if="has_error_signup && errors.name">{{ errors.name.message }}</span>
                    </div>

                    <div class="form-group" v-bind:class="{ 'has-error': has_error_signup && errors.email }">
                        <input type="email" id="email_signup" class="form-control body_2" placeholder="E-MAIL" v-model="email_signup">
                        <span class="help-block body_2" v-if="has_error_signup && errors.email">{{ errors.email.message }}</span>
                    </div>

                    <div class="form-group" v-bind:class="{ 'has-error': has_error_signup && errors.password }">
                        <input type="password" id="password_signup" class="form-control body_2" placeholder="MOT DE PASSE" v-model="password_signup">
                        <span class="help-block body_2" v-if="has_error_signup && errors.password">{{ errors.password.message }}</span>
                    </div>

                    <button type="submit" class="btn btn-default">Inscription</button>
                </form>
            </transition>
        </div>
        <div class="bottom">
            <transition name="sign-button-login-anim" enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
                <p class="subtitle_1" v-if="close" @click.prevent.stop="switchSignin">{{ signText }}</p>
            </transition>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                email: null,
                password: null,
                has_error: false,
                close: false,


                name: '',
                email_signup: '',
                password_signup: '',
                has_error_signup: false,
                error: '',
                errors: {},
                signin: true
            }
        },
        mounted() {
            let self = this
            setTimeout(function () {
                self.switchClose ()
            }, 250)
        },
        computed: {
          isClose () {
              return this.close ? 'close' : 'open'
          },
            signText () {
              return this.signin ? 'SIGNIN' : 'SIGNUP'
          }
        },
        methods: {
            switchClose () {
                this.close = !this.close
            },
            switchSignin () {
                this.signin = !this.signin
            },
            login() {
                // get the redirect object
                // var redirect = this.$auth.redirect()
                let app = this
                app.$auth.login({
                    data: {
                        email: app.email,
                        password: app.password
                    },
                    success: function() {
                        // handle redirection
                        // const redirectTo = redirect ? redirect.from.name : app.$auth.user().role === 2 ? 'admin.dashboard' : 'dashboard'
                        app.switchClose()
                        setTimeout(function () {
                            app.$router.push({name: 'dashboard'})
                        }, 1000)
                    },
                    error: function() {
                        app.has_error = true
                    },
                    rememberMe: true,
                    fetchUser: true
                })
            },
            register() {
                let app = this
                this.$auth.register({
                    data: {
                        name: app.name,
                        email: app.email_signup,
                        password: app.password_signup
                    },
                    success: function () {
                        app.success_signup = true
                        app.email = app.email_signup
                        app.password = app.password_signup
                        app.login()
                        /* setTimeout(function () {
                            app.$router.push({name: 'dashboard'})
                        }, 1000) */
                    },
                    error: function (res) {
                        console.log(res.response.data)
                        app.error = ''
                        app.has_error_signup = true
                        if (res.response.data.error) {
                            app.error = res.response.data.error
                        } else if (res.response.data.name) {
                            app.error = res.response.data.name === 'ValidationError' ? 'registration_validation_error' : res.response.data.name
                        }
                        app.errors = res.response.data.errors || {}
                    }
                })
            }
        }
    }
</script>
<style scoped>
    .sign-pages {
        position: relative;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
    }
    .sign-pages > .top,
    .sign-pages > .center,
    .sign-pages > .bottom{
        display: flex;
        flex-direction: column;
        align-items: center;

        -webkit-transition: 1s ease;
        -moz-transition: 1s ease;
        -ms-transition: 1s ease;
        -o-transition: 1s ease;
        transition: 1s ease;
    }

    .sign-pages > .top {
        justify-content: flex-start;
    }

    .sign-pages > .bottom {
        justify-content: flex-end;
    }

    .sign-pages.open > .top,
    .sign-pages.open > .bottom {
        padding: 0px;
        flex: 0;
    }

    .sign-pages.close > .top,
    .sign-pages.close > .bottom {
        padding: 20px;
        flex: 2;
    }
    .sign-pages.close > .center {
        flex: 0;
    }
    .sign-pages.open > .center {
        flex: 1;
    }
    .sign-pages > .center {
        justify-content: center;
        padding: 20px;
    }
    .sign-pages > .top {
        background-color: var(--color-primary);
    }

    .sign-pages > .center {
        background-color: var(--color-light);
    }

    .sign-pages > .bottom {
        background-color: var(--color-secondary);
    }
    .sign-pages > .top p {
        position: absolute;
        color: var(--color-primary-10);
    }
    .sign-pages > .bottom p {
        position: absolute;
        color: var(--color-secondary-00);
        cursor: pointer;
    }
    .sign-pages .center form {
        position: relative;
    }
    .sign-pages .center .form-group {
        position: relative;
        display: flex;
        flex-direction: column;
    }
    .sign-pages .center .form-group label,
    .sign-pages .center button {
        margin-top: 5px;
    }
    .sign-pages .center .form-group .form-control {
        border: none;
        padding: 2px 0;
        outline: none;
        margin: 5px 0;
        text-align: center;
    }
    .sign-pages .center button {
        width: 100%;
        border: none;
        background-color: transparent;
        outline: none;

        -webkit-border-radius: 5px;
        -moz-border-radius: 5px;
        border-radius: 5px;
        cursor: pointer;
    }

    .sign-pages .center button:hover {
        background-color: var(--color-tertiary-00);
        color: var(--color-tertiary);
    }
    .alert-danger {
        background-color: var(--color-alert2);
        color: var(--color-secondary-10);
        padding: 5px;
        -webkit-border-radius: 5px;
        -moz-border-radius: 5px;
        border-radius: 5px;
        margin-bottom: 10px;
    }
    .form-group.has-error {
        background-color: var(--color-alert2);
        color: var(--color-secondary-10);
        -webkit-border-radius: 5px;
        -moz-border-radius: 5px;
        border-radius: 5px;
        overflow: hidden;
    }
    .form-group.has-error > * {
        background-color: var(--color-alert2);
        color: var(--color-secondary-10);
    }
    .help-block {
        text-align: center;
    }
</style>