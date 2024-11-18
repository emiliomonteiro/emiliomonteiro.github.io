document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        const isActive = card.getAttribute('data-active') === 'true';
        card.style.display = isActive ? 'block' : 'none';
    });
});

//
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    document.querySelectorAll('header, footer, nav a').forEach(element => {
        element.style.color = isDarkMode ? '#333' : 'white';
    });
}

//
function validateForm() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const feedback = document.getElementById('feedback').value;

    //
    if (name.length < 3) {
        alert('O nome deve ter pelo menos 3 letras.');
        return;
    }

    //
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        alert('Por favor, insira um endereço de email válido.');
        return;
    }

    //
    if (feedback.length < 10) {
        alert('O feedback deve ter pelo menos 10 caracteres.');
        return;
    }

    //
    const formData = {
        name: name,
        email: email,
        feedback: feedback
    };

    //
    localStorage.setItem('formData', JSON.stringify(formData));

    alert('Formulário enviado com sucesso!');
}

//
window.addEventListener('load', () => {
    document.querySelector('header').style.transform = 'translateY(0)';
});

//
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const galleryItems = document.querySelectorAll('.gallery-item');

galleryItems.forEach(item => {
    item.addEventListener('click', () => {
        lightbox.style.display = 'flex';
        lightboxImg.src = item.src;
    });
});

document.querySelector('.close').addEventListener('click', () => {
    lightbox.style.display = 'none';
});
