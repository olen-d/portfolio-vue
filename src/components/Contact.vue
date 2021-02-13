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
            You've made it this far, so please take the time to reach out and start discussing your project with me. I can be contacted at {{ contact.tel | toPhoneUS }}, or send an email to <a :href="`mailto:${contact.email}`">{{contact.email}}</a>.
          </p>
        </div>
        <div class="one column">
          &nbsp;
        </div>
      </div>
      <form id="contactForm">
        <div class="row">
          <div class="one column">
            &nbsp;
          </div>
          <div class="five columns">
            <label for="name">Name</label>
            <input v-model="contactData.name" type="text" class="u-full-width" id="name" placeholder="Your Name" required>
          </div>
          <div class="five columns">
            <label for="title">Email Address</label>
            <input v-model="contactData.fromAddress" type="email" class="u-full-width" id="fromAddress" placeholder="Your Email Address" required>
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
            <textarea v-model="contactData.message" class="u-full-width" id="message" placeholder="Let me know what you need..." ></textarea>
            <div v-if="messageStatus" id="message-status">
              <p>
                {{ messageStatus }}
              </p>
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
            <button v-on:click.prevent="submitContactForm" type="submit" class="button-primary" id="submitMessage">Send a Message</button>
          </div>
          <div class="one column">
            &nbsp;
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import Header from "./Header.vue";

export default {
  components: {
    Header
  },

  data: () => {
    return {
      contact: [],
      contactData: {
        name: "",
        fromAddress: "",
        message: "",
      },
      messageStatus: ""
    }
  },

  filters: {
    toPhoneUS(value) {
      const areaCode = value.substr(0, 3);
      const prefix = value.substr(3, 3);
      const lineNumber = value.substr(6);
      return `(${areaCode}) ${prefix}-${lineNumber}`;
    }
  },
  
  methods: {
    submitContactForm() {
      // TODO: Validate this mess
      const {
        contactData: { fromAddress, message, name }
      } = this;

      const html = `${message} <p>Contact Name: ${name}</p><p>Contact Email: ${fromAddress}</p>`; // ! TODO: Remember to detect html and add <html>, <body>, and convert linebreaks to <p>, <br />
      const subjectPrefix = "[OLEN.DEV]";
      const subject = `[OLEN.DEV] Website Contact Form Message From ${name}`;
      // eslint-disable-next-line prettier/prettier
      const subjectProcessed = subject.includes(subjectPrefix) ? subject : `${subjectPrefix} ${subject}`;
      const messageStripped = message.replace(/(<([^>]+)>)/gi, ""); // ! TODO: Update this with a more robust function and convert <p> & <br> to \n
      const text = `${messageStripped} \n\n Contact Name: ${name} \nContact Email: ${fromAddress}`;
      const toAddress = "contact@olen.dev";

      const mailOptions = {
        from: fromAddress,
        to: toAddress,
        subject: subjectProcessed,
        text,
        html
      };

      this.sendMail(mailOptions);
    },

    clearContactForm() {
      const keys = Object.keys(this.contactData);

      keys.forEach(e => {
        this.contactData[e] = null;
      });
    },
    
    sendMail(mailOptions) {

      this.messageStatus = "Sending your message...";

      fetch(`${process.env.VUE_APP_API_BASE_URL}/api/mail/send`, {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
        body: JSON.stringify({ mailOptions })
      }).then(response => {
        return response.json();
      }).then(response => {
        if (!response.error) {
          this.messageStatus = `Thank you for getting in touch, your message was successfully sent to ${response.accepted}. You can expect a response within 24 hours.`;
          this.clearContactForm();
        } else {
          this.messageStatus = "Something has gone terribly wrong and your message was not sent. Please try again.";
          // TODO, parse response.error and provide a more useful error message
        }
      }).catch(error => {
        return ({
          type: "error",
          message: "Internal server error.",
          error: error
        })
      });
    }
  },

  created() {
    fetch(`${process.env.VUE_APP_API_BASE_URL}/api/profiles/contact/olen.d`)
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        this.contact = json.contact;
      });
  }
}

</script>
