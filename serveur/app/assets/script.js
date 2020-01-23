var app2 = new Vue({
    el: '#app',
    data: {

    },
    mounted () {
        window.onload = function(){
            alert('test')
            front.send('get-data', app.getPath('userData'));
            alert('test2')
        }

        front.on('get-data-result', function(msg){
            if(msg != "@@"){
                let data = msg.split('@');
                document.getElementById('author').innerHTML = data[0];
                document.getElementById('title').innerHTML = data[1];
                document.getElementById('text').innerHTML = data[2];
            }
        })
        front.on('toast-msg', function(msg){
            app.toast.show(msg, 1);
        })
    },
    methods: {
        save () {
            let author = document.getElementById('author').innerHTML;
            let title = document.getElementById('title').innerHTML;
            let text = document.getElementById('text').innerHTML;
            let msg = author + "@" + title + "@" + text;
            // let make a complete string of message seperated by @
            // send this msg and path where to save file to back process to save in external storage of android
            front.send('save-data', app.getPath('userData'), msg)
        }
    }
})