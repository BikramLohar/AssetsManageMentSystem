document.addEventListener('DOMContentLoaded', function () {
    const featureCards = document.querySelectorAll('.feature-card');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    featureCards.forEach(card => {
        observer.observe(card);
    });

    // Create additional floating elements dynamically
    const floatingContainer = document.querySelector('.floating-elements');
    for (let i = 0; i < 8; i++) {
        const size = Math.random() * 100 + 50;
        const top = Math.random() * 100;
        const left = Math.random() * 100;
        const delay = Math.random() * 10;
        const duration = Math.random() * 10 + 10;

        const element = document.createElement('div');
        element.className = 'floating-element';
        element.style.width = `${size}px`;
        element.style.height = `${size}px`;
        element.style.top = `${top}%`;
        element.style.left = `${left}%`;
        element.style.animationDelay = `${delay}s`;
        element.style.animationDuration = `${duration}s`;

        floatingContainer.appendChild(element);
    }
});

function toggleNav() {
    const toggleNav = document.getElementById('navbar-links');
    toggleNav.classList.toggle('show')

}

// const navItems=document.querySelectorAll('.nav-item a');

// navItems.forEach(item=>{
//     item.addEventListener('click',()=>{
//         navItems.forEach(i=>i.classList.remove('active'));
//         item.classList.add('active');
//     });
// });

const links = document.querySelectorAll('.nav-item a');
const currentPath = window.location.pathname;

links.forEach(link => {
    if (link.getAttribute('href') === currentPath.split('/').pop()) {
        link.parentElement.classList.add('active');
    }
});

VerifyPassword = (event) => {
    event.preventDefault();
    const userPassword = document.getElementById('loginPassword').value;
    const newEntryStyle = document.getElementById('newEntry')
    const editEntryStyle = document.getElementById('editEntry');

    const password = 1111;
    if (userPassword.length === 0) {
        alert('Please Enter the password')
    } else if (password === parseInt(userPassword)) {
    
        newEntryStyle.style.display = 'inline-block';
        editEntryStyle.style.display = 'inline-block';
        document.getElementById('Box').style.display = 'none';
        document.getElementById('lgn-password').style.display='none';

    } else {
        alert("Incorrect Password")
        document.getElementById('loginPassword').value='';
      
    }
}

const PasswordInput=document.getElementById('loginPassword');
const togglePassword=document.getElementById('togglePassword');

togglePassword.addEventListener('click',()=>{
    if(PasswordInput.type === 'password'){
        PasswordInput.type='text';
        togglePassword.textContent="🙈"
    }else{
        PasswordInput.type='password';
        togglePassword.textContent='👁️'
    }
})