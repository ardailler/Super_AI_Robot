<template>
    <div class="dashboard-container">
        <div class="salle">
            <p>salles : {{salle}}</p>
        </div>
    </div>
</template>

<script>
    //api
    import sallesApi from '@/api/salles'
    
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
            //
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

</style>