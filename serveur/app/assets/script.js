new Vue({
    el: '#app',
    data: {
        isLoad: false,
        ip: '192.168.178.73', //todo remove
        ipConnected: false, // todo false
        baseURL: '',
        connexion: {
            has_error: false,
            email: '',
            password: ''
        },
        user: {
            email: '',
            name: '', // todo remove ''
            token: ''
        },
        userConnected: false, // todo false
        salle: {
            has_error: false,
            name: '',
            _id: ''
        },
        salleConnected: false, // todo false
        compteur: 3,
        intervalle: null,
        alpha: null,
        beta: null,
        gamma: null,
        distance: null,
        mur: null,
        socket: null
    },
    mounted () {
        let self = this
        // todo delete
        setTimeout(function () {
            self.isLoad = true
        },500)

        window.onload = function(){
            front.send('get-ip', app.getPath('userData'));
            front.send('get-user', app.getPath('userData'));
        }

        front.on('get-ip-result', function(msg){
            if(msg !== ""){
                self.ip = msg
            }
            self.isLoad = true
        })

        front.on('get-user-result', function(msg){
            if(msg !== "$$"){
                let data = msg.split('$');
                self.user.email = data[0]
                self.user.name = data[1]
                self.user.token = data[2]
                self.tryConnexion(self.user.token)
                app.toast.show('after connexion', 1)
            }
            self.isLoad = true
        })

        front.on('toast-msg', function(msg){
            app.toast.show(msg, 1)
        })
    },
    beforeDestroy () {
        let self = this
        if (self.intervalle !== null) {
            clearInterval(self.intervalle)
            self.intervalle = null
        }
    },
    watch: {
        salleConnected () {
            let self = this
            if (self.salleConnected && self.intervalle === null) {
                self.intervalle = setInterval(function () {
                    self.compteur --
                    if (self.compteur === 0) {
                        clearInterval(self.intervalle)
                    }
                }, 1000)
            }
            if (!self.salleConnected) {
                self.compteur = 3
                try {
                    window.removeEventListener("deviceorientation", self.process, false)
                } catch (err) {
                    console.log(err)
                }
            }
        },
        compteur () {
            let self = this
            if (self.compteur === 0) {
                if(window.DeviceOrientationEvent) {
                    window.addEventListener("deviceorientation", self.process, false);
                    app.toast.show('Orientation go !!', 0);
                } else {
                    console.log('Device not support orientation')
                    app.toast.show('Device not support orientation', 0);
                    // Le navigateur ne supporte pas l'événement deviceorientation
                }
            }
        },
        ipConnected () {
            let self = this
            console.log('ip : ', self.ip)
            self.socket = io(`http://${self.ip}:80`)
            self.socket.on('connected', function(data){
                console.log(data)
            })
        }
    },
    methods: {
        validateIp () {
            let self = this
            if (self.ip) {
                self.ipConnected = true
                self.baseURL = `http://${self.ip}/api`
                front.send('save-ip', app.getPath('userData'), this.ip)
            } else {
                app.toast.show('Adresse ip vide', 0);
            }
        },
        tryConnexion (token) {
            let self = this
            $.ajax({
                type: "GET",
                headers: {
                    'Access-Control-Allow-Origin': `http://${self.ip}/api`,
                    'Authorization': token
                },
                url: `http://${self.ip}/api`+'/auth/user',
                crossDomain: true,
                success: function (response) {
                    self.ipConnected = true
                    self.userConnected = true
                    self.baseURL = `http://${this.ip}/api`
                    self.socket.emit('new-app-client', 'id' ); // todo id
                    app.toast.show('Connexion reussite', 0);
                },
                error: function (response) {
                    app.toast.show('Erreur de connexion', 0);
                }
            })
        },
        login() {
            // get the redirect object
            // var redirect = this.$auth.redirect()
            let self = this
            $.ajax({
                type: "POST",
                headers: {  'Access-Control-Allow-Origin': self.baseURL },
                url: self.baseURL+'/auth/login',
                data: {
                    email: self.connexion.email,
                    password: self.connexion.password
                },
                crossDomain: true,
                dataType: 'json',
                success: function (response) {
                    if (response.token) {
                        // todo stock id
                        self.user.email = response.data.email
                        self.user.name = response.data.name
                        self.user.token = response.token
                        self.userConnected = true
                        let msg = self.user.email + "$" + self.user.name + "$" + self.user.token;
                        self.socket.emit('new-app-client', 'id' ); // todo id
                        front.send('save-user', app.getPath('userData'), msg)
                        app.toast.show('Connexion réussi', 0);
                    } else {
                        app.toast.show('Erreur de connexion', 0);
                    }
                },
                error: function (response) {
                    self.connexion.has_error = true
                    app.toast.show('Erreur lors de la connexion', 0);
                }
            })
        },
        logout () {
            let self = this
            $.ajax({
                type: "POST",
                headers: {
                    'Access-Control-Allow-Origin': self.baseURL,
                    'Authorization': self.user.token
                },
                data: {},
                url: self.baseURL+'/auth/logout',
                crossDomain: true,
                dataType: 'json',
                success: function (response) {
                    console.log(response)
                    self.user.email = ''
                    self.user.name = ''
                    self.user.token = ''
                    self.userConnected = false
                    let msg = '' + "$" + '' + "$" + ''
                    front.send('save-user', app.getPath('userData'), msg)
                    app.toast.show('Deconnexion réussi', 0);
                },
                error: function (response) {
                    app.toast.show('Erreur lors de la deconnexion', 0);
                }
            })
        },
        createSalle () {
            let self = this
            if (self.salle.name) {
                $.ajax({
                    type: "POST",
                    headers: {
                        'Access-Control-Allow-Origin': self.baseURL,
                        'Authorization': self.user.token
                    },
                    url: self.baseURL+'/salles',
                    data: {
                        name: self.salle.name
                    },
                    crossDomain: true,
                    dataType: 'json',
                    success: function (response) {
                        if (response) {
                            self.salle._id = response._id
                            self.salleConnected = true
                        } else {
                            app.toast.show('Erreur lors de la création de la salle', 0);
                        }
                    },
                    error: function (response) {
                        self.salle.has_error = true
                        app.toast.show('Erreur lors de la connexion', 0);
                    }
                })
            } else {
                self.salle.has_error = true
            }
        },
        process (event) {
            let self = this
            self.alpha = event.alpha;
            self.beta = event.beta;
            self.gamma = event.gamma;
        }
    }
})