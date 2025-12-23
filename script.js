document.addEventListener('DOMContentLoaded', function() {
    // Основные переменные
    const slides = document.querySelectorAll('.slide');
    const totalSlides = slides.length;
    let currentSlide = 0;
    
    // Элементы навигации
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const currentSlideEl = document.getElementById('currentSlide');
    const totalSlidesEl = document.getElementById('totalSlides');
    
    // Меню
    const menuToggle = document.getElementById('menuToggle');
    const menuContent = document.getElementById('menuContent');
    const menuItems = document.getElementById('menuItems');
    
    // Инициализация
    totalSlidesEl.textContent = totalSlides;
    updateSlideCounter();
    createMenu();
    initPrograms();
    
    // Навигация
    prevBtn.addEventListener('click', showPrevSlide);
    nextBtn.addEventListener('click', showNextSlide);
    menuToggle.addEventListener('click', toggleMenu);
    
    // Клавиатура
    document.addEventListener('keydown', function(event) {
        if (event.key === 'ArrowLeft') showPrevSlide();
        if (event.key === 'ArrowRight') showNextSlide();
        if (event.key === 'Escape') menuContent.classList.remove('show');
    });
    
    // Функции навигации
    function showSlide(index) {
        if (index < 0) index = 0;
        if (index >= totalSlides) index = totalSlides - 1;
        
        slides[currentSlide].classList.remove('active');
        currentSlide = index;
        slides[currentSlide].classList.add('active');
        
        updateSlideCounter();
        updateMenu();
        renderMath();
    }
    
    function showPrevSlide() { showSlide(currentSlide - 1); }
    function showNextSlide() { showSlide(currentSlide + 1); }
    function updateSlideCounter() { currentSlideEl.textContent = currentSlide + 1; }
    
    // Меню
    function createMenu() {
        menuItems.innerHTML = '';
        slides.forEach((slide, index) => {
            const slideNumber = slide.dataset.slideNumber;
            const slideTitle = slide.querySelector('h1, h2')?.textContent || `Слайд ${slideNumber}`;
            
            const menuItem = document.createElement('div');
            menuItem.className = 'menu-item';
            menuItem.textContent = `${slideNumber}. ${slideTitle.substring(0, 30)}`;
            menuItem.dataset.slideIndex = index;
            
            menuItem.addEventListener('click', () => {
                showSlide(index);
                menuContent.classList.remove('show');
            });
            
            menuItems.appendChild(menuItem);
        });
        updateMenu();
    }
    
    function updateMenu() {
        document.querySelectorAll('.menu-item').forEach((item, index) => {
            item.classList.toggle('active', index === currentSlide);
        });
    }
    
    function toggleMenu() {
        menuContent.classList.toggle('show');
    }
    
    // Инициализация программ
    function initPrograms() {
        initConverter();
        initGraph();
        initCanvas();
    }
    
    // Конвертер уравнений
    function initConverter() {
        const conversionType = document.getElementById('conversionType');
        const convertBtn = document.getElementById('convertBtn');
        const inputsSection = document.getElementById('inputsSection');
        
        function updateInputs() {
            const type = conversionType.value;
            let html = '';
            
            switch(type) {
                case 'generalToCanonical':
                case 'generalToParametric':
                    html = `
                        <h3>Общее уравнение: Ax + By + C = 0</h3>
                        <div class="inputs-row">
                            <input type="number" id="A" placeholder="A" value="2">
                            <input type="number" id="B" placeholder="B" value="-3">
                            <input type="number" id="C" placeholder="C" value="6">
                        </div>
                    `;
                    break;
                    
                case 'canonicalToGeneral':
                case 'canonicalToParametric':
                    html = `
                        <h3>Каноническое: (x - x₀)/m = (y - y₀)/n</h3>
                        <div class="inputs-row">
                            <input type="number" id="x0" placeholder="x₀" value="0">
                            <input type="number" id="y0" placeholder="y₀" value="2">
                            <input type="number" id="m" placeholder="m" value="3">
                            <input type="number" id="n" placeholder="n" value="2">
                        </div>
                    `;
                    break;
                    
                case 'parametricToCanonical':
                case 'parametricToGeneral':
                    html = `
                        <h3>Параметрическое: x = x₀ + mt, y = y₀ + nt</h3>
                        <div class="inputs-row">
                            <input type="number" id="px0" placeholder="x₀" value="0">
                            <input type="number" id="py0" placeholder="y₀" value="2">
                            <input type="number" id="pm" placeholder="m" value="3">
                            <input type="number" id="pn" placeholder="n" value="2">
                        </div>
                    `;
                    break;
            }
            
            inputsSection.innerHTML = html;
        }
        
        conversionType.addEventListener('change', updateInputs);
        convertBtn.addEventListener('click', performConversion);
        updateInputs();
    }
    
    function performConversion() {
        const type = document.getElementById('conversionType').value;
        const resultDiv = document.getElementById('result');
        
        try {
            let equation;
            
            switch(type) {
                case 'generalToCanonical':
                    equation = convertGeneralToCanonical();
                    break;
                case 'generalToParametric':
                    equation = convertGeneralToParametric();
                    break;
                case 'canonicalToGeneral':
                    equation = convertCanonicalToGeneral();
                    break;
                case 'canonicalToParametric':
                    equation = convertCanonicalToParametric();
                    break;
                case 'parametricToCanonical':
                    equation = convertParametricToCanonical();
                    break;
                case 'parametricToGeneral':
                    equation = convertParametricToGeneral();
                    break;
            }
            
            resultDiv.innerHTML = `<div class="katex-equation">${equation}</div>`;
            renderMathInElement(resultDiv);
            
        } catch(error) {
            resultDiv.innerHTML = `<p style="color: #e74c3c;">Ошибка: ${error.message}</p>`;
        }
    }
    
    // Функции преобразования
    function convertGeneralToCanonical() {
        const A = getNumber('A');
        const B = getNumber('B');
        const C = getNumber('C');
        
        validateCoefficients(A, B);
        
        let x0, y0;
        if (B !== 0) {
            x0 = 0;
            y0 = -C / B;
        } else {
            y0 = 0;
            x0 = -C / A;
        }
        
        const m = -B;
        const n = A;
        
        return `\\frac{x ${formatSign(-x0)}}{${format(m)}} = \\frac{y ${formatSign(-y0)}}{${format(n)}}`;
    }
    
    function convertGeneralToParametric() {
        const A = getNumber('A');
        const B = getNumber('B');
        const C = getNumber('C');
        
        validateCoefficients(A, B);
        
        let x0, y0;
        if (B !== 0) {
            x0 = 0;
            y0 = -C / B;
        } else {
            y0 = 0;
            x0 = -C / A;
        }
        
        const m = -B;
        const n = A;
        
        return `\\begin{cases} x = ${format(x0)} ${formatSign(m)}t \\\\ y = ${format(y0)} ${formatSign(n)}t \\end{cases}`;
    }
    
    function convertCanonicalToGeneral() {
        const x0 = getNumber('x0');
        const y0 = getNumber('y0');
        const m = getNumber('m');
        const n = getNumber('n');
        
        validateDirectionVector(m, n);
        
        const A = n;
        const B = -m;
        const C = m * y0 - n * x0;
        
        return `${format(A)}x ${formatSign(B)}y ${formatSign(C)} = 0`;
    }
    
    function convertCanonicalToParametric() {
        const x0 = getNumber('x0');
        const y0 = getNumber('y0');
        const m = getNumber('m');
        const n = getNumber('n');
        
        validateDirectionVector(m, n);
        
        return `\\begin{cases} x = ${format(x0)} ${formatSign(m)}t \\\\ y = ${format(y0)} ${formatSign(n)}t \\end{cases}`;
    }
    
    function convertParametricToCanonical() {
        const x0 = getNumber('px0');
        const y0 = getNumber('py0');
        const m = getNumber('pm');
        const n = getNumber('pn');
        
        validateDirectionVector(m, n);
        
        return `\\frac{x ${formatSign(-x0)}}{${format(m)}} = \\frac{y ${formatSign(-y0)}}{${format(n)}}`;
    }
    
    function convertParametricToGeneral() {
        const x0 = getNumber('px0');
        const y0 = getNumber('py0');
        const m = getNumber('pm');
        const n = getNumber('pn');
        
        validateDirectionVector(m, n);
        
        const A = n;
        const B = -m;
        const C = m * y0 - n * x0;
        
        return `${format(A)}x ${formatSign(B)}y ${formatSign(C)} = 0`;
    }
    
    // Вспомогательные функции
    function getNumber(id) {
        const element = document.getElementById(id);
        if (!element) throw new Error('Элемент не найден');
        return parseFloat(element.value);
    }
    
    function validateCoefficients(A, B) {
        if (isNaN(A) || isNaN(B)) throw new Error('Введите коэффициенты');
        if (A === 0 && B === 0) throw new Error('A и B не могут быть оба нулями');
    }
    
    function validateDirectionVector(m, n) {
        if (isNaN(m) || isNaN(n)) throw new Error('Введите координаты вектора');
        if (m === 0 && n === 0) throw new Error('Вектор не может быть нулевым');
    }
    
    function format(num) {
        if (Math.abs(num) < 0.001) return '0';
        if (Math.abs(num - Math.round(num)) < 0.001) {
            return Math.round(num).toString();
        }
        return Math.round(num * 1000) / 1000;
    }
    
    function formatSign(num) {
        const formatted = format(num);
        return num >= 0 ? `+ ${formatted}` : `- ${Math.abs(num).toFixed(3)}`;
    }
    
    // График
    function initGraph() {
        const drawBtn = document.getElementById('drawLineBtn');
        drawBtn.addEventListener('click', drawLine);
    }
    
    function initCanvas() {
        const canvas = document.getElementById('lineCanvas');
        const ctx = canvas.getContext('2d');
        drawAxes(ctx, canvas.width, canvas.height);
    }
    
    function drawAxes(ctx, width, height) {
        const centerX = width / 2;
        const centerY = height / 2;
        
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = '#f8f9fa';
        ctx.fillRect(0, 0, width, height);
        
        // Сетка
        ctx.strokeStyle = '#e0e0e0';
        ctx.lineWidth = 1;
        
        for (let x = 50; x < width; x += 50) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }
        
        for (let y = 50; y < height; y += 50) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }
        
        // Оси
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        
        ctx.beginPath();
        ctx.moveTo(0, centerY);
        ctx.lineTo(width, centerY);
        ctx.stroke();
        
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
        
        const x1 = parseFloat(document.getElementById('pointAx').value);
        const y1 = parseFloat(document.getElementById('pointAy').value);
        const x2 = parseFloat(document.getElementById('pointBx').value);
        const y2 = parseFloat(document.getElementById('pointBy').value);
        
        if (isNaN(x1) || isNaN(y1) || isNaN(x2) || isNaN(y2)) {
            alert('Введите координаты точек');
            return;
        }
        
        drawAxes(ctx, width, height);
        
        // Точки
        ctx.fillStyle = '#e74c3c';
        ctx.beginPath();
        ctx.arc(centerX + x1 * 50, centerY - y1 * 50, 5, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#3498db';
        ctx.beginPath();
        ctx.arc(centerX + x2 * 50, centerY - y2 * 50, 5, 0, Math.PI * 2);
        ctx.fill();
        
        // Линия
        ctx.strokeStyle = '#27ae60';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(centerX + x1 * 50, centerY - y1 * 50);
        ctx.lineTo(centerX + x2 * 50, centerY - y2 * 50);
        ctx.stroke();
        
        // Уравнение
        const output = document.getElementById('equationOutput');
        let equation;
        
        if (Math.abs(x2 - x1) < 0.001) {
            equation = `x = ${format(x1)}`;
        } else if (Math.abs(y2 - y1) < 0.001) {
            equation = `y = ${format(y1)}`;
        } else {
            const k = (y2 - y1) / (x2 - x1);
            const b = y1 - k * x1;
            equation = `y = ${format(k)}x ${b >= 0 ? '+' : ''}${format(b)}`;
        }
        
        output.innerHTML = `<p><strong>Уравнение прямой:</strong> ${equation}</p>`;
    }
    
    // KaTeX
    function renderMath() {
        const slide = slides[currentSlide];
        const equations = slide.querySelectorAll('.katex-equation');
        equations.forEach(eq => {
            if (eq.textContent && typeof katex !== 'undefined') {
                try {
                    katex.render(eq.textContent, eq, {
                        throwOnError: false,
                        displayMode: eq.textContent.includes('\\begin') || eq.textContent.includes('\\frac')
                    });
                } catch (error) {
                    console.error('KaTeX error:', error);
                }
            }
        });
    }
    
    function renderMathInElement(element) {
        const equations = element.querySelectorAll('.katex-equation');
        equations.forEach(eq => {
            if (eq.textContent && typeof katex !== 'undefined') {
                try {
                    katex.render(eq.textContent, eq, {
                        throwOnError: false,
                        displayMode: true
                    });
                } catch (error) {
                    console.error('KaTeX error:', error);
                }
            }
        });
    }
    
    // Закрытие меню при клике снаружи
    document.addEventListener('click', function(event) {
        if (!menuToggle.contains(event.target) && !menuContent.contains(event.target)) {
            menuContent.classList.remove('show');
        }
    });
    
    // Инициализация при загрузке
    setTimeout(() => {
        renderMath();
        initCanvas();
    }, 100);
});
