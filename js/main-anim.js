document.addEventListener('DOMContentLoaded', () => {
  const inputElement = document.getElementById('username-input');
  const container = document.querySelector('.container');
  let typingTimeout;

  function startTyping() {
    container.style.transition = 'transform 0.3s ease';
    container.style.transform = 'scale(1.05)';
    clearTimeout(typingTimeout);
  }

  function stopTyping() {
    typingTimeout = setTimeout(() => {
      container.style.transition = 'transform 0.2s ease';
      container.style.transform = 'scale(1)';
    }, 100);
  }

  inputElement.addEventListener('input', startTyping);
  inputElement.addEventListener('keydown', startTyping);
  inputElement.addEventListener('keyup', stopTyping);
  inputElement.addEventListener('blur', () => {
    clearTimeout(typingTimeout);
    container.style.transition = 'transform 0.3s ease';
    container.style.transform = 'scale(1)';
  });
});
