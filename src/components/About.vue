<template>
    <div id="about" class="container">
        <div class="row">
            <div class="twelve columns">
                <div class="hexa">
                    <div class="hex1">
                        <div class="hex2">
                            <img src="./../assets/images/headshot_01.jpg" alt="Olen Daelhousen's Headshot" width="100%" height="auto">
                        </div>
                    </div>
                </div>
                <div class="main-header-wrapper">
                    <div v-if="about.firstName" class="main-header">
                        <h1>
                            {{about.firstName}}&nbsp;{{about.lastName}}
                        </h1>
                        <h4 class="title">
                            {{about.title}}
                        </h4>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="one column">
                &nbsp;
            </div>
            <div class="ten columns">
                <span v-html="about.bio"></span>
            </div>
            <div class="one column">
                &nbsp;
            </div>
        </div>
    </div> <!-- End About Container -->
</template>

<script>

    module.exports = {

        data: () => {
            return {
                about: []
            }
        },

        created() {
            fetch("https://www.olen.dev/api/about/user/olen.d")
                .then((response) => {
                    return response.json();
                })
                .then((json) => {
                    this.about = json.about[0];
                });
        }
    }

</script>
