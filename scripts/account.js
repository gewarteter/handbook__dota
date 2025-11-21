function showPopup() {
  document.getElementById('popup-overlay').classList.add('active');
}

function closePopup() {
  document.getElementById('popup-overlay').classList.remove('active');
}

const overlay = document.getElementById('popup-overlay');
const popup = document.getElementById('popup');

overlay.addEventListener('click', function(event) {
  if (event.target === overlay) {
    closePopup();
  }
});

popup.addEventListener('click', function(event) {
  event.stopPropagation();
});
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closePopup();
});

function changeAvatar(avatarSrc) {
    const mainAvatar = document.querySelector('.account_avatar .avatar');
    mainAvatar.src = avatarSrc;
    localStorage.setItem('selectedAvatar', avatarSrc);
    hidePopup();
}

function toggleNicknameEdit() {
    const nicknameText = document.getElementById('nickname-text');
    const nicknameInput = document.getElementById('nickname-input');
    const pencilButton = document.querySelector('.account_name button');
    
    if (nicknameInput.style.display === 'none') {
        nicknameText.style.display = 'none';
        nicknameInput.style.display = 'block';
        nicknameInput.value = nicknameText.textContent;
        nicknameInput.focus();
        nicknameInput.select();
   } else {
        saveNickname();
    }
}

function saveNickname() {
    const nicknameText = document.getElementById('nickname-text');
    const nicknameInput = document.getElementById('nickname-input');
    const pencilButton = document.querySelector('.account_name button');
    
    let newNickname = nicknameInput.value.trim();
    
    if (newNickname === '') {
        newNickname = nicknameText.textContent;
    }
    
    nicknameText.textContent = newNickname;
    nicknameText.style.display = 'block';
    nicknameInput.style.display = 'none';
    localStorage.setItem('userNickname', newNickname);
}

function handleNicknameKeyPress(event) {
    if (event.key === 'Enter') {
        saveNickname();
    }
    
    if (event.key === 'Escape') {
        cancelNicknameEdit();
    }
}

function cancelNicknameEdit() {
    const nicknameText = document.getElementById('nickname-text');
    const nicknameInput = document.getElementById('nickname-input');
    
    nicknameText.style.display = 'block';
    nicknameInput.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', function() {
    const savedAvatar = localStorage.getItem('selectedAvatar');
    if (savedAvatar) {
        const mainAvatar = document.querySelector('.account_avatar .avatar');
        mainAvatar.src = savedAvatar;
    }

    const popupAvatars = document.querySelectorAll('#popup img');
    popupAvatars.forEach(avatar => {
        avatar.addEventListener('click', function() {
            changeAvatar(this.src);
        });
    });

    const savedNickname = localStorage.getItem('userNickname');
    if (savedNickname) {
        document.getElementById('nickname-text').textContent = savedNickname;
    }
    const nicknameInput = document.getElementById('nickname-input');
    nicknameInput.addEventListener('keypress', handleNicknameKeyPress);
    nicknameInput.addEventListener('blur', saveNickname); 
    
    const nicknameText = document.getElementById('nickname-text');
    nicknameText.addEventListener('click', toggleNicknameEdit);
});