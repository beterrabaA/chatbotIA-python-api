class Chatbox {
    constructor() {
        this.args = {
            openButton: document.querySelector('.chatbox__button'),
            chatBox: document.querySelector('.chatbox__support'),
            sendButton: document.querySelector('.send__button'),
        }


        this.state = false;
        this.message = []
    }

    displayChatBox() {
        const { openButton, chatBox, sendButton } = this.args;

        openButton.addEventListener('click', () => this.toggleState(chatBox));

        sendButton.addEventListener('click', () => this.onSendButton(chatBox));

        const node = chatBox.querySelector('input');
        node.addEventListener('keyup', ({ key }) => {
            if (key === "Enter") {
                this.onSendButton(chatBox)
            }
        });
    }

    toggleState(chatBox) {
        this.state = !this.state;

        if (this.state) {
            chatBox.classList.add('chatbox--active');
        } else
            chatBox.classList.remove('chatbox--active');
    }

    onSendButton(chatBox) {
        var textField = chatBox.querySelector('input');
        let text1 = textField.value;
        if (text1 === "") {
            return 
        }

        let ms1 = { name: "user", text: text1 };
        this.message.push(ms1);

        fetch('http://localhost:5000/predict', 
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: text1 }),
            mode: 'cors'

        }).then(response => response.json()).then(data => {
            let ms2 = { name: "bot", text: data.answer };
            this.message.push(ms2);
            this.updateChatBox(chatBox);
            textField.value = "";
    }).catch(error => console.error(error));
}

    updateChatBox(chatBox) {
        var html = "";

        this.message.slice().reverse().forEach((ms,index) => {
            if (ms.name === "user") {
                html += '<div class="messages__item messages__item--visitor">' + ms.text + '</div>';
            } else {
                html += '<div class="messages__item messages__item--operator">' + ms.text + '</div>';
            }
        })

        const chatMessage = chatBox.querySelector('.chatbox__messages');
        chatMessage.innerHTML = html;
    }
}

const chatbox = new Chatbox();
chatbox.displayChatBox();