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
    
    // Меню
    const menuToggle = document.getElementById('menuToggle');
    const menuContent = document.getElementById('menuContent');
    const menuItems = document.getElementById('menuItems');
    
    // Инициализация
    totalSlidesEl.textContent = totalSlides;
    updateSlideCounter();
    createMenu();
    initConverter();
    initGraph();
    renderMath();
    
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
        
        // Перерисовываем формулы на новом слайде
        setTimeout(renderMath, 50);
    }
    
    function showPrevSlide() { showSlide(currentSlide - 1); }
    function showNextSlide() { showSlide(currentSlide + 1); }
    
    function updateSlideCounter() {
        currentSlideEl.textContent = currentSlide + 1;
    }
    
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
    
    // KaTeX рендеринг
    function renderMath() {
        const slide = slides[currentSlide];
        const equations = slide.querySelectorAll('.katex-equation');
        
        equations.forEach(eq => {
            if (eq.textContent && typeof katex !== 'undefined') {
                try {
                    // Удваиваем обратные слеши для KaTeX
                    const texContent = eq.textContent.replace(/\\/g, '\\\\');
                    katex.render(texContent, eq, {
                        throwOnError: false,
                        displayMode: texContent.includes('\\begin') || 
                                     texContent.includes('\\frac') ||
                                     texContent.includes('\\dfrac') ||
                                     texContent.includes('\\vec')
                    });
                } catch (error) {
                    console.error('KaTeX error:', error);
                }
            }
        });
    }
    
    // Программа преобразования уравнений
    function initConverter() {
        const conversionType = document.getElementById('conversionType');
        const convertBtn = document.getElementById('convertBtn');
        const inputSection = document.getElementById('inputSection');
        const resultDiv = document.getElementById('result');
        const stepsDiv = document.getElementById('stepsContent');
        
        function updateInputs() {
            const type = conversionType.value;
            let html = '';
            
            switch(type) {
                case 'generalToCanonical':
                case 'generalToParametric':
                    html = `
                        <h3>Общее уравнение: Ax + By + C = 0</h3>
                        <div class="inputs-row">
                            <input type="number" id="A" placeholder="A" value="2" class="coef-input">
                            <input type="number" id="B" placeholder="B" value="-3" class="coef-input">
                            <input type="number" id="C" placeholder="C" value="6" class="coef-input">
                        </div>
                    `;
                    break;
                    
                case 'canonicalToGeneral':
                case 'canonicalToParametric':
                    html = `
                        <h3>Каноническое уравнение: (x - x₀)/m = (y - y₀)/n</h3>
                        <div class="inputs-row">
                            <input type="number" id="x0" placeholder="x₀" value="0" class="coef-input">
                            <input type="number" id="y0" placeholder="y₀" value="2" class="coef-input">
                            <input type="number" id="m" placeholder="m" value="3" class="coef-input">
                            <input type="number" id="n" placeholder="n" value="2" class="coef-input">
                        </div>
                    `;
                    break;
                    
                case 'parametricToCanonical':
                case 'parametricToGeneral':
                    html = `
                        <h3>Параметрическое уравнение:</h3>
                        <p>x = x₀ + m·t, y = y₀ + n·t</p>
                        <div class="inputs-row">
                            <input type="number" id="px0" placeholder="x₀" value="0" class="coef-input">
                            <input type="number" id="py0" placeholder="y₀" value="2" class="coef-input">
                            <input type="number" id="pm" placeholder="m" value="3" class="coef-input">
                            <input type="number" id="pn" placeholder="n" value="2" class="coef-input">
                        </div>
                    `;
                    break;
            }
            
            inputSection.innerHTML = html;
            
            // Добавляем обработчики для автоматического преобразования
            document.querySelectorAll('.coef-input').forEach(input => {
                input.addEventListener('input', performConversion);
            });
        }
        
        conversionType.addEventListener('change', updateInputs);
        convertBtn.addEventListener('click', performConversion);
        updateInputs();
        
        function performConversion() {
            const type = conversionType.value;
            
            try {
                let result;
                let steps = [];
                
                switch(type) {
                    case 'generalToCanonical':
                        result = convertGeneralToCanonical();
                        steps = [
                            '1. Находим точку на прямой:',
                            '   Если B ≠ 0: x₀ = 0, y₀ = -C/B',
                            '   Если A ≠ 0: y₀ = 0, x₀ = -C/A',
                            '2. Направляющий вектор: \vec{s} = (-B, A)',
                            '3. Записываем каноническое уравнение:'
                        ];
                        break;
                        
                    case 'generalToParametric':
                        result = convertGeneralToParametric();
                        steps = [
                            '1. Находим точку на прямой (как в предыдущем алгоритме)',
                            '2. Направляющий вектор: \vec{s} = (-B, A)',
                            '3. Записываем параметрическое уравнение:'
                        ];
                        break;
                        
                    case 'canonicalToGeneral':
                        result = convertCanonicalToGeneral();
                        steps = [
                            '1. Умножаем крест-накрест: n(x - x₀) = m(y - y₀)',
                            '2. Раскрываем скобки: nx - nx₀ = my - my₀',
                            '3. Переносим всё в одну сторону: nx - my + (my₀ - nx₀) = 0',
                            '4. Получаем общее уравнение:'
                        ];
                        break;
                        
                    case 'canonicalToParametric':
                        result = convertCanonicalToParametric();
                        steps = [
                            '1. Берем точку (x₀, y₀) из уравнения',
                            '2. Берем направляющий вектор (m, n) из уравнения',
                            '3. Записываем параметрическое уравнение:'
                        ];
                        break;
                        
                    case 'parametricToCanonical':
                        result = convertParametricToCanonical();
                        steps = [
                            '1. Из первого уравнения выражаем t',
                            '2. Из второго уравнения выражаем t',
                            '3. Приравниваем полученные выражения',
                            '4. Получаем каноническое уравнение:'
                        ];
                        break;
                        
                    case 'parametricToGeneral':
                        result = convertParametricToGeneral();
                        steps = [
                            '1. Выражаем t из обоих уравнений',
                            '2. Приравниваем выражения для t',
                            '3. Преобразуем в каноническое уравнение',
                            '4. Преобразуем в общее уравнение:'
                        ];
                        break;
                }
                
                resultDiv.innerHTML = `<div class="katex-equation">${result.equation}</div>`;
                
                // Показываем шаги решения
                let stepsHTML = '';
                steps.forEach(step => {
                    stepsHTML += `<div class="step">${step}</div>`;
                });
                stepsDiv.innerHTML = stepsHTML;
                
                // Рендерим формулы в результате
                renderMathInElement(resultDiv);
                renderMathInElement(stepsDiv);
                
            } catch(error) {
                resultDiv.innerHTML = `<p style="color: #e74c3c; font-weight: bold;">Ошибка: ${error.message}</p>`;
                stepsDiv.innerHTML = '';
            }
        }
        
        // Функции преобразования
        function convertGeneralToCanonical() {
            const A = getNumber('A');
            const B = getNumber('B');
            const C = getNumber('C');
            
            if (isNaN(A) || isNaN(B) || isNaN(C)) {
                throw new Error('Введите все коэффициенты');
            }
            
            if (A === 0 && B === 0) {
                throw new Error('A и B не могут быть одновременно равны 0');
            }
            
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
            
            const equation = `\\frac{x ${formatSign(-x0)}}{${format(m)}} = \\frac{y ${formatSign(-y0)}}{${format(n)}}`;
            
            return { equation, point: {x: x0, y: y0}, vector: {m, n} };
        }
        
        function convertGeneralToParametric() {
            const A = getNumber('A');
            const B = getNumber('B');
            const C = getNumber('C');
            
            if (isNaN(A) || isNaN(B) || isNaN(C)) {
                throw new Error('Введите все коэффициенты');
            }
            
            if (A === 0 && B === 0) {
                throw new Error('A и B не могут быть одновременно равны 0');
            }
            
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
            
            const equation = `\\begin{cases} x = ${format(x0)} ${formatSign(m)}t \\\\ y = ${format(y0)} ${formatSign(n)}t \\end{cases}`;
            
            return { equation, point: {x: x0, y: y0}, vector: {m, n} };
        }
        
        function convertCanonicalToGeneral() {
            const x0 = getNumber('x0');
            const y0 = getNumber('y0');
            const m = getNumber('m');
            const n = getNumber('n');
            
            if (isNaN(x0) || isNaN(y0) || isNaN(m) || isNaN(n)) {
                throw new Error('Введите все коэффициенты');
            }
            
            if (m === 0 && n === 0) {
                throw new Error('m и n не могут быть одновременно равны 0');
            }
            
            const A = n;
            const B = -m;
            const C = m * y0 - n * x0;
            
            const equation = `${format(A)}x ${formatSign(B)}y ${formatSign(C)} = 0`;
            
            return { equation, coefficients: {A, B, C} };
        }
        
        function convertCanonicalToParametric() {
            const x0 = getNumber('x0');
            const y0 = getNumber('y0');
            const m = getNumber('m');
            const n = getNumber('n');
            
            if (isNaN(x0) || isNaN(y0) || isNaN(m) || isNaN(n)) {
                throw new Error('Введите все коэффициенты');
            }
            
            if (m === 0 && n === 0) {
                throw new Error('m и n не могут быть одновременно равны 0');
            }
            
            const equation = `\\begin{cases} x = ${format(x0)} ${formatSign(m)}t \\\\ y = ${format(y0)} ${formatSign(n)}t \\end{cases}`;
            
            return { equation, point: {x: x0, y: y0}, vector: {m, n} };
        }
        
        function convertParametricToCanonical() {
            const x0 = getNumber('px0');
            const y0 = getNumber('py0');
            const m = getNumber('pm');
            const n = getNumber('pn');
            
            if (isNaN(x0) || isNaN(y0) || isNaN(m) || isNaN(n)) {
                throw new Error('Введите все коэффициенты');
            }
            
            if (m === 0 && n === 0) {
                throw new Error('m и n не могут быть одновременно равны 0');
            }
            
            const equation = `\\frac{x ${formatSign(-x0)}}{${format(m)}} = \\frac{y ${formatSign(-y0)}}{${format(n)}}`;
            
            return { equation, point: {x: x0, y: y0}, vector: {m, n} };
        }
        
        function convertParametricToGeneral() {
            const x0 = getNumber('px0');
            const y0 = getNumber('py0');
            const m = getNumber('pm');
            const n = getNumber('pn');
            
            if (isNaN(x0) || isNaN(y0) || isNaN(m) || isNaN(n)) {
                throw new Error('Введите все коэффициенты');
            }
            
            if (m === 0 && n === 0) {
                throw new Error('m и n не могут быть одновременно равны 0');
            }
            
            const A = n;
            const B = -m;
            const C = m * y0 - n * x0;
            
            const equation = `${format(A)}x ${formatSign(B)}y ${formatSign(C)} = 0`;
            
            return { equation, coefficients: {A, B, C} };
        }
        
        // Вспомогательные функции
        function getNumber(id) {
            const element = document.getElementById(id);
            if (!element) throw new Error(`Элемент #${id} не найден`);
            const value = parseFloat(element.value);
            return isNaN(value) ? 0 : value;
        }
        
        function format(num) {
            if (Math.abs(num) < 0.0001) return '0';
            if (Math.abs(num - Math.round(num)) < 0.0001) {
                return Math.round(num).toString();
            }
            return Math.round(num * 1000) / 1000;
        }
        
        function formatSign(num) {
            const formatted = format(num);
            if (num >= 0) {
                return `+ ${formatted}`;
            } else {
                return `- ${Math.abs(num).toFixed(3)}`;
            }
        }
    }
    
    // Программа построения графика
    function initGraph() {
        const drawBtn = document.getElementById('drawLineBtn');
        const canvas = document.getElementById('lineCanvas');
        const ctx = canvas.getContext('2d');
        
        // Инициализация координатной плоскости
        function initCanvas() {
            drawAxes(ctx, canvas.width, canvas.height);
        }
        
        drawBtn.addEventListener('click', function() {
            drawLine();
        });
        
        // Автоматическая отрисовка при изменении значений
        ['pointAx', 'pointAy', 'pointBx', 'pointBy'].forEach(id => {
            document.getElementById(id).addEventListener('input', function() {
                if (this.value !== '') {
                    drawLine();
                }
            });
        });
        
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
            
            // Подписи осей
            ctx.font = '14px Arial';
            ctx.fillStyle = '#000';
            ctx.fillText('X', width - 20, centerY - 10);
            ctx.fillText('Y', centerX + 10, 20);
            
            // Разметка
            ctx.font = '12px Arial';
            ctx.fillStyle = '#666';
            
            for (let i = -5; i <= 5; i++) {
                if (i === 0) continue;
                const x = centerX + i * 50;
                ctx.beginPath();
                ctx.moveTo(x, centerY - 5);
                ctx.lineTo(x, centerY + 5);
                ctx.stroke();
                ctx.fillText(i.toString(), x - 5, centerY + 20);
            }
            
            for (let i = -4; i <= 4; i++) {
                if (i === 0) continue;
                const y = centerY - i * 50;
                ctx.beginPath();
                ctx.moveTo(centerX - 5, y);
                ctx.lineTo(centerX + 5, y);
                ctx.stroke();
                ctx.fillText(i.toString(), centerX + 10, y + 4);
            }
            
            // Ноль
            ctx.fillText('0', centerX + 10, centerY + 20);
        }
        
        function drawLine() {
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
            
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            
            // Очищаем и рисуем оси
            drawAxes(ctx, canvas.width, canvas.height);
            
            // Рисуем точки
            ctx.fillStyle = '#e74c3c';
            ctx.beginPath();
            ctx.arc(centerX + x1 * 50, centerY - y1 * 50, 6, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = '#3498db';
            ctx.beginPath();
            ctx.arc(centerX + x2 * 50, centerY - y2 * 50, 6, 0, Math.PI * 2);
            ctx.fill();
            
            // Подписи точек
            ctx.font = '14px Arial';
            ctx.fillStyle = '#e74c3c';
            ctx.fillText(`A(${x1}, ${y1})`, centerX + x1 * 50 + 10, centerY - y1 * 50 - 10);
            ctx.fillStyle = '#3498db';
            ctx.fillText(`B(${x2}, ${y2})`, centerX + x2 * 50 + 10, centerY - y2 * 50 - 10);
            
            // Вычисляем уравнение прямой
            let equation;
            let equationText;
            
            if (Math.abs(x2 - x1) > 0.001) {
                // Прямая не вертикальная
                const k = (y2 - y1) / (x2 - x1);
                const b = y1 - k * x1;
                
                equationText = `y = ${formatNumber(k)}x ${b >= 0 ? '+' : ''}${formatNumber(b)}`;
                equation = `y = ${formatNumber(k)}x ${b >= 0 ? '+' : ''}${formatNumber(b)}`;
                
                // Рисуем линию
                const startX = -5;
                const endX = 5;
                const startY = k * startX + b;
                const endY = k * endX + b;
                
                ctx.strokeStyle = '#27ae60';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.moveTo(centerX + startX * 50, centerY - startY * 50);
                ctx.lineTo(centerX + endX * 50, centerY - endY * 50);
                ctx.stroke();
                
            } else {
                // Вертикальная прямая
                equationText = `x = ${formatNumber(x1)}`;
                equation = `x = ${formatNumber(x1)}`;
                
                // Рисуем вертикальную линию
                ctx.strokeStyle = '#27ae60';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.moveTo(centerX + x1 * 50, 0);
                ctx.lineTo(centerX + x1 * 50, canvas.height);
                ctx.stroke();
            }
            
            // Выводим уравнение
            const equationDiv = document.getElementById('lineEquation');
            equationDiv.innerHTML = `
                <p><strong>Уравнение прямой:</strong> ${equationText}</p>
                <p><strong>Общий вид:</strong> ${getGeneralEquation(x1, y1, x2, y2)}</p>
                <p><strong>Канонический вид:</strong> ${getCanonicalEquation(x1, y1, x2, y2)}</p>
            `;
            
            // Рендерим формулы
            renderMathInElement(equationDiv);
        }
        
        function formatNumber(num) {
            if (Math.abs(num) < 0.0001) return '0';
            if (Math.abs(num - Math.round(num)) < 0.0001) {
                return Math.round(num).toString();
            }
            return Math.round(num * 1000) / 1000;
        }
        
        function getGeneralEquation(x1, y1, x2, y2) {
            const A = y2 - y1;
            const B = -(x2 - x1);
            const C = x2 * y1 - x1 * y2;
            return `${formatNumber(A)}x ${B >= 0 ? '+' : ''}${formatNumber(B)}y ${C >= 0 ? '+' : ''}${formatNumber(C)} = 0`;
        }
        
        function getCanonicalEquation(x1, y1, x2, y2) {
            if (Math.abs(x2 - x1) < 0.001) {
                return `x = ${formatNumber(x1)}`;
            }
            if (Math.abs(y2 - y1) < 0.001) {
                return `y = ${formatNumber(y1)}`;
            }
            return `\\frac{x ${formatSign(-x1)}}{${formatNumber(x2 - x1)}} = \\frac{y ${formatSign(-y1)}}{${formatNumber(y2 - y1)}}`;
        }
        
        function formatSign(num) {
            return num >= 0 ? `+ ${formatNumber(num)}` : `- ${formatNumber(Math.abs(num))}`;
        }
        
        // Инициализация при загрузке
        initCanvas();
    }
    
    // Вспомогательная функция для рендеринга KaTeX в конкретном элементе
    function renderMathInElement(element) {
        const equations = element
