// Обновляем script.js

// В функцию initSlideNavigation добавляем создание точек
function initSlideNavigation() {
    const slides = document.querySelectorAll('.slide');
    const totalSlides = slides.length;
    const currentSlideElement = document.getElementById('current-slide');
    const totalSlidesElement = document.getElementById('total-slides');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const menuLinks = document.querySelectorAll('.menu-link');
    
    let currentSlideIndex = 0;
    
    // Устанавливаем общее количество слайдов
    if (totalSlidesElement) {
        totalSlidesElement.textContent = totalSlides;
    }
    
    // Создаем навигацию точками
    createDotsNavigation();
    
    // Функция создания навигации точками
    function createDotsNavigation() {
        const dotsContainer = document.createElement('div');
        dotsContainer.className = 'dots-navigation';
        
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('div');
            dot.className = 'dot';
            dot.dataset.slide = i;
            
            dot.addEventListener('click', function() {
                const slideIndex = parseInt(this.dataset.slide);
                showSlide(slideIndex);
            });
            
            dotsContainer.appendChild(dot);
        }
        
        document.querySelector('.presentation-container').appendChild(dotsContainer);
    }
    
    // Функция обновления активной точки
    function updateActiveDot(index) {
        const dots = document.querySelectorAll('.dot');
        dots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        if (dots[index]) {
            dots[index].classList.add('active');
        }
    }
    
    // Функция для показа слайда
    function showSlide(index) {
        // Проверяем, что индекс в пределах
        if (index < 0) index = 0;
        if (index >= totalSlides) index = totalSlides - 1;
        
        // Скрываем все слайды
        slides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        // Показываем выбранный слайд
        slides[index].classList.add('active');
        
        // Обновляем счетчик
        currentSlideIndex = index;
        if (currentSlideElement) {
            currentSlideElement.textContent = index + 1;
        }
        
        // Обновляем активную ссылку в меню
        menuLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        if (menuLinks[index]) {
            menuLinks[index].classList.add('active');
        }
        
        // Обновляем активную точку
        updateActiveDot(index);
        
        // Прокручиваем к началу слайда
        slides[index].scrollTop = 0;
    }
    
    // Кнопка "назад"
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            showSlide(currentSlideIndex - 1);
        });
    }
    
    // Кнопка "вперед"
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            showSlide(currentSlideIndex + 1);
        });
    }
    
    // Навигация с клавиатуры
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
            e.preventDefault();
            showSlide(currentSlideIndex - 1);
        } else if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
            e.preventDefault();
            showSlide(currentSlideIndex + 1);
        } else if (e.key === 'Home') {
            e.preventDefault();
            showSlide(0);
        } else if (e.key === 'End') {
            e.preventDefault();
            showSlide(totalSlides - 1);
        }
    });
    
    // Навигация через меню
    menuLinks.forEach((link, index) => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            showSlide(index);
        });
    });
    
    // Инициализация первого слайда
    showSlide(0);
}
