<template>
    <div class="dashboard-container">
        <div class="salle">
            <div class="title">
                <h6>Liste de vos Salles :</h6>
                <p class="subtitle_2">
                    Créer une nouvelle salle
                    <span class="icon-ios-add-circle-outline"></span>
                </p>
            </div>
            <transition-group name="salles-anim" mode="out-in" enter-active-class="animated zoomIn faster" leave-active-class="animated zoomOut faster" tag="div" class="salle-containter row">
                <div v-for="(item, index) in salle" :key="'salle-'+index" class="salle-item col-xs-12 col-s-6 col-m-6 col-l-6 col-4">
                    {{item}}
                    <Salle></Salle>
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

    export default {
        data() {
            return {
                error: '',
                salle: null
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
        components: {
            Salle
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
            }
        },
        beforeRouteLeave: function(to, from, next) {
            if (this.$auth.check()) {
                next()
            } else {
                this.salle = null
                setTimeout(function () {
                    next()
                }, 500)
            }

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
    .title p.subtitle_2 {
        position: relative;
        display: block;
        padding: 0 5px;
        background-color: transparent;
        color: var(--color-tertiary-20);
        border: 1px solid var(--color-tertiary-20);
        -webkit-border-radius: 5px;
        -moz-border-radius: 5px;
        border-radius: 5px;

        -webkit-transition: 0.25s ease-in;
        -moz-transition: 0.25s ease-in;
        -ms-transition: 0.25s ease-in;
        -o-transition: 0.25s ease-in;
        transition: 0.25s ease-in;
        cursor: pointer;
    }

    .title p.subtitle_2:hover {
        color: var(--color-tertiary);
        background-color: var(--color-tertiary-00);
        border: 1px solid var(--color-tertiary-00);

        -webkit-transition: 0.25s ease-out;
        -moz-transition: 0.25s ease-out;
        -ms-transition: 0.25s ease-out;
        -o-transition: 0.25s ease-out;
        transition: 0.25s ease-out;
    }
    .salle-containter {
        position: relative;
        padding: 10px;
        width: 100%;
        margin: auto;
        justify-content: flex-start;
    }
    .salle-containter .salle-item {
        position: relative;
        display: block;
        padding: 10px;
    }


    @media only screen and (min-width: 992px) {
        .salle-containter {
            width: 66%;
        }
    }


</style>