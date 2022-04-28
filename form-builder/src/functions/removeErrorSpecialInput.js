export default function removeErrorSpecialInput(e) {
  const nameInput = e.target;

  nameInput.style.setProperty('--borderColor', '#1a73e8');
  nameInput.style.setProperty('--normalBorderColor', '#888c8f');
  nameInput.style.setProperty('--hoverColor', '#161616');
  nameInput.style.setProperty('--focusBorderColor', '#1a73e8');

  const nameSpan = document.querySelector('.special--input--span');

  nameSpan.style.setProperty('--fontColor', '#1a73e8');
  nameSpan.style.setProperty('--normalFontColor', '#5f6368');
  nameSpan.style.setProperty('--hoverColor', '#161616');

  const errorLabel = document.querySelector('.error--label');

  errorLabel.classList.remove('active');
}
