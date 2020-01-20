<template>
    <div class="dashboard-container">
        <div class="salle">
            <transition name="salle-title-anim" enter-active-class="animated fadeInDown faster" leave-active-class="animated fadeOutUp faster">
                <div class="title" v-if="show">
                    <h6>Liste de vos Salles :</h6>
                    <div class="subtitle_2">
                        <input type="text" class="subtitle_2" v-model="name" placeholder="Nom de la nouvelle salle">
                        <span class="icon-ios-add-circle-outline" @click.stop.prevent="createSalle"></span>
                    </div>
                </div>
            </transition>
            <transition name="alert-anim" enter-active-class="animated fadeInDown fast" leave-active-class="animated fadeOutUp fast">
                <div class="alert" v-if="error && show">
                    <p class="subtitle_2">{{error}}</p>
                </div>
            </transition>
            <transition-group name="salles-anim" mode="out-in" enter-active-class="animated zoomIn faster" leave-active-class="animated zoomOut faster" tag="div" class="salle-containter row">
                <div v-for="(item, index) in salle" :key="'salle-'+index" class="salle-item col-xs-12 col-s-6 col-m-6 col-l-6 col-4">
                    <Salle :id="item._id" :name="item.name" :time="item.createdAt"></Salle>
                </div>
            </transition-group>

        </div>
    </div>
</template>

<script>
    //api
    import sallesApi from '@/api/salles'
    import Salle from '@/components/tools/Salle.vue'

    import axios from 'axios'

    const getAllSalles = (callback) => {
        sallesApi.getAll(axios)
            .then(response => {
                callback(null, response.data)
            }).catch(error => {
            callback(error, error.response.data)
        })
    }
    const createSalles = (callback, _data) => {
        sallesApi.create(axios, _data)
            .then(response => {
                callback(null, response.data)
            }).catch(error => {
            callback(error, error.response.data)
        })
    }

    export default {
        data() {
            return {
                error: '',
                salle: null,
                show: false,
                timer: null,
                name: '',
                timer2: null
            }
        },
        beforeRouteEnter (to, from, next) {
            getAllSalles((err, sallesData)=> {
                next(vm => {
                    vm.setSalleData(err, sallesData)
                })
            })
        },
        beforeRouteUpdate (to, from, next) {
            let self = this
            getAllSalles ((err, sallesData,) => {
                self.setSalleData(err, sallesData)
                next()
            })
        },
        watch: {
            error () {
                let self = this
                if (!self.timer2) {
                    self.timer2 = setTimeout(function () {
                        self.error = ''
                        clearInterval(self.timer2)
                        self.timer2 = null
                    }, 2000)
                }

            }
        },
        components: {
            Salle
        },
        mounted () {
            let self = this
            self.timer = setTimeout(function () {
                self.show = true
            }, 5)
        },
        methods: {
            setSalleData: function (err, data) {
                if (err) {
                    this.error = err.toString()
                } else {
                    this.salle = data
                    this.error = ''
                    // this.emptyData = false
                }
            },
            createSalleData (err, data) {
                if (err) {
                    this.error = err.toString()
                } else {
                    this.$router.push({ name: 'editSalle', params: {id: data._id }})
                }
            },
            createSalle () {
                let self = this
                if (self.name) {
                    createSalles((err, newSalleData)=> {
                        self.createSalleData(err, newSalleData)
                    }, {name: self.name})
                } else {
                    self.error = "Erreur : Champs `nom` vide."
                }
            }
        },
        beforeRouteLeave: function(to, from, next) {
            let self = this
            self.salle = null
            clearInterval(self.timer)
            clearInterval(self.timer2)
            self.show = false
            setTimeout(function () {
                next()
            }, 500)
        }
    }
</script>

<style scoped>
    .dashboard-container {
        position: relative;
        display: block;
        height: 100%;
        width: 100%;
        padding: 84px 20px 20px 20px;
    }
    .salle .title {
        position: relative;
        display: flex;
        flex-flow: wrap;
        align-items: center;
        justify-content: space-between;
    }
    .title > .subtitle_2 {
        position: relative;
        display: block;
        padding: 0 5px;
        background-color: transparent;
        color: var(--color-tertiary-20);
        border: 1px solid var(--color-tertiary-20);
        -webkit-border-radius: 5px;
        -moz-border-radius: 5px;
        border-radius: 5px;
        text-decoration: none;

        -webkit-transition: 0.25s ease-in;
        -moz-transition: 0.25s ease-in;
        -ms-transition: 0.25s ease-in;
        -o-transition: 0.25s ease-in;
        transition: 0.25s ease-in;
        cursor: pointer;
    }

    .title > .subtitle_2:hover {
        color: var(--color-tertiary);
        background-color: var(--color-tertiary-00);
        border: 1px solid var(--color-tertiary-00);

        -webkit-transition: 0.25s ease-out;
        -moz-transition: 0.25s ease-out;
        -ms-transition: 0.25s ease-out;
        -o-transition: 0.25s ease-out;
        transition: 0.25s ease-out;
    }
    .title input {
        position: relative;
        height: 20px;
        top: .1px;
        padding: 0 5px;
        border: none;
        outline: none;

        -webkit-transition: 0.25s ease-out;
        -moz-transition: 0.25s ease-out;
        -ms-transition: 0.25s ease-out;
        -o-transition: 0.25s ease-out;
        transition: 0.25s ease-out;
    }

    .title > .subtitle_2:hover input {
    }
    .salle-containter {
        position: relative;
        width: 100%;
        margin: auto;
        justify-content: flex-start;
    }
    .salle-containter .salle-item {
        position: relative;
        display: block;
        padding: 10px;
    }

    .alert {
        position: absolute;
        display: block;
        top: 64px;
        left: 0;
        width: 100%;
    }
    .alert > p {
        position: relative;
        display: block;
        width: 100%;
        background-color: var(--color-alert1);
        color: var(--color-secondary-00);
        padding: 2.5px;
        text-align: center;

    }

    @media only screen and (min-width: 992px) {
        .salle-containter {
            width: 66%;
        }
    }


</style>