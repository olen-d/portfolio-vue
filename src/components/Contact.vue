<template>
    <div id="front-end">
        <Header></Header>
        <div id="contact" class="container">
            <div class="row">
                <div class="one column">
                    &nbsp;
                </div>
                <div class="ten columns">
                    <h1>
                        Get in Touch
                    </h1>
                    <p v-if="contact.tel">
                        You've made it this far, so please take the time to reach out and start discussing your project with me. I can be contacted at {{contact.tel | toPhoneUS}}, or send an email to <a :href="`mailto:${contact.email}`">{{contact.email}}</a>.
                    </p>
                </div>
                <div class="one column">
                    &nbsp;
                </div>
            </div>
            <div class="row">
                <div class="one column">
                    &nbsp;
                </div>
                <div class="five columns">
                    <form id="contactForm">
                        <label for="name">Name</label>
                        <input type="text" class="u-full-width" id="name" placeholder="Your Name" required>
                    </form>
                </div>
                <div class="five columns">
                        <label for="title">Email Address</label>
                        <input type="email" class="u-full-width" id="email" placeholder="Your Email Address" required>
                </div>
                <div class="one column">
                    &nbsp;
                </div>  
            </div>
            <div class="row">
                <div class="one column">
                    &nbsp;
                </div>
                <div class="ten columns">
                        <label for="message">Message</label>
                        <textarea class="u-full-width" id="message" placeholder="Let me know what you need..." ></textarea>
                        <div id="message-status">
                        </div>
                </div>
                <div class = "one column">
                    &nbsp;
                </div>
            </div>
            <div class="row">
                <div class="one column">
                    &nbsp;
                </div>
                <div class="ten columns">
                        <button v-on:click.prevent="submitMessage" type="submit" class="button-primary" id="submitMessage">Send a Message</button>
                </div>
                <div class="one column">
                    &nbsp;
                </div>
                    </form>
            </div>
        </div>
    </div>
</template>

<script>
import Header from "./Header.vue";

    const ajax = {
        post(url, data) {
            //console.log("------\n",url,data);
            return new Promise ((resolve, reject) => {
                let xhr = new XMLHttpRequest();
                xhr.open("POST", url);
                xhr.setRequestHeader("Content-Type", "application/json");
                xhr.onload = () => { 
                    if (xhr.status === 200) {
                        // console.log("---",xhr.status);
                        let res = xhr.responseText;
                        resolve(res);
                    } else {
                        reject({
                            status: 500,
                            error: "Internal server error. Failed to post http:// request."
                        });
                    }
                }
                xhr.send(JSON.stringify({
                    data
                }));
            })
        },

        get(url) {
            return new Promise ((resolve, reject) => {
                let xhr = new XMLHttpRequest();
                xhr.open("GET", url);
                xhr.onload = () => {
                    if (xhr.status === 200) {
                        let data = xhr.responseText;
                        resolve(data);
                    } else {
                        reject({
                            status: 500,
                            login: false,
                            error: "Internal server error. Failed to get http:// request."
                        });
                    }
                }
                xhr.send();
            });
        }
    }

    export default {
        components: {
            Header
        },

        data: () => {
            return {
                contact: []
            }
        },

        methods: {
            submitMessage: () => {
                const $msgStatus = document.getElementById("message-status");
                $msgStatus.innerHTML = "<p>Sending your message...</p>";
                $msgStatus.style.display = "block";

                const $name = document.getElementById("name");
                const $email = document.getElementById("email");
                const $message = document.getElementById("message");
            
                // TODO: Fix this to use v-model
                let name = $name.value;
                let email = $email.value;
                let message = $message.value;
                
                // TODO: Validate this mess
            
                let data = {
                    name: name,
                    email: email,
                    message: message
                }

                // TODO: The below works, but update to use fetch
                ajax.post(`${process.env.VUE_APP_API_BASE_URL}/api/contact/send`, data)
                .then(response => {                 
                    response = JSON.parse(response);

                    // Set up the status area
                    $msgStatus.innerHTML = "";
                    let p = document.createElement("p");

                    if(response.rejected.length === 0) {
                        // Clear the form fields
                        $name.value = "";
                        $email.value = "";
                        $message.value = "";

                        // Build the success message
                        p.setAttribute("class", "success");
                        p.innerText = `Thank you for getting in touch, your message was successfully sent to ${response.accepted}. You can expect a response within 24 hours.`;
                    } else {
                        // Build the fail message
                        p.setAttribute("class", "fail");
                        p.innerText = `Something has gone terribly wrong and your message was not sent. Please try again.`;
                    }

                    // Output the success or fail message
                    $msgStatus.appendChild(p);
                    $msgStatus.style.display = "block";
                })
                .catch(err => {
                    console.log("Something went horribly awry.");
                    // TODO: Fix this to return something useful to the user. 
                });
            }
        },

        created() {
            fetch(`${process.env.VUE_APP_API_BASE_URL}/api/about/contact/olen.d`)
                .then((response) => {
                    return response.json();
                })
                .then((json) => {
                    this.contact = json.contact[0];
                });
        },

        filters: {
            toPhoneUS(value) {
                const areaCode = value.substr(0, 3);
                const prefix = value.substr(3, 3);
                const lineNumber = value.substr(6);
                return `(${areaCode}) ${prefix}-${lineNumber}`;
            }
        }
    }

</script>
