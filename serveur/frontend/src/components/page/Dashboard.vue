<template>
    <div class="container">
        <div class="card card-default">
            <div class="card-header">Dashboard</div>

            <div class="card-body">
                Bienvenue
            </div>
            <div class="card-body" @click.prevent.stop="logout">
                logout
            </div>
        </div>
    </div>
</template>

<script>

    export default {
        data() {
            return {
                //
            }
        },
        components: {
            //
        },
        methods: {
            logout () {
              this.$auth.logout()
            }
        }
    }
</script>