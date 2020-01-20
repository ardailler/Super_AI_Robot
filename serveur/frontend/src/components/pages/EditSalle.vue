<template>
    <div class="create-salle-container">
        <div class="title">
            <h6>Salle {{salle.name}}</h6>
            <span class="subtitle_1">n°{{id}}</span>
        </div>
    </div>
</template>

<script>
    //api
    import sallesApi from '@/api/salles'

    import axios from 'axios'

    const getSalleById = (callback, _id) => {
        sallesApi.getById(axios, _id)
            .then(response => {
                callback(null, response.data)
            }).catch(error => {
            callback(error, error.response.data)
        })
    }

    export default {
        data() {
            return {
                id: -1,
                error: '',
                salle: null,
                show: false,
                timer: null
            }
        },
        beforeRouteEnter (to, from, next) {
            getSalleById((err, sallesData)=> {
                    next(vm => {
                        vm.setSalleData(err, sallesData)
                    })
                }, to.params.id)
        },
        beforeRouteUpdate (to, from, next) {
            let self = this
            getSalleById ((err, sallesData,) => {
                self.setSalleData(err, sallesData)
                next()
            }, to.params.id)
        },
        components: {
        },
        mounted () {
            let self = this
            self.id = self.$route.params.id

            /*let self = this
            self.timer = setTimeout(function () {
                self.show = true
            }, 5)*/
        },
        methods: {
            setSalleData: function (err, data) {
                if (err) {
                    this.error = err.toString()
                } else {
                    console.log(data)
                    this.salle = data
                    this.error = ''
                    // this.emptyData = false
                }
            }
        },
        /*beforeRouteLeave: function(to, from, next) {
            let self = this
            if (self.$auth.check()) {
                next()
            } else {
                self.salle = null
                clearInterval(self.timer)
                self.show = false
                setTimeout(function () {
                    next()
                }, 500)
            }
        }*/
    }
</script>

<style scoped>
    .create-salle-container {
        position: relative;
        display: block;
        height: 100%;
        width: 100%;
        padding: 84px 20px 20px 20px;
    }
    .title {
        position: relative;
        display: flex;
        flex-flow: wrap;
        align-items: center;
    }
    .title h6 {
        margin-right: 10px;
    }
    .title span {
        text-decoration: underline;
    }
    /*@media only screen and (min-width: 992px) {
        .salle-containter {
            width: 66%;
        }
    }*/


</style>