// script.js
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация KaTeX
    renderMath();
    
    // Инициализация меню
    initMenu();
    
    // Инициализация навигации по слайдам
    initSlideNavigation();
    
    // Инициализация конвертера уравнений
    initConverter();
    
    // Инициализация программы для прямой через 2 точки
    initTwoPointsApp();
    
    // Инициализация вкладок с кодом
    initCodeTabs();
});

// Рендеринг математических формул с помощью KaTeX
function renderMath() {
    // Титульный слайд
    katex.renderToString("Ax + By + C = 0", document.getElementById('title-math'), {
        throwOnError: false
    });
    
    // Определение
    katex.renderToString("F(x, y) = 0", document.getElementById('def-math'), {
        throwOnError: false
    });
    
    // Общее уравнение
    katex.renderToString("Ax + By + C = 0", document.getElementById('general-eq'), {
        throwOnError: false
    });
    
    // Уравнение через 2 точки
    katex.renderToString("\\frac{x - x_1}{x_2 - x_1} = \\frac{y - y_1}{y_2 - y_1}", document.getElementById('two-points-eq'), {
        throwOnError: false
    });
    
    katex.renderToString("\\frac{x - 1}{4 - 1} = \\frac{y - 2}{5 - 2}", document.getElementById('two-points-example'), {
        throwOnError: false
    });
    
    // Каноническое уравнение
    katex.renderToString("\\frac{x - x_0}{l} = \\frac{y - y_0}{m}", document.getElementById('canonical-eq'), {
        throwOnError: false
    });
    
    katex.renderToString("\\frac{x - 2}{3} = \\frac{y - 1}{4}", document.getElementById('canonical-example'), {
        throwOnError: false
    });
    
    // Параметрическое уравнение
    katex.renderToString("\\begin{cases} x = x_0 + lt \\\\ y = y_0 + mt \\end{cases}, \\quad t \\in \\mathbb{R}", document.getElementById('parametric-eq'), {
        throwOnError: false,
        displayMode: true
    });
    
    katex.renderToString("\\begin{cases} x = 1 + 2t \\\\ y = -1 + 3t \\end{cases}, \\quad t \\in \\mathbb{R}", document.getElementById('parametric-example'), {
        throwOnError: false,
        displayMode: true
    });
    
    // Автоматический рендеринг KaTeX на всем документе
    renderMathInDocument();
}

// Инициализация меню
function initMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const slideMenu = document.querySelector('.slide-menu');
    const slidesContainer = document.querySelector('.slides-container');
    const menuLinks = document.querySelectorAll('.menu-link');
    
    menuToggle.addEventListener('click', function() {
        slideMenu.classList.toggle('active');
        slidesContainer.classList.toggle('menu-open');
        menuToggle.innerHTML = slideMenu.classList.contains('active') ? 
            '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    });
    
    // Закрытие меню при клике на ссылку
    menuLinks.forEach(link => {
        link.addEventListener('click', function() {
            slideMenu.classList.remove('active');
            slidesContainer.classList.remove('menu-open');
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });
}

// Инициализация навигации по слайдам
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
    totalSlidesElement.textContent = totalSlides;
    
    // Функция для показа слайда
    function showSlide(index) {
        // Скрываем все слайды
        slides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        // Показываем выбранный слайд
        slides[index].classList.add('active');
        
        // Обновляем счетчик
        currentSlideIndex = index;
        currentSlideElement.textContent = index + 1;
        
        // Обновляем активную ссылку в меню
        menuLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        if (menuLinks[index]) {
            menuLinks[index].classList.add('active');
        }
        
        // Прокручиваем к началу слайда
        slides[index].scrollTop = 0;
    }
    
    // Кнопка "назад"
    prevBtn.addEventListener('click', function() {
        if (currentSlideIndex > 0) {
            showSlide(currentSlideIndex - 1);
        }
    });
    
    // Кнопка "вперед"
    nextBtn.addEventListener('click', function() {
        if (currentSlideIndex < totalSlides - 1) {
            showSlide(currentSlideIndex + 1);
        }
    });
    
    // Навигация с клавиатуры
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
            if (currentSlideIndex > 0) {
                showSlide(currentSlideIndex - 1);
            }
        } else if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
            if (currentSlideIndex < totalSlides - 1) {
                showSlide(currentSlideIndex + 1);
            }
        } else if (e.key === 'Home') {
            showSlide(0);
        } else if (e.key === 'End') {
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

// Инициализация конвертера уравнений
function initConverter() {
    const sourceType = document.getElementById('source-type');
    const targetType = document.getElementById('target-type');
    const convertBtn = document.getElementById('convert-btn');
    const generalInputs = document.getElementById('general-inputs');
    const canonicalInputs = document.getElementById('canonical-inputs');
    const parametricInputs = document.getElementById('parametric-inputs');
    
    // Показать/скрыть соответствующие поля ввода
    sourceType.addEventListener('change', function() {
        generalInputs.style.display = 'none';
        canonicalInputs.style.display = 'none';
        parametricInputs.style.display = 'none';
        
        if (sourceType.value === 'general') {
            generalInputs.style.display = 'block';
        } else if (sourceType.value === 'canonical') {
            canonicalInputs.style.display = 'block';
        } else if (sourceType.value === 'parametric') {
            parametricInputs.style.display = 'block';
        }
        
        updateSourceEquation();
    });
    
    // Обновление исходного уравнения при изменении значений
    document.querySelectorAll('#general-inputs input, #canonical-inputs input, #parametric-inputs input').forEach(input => {
        input.addEventListener('input', updateSourceEquation);
    });
    
    // Кнопка преобразования
    convertBtn.addEventListener('click', performConversion);
    
    // Инициализация отображения исходного уравнения
    updateSourceEquation();
    
    // Функция обновления отображения исходного уравнения
    function updateSourceEquation() {
        const sourceEqElement = document.getElementById('source-equation');
        let equation = '';
        
        if (sourceType.value === 'general') {
            const A = parseFloat(document.getElementById('input-A').value) || 0;
            const B = parseFloat(document.getElementById('input-B').value) || 0;
            const C = parseFloat(document.getElementById('input-C').value) || 0;
            
            equation = `${formatCoefficient(A)}x ${formatSignedCoefficient(B)}y ${formatSignedCoefficient(C)} = 0`;
            
        } else if (sourceType.value === 'canonical') {
            const x0 = parseFloat(document.getElementById('input-x0').value) || 0;
            const y0 = parseFloat(document.getElementById('input-y0').value) || 0;
            const l = parseFloat(document.getElementById('input-l').value) || 1;
            const m = parseFloat(document.getElementById('input-m').value) || 1;
            
            equation = `\\frac{x ${formatSignedNumber(-x0)}}{${l}} = \\frac{y ${formatSignedNumber(-y0)}}{${m}}`;
            
        } else if (sourceType.value === 'parametric') {
            const x0 = parseFloat(document.getElementById('param-x0').value) || 0;
            const y0 = parseFloat(document.getElementById('param-y0').value) || 0;
            const l = parseFloat(document.getElementById('param-l').value) || 1;
            const m = parseFloat(document.getElementById('param-m').value) || 1;
            
            equation = `\\begin{cases} x = ${x0} ${formatSignedNumber(l)}t \\\\ y = ${y0} ${formatSignedNumber(m)}t \\end{cases}`;
        }
        
        // Рендерим с помощью KaTeX
        try {
            if (sourceType.value === 'parametric') {
                sourceEqElement.innerHTML = katex.renderToString(equation, { throwOnError: false, displayMode: true });
            } else {
                sourceEqElement.innerHTML = katex.renderToString(equation, { throwOnError: false });
            }
        } catch (e) {
            sourceEqElement.textContent = equation;
        }
    }
    
    // Функция выполнения преобразования
    function performConversion() {
        const sourceTypeVal = sourceType.value;
        const targetTypeVal = targetType.value;
        const resultEqElement = document.getElementById('result-equation');
        const stepsElement = document.getElementById('conversion-steps');
        
        let result = '';
        let steps = '';
        
        try {
            if (sourceTypeVal === 'general' && targetTypeVal === 'general') {
                result = "Исходное и целевое уравнения совпадают";
                steps = "Преобразование не требуется.";
            } 
            else if (sourceTypeVal === 'general' && targetTypeVal === 'canonical') {
                const A = parseFloat(document.getElementById('input-A').value) || 0;
                const B = parseFloat(document.getElementById('input-B').value) || 0;
                const C = parseFloat(document.getElementById('input-C').value) || 0;
                
                // Находим точку на прямой
                let x0, y0;
                if (A !== 0) {
                    y0 = 0;
                    x0 = -C / A;
                    steps += `1. Принимаем y = 0, тогда x = -C/A = ${formatNumber(-C/A)}<br>`;
                    steps += `   Получаем точку M<sub>0</sub>(${formatNumber(x0)}, ${formatNumber(y0)})<br>`;
                } else {
                    x0 = 0;
                    y0 = -C / B;
                    steps += `1. Принимаем x = 0, тогда y = -C/B = ${formatNumber(-C/B)}<br>`;
                    steps += `   Получаем точку M<sub>0</sub>(${formatNumber(x0)}, ${formatNumber(y0)})<br>`;
                }
                
                // Направляющий вектор
                let l = B;
                let m = -A;
                
                // Нормализуем вектор (делим на НОД)
                let gcdVal = gcd(l, m);
                if (gcdVal !== 0) {
                    l /= gcdVal;
                    m /= gcdVal;
                    steps += `2. Направляющий вектор: s = (-B, A) = (${formatNumber(B)}, ${formatNumber(-A)})<br>`;
                    steps += `   После упрощения: s = (${formatNumber(l)}, ${formatNumber(m)})<br>`;
                } else {
                    steps += `2. Направляющий вектор: s = (-B, A) = (${formatNumber(l)}, ${formatNumber(m)})<br>`;
                }
                
                result = `\\frac{x ${formatSignedNumber(-x0)}}{${formatNumber(l)}} = \\frac{y ${formatSignedNumber(-y0)}}{${formatNumber(m)}}`;
                
            } 
            else if (sourceTypeVal === 'general' && targetTypeVal === 'parametric') {
                const A = parseFloat(document.getElementById('input-A').value) || 0;
                const B = parseFloat(document.getElementById('input-B').value) || 0;
                const C = parseFloat(document.getElementById('input-C').value) || 0;
                
                // Находим точку на прямой
                let x0, y0;
                if (A !== 0) {
                    y0 = 0;
                    x0 = -C / A;
                    steps += `1. Принимаем y = 0, тогда x = -C/A = ${formatNumber(-C/A)}<br>`;
                } else {
                    x0 = 0;
                    y0 = -C / B;
                    steps += `1. Принимаем x = 0, тогда y = -C/B = ${formatNumber(-C/B)}<br>`;
                }
                
                steps += `   Получаем точку M<sub>0</sub>(${formatNumber(x0)}, ${formatNumber(y0)})<br>`;
                
                // Направляющий вектор
                let l = B;
                let m = -A;
                
                // Нормализуем вектор (делим на НОД)
                let gcdVal = gcd(l, m);
                if (gcdVal !== 0) {
                    l /= gcdVal;
                    m /= gcdVal;
                    steps += `2. Направляющий вектор: s = (-B, A) = (${formatNumber(B)}, ${formatNumber(-A)})<br>`;
                    steps += `   После упрощения: s = (${formatNumber(l)}, ${formatNumber(m)})<br>`;
                } else {
                    steps += `2. Направляющий вектор: s = (-B, A) = (${formatNumber(l)}, ${formatNumber(m)})<br>`;
                }
                
                result = `\\begin{cases} x = ${formatNumber(x0)} ${formatSignedNumber(l)}t \\\\ y = ${formatNumber(y0)} ${formatSignedNumber(m)}t \\end{cases}`;
                
            }
            else if (sourceTypeVal === 'canonical' && targetTypeVal === 'general') {
                const x0 = parseFloat(document.getElementById('input-x0').value) || 0;
                const y0 = parseFloat(document.getElementById('input-y0').value) || 0;
                const l = parseFloat(document.getElementById('input-l').value) || 1;
                const m = parseFloat(document.getElementById('input-m').value) || 1;
                
                steps += `1. Из канонического уравнения: ${m}(x ${formatSignedNumber(-x0)}) = ${l}(y ${formatSignedNumber(-y0)})<br>`;
                
                const A = m;
                const B = -l;
                const C = -m*x0 + l*y0;
                
                steps += `2. Раскрываем скобки: ${formatNumber(A)}x ${formatSignedNumber(B)}y ${formatSignedNumber(C)} = 0<br>`;
                
                result = `${formatCoefficient(A)}x ${formatSignedCoefficient(B)}y ${formatSignedCoefficient(C)} = 0`;
                
            }
            else if (sourceTypeVal === 'canonical' && targetTypeVal === 'parametric') {
                const x0 = parseFloat(document.getElementById('input-x0').value) || 0;
                const y0 = parseFloat(document.getElementById('input-y0').value) || 0;
                const l = parseFloat(document.getElementById('input-l').value) || 1;
                const m = parseFloat(document.getElementById('input-m').value) || 1;
                
                steps += `1. Приравниваем каждую дробь к параметру t:<br>`;
                steps += `   \\frac{x ${formatSignedNumber(-x0)}}{${l}} = t и \\frac{y ${formatSignedNumber(-y0)}}{${m}} = t<br>`;
                steps += `2. Выражаем x и y через t:<br>`;
                
                result = `\\begin{cases} x = ${formatNumber(x0)} ${formatSignedNumber(l)}t \\\\ y = ${formatNumber(y0)} ${formatSignedNumber(m)}t \\end{cases}`;
                
            }
            else if (sourceTypeVal === 'parametric' && targetTypeVal === 'canonical') {
                const x0 = parseFloat(document.getElementById('param-x0').value) || 0;
                const y0 = parseFloat(document.getElementById('param-y0').value) || 0;
                const l = parseFloat(document.getElementById('param-l').value) || 1;
                const m = parseFloat(document.getElementById('param-m').value) || 1;
                
                steps += `1. Из параметрических уравнений выражаем t:<br>`;
                steps += `   t = \\frac{x ${formatSignedNumber(-x0)}}{${l}}<br>`;
                steps += `   t = \\frac{y ${formatSignedNumber(-y0)}}{${m}}<br>`;
                steps += `2. Приравниваем выражения для t:<br>`;
                
                result = `\\frac{x ${formatSignedNumber(-x0)}}{${formatNumber(l)}} = \\frac{y ${formatSignedNumber(-y0)}}{${formatNumber(m)}}`;
                
            }
            else if (sourceTypeVal === 'parametric' && targetTypeVal === 'general') {
                const x0 = parseFloat(document.getElementById('param-x0').value) || 0;
                const y0 = parseFloat(document.getElementById('param-y0').value) || 0;
                const l = parseFloat(document.getElementById('param-l').value) || 1;
                const m = parseFloat(document.getElementById('param-m').value) || 1;
                
                steps += `1. Из первого уравнения: t = \\frac{x ${formatSignedNumber(-x0)}}{${l}}<br>`;
                steps += `2. Подставляем во второе уравнение:<br>`;
                steps += `   y = ${y0} + ${m} \\cdot \\frac{x ${formatSignedNumber(-x0)}}{${l}}<br>`;
                
                const A = m;
                const B = -l;
                const C = -m*x0 + l*y0;
                
                steps += `3. Преобразуем к общему виду: ${formatCoefficient(A)}x ${formatSignedCoefficient(B)}y ${formatSignedCoefficient(C)} = 0<br>`;
                
                result = `${formatCoefficient(A)}x ${formatSignedCoefficient(B)}y ${formatSignedCoefficient(C)} = 0`;
                
            }
            else if (sourceTypeVal === 'canonical' && targetTypeVal === 'canonical') {
                result = "Исходное и целевое уравнения совпадают";
                steps = "Преобразование не требуется.";
            }
            else if (sourceTypeVal === 'parametric' && targetTypeVal === 'parametric') {
                result = "Исходное и целевое уравнения совпадают";
                steps = "Преобразование не требуется.";
            }
            
            // Рендерим результат с помощью KaTeX
            try {
                if (targetTypeVal === 'parametric') {
                    resultEqElement.innerHTML = katex.renderToString(result, { throwOnError: false, displayMode: true });
                } else {
                    resultEqElement.innerHTML = katex.renderToString(result, { throwOnError: false });
                }
            } catch (e) {
                resultEqElement.textContent = result;
            }
            
            stepsElement.innerHTML = steps;
            
        } catch (error) {
            resultEqElement.textContent = "Ошибка преобразования: " + error.message;
            stepsElement.textContent = "";
        }
    }
    
    // Вспомогательные функции для форматирования
    function formatNumber(num) {
        if (Math.abs(num) < 0.0001) return "0";
        if (Math.abs(num - Math.round(num)) < 0.0001) {
            return Math.round(num).toString();
        }
        return num.toFixed(2);
    }
    
    function formatSignedNumber(num) {
        if (num >= 0) return `+ ${formatNumber(num)}`;
        return `- ${formatNumber(Math.abs(num))}`;
    }
    
    function formatCoefficient(num) {
        if (Math.abs(num - 1) < 0.0001) return "";
        if (Math.abs(num + 1) < 0.0001) return "-";
        return formatNumber(num);
    }
    
    function formatSignedCoefficient(num) {
        if (num >= 0) return `+ ${formatCoefficient(num)}`;
        return `- ${formatCoefficient(Math.abs(num))}`;
    }
    
    // Функция для нахождения НОД
    function gcd(a, b) {
        a = Math.abs(a);
        b = Math.abs(b);
        
        if (a < 0.0001 && b < 0.0001) return 0;
        if (a < 0.0001) return b;
        if (b < 0.0001) return a;
        
        // Используем алгоритм Евклида
        while (Math.abs(b) > 0.0001) {
            let temp = b;
            b = a % b;
            a = temp;
        }
        return a;
    }
}

// Инициализация программы для прямой через 2 точки
function initTwoPointsApp() {
    const calculateBtn = document.getElementById('calculate-line');
    const point1x = document.getElementById('point1-x');
    const point1y = document.getElementById('point1-y');
    const point2x = document.getElementById('point2-x');
    const point2y = document.getElementById('point2-y');
    
    // Обработчик кнопки расчета
    calculateBtn.addEventListener('click', calculateLineEquation);
    
    // Обработчики изменений значений
    [point1x, point1y, point2x, point2y].forEach(input => {
        input.addEventListener('input', calculateLineEquation);
    });
    
    // Инициализация при загрузке
    calculateLineEquation();
    
    function calculateLineEquation() {
        try {
            const x1 = parseFloat(point1x.value) || 0;
            const y1 = parseFloat(point1y.value) || 0;
            const x2 = parseFloat(point2x.value) || 0;
            const y2 = parseFloat(point2y.value) || 0;
            
            // Проверка, что точки не совпадают
            if (Math.abs(x1 - x2) < 0.001 && Math.abs(y1 - y2) < 0.001) {
                throw new Error("Точки совпадают");
            }
            
            // Вычисляем коэффициенты для общего уравнения
            const A = y2 - y1;
            const B = x1 - x2;
            const C = x2 * y1 - x1 * y2;
            
            // Отображаем общее уравнение
            const generalFormElement = document.getElementById('general-form');
            const generalEq = `${formatCoefficient(A)}x ${formatSignedCoefficient(B)}y ${formatSignedCoefficient(C)} = 0`;
            generalFormElement.innerHTML = katex.renderToString(generalEq, { throwOnError: false });
            
            // Отображаем каноническое уравнение
            const canonicalFormElement = document.getElementById('canonical-form');
            const l = x2 - x1;
            const m = y2 - y1;
            const canonicalEq = `\\frac{x ${formatSignedNumber(-x1)}}{${formatNumber(l)}} = \\frac{y ${formatSignedNumber(-y1)}}{${formatNumber(m)}}`;
            canonicalFormElement.innerHTML = katex.renderToString(canonicalEq, { throwOnError: false });
            
            // Отображаем параметрическое уравнение
            const parametricFormElement = document.getElementById('parametric-form');
            const parametricEq = `\\begin{cases} x = ${formatNumber(x1)} ${formatSignedNumber(l)}t \\\\ y = ${formatNumber(y1)} ${formatSignedNumber(m)}t \\end{cases}`;
            parametricFormElement.innerHTML = katex.renderToString(parametricEq, { throwOnError: false, displayMode: true });
            
            // Отображаем основное уравнение
            const lineEquationElement = document.getElementById('line-equation');
            lineEquationElement.innerHTML = katex.renderToString(generalEq, { throwOnError: false });
            
            // Строим график
            createLineChart(x1, y1, x2, y2, A, B, C);
            
        } catch (error) {
            document.getElementById('general-form').textContent = "Ошибка: " + error.message;
            document.getElementById('canonical-form').textContent = "";
            document.getElementById('parametric-form').textContent = "";
            document.getElementById('line-equation').textContent = "Ошибка: " + error.message;
        }
    }
    
    // Функция для построения графика с использованием Chart.js
    function createLineChart(x1, y1, x2, y2, A, B, C) {
        const ctx = document.getElementById('line-chart').getContext('2d');
        
        // Рассчитываем точки для прямой
        const linePoints = [];
        const xMin = -10;
        const xMax = 10;
        
        if (Math.abs(B) > 0.001) {
            // Прямая не вертикальная
            for (let x = xMin; x <= xMax; x += 0.5) {
                let y = (-A * x - C) / B;
                linePoints.push({x, y});
            }
        } else {
            // Вертикальная прямая
            let x = -C / A;
            for (let y = xMin; y <= xMax; y += 0.5) {
                linePoints.push({x, y});
            }
        }
        
        // Подготавливаем данные для графика
        const data = {
            datasets: [
                {
                    label: 'Прямая',
                    data: linePoints,
                    borderColor: 'rgb(75, 192, 192)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderWidth: 2,
                    fill: false,
                    tension: 0,
                    pointRadius: 0
                },
                {
                    label: 'Точка A',
                    data: [{x: x1, y: y1}],
                    backgroundColor: 'rgb(255, 99, 132)',
                    borderColor: 'rgb(255, 99, 132)',
                    pointRadius: 8,
                    pointHoverRadius: 10
                },
                {
                    label: 'Точка B',
                    data: [{x: x2, y: y2}],
                    backgroundColor: 'rgb(54, 162, 235)',
                    borderColor: 'rgb(54, 162, 235)',
                    pointRadius: 8,
                    pointHoverRadius: 10
                }
            ]
        };
        
        // Настройки графика
        const config = {
            type: 'scatter',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        type: 'linear',
                        position: 'bottom',
                        min: -10,
                        max: 10,
                        grid: {
                            color: 'rgba(200, 200, 200, 0.3)'
                        },
                        ticks: {
                            stepSize: 2
                        }
                    },
                    y: {
                        min: -10,
                        max: 10,
                        grid: {
                            color: 'rgba(200, 200, 200, 0.3)'
                        },
                        ticks: {
                            stepSize: 2
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                label += '(' + context.parsed.x.toFixed(2) + 
                                        ', ' + context.parsed.y.toFixed(2) + ')';
                                return label;
                            }
                        }
                    }
                }
            }
        };
        
        // Создаем или обновляем график
        if (window.lineChart) {
            window.lineChart.destroy();
        }
        window.lineChart = new Chart(ctx, config);
    }
    
    // Вспомогательные функции для форматирования
    function formatNumber(num) {
        if (Math.abs(num) < 0.0001) return "0";
        if (Math.abs(num - Math.round(num)) < 0.0001) {
            return Math.round(num).toString();
        }
        return num.toFixed(2);
    }
    
    function formatSignedNumber(num) {
        if (num >= 0) return `+ ${formatNumber(num)}`;
        return `- ${formatNumber(Math.abs(num))}`;
    }
    
    function formatCoefficient(num) {
        if (Math.abs(num - 1) < 0.0001) return "";
        if (Math.abs(num + 1) < 0.0001) return "-";
        return formatNumber(num);
    }
    
    function formatSignedCoefficient(num) {
        if (num >= 0) return `+ ${formatCoefficient(num)}`;
        return `- ${formatCoefficient(Math.abs(num))}`;
    }
}

// Инициализация вкладок с кодом
function initCodeTabs() {
    const codeTabs = document.querySelectorAll('.code-tab');
    const codeBlocks = document.querySelectorAll('.code-block');
    
    codeTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Убираем активный класс у всех вкладок
            codeTabs.forEach(t => t.classList.remove('active'));
            // Добавляем активный класс текущей вкладке
            this.classList.add('active');
            
            // Скрываем все блоки с кодом
            codeBlocks.forEach(block => {
                block.classList.remove('active');
            });
            
            // Показываем выбранный блок с кодом
            document.getElementById(`${tabId}-code`).classList.add('active');
        });
    });
}

// Функция для автоматического рендеринга KaTeX на всем документе
function renderMathInDocument() {
    renderMathInElement(document.body, {
        delimiters: [
            {left: "$$", right: "$$", display: true},
            {left: "$", right: "$", display: false},
            {left: "\\(", right: "\\)", display: false},
            {left: "\\[", right: "\\]", display: true}
        ],
        throwOnError: false
    });
}
