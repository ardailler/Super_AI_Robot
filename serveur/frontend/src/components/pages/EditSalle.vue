<template>
    <div class="create-salle-container">
        <div class="title">
            <h6>Salle {{ getName }}</h6>
            <span class="subtitle_1">n°{{id}}</span>
        </div>
        <div class="content">
            <div id="canvas-container">
                <canvas id="canvasSalle"></canvas>
            </div>
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
                timer: null,
                canvas: null,
                context: null
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
        computed: {
            getName () {
                return this.salle && this.salle.name ? this.salle.name : ''
            }
        },
        mounted () {
            let self = this
            self.id = self.$route.params.id
            self.canvas = document.getElementById('canvasSalle')
            self.context = self.canvas.getContext('2d')
            self.timer = setTimeout(function () {
                self.resizeCanvas()
                window.addEventListener('resize', self.resizeCanvas, false)
                // self.show = true
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
            resizeCanvas() {
                this.canvas.width = document.getElementById('canvas-container').offsetWidth;
                this.canvas.height = document.getElementById('canvas-container').offsetHeight;

                /**
                 * Your drawings need to be inside this function otherwise they will be reset when
                 * you resize the browser window and the canvas goes will be cleared.
                 */
                // drawStuff();
                this.dotDrawing ()
            },
            dotDrawing () {
                let dotSpace = 10
                let widthSpace = this.canvas.width - dotSpace
                let heightSpace = this.canvas.height - dotSpace
                for (let i = dotSpace; i < widthSpace ; i += dotSpace) {
                    for (let j = dotSpace; j < heightSpace ; j += dotSpace) {
                        this.context.fillStyle = "#6f6fa9";
                        this.context.fillRect(i,j, 1, 1);
                    }
                }
            }
        },
        beforeDestroy() {
            window.removeEventListener('resize', self.resizeCanvas, false)
            clearInterval(self.timer)
        }
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
        position: absolute;
        display: flex;
        flex-direction: column;
        min-height: 100%;
        width: 100%;
        padding: 84px 20px 20px 20px;
    }
    .title {
        position: relative;
        display: flex;
        flex-flow: wrap;
        align-items: center;
        flex: 0;
        padding-bottom: 10px;
    }
    .title h6 {
        margin-right: 10px;
    }
    .title span {
        text-decoration: underline;
    }
    .content {
        position: relative;
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        flex: 1;
    }
    #canvas-container {
        position: relative;
        display: block;
        width: 100%;
        height: 100%;
        border: 2px solid var(--color-primary-40);
        flex: 1;
        overflow: hidden;

        -webkit-border-radius: 25px;
        -moz-border-radius: 25px;
        border-radius: 25px;
    }
    #canvas-container canvas {
        position: absolute;
        background-color: transparent;
    }
    /*@media only screen and (min-width: 992px) {
        .salle-containter {
            width: 66%;
        }
    }*/


</style>