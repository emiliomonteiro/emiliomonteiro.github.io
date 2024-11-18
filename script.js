document.addEventListener('DOMContentLoaded', () => {
    const gallerySection = document.querySelector('.gallery');
    const isIndexPage = document.body.classList.contains('index'); 

    fetch('data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (isIndexPage) {
                data.profiles.forEach(profile => {
                    if (profile.visible) {
                        const card = document.createElement('div');
                        card.className = 'card';
                        card.setAttribute('data-active', 'true');

                        const img = document.createElement('img');
                        img.src = profile.image;
                        img.alt = profile.name;
                        img.className = 'gallery-item'; 

                        const name = document.createElement('h2');
                        name.textContent = profile.name;

                        const details = document.createElement('div');
                        details.className = 'card-details';
                        details.innerHTML = `
                            <p>Competências: ${profile.skills}</p>
                            <p>Experiência: ${profile.experience}</p>
                            <p>Escolaridade: ${profile.education}</p>
                        `;

                        card.appendChild(img);
                        card.appendChild(name);
                        card.appendChild(details);
                        gallerySection.appendChild(card);
                    }
                });
            } else {
                data.images.forEach(image => {
                    if (image.visible) {
                        const card = document.createElement('div');
                        card.className = 'card';
                        card.setAttribute('data-active', 'true');

                        const img = document.createElement('img');
                        img.src = image.src;
                        img.alt = image.description;
                        img.className = 'gallery-item'; 

                        const description = document.createElement('p');
                        description.textContent = image.description;

                        card.appendChild(img);
                        card.appendChild(description);
                        gallerySection.appendChild(card);
                    }
                });

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

                lightbox.addEventListener('click', (event) => {
                    if (event.target === lightbox) {
                        lightbox.style.display = 'none';
                    }
                });
            }
        })
        .catch(error => console.error('Error loading JSON data:', error));
});

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    document.querySelectorAll('header, footer, nav a').forEach(element => {
        element.style.color = isDarkMode ? '#333' : 'white';
    });
}

function validateForm() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const feedback = document.getElementById('feedback').value;

    if (name.length < 3) {
        alert('O nome deve ter pelo menos 3 letras.');
        return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        alert('Por favor, insira um endereço de email válido.');
        return;
    }

    if (feedback.length < 10) {
        alert('O feedback deve ter pelo menos 10 caracteres.');
        return;
    }

    const formData = {
        name: name,
        email: email,
        feedback: feedback
    };

    localStorage.setItem('formData', JSON.stringify(formData));

    alert('Formulário enviado com sucesso!');
}

window.addEventListener('load', () => {
    document.querySelector('header').style.transform = 'translateY(0)';
});
