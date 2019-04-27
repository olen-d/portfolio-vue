<template>
    <nav id="navigation">
        <ul id="horizontalNavItem" v-if="showStandard">
            <li v-for="link in links"><a :href="link.uri">{{link.title}}</a></li>
        </ul>
        <span v-if="showHamburger" v-on:click="toggleDropDownMenu" id="hamburger" class="fas fa-bars"></span>
        <div id="dropDownContainer">
            <ul v-if="visible && showHamburger">
                <li v-for="link in links"><router-link :to="link.uri">{{link.title}}</router-link></li>
            </ul>
        </div>
    </nav>
</template>

<script>
    module.exports = {

            data: () => { // TODO: Set up the DB to include this information. Remember, only the links are coming from the DB. Window and Visible are coded here.
                return {
                links: [
                    {id: 0, sort: 0, title: "OD", uri: "/"},
                    {id: 1, sort: 1, title: "About", uri: "/about"},
                    {id: 2, sort: 2, title: "Projects", uri: "/projects"},
                    {id: 3, sort: 3, title: "Contact", uri: "/contact"}
                ],

                window: {
                    width: 0,
                    height: 0
                },

                visible: false
            }
            },
            computed: {
                showStandard: function() {
                    return this.window.width >= 500;
                },
                showHamburger: function() {
                    return this.window.width < 500;
                }
            },

            created() {
                window.addEventListener("resize", this.handleResize);
                this.handleResize();

                let self = this;
                window.addEventListener("click", function(e) {
                    if(!self.$el.contains(e.target)){
                       self.visible = !self.visible;
                    }
                })
            },

            destroyed() {
                window.removeEventListener("resize", this.handleResize);
            },
            
            methods: {
                handleResize() {
                this.window.width = window.innerWidth;
                this.window.height = window.innerHeight;
                },

                toggleDropDownMenu() {
                    this.visible = !this.visible;
                },

                hideDiv(divToHide) {
                    console.log("--------------------\n",divToHide,document.getElementById(divToHide));
                    let elementToHide = document.getElementById(divToHide);
                    if (this.id !== elementToHideId) {
                        elementToHide.style.display = "none";
                    }
                }

            }
    }
</script>

<style scoped>

#navigation {
    position:fixed;
    top:0px;
    left:0px;
    width:100%;
    height:5rem;
    z-index:9000;
    background-color:#3d3d3d;
    color:#ffffff;
    overflow:visible;
}

#horizontalNavItem li {
    display:inline-block;
    margin-top:1rem;
    margin-bottom:1rem;
}

#horizontalNavItem li:first-child {
    margin-left:6rem;
}

#horizontalNavItem li:not(first-child){
    margin-left:4rem;
}

#navigation li a:link, #navigation li a:visited {
    text-decoration:none;
    color:#ffffff;
}

#navigation li a:hover {
    color:#fcc914;
}

#hamburger {
    margin:1.5rem 6rem 1rem 6rem;
}

#dropDownContainer {
    position:fixed;
    top:5rem;
    left:0px;
    width:100%;
    z-index:8950;
    background-color:#3d3d3d;
    color:#ffffff;
    overflow:hidden;
}

#dropDownContainer ul {
    list-style:none;
}

#dropDownContainer li {
    margin-left:6rem;
    margin-top:3rem;
    margin-bottom:3rem;
}

#dropDownContainer li:last-child {
    margin-bottom:4.5rem;
}

</style>
