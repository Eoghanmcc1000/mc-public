class Foo {
  constructor() {
    this.fooEndpoint = 'http://localhost:3000/foo';
    this.barEndpoint = 'http://localhost:3000/bar';  
    this.fetchMessages();

    $(document).ready(() => {
      this.setupForm();
    });
  }

  setupForm() {
    $('#messageForm').on('submit', (e) => {
      e.preventDefault(); // prevent page reload
      this.sendMessage();
      this.fetchMessages();
    })
  }

  async sendMessage() {
    // Get values from form
    const sender = $('#senderInput').val();
    const content = $('#contentInput').val();
    try {
      let response = await $.post(this.fooEndpoint, {
        sender: sender,
        content: content
      }).then();
      if (response.success === true) {
        alert('Message sent successfully');
        // Clear the form
        $('#senderInput').val('');
        $('#contentInput').val('');
      }
    } catch (error) {
      alert('There has been a problem with the request');
    }
  }

  async fetchMessages() {
    try {
      let response = await $.get(this.barEndpoint).then(); // makes GET request to foo endpoint, waits for response
      console.log('Response:', response);
      let messages = response.messages;
      console.log('Messages:', messages);
      let messageList = $('#messagesList'); // gets div id with id messagesList from html
      console.log('Message list div:', messageList);
      messageList.empty(); // clear existing messages

      messages.forEach(function(msg) {

        let messageHtml = `
          <div class="message">
            <strong>${msg.sender}</strong>: ${msg.content}
            <br><small>${msg.timestamp}</small>
          </div>
          <hr>
        `;
        messageList.append(messageHtml);  
      })
    } catch (error) {
      alert('There has been a problem with the request');
    }
  }
}


