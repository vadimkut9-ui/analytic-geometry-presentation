// Основной скрипт презентации

document.addEventListener('DOMContentLoaded', function() {
    // Инициализация переменных
    const slides = document.querySelectorAll('.slide');
    const totalSlides = slides.length;
    let currentSlide = 0;
    
    // Элементы навигации
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const currentSlideEl = document.getElementById('currentSlide');
    const totalSlidesEl = document.getElementById('totalSlides');
    
    // Элементы меню
    const menuToggle = document.getElementById('menuToggle');
    const menuContent = document.getElementById('menuContent');
    const menuItems = document.getElementById('menuItems');
    
    // Инициализация счетчика слайдов
    totalSlidesEl.textContent = totalSlides;
    updateSlideCounter();
    
    // Создание меню
    createMenu();
    
    // Инициализация программ
    initConversionProgram();
    initGraphProgram();
    
    // Навигация по слайдам
    prevBtn.addEventListener('click', showPrevSlide);
    nextBtn.addEventListener('click', showNextSlide);
    
    // Переключение меню
    menuToggle.addEventListener('click', toggleMenu);
    
    // Закрытие меню при клике вне его
    document.addEventListener('click', function(event) {
        if (!menuToggle.contains(event.target) && !menuContent.contains(event.target)) {
            menuContent.classList.remove('show');
        }
    });
    
    // Навигация с клавиатуры
    document.addEventListener('keydown', function(event) {
        if (event.key === 'ArrowLeft') {
            showPrevSlide();
        } else if (event.key === 'ArrowRight') {
            showNextSlide();
        } else if (event.key === 'Escape') {
            menuContent.classList.remove('show');
        }
    });
    
    // Функции навигации
    function showSlide(index) {
        // Проверка границ
        if (index < 0) index = 0;
        if (index >= totalSlides) index = totalSlides - 1;
        
        // Скрытие текущего слайда
        slides[currentSlide].classList.remove('active');
        
        // Показ нового слайда
        currentSlide = index;
        slides[currentSlide].classList.add('active');
        
        // Обновление счетчика
        updateSlideCounter();
        
        // Обновление активного пункта меню
        updateMenu();
    }
    
    function showPrevSlide() {
        showSlide(currentSlide - 1);
    }
    
    function showNextSlide() {
        showSlide(currentSlide + 1);
    }
    
    function updateSlideCounter() {
        currentSlideEl.textContent = currentSlide + 1;
    }
    
    // Функции меню
    function createMenu() {
        menuItems.innerHTML = '';
        
        slides.forEach((slide, index) => {
            const slideNumber = slide.dataset.slideNumber;
            const slideTitle = slide.querySelector('h1, h2')?.textContent || `Слайд ${slideNumber}`;
            
            const menuItem = document.createElement('div');
            menuItem.className = 'menu-item';
            menuItem.textContent = `${slideNumber}. ${slideTitle.substring(0, 30)}`;
            menuItem.dataset.slideIndex = index;
            
            menuItem.addEventListener('click', function() {
                showSlide(index);
                menuContent.classList.remove('show');
            });
            
            menuItems.appendChild(menuItem);
        });
        
        updateMenu();
    }
    
    function updateMenu() {
        const menuItems = document.querySelectorAll('.menu-item');
        menuItems.forEach((item, index) => {
            if (index === currentSlide) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }
    
    function toggleMenu() {
        menuContent.classList.toggle('show');
    }
    
    // Инициализация программы преобразования уравнений
    function initConversionProgram() {
        const conversionType = document.getElementById('conversionType');
        const convertBtn = document.getElementById('convertBtn');
        
        const generalInputs = document.getElementById('generalInputs');
        const canonicalInputs = document.getElementById('canonicalInputs');
        
        // Показать/скрыть соответствующие поля ввода
        conversionType.addEventListener('change', function() {
            const type = this.value;
            
            // Скрыть все поля ввода
            generalInputs.style.display = 'none';
            canonicalInputs.style.display = 'none';
            
            // Показать нужные поля
            if (type.startsWith('general')) {
                generalInputs.style.display = 'block';
            } else if (type.startsWith('canonical')) {
                canonicalInputs.style.display = 'block';
            }
        });
        
        // Обработка преобразования
        convertBtn.addEventListener('click', performConversion);
    }
    
    function performConversion() {
        const type = document.getElementById('conversionType').value;
        const resultDiv = document.getElementById('result');
        
        let result;
        
        try {
            switch(type) {
                case 'generalToCanonical':
                    result = convertGeneralToCanonical();
                    break;
                case 'generalToParametric':
                    result = convertGeneralToParametric();
                    break;
                case 'canonicalToGeneral':
                    result = convertCanonicalToGeneral();
                    break;
                default:
                    throw new Error('Неизвестный тип преобразования');
            }
            
            resultDiv.innerHTML = `<p><strong>Результат:</strong></p><div class="katex-equation">${result.equation}</div>`;
            
        } catch(error) {
            resultDiv.innerHTML = `<p style="color: var(--accent-color);"><strong>Ошибка:</strong> ${error.message}</p>`;
        }
        
        // Рендеринг KaTeX
        renderMathInElement(resultDiv);
    }
    
    function convertGeneralToCanonical() {
        const A = parseFloat(document.getElementById('coefA').value);
        const B = parseFloat(document.getElementById('coefB').value);
        const C = parseFloat(document.getElementById('coefC').value);
        
        if (isNaN(A) || isNaN(B) || isNaN(C)) {
            throw new Error('Введите все коэффициенты');
        }
        
        if (A === 0 && B === 0) {
            throw new Error('A и B не могут быть одновременно равны 0');
        }
        
        // Находим точку на прямой
        let x0, y0;
        if (B !== 0) {
            x0 = 0;
            y0 = -C / B;
        } else {
            y0 = 0;
            x0 = -C / A;
        }
        
        // Направляющий вектор
        const m = -B;
        const n = A;
        
        const equation = `\\frac{x ${formatNumberWithSign(-x0)}}{${formatNumber(m)}} = \\frac{y ${formatNumberWithSign(-y0)}}{${formatNumber(n)}}`;
        
        return { equation };
    }
    
    function convertGeneralToParametric() {
        const A = parseFloat(document.getElementById('coefA').value);
        const B = parseFloat(document.getElementById('coefB').value);
        const C = parseFloat(document.getElementById('coefC').value);
        
        if (isNaN(A) || isNaN(B) || isNaN(C)) {
            throw new Error('Введите все коэффициенты');
        }
        
        if (A === 0 && B === 0) {
            throw new Error('A и B не могут быть одновременно равны 0');
        }
        
        // Находим точку на прямой
        let x0, y0;
        if (B !== 0) {
            x0 = 0;
            y0 = -C / B;
        } else {
            y0 = 0;
            x0 = -C / A;
        }
        
        // Направляющий вектор
        const m = -B;
        const n = A;
        
        const equation = `\\begin{cases} x = ${formatNumber(x0)} ${formatNumberWithSign(m)}t \\\\ y = ${formatNumber(y0)} ${formatNumberWithSign(n)}t \\end{cases}`;
        
        return { equation };
    }
    
    function convertCanonicalToGeneral() {
        const x0 = parseFloat(document.getElementById('x0').value);
        const y0 = parseFloat(document.getElementById('y0').value);
        const m = parseFloat(document.getElementById('m').value);
        const n = parseFloat(document.getElementById('n').value);
        
        if (isNaN(x0) || isNaN(y0) || isNaN(m) || isNaN(n)) {
            throw new Error('Введите все коэффициенты');
        }
        
        if (m === 0 && n === 0) {
            throw new Error('m и n не могут быть одновременно равны 0');
        }
        
        // Общее уравнение: nx - my + (my₀ - nx₀) = 0
        const A = n;
        const B = -m;
        const C = m * y0 - n * x0;
        
        const equation = `${formatNumber(A)}x ${formatNumberWithSign(B)}y ${formatNumberWithSign(C)} = 0`;
        
        return { equation };
    }
    
    // Форматирование чисел
    function formatNumber(num) {
        if (Math.abs(num) < 0.0001) return '0';
        if (Math.abs(num - Math.round(num)) < 0.0001) {
            return Math.round(num).toString();
        }
        return Math.round(num * 1000) / 1000;
    }
    
    function formatNumberWithSign(num) {
        const formatted = formatNumber(num);
        if (num >= 0) {
            return `+ ${formatted}`;
        } else {
            return `- ${Math.abs(num).toFixed(3)}`;
        }
    }
    
    // Инициализация программы построения графика
    function initGraphProgram() {
        const drawLineBtn = document.getElementById('drawLineBtn');
        
        drawLineBtn.addEventListener('click', drawLine);
        
        // Инициализация графика
        initCanvas();
    }
    
    function initCanvas() {
        const canvas = document.getElementById('lineCanvas');
        const ctx = canvas.getContext('2d');
        
        drawAxes(ctx, canvas.width, canvas.height);
    }
    
    function drawAxes(ctx, width, height) {
        const centerX = width / 2;
        const centerY = height / 2;
        
        // Очистка
        ctx.clearRect(0, 0, width, height);
        
        // Фон
        ctx.fillStyle = '#f8f9fa';
        ctx.fillRect(0, 0, width, height);
        
        // Сетка
        ctx.strokeStyle = '#e0e0e0';
        ctx.lineWidth = 1;
        
        // Вертикальные линии
        for (let x = 50; x < width; x += 50) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }
        
        // Горизонтальные линии
        for (let y = 50; y < height; y += 50) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }
        
        // Ось X
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, centerY);
        ctx.lineTo(width, centerY);
        ctx.stroke();
        
        // Ось Y
        ctx.beginPath();
        ctx.moveTo(centerX, 0);
        ctx.lineTo(centerX, height);
        ctx.stroke();
        
        // Стрелки
        ctx.beginPath();
        ctx.moveTo(width - 10, centerY - 5);
        ctx.lineTo(width, centerY);
        ctx.lineTo(width - 10, centerY + 5);
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(centerX - 5, 10);
        ctx.lineTo(centerX, 0);
        ctx.lineTo(centerX + 5, 10);
        ctx.fill();
    }
    
    function drawLine() {
        const canvas = document.getElementById('lineCanvas');
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        const centerX = width / 2;
        const centerY = height / 2;
        
        // Получаем координаты
        const x1 = parseFloat(document.getElementById('pointAx').value);
        const y1 = parseFloat(document.getElementById('pointAy').value);
        const x2 = parseFloat(document.getElementById('pointBx').value);
        const y2 = parseFloat(document.getElementById('pointBy').value);
        
        if (isNaN(x1) || isNaN(y1) || isNaN(x2) || isNaN(y2)) {
            alert('Введите координаты обеих точек');
            return;
        }
        
        if (Math.abs(x1 - x2) < 0.001 && Math.abs(y1 - y2) < 0.001) {
            alert('Точки не должны совпадать');
            return;
        }
        
        // Очищаем и рисуем оси
        drawAxes(ctx, width, height);
        
        // Рисуем точки
        ctx.fillStyle = '#e74c3c';
        ctx.beginPath();
        ctx.arc(centerX + x1 * 50, centerY - y1 * 50, 5, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#3498db';
        ctx.beginPath();
        ctx.arc(centerX + x2 * 50, centerY - y2 * 50, 5, 0, Math.PI * 2);
        ctx.fill();
        
        // Рисуем линию
        ctx.strokeStyle = '#27ae60';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(centerX + x1 * 50, centerY - y1 * 50);
        ctx.lineTo(centerX + x2 * 50, centerY - y2 * 50);
        ctx.stroke();
        
        // Выводим уравнение
        const equationDiv = document.getElementById('lineEquation');
        let equation;
        
        if (Math.abs(x2 - x1) > 0.001) {
            const slope = (y2 - y1) / (x2 - x1);
            const intercept = y1 - slope * x1;
            equation = `y = ${formatNumber(slope)}x ${intercept >= 0 ? '+' : ''}${formatNumber(intercept)}`;
        } else {
            equation = `x = ${formatNumber(x1)}`;
        }
        
        equationDiv.innerHTML = `<p><strong>Уравнение прямой:</strong> ${equation}</p>`;
    }
    
    // Функция для рендеринга KaTeX
    function renderMathInElement(element) {
        const equations = element.querySelectorAll('.katex-equation');
        equations.forEach(eq => {
            if (typeof katex !== 'undefined') {
                try {
                    katex.render(eq.textContent, eq, {
                        throwOnError: false,
                        displayMode: eq.textContent.includes('\\begin')
                    });
                } catch (error) {
                    console.error('KaTeX error:', error);
                }
            }
        });
    }
    
    // Инициализация при загрузке
    initCanvas();
});
