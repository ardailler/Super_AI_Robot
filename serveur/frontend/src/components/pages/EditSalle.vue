<template>
    <div class="create-salle-container">
        <div class="title">
            <h6>Salle {{ getName }}</h6>
            <span class="subtitle_1">n°{{id}}</span>
        </div>
        <button class="startRand" @click.stop.prevent="startRand">start Rand</button>
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
                context: null,
                posX: 0,
                posY: 0,
                direction: 90,
                zoom: 1.5,
                ratio: 10, // X pixels = 1 Mètres
                deleteTimer: null, //todo delete
                style: {
                    dotColor: '#ffffff',
                    robotColor: '#cfcfe2',
                    traceColor: 'rgba(143, 143, 188,.5)',
                    murColor: "rgb(249, 113, 115)"
                }
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
        components: {
        },
        computed: {
            getName () {
                return this.salle && this.salle.name ? this.salle.name : ''
            }
        },
        watch: {
          salle () {
              this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
              this.drawProcedure()
          }
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
            ratioPM (meters) {
                return 10 * meters / 1 * this.zoom // 10px * x meters / 1 meters = Y pixels to show
            },
            resizeCanvas() {
                let self = this
                // all stuffs which need to draw
                self.drawProcedure()
            },
            drawRobot () {
                let self = this
                // test position
                self.context.fillStyle = self.style.robotColor;
                let taille = self.ratioPM(1) // taille du robot en mètres
                let x = self.posX
                let y = self.posY
                self.drawRect(x, y, taille, taille, 1, self.direction)
                // self.context.fillRect(self.posX - (taille / 2),self.posY - (taille / 2), taille, taille)
            },
            drawProcedure () {
                let self = this
                self.canvas.width = document.getElementById('canvas-container').offsetWidth
                self.canvas.height = document.getElementById('canvas-container').offsetHeight
                //init robot pos to the center of the page
                self.posX = self.canvas.width / 2
                self.posY = self.canvas.height / 2
                self.context.clearRect(0, 0, self.canvas.width, self.canvas.height);
                self.dotDrawing ()
                self.drawInfos()
            },
            dotDrawing () {
                let self = this
                let dotSpace = 10 * self.zoom
                let widthSpace = self.canvas.width - dotSpace
                let heightSpace = self.canvas.height - dotSpace
                for (let i = dotSpace; i < widthSpace ; i += dotSpace) {
                    for (let j = dotSpace; j < heightSpace ; j += dotSpace) {
                        self.context.fillStyle = self.style.dotColor;
                        self.context.fillRect(i,j, 1, 1);
                    }
                }
            },
            drawInfos () {
                let self = this
                if (self.salle) {
                    for (let action of self.salle.data) {
                        if (action.action.type === 'rotation') {
                            self.direction = parseFloat(action.action.value)
                        } else if (action.action.type === 'translation') {
                            let dx = Math.sin(self.direction * (3.14 / 180))
                            let dy = Math.cos(self.direction * (3.14 / 180))
                            let x = self.posX + self.ratioPM(parseFloat(action.action.value)) * dx
                            let y = self.posY + self.ratioPM(parseFloat(action.action.value)) * dy

                            // draw path
                            self.context.beginPath()
                            self.context.moveTo(self.posX, self.posY)
                            self.context.lineTo(x, y)
                            self.context.lineWidth = self.ratioPM(1)
                            self.context.strokeStyle = self.style.traceColor
                            self.context.stroke()

                            // new position
                            self.posX = x
                            self.posY = y
                        } else if (action.action.type === 'mur') {
                            let dx = Math.sin(self.direction * (3.14 / 180))
                            let dy = Math.cos(self.direction * (3.14 / 180))
                            let x = self.posX + self.ratioPM(parseFloat(action.action.value)) * dx
                            let y = self.posY + self.ratioPM(parseFloat(action.action.value)) * dy

                            let taille = self.ratioPM(1) // taille du robot en mètres
                            self.context.fillStyle = self.style.murColor
                            self.drawRect(x, y, taille, taille/2, 1, self.direction)
                        }
                    }
                    self.drawRobot ()
                }
            },
            drawRect(x,y,w,h,scale,rotation) {
                let self = this
                self.context.save()
                self.context.setTransform(scale,0,0,scale,x,y)
                self.context.rotate((3.14 / 180) * -rotation)
                self.context.fillRect(-w/2,-h/2,w,h)
                self.context.restore()

            },
            drawImage (img,x,y,w,h,scale,rotation,alpha) {
                let self = this
                self.context.save()
                self.context.globalAlpha = alpha
                self.context.setTransform(scale,0,0,scale,x,y)
                self.context.rotate(rotation)
                self.context.drawImage(img,-img.width/2,-img.height/2,img.width,img.height)
                self.context.restore()
            },
            startRand () { // todo delete
                let self = this
                let rotation = 0
                let translation = 0
                let mur = 0
                if (self.deleteTimer) {
                    clearInterval(self.deleteTimer)
                }
                self.deleteTimer = setInterval(function () {
                    rotation = Math.floor(Math.random() * 359) + 0
                    translation = Math.floor(Math.random() * 20) + 5
                    mur = Math.floor(Math.random() * 20) + 5

                    let data = [
                        {
                            "action": {
                                "type": "rotation",
                                "value": rotation
                            }
                        },
                        {
                            "action": {
                                "type": "translation",
                                "value": translation
                            }
                        },
                        {
                            "action": {
                                "type": "mur",
                                "value": mur
                            }
                        }
                    ]
                    // self.salle.data = self.salle.data.concat(data)
                    // self.drawProcedure()
                    self.$socket.emit('addActions', self.$auth.user()._id, self.id, data)
                },2000)
            }
        },
        sockets: {
            newActionsAdded (data) {
                let self = this
                if (self.id === data.salle_id) {
                    self.salle.data = self.salle.data.concat(data.actions)
                    self.drawProcedure()
                }
            }
        },
        beforeDestroy() {
            let self = this
            window.removeEventListener('resize', self.resizeCanvas, false)
            clearInterval(self.timer)
            if (self.deleteTimer) {
                clearInterval(self.deleteTimer)
            }
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
    .startRand {
        position: absolute;
        left: 600px;
    }
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
        flex: 1;
        overflow: hidden;

        -webkit-border-radius: 25px;
        -moz-border-radius: 25px;
        border-radius: 25px;
    }
    #canvas-container canvas {
        position: absolute;
        background-color: var(--color-primary-10);
    }
    /*@media only screen and (min-width: 992px) {
        .salle-containter {
            width: 66%;
        }
    }*/


</style>