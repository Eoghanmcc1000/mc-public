class Bar {
  constructor() {
    this.barEndpoint = 'http://localhost:3000/bar';

    $(document).ready(() => {
      this.fetchMessages();
    });
  }

  async fetchMessages() {
    try {
      let response = await $.get(this.barEndpoint).then(); // makes GET request to bar endpoint, waits for response
      console.log('Response:', response);
      let messages = response.messages;
      console.log('Messages:', messages);
      let messageList = $('#messagesList'); // gets div with id messagesList from html
      console.log('Message list div:', messageList);
      messageList.empty();

      messages.forEach(function(msg) { // loops througgh messages, for each message call this function and name it msg, runs once for johns message, janes message etc
        // backtick allows multi line strings
        // this is just a template literal, not html
        let messageHtml = ` 
          <div class="message">
            <strong>${msg.sender}</strong>: ${msg.content}
            <br><small>${msg.timestamp}</small>
          </div>
          <hr>
        `;
        messageList.append(messageHtml);
        // adds html string to end of div and inserts message into page
      });
    } catch (error) {
      alert('There has been a problem with the request');
    }
  }
}
