
// Create the input bubble element
const inputBubble = document.createElement('div');
inputBubble.classList.add('bubble');

// Create the emoji element
const emoji = document.createElement('div');
emoji.classList.add('emoji');
emoji.textContent = '🐶';

// Create the input element
const input = document.createElement('input');
input.type = 'text';
input.classList.add('input-field');
input.value = 'girl.tv says:';

// Append the emoji and input elements to the input bubble element
inputBubble.appendChild(emoji);
inputBubble.appendChild(input);

// Append the input bubble element to the body
document.body.appendChild(inputBubble);

// Add CSS styles to the head
const cssStyles = `
  .bubble {
    display: inline-block;
    vertical-align: super;
    background: white;
    padding-right: 12px;
    padding-left: 56px;
    padding-top: 9px;
    padding-bottom: 6px;
    border-top-right-radius: 25px;
    border-top-left-radius: 25px;
    border-bottom-right-radius: 25px;
    border-bottom-left-radius: 0px;
    white-space: nowrap;
  }

  .emoji {
    display: inline-block;
    font-size: 20px;
    margin-right: 8px;
  }

  .input-field {
    border: none;
    outline: none;
    font-size: 16px;
    font-family: Arial, sans-serif;
    color: #333;
  }
`;

const style = document.createElement('style');
style.textContent = cssStyles;
document.head.appendChild(style);

// Speak the input text using the browser's default voice
function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  window.speechSynthesis.speak(utterance);
}

input.addEventListener('focus', () => {
  speak(input.value);
});

