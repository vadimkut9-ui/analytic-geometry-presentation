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
        
        // Прокрутка к началу слайда
        slides[currentSlide].scrollTop = 0;
        
        // Обновление KaTeX на новом слайде
        renderMath();
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
            menuItem.textContent = `${slideNumber}. ${slideTitle.substring(0, 50)}`;
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
    
    // Функция для рендеринга математических формул с KaTeX
    function renderMath() {
        // Рендерим все формулы на текущем слайде
        const currentSlideElement = slides[currentSlide];
        const equations = currentSlideElement.querySelectorAll('.katex-equation');
        
        equations.forEach(element => {
            try {
                // Пытаемся отрендерить KaTeX
                katex.render(element.textContent, element, {
                    throwOnError: false,
                    displayMode: element.textContent.includes('\\begin') || 
                                element.textContent.includes('\\frac') || 
                                element.textContent.includes('\\dfrac'),
                    output: 'html'
                });
            } catch (error) {
                console.error('Ошибка рендеринга KaTeX:', error);
            }
        });
    }
    
    // Инициализация программы преобразования уравнений
    function initConversionProgram() {
        const conversionType = document.getElementById('conversionType');
        const convertBtn = document.getElementById('convertBtn');
        const clearBtn = document.getElementById('clearBtn');
        
        const generalInputs = document.getElementById('generalInputs');
        const canonicalInputs = document.getElementById('canonicalInputs');
        const parametricInputs = document.getElementById('parametricInputs');
        
        // Показать/скрыть соответствующие поля ввода
        conversionType.addEventListener('change', function() {
            const type = this.value;
            
            // Скрыть все поля ввода
            generalInputs.style.display = 'none';
            canonicalInputs.style.display = 'none';
            parametricInputs.style.display = 'none';
            
            // Показать нужные поля
            if (type.startsWith('general')) {
                generalInputs.style.display = 'block';
            } else if (type.startsWith('canonical')) {
                canonicalInputs.style.display = 'block';
            } else if (type.startsWith('parametric')) {
                parametricInputs.style.display = 'block';
            }
        });
        
        // Обработка преобразования
        convertBtn.addEventListener('click', performConversion);
        
        // Очистка результатов
        clearBtn.addEventListener('click', function() {
            document.getElementById('result').innerHTML = '<p>Выберите тип преобразования и введите коэффициенты</p>';
            document.getElementById('stepsContent').innerHTML = '';
        });
        
        // Автоматическое преобразование при изменении значений
        const inputs = document.querySelectorAll('#coefA, #coefB, #coefC, #x0, #y0, #m, #n, #px0, #py0, #pm, #pn');
        inputs.forEach(input => {
            input.addEventListener('input', function() {
                if (this.value !== '') {
                    performConversion();
                }
            });
        });
    }
    
    function performConversion() {
        const type = document.getElementById('conversionType').value;
        const resultDiv = document.getElementById('result');
        const stepsDiv = document.getElementById('stepsContent');
        
        let result, steps;
        
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
                case 'canonicalToParametric':
                    result = convertCanonicalToParametric();
                    break;
                case 'parametricToCanonical':
                    result = convertParametricToCanonical();
                    break;
                case 'parametricToGeneral':
                    result = convertParametricToGeneral();
                    break;
                default:
                    throw new Error('Неизвестный тип преобразования');
            }
            
            resultDiv.innerHTML = `<p><strong>Результат:</strong></p><div class="katex-equation">${result.equation}</div>`;
            stepsDiv.innerHTML = result.steps;
            
        } catch(error) {
            resultDiv.innerHTML = `<p style="color: var(--accent-color);"><strong>Ошибка:</strong> ${error.message}</p>`;
            stepsDiv.innerHTML = '';
        }
        
        // Рендеринг KaTeX в результате
        renderMath();
    }
    
    // Функции преобразования уравнений
    function formatNumber(num) {
        // Форматирование числа для отображения
        if (Math.abs(num) < 0.0001) return '0';
        
        // Если число целое, отображаем без десятичных знаков
        if (Math.abs(num - Math.round(num)) < 0.0001) {
            return Math.round(num).toString();
        }
        
        // Округляем до 3 знаков после запятой
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
        
        let steps = '';
        steps += `<div class="step"><strong>Дано:</strong> ${formatNumber(A)}x ${formatNumberWithSign(B)}y ${formatNumberWithSign(C)} = 0</div>`;
        
        // Находим точку на прямой
        let x0, y0;
        if (B !== 0) {
            x0 = 0;
            y0 = -C / B;
            steps += `<div class="step">1. При x = 0 находим y: ${formatNumber(B)}y ${formatNumberWithSign(C)} = 0 ⇒ y = ${formatNumber(y0)}</div>`;
            steps += `<div class="step">   Точка на прямой: (${formatNumber(x0)}, ${formatNumber(y0)})</div>`;
        } else {
            y0 = 0;
            x0 = -C / A;
            steps += `<div class="step">1. При y = 0 находим x: ${formatNumber(A)}x ${formatNumberWithSign(C)} = 0 ⇒ x = ${formatNumber(x0)}</div>`;
            steps += `<div class="step">   Точка на прямой: (${formatNumber(x0)}, ${formatNumber(y0)})</div>`;
        }
        
        // Направляющий вектор
        const m = -B;
        const n = A;
        steps += `<div class="step">2. Направляющий вектор: \\vec{s} = (${formatNumber(m)}, ${formatNumber(n)})</div>`;
        
        // Каноническое уравнение
        const equation = `\\frac{x ${formatNumberWithSign(-x0)}}{${formatNumber(m)}} = \\frac{y ${formatNumberWithSign(-y0)}}{${formatNumber(n)}}`;
        steps += `<div class="step">3. Каноническое уравнение: ${equation}</div>`;
        
        return {
            equation: equation,
            steps: steps
        };
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
        
        let steps = '';
        steps += `<div class="step"><strong>Дано:</strong> ${formatNumber(A)}x ${formatNumberWithSign(B)}y ${formatNumberWithSign(C)} = 0</div>`;
        
        // Находим точку на прямой
        let x0, y0;
        if (B !== 0) {
            x0 = 0;
            y0 = -C / B;
            steps += `<div class="step">1. При x = 0 находим y: ${formatNumber(B)}y ${formatNumberWithSign(C)} = 0 ⇒ y = ${formatNumber(y0)}</div>`;
            steps += `<div class="step">   Точка на прямой: (${formatNumber(x0)}, ${formatNumber(y0)})</div>`;
        } else {
            y0 = 0;
            x0 = -C / A;
            steps += `<div class="step">1. При y = 0 находим x: ${formatNumber(A)}x ${formatNumberWithSign(C)} = 0 ⇒ x = ${formatNumber(x0)}</div>`;
            steps += `<div class="step">   Точка на прямой: (${formatNumber(x0)}, ${formatNumber(y0)})</div>`;
        }
        
        // Направляющий вектор
        const m = -B;
        const n = A;
        steps += `<div class="step">2. Направляющий вектор: \\vec{s} = (${formatNumber(m)}, ${formatNumber(n)})</div>`;
        
        // Параметрическое уравнение
        const equation = `\\begin{cases} x = ${formatNumber(x0)} ${formatNumberWithSign(m)}t \\\\ y = ${formatNumber(y0)} ${formatNumberWithSign(n)}t \\end{cases}`;
        steps += `<div class="step">3. Параметрическое уравнение: ${equation}</div>`;
        
        return {
            equation: equation,
            steps: steps
        };
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
        
        let steps = '';
        steps += `<div class="step"><strong>Дано:</strong> \\frac{x ${formatNumberWithSign(-x0)}}{${formatNumber(m)}} = \\frac{y ${formatNumberWithSign(-y0)}}{${formatNumber(n)}}</div>`;
        
        // Преобразуем в общее уравнение
        steps += `<div class="step">1. Умножаем крест-накрест: ${formatNumber(n)}(x ${formatNumberWithSign(-x0)}) = ${formatNumber(m)}(y ${formatNumberWithSign(-y0)})</div>`;
        
        // Раскрываем скобки
        const nx = `${formatNumber(n)}x`;
        const ny = `${formatNumber(m)}y`;
        const constant = m * y0 - n * x0;
        
        steps += `<div class="step">2. Раскрываем скобки: ${nx} ${formatNumberWithSign(-n * x0)} = ${ny} ${formatNumberWithSign(-m * y0)}</div>`;
        
        // Переносим все в одну сторону
        const A = n;
        const B = -m;
        const C = constant;
        
        steps += `<div class="step">3. Переносим все в одну сторону: ${formatNumber(A)}x ${formatNumberWithSign(B)}y ${formatNumberWithSign(C)} = 0</div>`;
        
        const equation = `${formatNumber(A)}x ${formatNumberWithSign(B)}y ${formatNumberWithSign(C)} = 0`;
        
        return {
            equation: equation,
            steps: steps
        };
    }
    
    function convertCanonicalToParametric() {
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
        
        let steps = '';
        steps += `<div class="step"><strong>Дано:</strong> \\frac{x ${formatNumberWithSign(-x0)}}{${formatNumber(m)}} = \\frac{y ${formatNumberWithSign(-y0)}}{${formatNumber(n)}}</div>`;
        
        steps += `<div class="step">1. Точка на прямой: (${formatNumber(x0)}, ${formatNumber(y0)})</div>`;
        steps += `<div class="step">2. Направляющий вектор: (${formatNumber(m)}, ${formatNumber(n)})</div>`;
        
        const equation = `\\begin{cases} x = ${formatNumber(x0)} ${formatNumberWithSign(m)}t \\\\ y = ${formatNumber(y0)} ${formatNumberWithSign(n)}t \\end{cases}`;
        steps += `<div class="step">3. Параметрическое уравнение: ${equation}</div>`;
        
        return {
            equation: equation,
            steps: steps
        };
    }
    
    function convertParametricToCanonical() {
        const x0 = parseFloat(document.getElementById('px0').value);
        const y0 = parseFloat(document.getElementById('py0').value);
        const m = parseFloat(document.getElementById('pm').value);
        const n = parseFloat(document.getElementById('pn').value);
        
        if (isNaN(x0) || isNaN(y0) || isNaN(m) || isNaN(n)) {
            throw new Error('Введите все коэффициенты');
        }
        
        if (m === 0 && n === 0) {
            throw new Error('m и n не могут быть одновременно равны 0');
        }
        
        let steps = '';
        steps += `<div class="step"><strong>Дано:</strong> \\begin{cases} x = ${formatNumber(x0)} ${formatNumberWithSign(m)}t \\\\ y = ${formatNumber(y0)} ${formatNumberWithSign(n)}t \\end{cases}</div>`;
        
        steps += `<div class="step">1. Из первого уравнения выражаем t: t = \\frac{x ${formatNumberWithSign(-x0)}}{${formatNumber(m)}}</div>`;
        steps += `<div class="step">2. Из второго уравнения выражаем t: t = \\frac{y ${formatNumberWithSign(-y0)}}{${formatNumber(n)}}</div>`;
        
        const equation = `\\frac{x ${formatNumberWithSign(-x0)}}{${formatNumber(m)}} = \\frac{y ${formatNumberWithSign(-y0)}}{${formatNumber(n)}}`;
        steps += `<div class="step">3. Приравниваем: ${equation}</div>`;
        
        return {
            equation: equation,
            steps: steps
        };
    }
    
    function convertParametricToGeneral() {
        const x0 = parseFloat(document.getElementById('px0').value);
        const y0 = parseFloat(document.getElementById('py0').value);
        const m = parseFloat(document.getElementById('pm').value);
        const n = parseFloat(document.getElementById('pn').value);
        
        if (isNaN(x0) || isNaN(y0) || isNaN(m) || isNaN(n)) {
            throw new Error('Введите все коэффициенты');
        }
        
        if (m === 0 && n === 0) {
            throw new Error('m и n не могут быть одновременно равны 0');
        }
        
        let steps = '';
        steps += `<div class="step"><strong>Дано:</strong> \\begin{cases} x = ${formatNumber(x0)} ${formatNumberWithSign(m)}t \\\\ y = ${formatNumber(y0)} ${formatNumberWithSign(n)}t \\end{cases}</div>`;
        
        // Сначала преобразуем в каноническое
        steps += `<div class="step">1. Выражаем t из обоих уравнений и приравниваем:</div>`;
        steps += `<div class="step">   \\frac{x ${formatNumberWithSign(-x0)}}{${formatNumber(m)}} = \\frac{y ${formatNumberWithSign(-y0)}}{${formatNumber(n)}}</div>`;
        
        // Затем преобразуем в общее
        steps += `<div class="step">2. Умножаем крест-накрест: ${formatNumber(n)}(x ${formatNumberWithSign(-x0)}) = ${formatNumber(m)}(y ${formatNumberWithSign(-y0)})</div>`;
        
        const A = n;
        const B = -m;
        const C = m * y0 - n * x0;
        
        steps += `<div class="step">3. Раскрываем скобки и упрощаем: ${formatNumber(A)}x ${formatNumberWithSign(B)}y ${formatNumberWithSign(C)} = 0</div>`;
        
        const equation = `${formatNumber(A)}x ${formatNumberWithSign(B)}y ${formatNumberWithSign(C)} = 0`;
        
        return {
            equation: equation,
            steps: steps
        };
    }
    
    // Инициализация программы построения графика
    function initGraphProgram() {
        const drawLineBtn = document.getElementById('drawLineBtn');
        const clearGraphBtn = document.getElementById('clearGraphBtn');
        
        drawLineBtn.addEventListener('click', drawLine);
        clearGraphBtn.addEventListener('click', clearGraph);
        
        // Автоматическое рисование при изменении значений
        const pointInputs = document.querySelectorAll('#pointAx, #pointAy, #pointBx, #pointBy');
        pointInputs.forEach(input => {
            input.addEventListener('input', function() {
                if (this.value !== '') {
                    drawLine();
                }
            });
        });
        
        // Инициализация графика
        initCanvas();
    }
    
    function initCanvas() {
        const canvas = document.getElementById('lineCanvas');
        const ctx = canvas.getContext('2d');
        
        // Очистка и настройка
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Нарисовать оси координат
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
        
        // Вертикальные линии сетки
        for (let x = 50; x < width; x += 50) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }
        
        // Горизонтальные линии сетки
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
        
        // Стрелки на осях
        // Стрелка оси X
        ctx.beginPath();
        ctx.moveTo(width - 10, centerY - 5);
        ctx.lineTo(width, centerY);
        ctx.lineTo(width - 10, centerY + 5);
        ctx.fill();
        
        // Стрелка оси Y
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
        
        // Разметка на осях
        ctx.font = '12px Arial';
        ctx.fillStyle = '#666';
        
        // Разметка оси X
        for (let i = -5; i <= 5; i++) {
            if (i === 0) continue;
            const x = centerX + i * 50;
            ctx.beginPath();
            ctx.moveTo(x, centerY - 5);
            ctx.lineTo(x, centerY + 5);
            ctx.stroke();
            ctx.fillText(i.toString(), x - 5, centerY + 20);
        }
        
        // Разметка оси Y
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
        const canvas = document.getElementById('lineCanvas');
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        const centerX = width / 2;
        const centerY = height / 2;
        
        // Получаем координаты точек
        const x1 = parseFloat(document.getElementById('pointAx').value);
        const y1 = parseFloat(document.getElementById('pointAy').value);
        const x2 = parseFloat(document.getElementById('pointBx').value);
        const y2 = parseFloat(document.getElementById('pointBy').value);
        
        if (isNaN(x1) || isNaN(y1) || isNaN(x2) || isNaN(y2)) {
            alert('Введите координаты обеих точек');
            return;
        }
        
        // Проверяем, что точки не совпадают
        if (Math.abs(x1 - x2) < 0.001 && Math.abs(y1 - y2) < 0.001) {
            alert('Точки не должны совпадать');
            return;
        }
        
        // Пересчитываем координаты для canvas
        const canvasX1 = centerX + x1 * 50;
        const canvasY1 = centerY - y1 * 50;
        const canvasX2 = centerX + x2 * 50;
        const canvasY2 = centerY - y2 * 50;
        
        // Очищаем и рисуем оси
        drawAxes(ctx, width, height);
        
        // Рисуем точки
        ctx.fillStyle = '#e74c3c';
        ctx.beginPath();
        ctx.arc(canvasX1, canvasY1, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#3498db';
        ctx.beginPath();
        ctx.arc(canvasX2, canvasY2, 6, 0, Math.PI * 2);
        ctx.fill();
        
        // Подписи точек
        ctx.font = '14px Arial';
        ctx.fillStyle = '#e74c3c';
        ctx.fillText(`A(${x1}, ${y1})`, canvasX1 + 10, canvasY1 - 10);
        ctx.fillStyle = '#3498db';
        ctx.fillText(`B(${x2}, ${y2})`, canvasX2 + 10, canvasY2 - 10);
        
        // Вычисляем уравнение прямой
        let equation, slope, intercept;
        
        if (Math.abs(x2 - x1) > 0.001) {
            // Прямая не вертикальная
            slope = (y2 - y1) / (x2 - x1);
            intercept = y1 - slope * x1;
            
            // Уравнение в разных формах
            if (Math.abs(slope - 1) < 0.001) {
                equation = `y = x ${intercept >= 0 ? '+' : ''}${formatNumber(intercept)}`;
            } else if (Math.abs(slope) < 0.001) {
                equation = `y = ${formatNumber(intercept)}`;
            } else {
                equation = `y = ${formatNumber(slope)}x ${intercept >= 0 ? '+' : ''}${formatNumber(intercept)}`;
            }
            
            // Рисуем линию
            const startX = -5;
            const endX = 5;
            const startY = slope * startX + intercept;
            const endY = slope * endX + intercept;
            
            const canvasStartX = centerX + startX * 50;
            const canvasStartY = centerY - startY * 50;
            const canvasEndX = centerX + endX * 50;
            const canvasEndY = centerY - endY * 50;
            
            ctx.strokeStyle = '#27ae60';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(canvasStartX, canvasStartY);
            ctx.lineTo(canvasEndX, canvasEndY);
            ctx.stroke();
            
        } else {
            // Вертикальная прямая
            equation = `x = ${formatNumber(x1)}`;
            
            // Рисуем вертикальную линию
            ctx.strokeStyle = '#27ae60';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(canvasX1, 0);
            ctx.lineTo(canvasX1, height);
            ctx.stroke();
        }
        
        // Выводим уравнение
        const equationDiv = document.getElementById('lineEquation');
        equationDiv.innerHTML = `
            <p><strong>Уравнение прямой через точки A и B:</strong></p>
            <div class="katex-equation">${equation}</div>
            <p>Общий вид: ${getGeneralEquation(x1, y1, x2, y2)}</p>
            <p>Канонический вид: ${getCanonicalEquation(x1, y1, x2, y2)}</p>
        `;
        
        // Рендерим KaTeX
        renderMath();
    }
    
    function getGeneralEquation(x1, y1, x2, y2) {
        // Уравнение в общем виде: (y2 - y1)x - (x2 - x1)y + (x2*y1 - x1*y2) = 0
        const A = y2 - y1;
        const B = -(x2 - x1);
        const C = x2 * y1 - x1 * y2;
        
        return `${formatNumber(A)}x ${formatNumberWithSign(B)}y ${formatNumberWithSign(C)} = 0`;
    }
    
    function getCanonicalEquation(x1, y1, x2, y2) {
        if (Math.abs(x2 - x1) < 0.001) {
            return `x = ${formatNumber(x1)}`;
        }
        
        if (Math.abs(y2 - y1) < 0.001) {
            return `y = ${formatNumber(y1)}`;
        }
        
        return `\\frac{x ${formatNumberWithSign(-x1)}}{${formatNumber(x2 - x1)}} = \\frac{y ${formatNumberWithSign(-y1)}}{${formatNumber(y2 - y1)}}`;
    }
    
    function clearGraph() {
        const canvas = document.getElementById('lineCanvas');
        const ctx = canvas.getContext('2d');
        
        // Очищаем и рисуем только оси
        drawAxes(ctx, canvas.width, canvas.height);
        
        // Очищаем уравнение
        document.getElementById('lineEquation').innerHTML = '<p>Введите координаты точек</p>';
    }
    
    // Инициализируем график при загрузке
    initCanvas();
    
    // Автоматическое преобразование при загрузке страницы (пример)
    setTimeout(() => {
        if (document.getElementById('coefA').value !== '') {
            performConversion();
        }
    }, 500);
    
    // Инициализация KaTeX после загрузки страницы
    setTimeout(() => {
        if (typeof katex !== 'undefined') {
            renderMath();
        }
    }, 100);
});