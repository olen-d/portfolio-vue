<template>
    <div id="projects" class="container">
        <div class="row">
            <div class="one column">
                &nbsp;
            </div>
            <div class="ten columns">
                <h1>Projects</h1>
            </div>
            <div class="one column">
                &nbsp;
            </div>
        </div>
        <div class="row">
            <div class="one column">
                &nbsp;
            </div>
            <div class="ten columns projects">
                <div v-for="project in results.projects" class="card u-pull-left">
                    <div class="card-title">
                        <img :src="`${publicPath}${project.screenshot}`" width="350" height="auto" :alt="`Screenshot of ${project.projectTitle}`">
                        <h2>
                            {{project.projectTitle}}
                        </h2>
                        <p>
                            {{project.description}}
                        </p>
                        <p>
                            <a :href="project.deployedLink">Visit the project</a>.
                        </p>
                        <p>
                            <a :href="project.repoLink">See the code on Github</a>
                        </p>
                    </div>
                </div>
            </div>
            <div class="one column">
                &nbsp;
            </div>
        </div>
    </div>
</template>

<script>

    export default {

        data: () => {
            return {
            results: [],
            publicPath: process.env.BASE_URL
            }
        },

        created() {
            fetch(`${process.env.VUE_APP_API_BASE_URL}/api/projects`)
                .then((response) => {
                    return response.json();
                })
                .then((json) => {
                    this.results = json;
                });
        }
    }

</script>
