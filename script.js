

document.addEventListener('DOMContentLoaded', function() {
    console.log('Презентация "Аналитическая геометрия" загружается...');
    
    // Инициализация всех компонентов
    initMenu();
    initSlideNavigation();
    initConverter();
    initTwoPointsApp();
    initCodeTabs();
    
    // Рендеринг математических формул
    setTimeout(renderMath, 100);
});

// ==================== МЕНЮ ====================
function initMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const slideMenu = document.querySelector('.slide-menu');
    const slidesContainer = document.querySelector('.slides-container');
    const menuLinks = document.querySelectorAll('.menu-link');
    
    if (!menuToggle || !slideMenu || !slidesContainer) {
        console.error('Не найдены элементы меню');
        return;
    }
    
    // Обработчик клика по кнопке меню
    menuToggle.addEventListener('click', function() {
        const isActive = slideMenu.classList.toggle('active');
        slidesContainer.classList.toggle('menu-open');
        menuToggle.innerHTML = isActive ? 
            '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
        
        console.log(`Меню ${isActive ? 'открыто' : 'закрыто'}`);
    });
    
    // Закрытие меню при клике на ссылку
    menuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            slideMenu.classList.remove('active');
            slidesContainer.classList.remove('menu-open');
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            
            console.log('Меню закрыто после клика по ссылке');
        });
    });
    
    console.log('Меню инициализировано');
}

// ==================== НАВИГАЦИЯ ПО СЛАЙДАМ ====================
function initSlideNavigation() {
    const slides = document.querySelectorAll('.slide');
    const totalSlides = slides.length;
    const currentSlideElement = document.getElementById('current-slide');
    const totalSlidesElement = document.getElementById('total-slides');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const menuLinks = document.querySelectorAll('.menu-link');
    
    if (slides.length === 0) {
        console.error('Слайды не найдены');
        return;
    }
    
    let currentSlideIndex = 0;
    
    // Устанавливаем общее количество слайдов
    if (totalSlidesElement) {
        totalSlidesElement.textContent = totalSlides;
        console.log(`Всего слайдов: ${totalSlides}`);
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
            dot.title = `Перейти к слайду ${i + 1}`;
            
            dot.addEventListener('click', function() {
                const slideIndex = parseInt(this.dataset.slide);
                console.log(`Клик по точке слайда ${slideIndex + 1}`);
                showSlide(slideIndex);
            });
            
            dotsContainer.appendChild(dot);
        }
        
        document.querySelector('.presentation-container').appendChild(dotsContainer);
        console.log('Навигация точками создана');
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
        
        // Если уже на этом слайде, ничего не делаем
        if (index === currentSlideIndex) return;
        
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
        
        console.log(`Переключено на слайд ${index + 1}`);
        
        // Обновляем уравнения на текущем слайде
        if (index === 16) { // Слайд с конвертером
            setTimeout(updateSourceEquation, 50);
        }
        if (index === 17) { // Слайд с программой через 2 точки
            setTimeout(calculateLineEquation, 50);
        }
    }
    
    // Кнопка "назад"
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            console.log('Кнопка "Назад" нажата');
            showSlide(currentSlideIndex - 1);
        });
    }
    
    // Кнопка "вперед"
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            console.log('Кнопка "Вперед" нажата');
            showSlide(currentSlideIndex + 1);
        });
    }
    
    // Навигация с клавиатуры
    document.addEventListener('keydown', function(e) {
        // Игнорируем нажатия клавиш в полях ввода
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA') {
            return;
        }
        
        switch(e.key) {
            case 'ArrowLeft':
            case 'PageUp':
                e.preventDefault();
                console.log(`Клавиша "${e.key}" нажата - перейти к предыдущему слайду`);
                showSlide(currentSlideIndex - 1);
                break;
                
            case 'ArrowRight':
            case 'PageDown':
            case ' ':
                e.preventDefault();
                console.log(`Клавиша "${e.key}" нажата - перейти к следующему слайду`);
                showSlide(currentSlideIndex + 1);
                break;
                
            case 'Home':
                e.preventDefault();
                console.log('Клавиша "Home" нажата - перейти к первому слайду');
                showSlide(0);
                break;
                
            case 'End':
                e.preventDefault();
                console.log('Клавиша "End" нажата - перейти к последнему слайду');
                showSlide(totalSlides - 1);
                break;
        }
    });
    
    // Навигация через меню
    menuLinks.forEach((link, index) => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            console.log(`Меню: переход к слайду ${index + 1}`);
            showSlide(index);
        });
    });
    
    // Инициализация первого слайда
    showSlide(0);
    console.log('Навигация по слайдам инициализирована');
}

// ==================== КОНВЕРТЕР УРАВНЕНИЙ ====================
function initConverter() {
    const sourceType = document.getElementById('source-type');
    const targetType = document.getElementById('target-type');
    const convertBtn = document.getElementById('convert-btn');
    
    if (!sourceType || !convertBtn) {
        console.log('Конвертер уравнений: элементы не найдены');
        return;
    }
    
    console.log('Инициализация конвертера уравнений...');
    
    // Показать/скрыть соответствующие поля ввода
    sourceType.addEventListener('change', function() {
        updateInputVisibility();
        updateSourceEquation();
    });
    
    // Обновление исходного уравнения при изменении значений
    const inputs = document.querySelectorAll('#general-inputs input, #canonical-inputs input, #parametric-inputs input');
    inputs.forEach(input => {
        input.addEventListener('input', updateSourceEquation);
    });
    
    // Кнопка преобразования
    convertBtn.addEventListener('click', performConversion);
    
    // Инициализация отображения
    updateInputVisibility();
    updateSourceEquation();
    
    console.log('Конвертер уравнений инициализирован');
    
    // Функция обновления видимости полей ввода
    function updateInputVisibility() {
        const generalInputs = document.getElementById('general-inputs');
        const canonicalInputs = document.getElementById('canonical-inputs');
        const parametricInputs = document.getElementById('parametric-inputs');
        
        if (generalInputs) generalInputs.style.display = 'none';
        if (canonicalInputs) canonicalInputs.style.display = 'none';
        if (parametricInputs) parametricInputs.style.display = 'none';
        
        if (sourceType.value === 'general' && generalInputs) {
            generalInputs.style.display = 'block';
        } else if (sourceType.value === 'canonical' && canonicalInputs) {
            canonicalInputs.style.display = 'block';
        } else if (sourceType.value === 'parametric' && parametricInputs) {
            parametricInputs.style.display = 'block';
        }
    }
    
    // Функция обновления отображения исходного уравнения
    function updateSourceEquation() {
        const sourceEqElement = document.getElementById('source-equation');
        if (!sourceEqElement) return;
        
        let equation = '';
        let displayMode = false;
        
        if (sourceType.value === 'general') {
            const A = parseFloat(document.getElementById('input-A')?.value) || 0;
            const B = parseFloat(document.getElementById('input-B')?.value) || 0;
            const C = parseFloat(document.getElementById('input-C')?.value) || 0;
            
            equation = `${formatCoefficient(A)}x ${formatSignedCoefficient(B)}y ${formatSignedCoefficient(C)} = 0`;
            
        } else if (sourceType.value === 'canonical') {
            const x0 = parseFloat(document.getElementById('input-x0')?.value) || 0;
            const y0 = parseFloat(document.getElementById('input-y0')?.value) || 0;
            const l = parseFloat(document.getElementById('input-l')?.value) || 1;
            const m = parseFloat(document.getElementById('input-m')?.value) || 1;
            
            equation = `\\frac{x ${formatSignedNumber(-x0)}}{${l}} = \\frac{y ${formatSignedNumber(-y0)}}{${m}}`;
            
        } else if (sourceType.value === 'parametric') {
            const x0 = parseFloat(document.getElementById('param-x0')?.value) || 0;
            const y0 = parseFloat(document.getElementById('param-y0')?.value) || 0;
            const l = parseFloat(document.getElementById('param-l')?.value) || 1;
            const m = parseFloat(document.getElementById('param-m')?.value) || 1;
            
            equation = `\\begin{cases} x = ${x0} ${formatSignedNumber(l)}t \\\\ y = ${y0} ${formatSignedNumber(m)}t \\end{cases}`;
            displayMode = true;
        }
        
        // Рендерим с помощью KaTeX
        try {
            katex.render(equation, sourceEqElement, { 
                throwOnError: false, 
                displayMode: displayMode 
            });
        } catch (e) {
            console.error('Ошибка рендеринга уравнения:', e);
            sourceEqElement.textContent = equation;
        }
    }
    
    // Функция выполнения преобразования
    function performConversion() {
        console.log('Выполнение преобразования уравнения...');
        
        const sourceTypeVal = sourceType.value;
        const targetTypeVal = targetType.value;
        const resultEqElement = document.getElementById('result-equation');
        const stepsElement = document.getElementById('conversion-steps');
        
        if (!resultEqElement) return;
        
        let result = '';
        let steps = '';
        let displayMode = false;
        
        try {
            if (sourceTypeVal === 'general' && targetTypeVal === 'general') {
                result = "Исходное и целевое уравнения совпадают";
                steps = "Преобразование не требуется.";
            } 
            else if (sourceTypeVal === 'general' && targetTypeVal === 'canonical') {
                const A = parseFloat(document.getElementById('input-A')?.value) || 0;
                const B = parseFloat(document.getElementById('input-B')?.value) || 0;
                const C = parseFloat(document.getElementById('input-C')?.value) || 0;
                
                // Находим точку на прямой
                let x0, y0;
                if (Math.abs(A) > 0.0001) {
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
                if (Math.abs(gcdVal) > 0.0001) {
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
                const A = parseFloat(document.getElementById('input-A')?.value) || 0;
                const B = parseFloat(document.getElementById('input-B')?.value) || 0;
                const C = parseFloat(document.getElementById('input-C')?.value) || 0;
                
                // Находим точку на прямой
                let x0, y0;
                if (Math.abs(A) > 0.0001) {
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
                if (Math.abs(gcdVal) > 0.0001) {
                    l /= gcdVal;
                    m /= gcdVal;
                    steps += `2. Направляющий вектор: s = (-B, A) = (${formatNumber(B)}, ${formatNumber(-A)})<br>`;
                    steps += `   После упрощения: s = (${formatNumber(l)}, ${formatNumber(m)})<br>`;
                } else {
                    steps += `2. Направляющий вектор: s = (-B, A) = (${formatNumber(l)}, ${formatNumber(m)})<br>`;
                }
                
                result = `\\begin{cases} x = ${formatNumber(x0)} ${formatSignedNumber(l)}t \\\\ y = ${formatNumber(y0)} ${formatSignedNumber(m)}t \\end{cases}`;
                displayMode = true;
                
            }
            else if (sourceTypeVal === 'canonical' && targetTypeVal === 'general') {
                const x0 = parseFloat(document.getElementById('input-x0')?.value) || 0;
                const y0 = parseFloat(document.getElementById('input-y0')?.value) || 0;
                const l = parseFloat(document.getElementById('input-l')?.value) || 1;
                const m = parseFloat(document.getElementById('input-m')?.value) || 1;
                
                steps += `1. Из канонического уравнения: ${m}(x ${formatSignedNumber(-x0)}) = ${l}(y ${formatSignedNumber(-y0)})<br>`;
                
                const A = m;
                const B = -l;
                const C = -m*x0 + l*y0;
                
                steps += `2. Раскрываем скобки: ${formatNumber(A)}x ${formatSignedNumber(B)}y ${formatSignedNumber(C)} = 0<br>`;
                
                result = `${formatCoefficient(A)}x ${formatSignedCoefficient(B)}y ${formatSignedCoefficient(C)} = 0`;
                
            }
            else if (sourceTypeVal === 'canonical' && targetTypeVal === 'parametric') {
                const x0 = parseFloat(document.getElementById('input-x0')?.value) || 0;
                const y0 = parseFloat(document.getElementById('input-y0')?.value) || 0;
                const l = parseFloat(document.getElementById('input-l')?.value) || 1;
                const m = parseFloat(document.getElementById('input-m')?.value) || 1;
                
                steps += `1. Приравниваем каждую дробь к параметру t:<br>`;
                steps += `   \\frac{x ${formatSignedNumber(-x0)}}{${l}} = t и \\frac{y ${formatSignedNumber(-y0)}}{${m}} = t<br>`;
                steps += `2. Выражаем x и y через t:<br>`;
                
                result = `\\begin{cases} x = ${formatNumber(x0)} ${formatSignedNumber(l)}t \\\\ y = ${formatNumber(y0)} ${formatSignedNumber(m)}t \\end{cases}`;
                displayMode = true;
                
            }
            else if (sourceTypeVal === 'parametric' && targetTypeVal === 'canonical') {
                const x0 = parseFloat(document.getElementById('param-x0')?.value) || 0;
                const y0 = parseFloat(document.getElementById('param-y0')?.value) || 0;
                const l = parseFloat(document.getElementById('param-l')?.value) || 1;
                const m = parseFloat(document.getElementById('param-m')?.value) || 1;
                
                steps += `1. Из параметрических уравнений выражаем t:<br>`;
                steps += `   t = \\frac{x ${formatSignedNumber(-x0)}}{${l}}<br>`;
                steps += `   t = \\frac{y ${formatSignedNumber(-y0)}}{${m}}<br>`;
                steps += `2. Приравниваем выражения для t:<br>`;
                
                result = `\\frac{x ${formatSignedNumber(-x0)}}{${formatNumber(l)}} = \\frac{y ${formatSignedNumber(-y0)}}{${formatNumber(m)}}`;
                
            }
            else if (sourceTypeVal === 'parametric' && targetTypeVal === 'general') {
                const x0 = parseFloat(document.getElementById('param-x0')?.value) || 0;
                const y0 = parseFloat(document.getElementById('param-y0')?.value) || 0;
                const l = parseFloat(document.getElementById('param-l')?.value) || 1;
                const m = parseFloat(document.getElementById('param-m')?.value) || 1;
                
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
                katex.render(result, resultEqElement, { 
                    throwOnError: false, 
                    displayMode: displayMode 
                });
            } catch (e) {
                console.error('Ошибка рендеринга результата:', e);
                resultEqElement.textContent = result;
            }
            
            if (stepsElement) {
                stepsElement.innerHTML = steps;
            }
            
            console.log('Преобразование выполнено успешно');
            
        } catch (error) {
            console.error('Ошибка преобразования:', error);
            resultEqElement.textContent = "Ошибка преобразования: " + error.message;
            if (stepsElement) {
                stepsElement.textContent = "";
            }
        }
    }
}

// ==================== ПРОГРАММА: ПРЯМАЯ ЧЕРЕЗ 2 ТОЧКИ ====================
function initTwoPointsApp() {
    const calculateBtn = document.getElementById('calculate-line');
    
    if (!calculateBtn) {
        console.log('Программа "Прямая через 2 точки": элементы не найдены');
        return;
    }
    
    console.log('Инициализация программы "Прямая через 2 точки"...');
    
    // Обработчик кнопки расчета
    calculateBtn.addEventListener('click', function() {
        console.log('Кнопка "Найти уравнение" нажата');
        calculateLineEquation();
    });
    
    // Обработчики изменений значений
    const inputs = ['point1-x', 'point1-y', 'point2-x', 'point2-y'];
    inputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', calculateLineEquation);
        }
    });
    
    // Инициализация при загрузке
    calculateLineEquation();
    
    console.log('Программа "Прямая через 2 точки" инициализирована');
}

// Функция расчета уравнения прямой
function calculateLineEquation() {
    try {
        const x1 = parseFloat(document.getElementById('point1-x')?.value) || 0;
        const y1 = parseFloat(document.getElementById('point1-y')?.value) || 0;
        const x2 = parseFloat(document.getElementById('point2-x')?.value) || 0;
        const y2 = parseFloat(document.getElementById('point2-y')?.value) || 0;
        
        console.log(`Расчет прямой через точки: A(${x1}, ${y1}) и B(${x2}, ${y2})`);
        
        // Проверка, что точки не совпадают
        if (Math.abs(x1 - x2) < 0.001 && Math.abs(y1 - y2) < 0.001) {
            throw new Error("Точки совпадают");
        }
        
        // Вычисляем коэффициенты для общего уравнения
        const A = y2 - y1;
        const B = x1 - x2;
        const C = x2 * y1 - x1 * y2;
        
        console.log(`Коэффициенты: A=${A}, B=${B}, C=${C}`);
        
        // Отображаем общее уравнение
        const generalFormElement = document.getElementById('general-form');
        if (generalFormElement) {
            const generalEq = `${formatCoefficient(A)}x ${formatSignedCoefficient(B)}y ${formatSignedCoefficient(C)} = 0`;
            try {
                katex.render(generalEq, generalFormElement, { throwOnError: false });
            } catch (e) {
                generalFormElement.textContent = generalEq;
            }
        }
        
        // Отображаем каноническое уравнение
        const canonicalFormElement = document.getElementById('canonical-form');
        if (canonicalFormElement) {
            const l = x2 - x1;
            const m = y2 - y1;
            const canonicalEq = `\\frac{x ${formatSignedNumber(-x1)}}{${formatNumber(l)}} = \\frac{y ${formatSignedNumber(-y1)}}{${formatNumber(m)}}`;
            try {
                katex.render(canonicalEq, canonicalFormElement, { throwOnError: false });
            } catch (e) {
                canonicalFormElement.textContent = canonicalEq;
            }
        }
        
        // Отображаем параметрическое уравнение
        const parametricFormElement = document.getElementById('parametric-form');
        if (parametricFormElement) {
            const l = x2 - x1;
            const m = y2 - y1;
            const parametricEq = `\\begin{cases} x = ${formatNumber(x1)} ${formatSignedNumber(l)}t \\\\ y = ${formatNumber(y1)} ${formatSignedNumber(m)}t \\end{cases}`;
            try {
                katex.render(parametricEq, parametricFormElement, { throwOnError: false, displayMode: true });
            } catch (e) {
                parametricFormElement.textContent = parametricEq;
            }
        }
        
        // Отображаем основное уравнение
        const lineEquationElement = document.getElementById('line-equation');
        if (lineEquationElement) {
            const generalEq = `${formatCoefficient(A)}x ${formatSignedCoefficient(B)}y ${formatSignedCoefficient(C)} = 0`;
            try {
                katex.render(generalEq, lineEquationElement, { throwOnError: false });
            } catch (e) {
                lineEquationElement.textContent = generalEq;
            }
        }
        
        // Строим график
        createLineChart(x1, y1, x2, y2, A, B, C);
        
        console.log('Расчет уравнения выполнен успешно');
        
    } catch (error) {
        console.error('Ошибка расчета уравнения:', error);
        
        const generalFormElement = document.getElementById('general-form');
        if (generalFormElement) generalFormElement.textContent = "Ошибка: " + error.message;
        
        const canonicalFormElement = document.getElementById('canonical-form');
        if (canonicalFormElement) canonicalFormElement.textContent = "";
        
        const parametricFormElement = document.getElementById('parametric-form');
        if (parametricFormElement) parametricFormElement.textContent = "";
        
        const lineEquationElement = document.getElementById('line-equation');
        if (lineEquationElement) lineEquationElement.textContent = "Ошибка: " + error.message;
    }
}

// Функция для построения графика
function createLineChart(x1, y1, x2, y2, A, B, C) {
    const canvas = document.getElementById('line-chart');
    if (!canvas) {
        console.log('Canvas для графика не найден');
        return;
    }
    
    console.log('Построение графика...');
    
    // Рассчитываем точки для прямой
    const linePoints = [];
    const xMin = -10;
    const xMax = 10;
    
    if (Math.abs(B) > 0.001) {
        // Прямая не вертикальная
        for (let x = xMin; x <= xMax; x += 0.5) {
            let y = (-A * x - C) / B;
            if (y >= -10 && y <= 10) {
                linePoints.push({x, y});
            }
        }
    } else {
        // Вертикальная прямая
        let x = -C / A;
        for (let y = xMin; y <= xMax; y += 0.5) {
            linePoints.push({x, y});
        }
    }
    
    console.log(`Рассчитано ${linePoints.length} точек для графика`);
    
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
                    },
                    title: {
                        display: true,
                        text: 'Ось X'
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
                    },
                    title: {
                        display: true,
                        text: 'Ось Y'
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
    
    try {
        window.lineChart = new Chart(canvas, config);
        console.log('График построен успешно');
    } catch (error) {
        console.error('Ошибка построения графика:', error);
    }
}

// ==================== ВКЛАДКИ С КОДОМ ====================
function initCodeTabs() {
    const codeTabs = document.querySelectorAll('.code-tab');
    
    if (codeTabs.length === 0) {
        console.log('Вкладки с кодом не найдены');
        return;
    }
    
    console.log('Инициализация вкладок с кодом...');
    
    codeTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            console.log(`Переключение на вкладку: ${tabId}`);
            
            // Убираем активный класс у всех вкладок
            codeTabs.forEach(t => t.classList.remove('active'));
            
            // Добавляем активный класс текущей вкладке
            this.classList.add('active');
            
            // Скрываем все блоки с кодом
            const codeBlocks = document.querySelectorAll('.code-block');
            codeBlocks.forEach(block => {
                block.classList.remove('active');
            });
            
            // Показываем выбранный блок с кодом
            const targetBlock = document.getElementById(`${tabId}-code`);
            if (targetBlock) {
                targetBlock.classList.add('active');
            }
        });
    });
    
    console.log('Вкладки с кодом инициализированы');
}

// ==================== МАТЕМАТИЧЕСКИЕ ФОРМУЛЫ ====================
function renderMath() {
    console.log('Рендеринг математических формул...');
    
    try {
        // Титульный слайд
        if (document.getElementById('title-math')) {
            katex.render("Ax + By + C = 0", document.getElementById('title-math'), {
                throwOnError: false
            });
        }
        
        // Определение
        if (document.getElementById('def-math')) {
            katex.render("F(x, y) = 0", document.getElementById('def-math'), {
                throwOnError: false
            });
        }
        
        // Общее уравнение
        if (document.getElementById('general-eq')) {
            katex.render("Ax + By + C = 0", document.getElementById('general-eq'), {
                throwOnError: false
            });
        }
        
        // Уравнение через 2 точки
        if (document.getElementById('two-points-eq')) {
            katex.render("\\frac{x - x_1}{x_2 - x_1} = \\frac{y - y_1}{y_2 - y_1}", document.getElementById('two-points-eq'), {
                throwOnError: false
            });
        }
        
        if (document.getElementById('two-points-example')) {
            katex.render("\\frac{x - 1}{4 - 1} = \\frac{y - 2}{5 - 2}", document.getElementById('two-points-example'), {
                throwOnError: false
            });
        }
        
        // Каноническое уравнение
        if (document.getElementById('canonical-eq')) {
            katex.render("\\frac{x - x_0}{l} = \\frac{y - y_0}{m}", document.getElementById('canonical-eq'), {
                throwOnError: false
            });
        }
        
        if (document.getElementById('canonical-example')) {
            katex.render("\\frac{x - 2}{3} = \\frac{y - 1}{4}", document.getElementById('canonical-example'), {
                throwOnError: false
            });
        }
        
        // Параметрическое уравнение
        if (document.getElementById('parametric-eq')) {
            katex.render("\\begin{cases} x = x_0 + lt \\\\ y = y_0 + mt \\end{cases}, \\quad t \\in \\mathbb{R}", document.getElementById('parametric-eq'), {
                throwOnError: false,
                displayMode: true
            });
        }
        
        if (document.getElementById('parametric-example')) {
            katex.render("\\begin{cases} x = 1 + 2t \\\\ y = -1 + 3t \\end{cases}, \\quad t \\in \\mathbb{R}", document.getElementById('parametric-example'), {
                throwOnError: false,
                displayMode: true
            });
        }
        
        console.log('Математические формулы отрендерены');
        
    } catch (error) {
        console.error('Ошибка рендеринга математических формул:', error);
    }
}

// ==================== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ====================

// Форматирование чисел
function formatNumber(num) {
    if (Math.abs(num) < 0.0001) return "0";
    if (Math.abs(num - Math.round(num)) < 0.0001) {
        return Math.round(num).toString();
    }
    // Округляем до 2 знаков после запятой
    return parseFloat(num.toFixed(2)).toString();
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

// Функция для нахождения НОД (наибольшего общего делителя)
function gcd(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);
    
    if (a < 0.0001 && b < 0.0001) return 1;
    if (a < 0.0001) return b;
    if (b < 0.0001) return a;
    
    // Используем алгоритм Евклида
    while (Math.abs(b) > 0.0001) {
        const temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}

// ==================== ГЛОБАЛЬНЫЕ ФУНКЦИИ ====================
// Делаем функции доступными глобально для отладки
window.showSlide = function(index) {
    // Находим функцию через навигацию
    const slides = document.querySelectorAll('.slide');
    const totalSlides = slides.length;
    
    if (index >= 0 && index < totalSlides) {
        // Имитируем клик по соответствующей точке
        const dots = document.querySelectorAll('.dot');
        if (dots[index]) {
            dots[index].click();
        }
    }
};

window.updateSourceEquation = function() {
    // Перерисовываем исходное уравнение в конвертере
    const sourceEqElement = document.getElementById('source-equation');
    if (sourceEqElement) {
        const sourceType = document.getElementById('source-type');
        if (sourceType) {
            sourceType.dispatchEvent(new Event('change'));
        }
    }
};

window.calculateLineEquation = calculateLineEquation;

console.log('Script.js загружен и готов к работе');
