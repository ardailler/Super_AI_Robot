<template>
    <div :class="['sign-page', isClose]">
        <div class="top">
            <transition name="router-anim" enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
                <p class="subtitle_1" v-if="close">SUPER IA ROBOT</p>
            </transition>
        </div>
        <div class="center">
            <transition name="router-anim" enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
                <form autocomplete="off" @submit.prevent="login" method="post" v-if="close">
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
            </transition>
        </div>
        <div class="bottom">
            <transition name="router-anim" enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
                <p class="subtitle_1" v-if="close" @click.prevent.stop="clickSignUp">SIGNUP</p>
            </transition>
        </div>


        <!--<div class="card card-default">
            <div class="card-header">Connexion</div>

            <div class="card-body">
                <div class="alert alert-danger" v-if="has_error">
                    <p>Erreur, impossible de se connecter avec ces identifiants.</p>
                </div>
                <form autocomplete="off" @submit.prevent="login" method="post">
                    <div class="form-group">
                        <label for="email">E-mail</label>
                        <input type="email" id="email" class="form-control" placeholder="user@example.com" v-model="email" required>
                    </div>
                    <div class="form-group">
                        <label for="password">Mot de passe</label>
                        <input type="password" id="password" class="form-control" v-model="password" required>
                    </div>
                    <button type="submit" class="btn btn-default">Connexion</button>
                </form>
            </div>
        </div>-->
    </div>
</template>

<script>
    export default {
        data() {
            return {
                email: null,
                password: null,
                has_error: false,
                close: false
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
          }
        },
        methods: {
            switchClose () {
                this.close = !this.close
            },
            clickSignUp () {
                this.close = !this.close
            },
            login() {
                // get the redirect object
                // var redirect = this.$auth.redirect()
                var app = this
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
            }
        }
    }
</script>
<style scoped>
    .sign-page {
        position: relative;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
    }
    .sign-page > .top,
    .sign-page > .center,
    .sign-page > .bottom{
        display: flex;
        flex-direction: column;
        align-items: center;

        -webkit-transition: 1s ease;
        -moz-transition: 1s ease;
        -ms-transition: 1s ease;
        -o-transition: 1s ease;
        transition: 1s ease;
    }

    .sign-page > .top {
        justify-content: flex-start;
    }

    .sign-page > .bottom {
        justify-content: flex-end;
    }

    .sign-page.open > .top,
    .sign-page.open > .bottom {
        padding: 0px;
        flex: 0;
    }

    .sign-page.close > .top,
    .sign-page.close > .bottom {
        padding: 20px;
        flex: 2;
    }
    .sign-page > .center {
        flex: 1;
        justify-content: center;
        padding: 20px;
    }
    .sign-page > .top {
        background-color: var(--color-primary);
    }

    .sign-page > .center {
        background-color: var(--color-light);
    }

    .sign-page > .bottom {
        background-color: var(--color-secondary);
    }
    .sign-page > .top p {
        position: absolute;
        color: var(--color-primary-10);
    }
    .sign-page > .bottom p {
        position: absolute;
        color: var(--color-secondary-00);
    }
    .sign-page .center form {
        position: absolute;
    }
    .sign-page .center .form-group {
        position: relative;
        display: flex;
        flex-direction: column;
    }
    .sign-page .center .form-group label,
    .sign-page .center button {
        margin-top: 5px;
    }
    .sign-page .center .form-group .form-control {
        border: none;
        padding: 2px 0;
        outline: none;
        margin: 5px 0;
        text-align: center;
    }
    .sign-page .center button {
        width: 100%;
        border: none;
        background-color: transparent;
        outline: none;

        -webkit-border-radius: 5px;
        -moz-border-radius: 5px;
        border-radius: 5px;
        cursor: pointer;
    }

    .sign-page .center button:hover {
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
    }

</style>