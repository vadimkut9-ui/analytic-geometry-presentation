document.addEventListener('DOMContentLoaded', function() {
    initMenu();
    initSlideNavigation();
    initConverter();
    initTwoPointsApp();
    initCodeTabs();
    setTimeout(renderMath, 100);
});

function initMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const slideMenu = document.querySelector('.slide-menu');
    const slidesContainer = document.querySelector('.slides-container');
    const menuLinks = document.querySelectorAll('.menu-link');
    
    if (!menuToggle || !slideMenu || !slidesContainer) return;
    
    menuToggle.addEventListener('click', function() {
        const isActive = slideMenu.classList.toggle('active');
        slidesContainer.classList.toggle('menu-open');
        menuToggle.innerHTML = isActive ? 
            '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    });
    
    menuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            slideMenu.classList.remove('active');
            slidesContainer.classList.remove('menu-open');
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });
}

function initSlideNavigation() {
    const slides = document.querySelectorAll('.slide');
    const totalSlides = slides.length;
    const currentSlideElement = document.getElementById('current-slide');
    const totalSlidesElement = document.getElementById('total-slides');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const menuLinks = document.querySelectorAll('.menu-link');
    
    if (slides.length === 0) return;
    
    let currentSlideIndex = 0;
    
    if (totalSlidesElement) {
        totalSlidesElement.textContent = totalSlides;
    }
    
    createDotsNavigation();
    
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
                showSlide(slideIndex);
            });
            
            dotsContainer.appendChild(dot);
        }
        
        document.querySelector('.presentation-container').appendChild(dotsContainer);
    }
    
    function updateActiveDot(index) {
        const dots = document.querySelectorAll('.dot');
        dots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        if (dots[index]) {
            dots[index].classList.add('active');
        }
    }
    
    function showSlide(index) {
        if (index < 0) index = 0;
        if (index >= totalSlides) index = totalSlides - 1;
        if (index === currentSlideIndex) return;
        
        slides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        slides[index].classList.add('active');
        currentSlideIndex = index;
        
        if (currentSlideElement) {
            currentSlideElement.textContent = index + 1;
        }
        
        menuLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        if (menuLinks[index]) {
            menuLinks[index].classList.add('active');
        }
        
        updateActiveDot(index);
        
        if (index === 15) {
            setTimeout(updateSourceEquation, 50);
        }
        if (index === 16) {
            setTimeout(calculateLineEquation, 50);
        }
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            showSlide(currentSlideIndex - 1);
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            showSlide(currentSlideIndex + 1);
        });
    }
    
    document.addEventListener('keydown', function(e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA') {
            return;
        }
        
        switch(e.key) {
            case 'ArrowLeft':
            case 'PageUp':
                e.preventDefault();
                showSlide(currentSlideIndex - 1);
                break;
                
            case 'ArrowRight':
            case 'PageDown':
            case ' ':
                e.preventDefault();
                showSlide(currentSlideIndex + 1);
                break;
                
            case 'Home':
                e.preventDefault();
                showSlide(0);
                break;
                
            case 'End':
                e.preventDefault();
                showSlide(totalSlides - 1);
                break;
        }
    });
    
    menuLinks.forEach((link, index) => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            showSlide(index);
        });
    });
    
    showSlide(0);
}

function initConverter() {
    const sourceType = document.getElementById('source-type');
    const targetType = document.getElementById('target-type');
    const convertBtn = document.getElementById('convert-btn');
    
    if (!sourceType || !convertBtn) return;
    
    sourceType.addEventListener('change', function() {
        updateInputVisibility();
        updateSourceEquation();
    });
    
    const inputs = document.querySelectorAll('#general-inputs input, #canonical-inputs input, #parametric-inputs input');
    inputs.forEach(input => {
        input.addEventListener('input', updateSourceEquation);
    });
    
    convertBtn.addEventListener('click', performConversion);
    
    updateInputVisibility();
    updateSourceEquation();
    
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
        
        try {
            katex.render(equation, sourceEqElement, { 
                throwOnError: false, 
                displayMode: displayMode 
            });
        } catch (e) {
            sourceEqElement.textContent = equation;
        }
    }
    
    function performConversion() {
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
                
                let l = B;
                let m = -A;
                
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
                
                let l = B;
                let m = -A;
                
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
            
            try {
                katex.render(result, resultEqElement, { 
                    throwOnError: false, 
                    displayMode: displayMode 
                });
            } catch (e) {
                resultEqElement.textContent = result;
            }
            
            if (stepsElement) {
                stepsElement.innerHTML = steps;
            }
            
        } catch (error) {
            resultEqElement.textContent = "Ошибка преобразования: " + error.message;
            if (stepsElement) {
                stepsElement.textContent = "";
            }
        }
    }
}

function initTwoPointsApp() {
    const calculateBtn = document.getElementById('calculate-line');
    
    if (!calculateBtn) return;
    
    calculateBtn.addEventListener('click', function() {
        calculateLineEquation();
    });
    
    const inputs = ['point1-x', 'point1-y', 'point2-x', 'point2-y'];
    inputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', calculateLineEquation);
        }
    });
    
    calculateLineEquation();
}

function calculateLineEquation() {
    try {
        const x1 = parseFloat(document.getElementById('point1-x')?.value) || 0;
        const y1 = parseFloat(document.getElementById('point1-y')?.value) || 0;
        const x2 = parseFloat(document.getElementById('point2-x')?.value) || 0;
        const y2 = parseFloat(document.getElementById('point2-y')?.value) || 0;
        
        if (Math.abs(x1 - x2) < 0.001 && Math.abs(y1 - y2) < 0.001) {
            throw new Error("Точки совпадают");
        }
        
        const A = y2 - y1;
        const B = x1 - x2;
        const C = x2 * y1 - x1 * y2;
        
        const generalFormElement = document.getElementById('general-form');
        if (generalFormElement) {
            const generalEq = `${formatCoefficient(A)}x ${formatSignedCoefficient(B)}y ${formatSignedCoefficient(C)} = 0`;
            try {
                katex.render(generalEq, generalFormElement, { throwOnError: false });
            } catch (e) {
                generalFormElement.textContent = generalEq;
            }
        }
        
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
        
        const lineEquationElement = document.getElementById('line-equation');
        if (lineEquationElement) {
            const generalEq = `${formatCoefficient(A)}x ${formatSignedCoefficient(B)}y ${formatSignedCoefficient(C)} = 0`;
            try {
                katex.render(generalEq, lineEquationElement, { throwOnError: false });
            } catch (e) {
                lineEquationElement.textContent = generalEq;
            }
        }
        
        createLineChart(x1, y1, x2, y2, A, B, C);
        
    } catch (error) {
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

function createLineChart(x1, y1, x2, y2, A, B, C) {
    const canvas = document.getElementById('line-chart');
    if (!canvas) return;
    
    const linePoints = [];
    const xMin = -10;
    const xMax = 10;
    
    if (Math.abs(B) > 0.001) {
        for (let x = xMin; x <= xMax; x += 0.5) {
            let y = (-A * x - C) / B;
            if (y >= -10 && y <= 10) {
                linePoints.push({x, y});
            }
        }
    } else {
        let x = -C / A;
        for (let y = xMin; y <= xMax; y += 0.5) {
            linePoints.push({x, y});
        }
    }
    
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
    
    if (window.lineChart) {
        window.lineChart.destroy();
    }
    
    try {
        window.lineChart = new Chart(canvas, config);
    } catch (error) {
        console.error('Ошибка построения графика:', error);
    }
}

function initCodeTabs() {
    const codeTabs = document.querySelectorAll('.code-tab');
    
    if (codeTabs.length === 0) return;
    
    codeTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            codeTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            const codeBlocks = document.querySelectorAll('.code-block');
            codeBlocks.forEach(block => {
                block.classList.remove('active');
            });
            
            const targetBlock = document.getElementById(`${tabId}-code`);
            if (targetBlock) {
                targetBlock.classList.add('active');
            }
        });
    });
}

function renderMath() {
    try {
        if (document.getElementById('title-math')) {
            katex.render("Ax + By + C = 0", document.getElementById('title-math'), {
                throwOnError: false
            });
        }
        
        if (document.getElementById('def-math')) {
            katex.render("F(x, y) = 0", document.getElementById('def-math'), {
                throwOnError: false
            });
        }
        
        if (document.getElementById('general-eq')) {
            katex.render("Ax + By + C = 0", document.getElementById('general-eq'), {
                throwOnError: false
            });
        }
        
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
        
    } catch (error) {
        console.error('Ошибка рендеринга математических формул:', error);
    }
}

function formatNumber(num) {
    if (Math.abs(num) < 0.0001) return "0";
    if (Math.abs(num - Math.round(num)) < 0.0001) {
        return Math.round(num).toString();
    }
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

function gcd(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);
    
    if (a < 0.0001 && b < 0.0001) return 1;
    if (a < 0.0001) return b;
    if (b < 0.0001) return a;
    
    while (Math.abs(b) > 0.0001) {
        const temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}

window.showSlide = function(index) {
    const slides = document.querySelectorAll('.slide');
    const totalSlides = slides.length;
    
    if (index >= 0 && index < totalSlides) {
        const dots = document.querySelectorAll('.dot');
        if (dots[index]) {
            dots[index].click();
        }
    }
};

window.updateSourceEquation = function() {
    const sourceEqElement = document.getElementById('source-equation');
    if (sourceEqElement) {
        const sourceType = document.getElementById('source-type');
        if (sourceType) {
            sourceType.dispatchEvent(new Event('change'));
        }
    }
};

window.calculateLineEquation = calculateLineEquation;
