document.addEventListener('DOMContentLoaded', function() {
    initMenu();
    initSlideNavigation();
    initConverter();
    initTwoPointsApp();
    initCodeTabs();
    
    if (typeof katex !== 'undefined') {
        setTimeout(renderMath, 300);
    } else {
        setTimeout(function() {
            if (typeof katex !== 'undefined') {
                renderMath();
            }
        }, 1000);
    }
});

window.addEventListener('load', function() {
    initSwipeSupport();
    setTimeout(renderMath, 500);
    setTimeout(function() {
        if (typeof performConversion === 'function') performConversion();
        if (typeof calculateLineEquation === 'function') calculateLineEquation();
    }, 300);
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
        menuToggle.innerHTML = isActive ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
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
    let isAnimating = false;
    
    if (totalSlidesElement) totalSlidesElement.textContent = totalSlides;
    
    function showSlide(index, direction = 'auto') {
        if (isAnimating) return;
        if (index < 0) index = 0;
        if (index >= totalSlides) index = totalSlides - 1;
        if (index === currentSlideIndex) return;
        
        isAnimating = true;
        const currentSlide = slides[currentSlideIndex];
        const nextSlide = slides[index];
        
        if (direction === 'auto') direction = index > currentSlideIndex ? 'next' : 'prev';
        
        currentSlide.classList.add(direction === 'next' ? 'prev' : 'next');
        nextSlide.classList.add('active');
        
        if (direction === 'next') {
            nextSlide.style.transform = 'translateX(100%)';
            setTimeout(() => nextSlide.style.transform = 'translateX(0)', 10);
        } else {
            nextSlide.style.transform = 'translateX(-100%)';
            setTimeout(() => nextSlide.style.transform = 'translateX(0)', 10);
        }
        
        setTimeout(() => {
            currentSlide.classList.remove('active', 'prev', 'next');
            currentSlideIndex = index;
            if (currentSlideElement) currentSlideElement.textContent = index + 1;
            
            menuLinks.forEach(link => link.classList.remove('active'));
            if (menuLinks[index]) menuLinks[index].classList.add('active');
            
            isAnimating = false;
            renderMathOnSlide(index);
        }, 600);
    }
    
    function renderMathOnSlide(slideIndex) {
        setTimeout(() => {
            if (typeof katex !== 'undefined') {
                const slide = slides[slideIndex];
                const mathElements = slide.querySelectorAll('.math-block, .equation-display');
                mathElements.forEach(element => {
                    if (element.textContent && !element.querySelector('.katex')) {
                        try {
                            const isDisplayMode = element.classList.contains('math-block');
                            katex.render(element.textContent, element, {
                                throwOnError: false,
                                displayMode: isDisplayMode
                            });
                        } catch (e) {}
                    }
                });
            }
        }, 100);
    }
    
    if (prevBtn) prevBtn.addEventListener('click', function() {
        if (isAnimating) return;
        showSlide(currentSlideIndex - 1, 'prev');
    });
    
    if (nextBtn) nextBtn.addEventListener('click', function() {
        if (isAnimating) return;
        showSlide(currentSlideIndex + 1, 'next');
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA') return;
        if (isAnimating) return;
        
        switch(e.key) {
            case 'ArrowLeft':
            case 'PageUp':
                e.preventDefault();
                showSlide(currentSlideIndex - 1, 'prev');
                break;
            case 'ArrowRight':
            case 'PageDown':
            case ' ':
                e.preventDefault();
                showSlide(currentSlideIndex + 1, 'next');
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
            if (isAnimating) return;
            showSlide(index, 'click');
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
    
    targetType.addEventListener('change', function() {
        if (document.getElementById('source-equation').textContent.trim() !== '') {
            performConversion();
        }
    });
    
    const inputs = document.querySelectorAll('#general-inputs input, #canonical-inputs input, #parametric-inputs input');
    inputs.forEach(input => input.addEventListener('input', function() {
        updateSourceEquation();
        if (document.getElementById('source-equation').textContent.trim() !== '') {
            setTimeout(performConversion, 100);
        }
    }));
    
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
        
        if (sourceType.value === 'general' && generalInputs) generalInputs.style.display = 'block';
        else if (sourceType.value === 'canonical' && canonicalInputs) canonicalInputs.style.display = 'block';
        else if (sourceType.value === 'parametric' && parametricInputs) parametricInputs.style.display = 'block';
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
            
            if (Math.abs(l) < 0.001 && Math.abs(m) < 0.001) equation = "\\text{Ошибка: нулевой направляющий вектор}";
            else if (Math.abs(l) < 0.001) equation = `x = ${x0}`;
            else if (Math.abs(m) < 0.001) equation = `y = ${y0}`;
            else equation = `\\frac{x - ${formatNumber(x0)}}{${formatNumber(l)}} = \\frac{y - ${formatNumber(y0)}}{${formatNumber(m)}}`;
        } else if (sourceType.value === 'parametric') {
            const x0 = parseFloat(document.getElementById('param-x0')?.value) || 0;
            const y0 = parseFloat(document.getElementById('param-y0')?.value) || 0;
            const l = parseFloat(document.getElementById('param-l')?.value) || 1;
            const m = parseFloat(document.getElementById('param-m')?.value) || 1;
            equation = `\\begin{cases} x = ${formatNumber(x0)} ${formatSignedNumber(l)}t \\\\ y = ${formatNumber(y0)} ${formatSignedNumber(m)}t \\end{cases}`;
            displayMode = true;
        }
        
        try {
            sourceEqElement.innerHTML = '';
            katex.render(equation, sourceEqElement, { throwOnError: false, displayMode: displayMode });
        } catch (e) {
            sourceEqElement.textContent = equation;
        }
    }
    
    function performConversion() {
        const sourceTypeVal = sourceType.value;
        const targetTypeVal = targetType.value;
        const resultEqElement = document.getElementById('result-equation');
        if (!resultEqElement) return;
        
        let result = '';
        let displayMode = false;
        
        try {
            if (sourceTypeVal === targetTypeVal) {
                result = "Исходное и целевое уравнения совпадают";
            } else if (sourceTypeVal === 'general' && targetTypeVal === 'canonical') {
                const A = parseFloat(document.getElementById('input-A')?.value) || 0;
                const B = parseFloat(document.getElementById('input-B')?.value) || 0;
                const C = parseFloat(document.getElementById('input-C')?.value) || 0;
                
                if (Math.abs(A) < 0.0001 && Math.abs(B) < 0.0001) {
                    result = "\\text{Ошибка: A и B не могут быть одновременно нулями}";
                } else {
                    let x0, y0;
                    if (Math.abs(B) > 0.0001) {
                        x0 = 0;
                        y0 = -C / B;
                    } else {
                        y0 = 0;
                        x0 = -C / A;
                    }
                    
                    let l = -B;
                    let m = A;
                    let gcdVal = gcd(Math.abs(l), Math.abs(m));
                    if (gcdVal > 0.0001) { l /= gcdVal; m /= gcdVal; }
                    
                    if (Math.abs(l) < 0.001 && Math.abs(m) < 0.001) result = "\\text{Ошибка: нулевой направляющий вектор}";
                    else if (Math.abs(l) < 0.001) result = `x = ${formatNumber(x0)}`;
                    else if (Math.abs(m) < 0.001) result = `y = ${formatNumber(y0)}`;
                    else result = `\\frac{x - ${formatNumber(x0)}}{${formatNumber(l)}} = \\frac{y - ${formatNumber(y0)}}{${formatNumber(m)}}`;
                }
            } else if (sourceTypeVal === 'general' && targetTypeVal === 'parametric') {
                const A = parseFloat(document.getElementById('input-A')?.value) || 0;
                const B = parseFloat(document.getElementById('input-B')?.value) || 0;
                const C = parseFloat(document.getElementById('input-C')?.value) || 0;
                
                if (Math.abs(A) < 0.0001 && Math.abs(B) < 0.0001) {
                    result = "\\text{Ошибка: A и B не могут быть одновременно нулями}";
                } else {
                    let x0, y0;
                    if (Math.abs(B) > 0.0001) { x0 = 0; y0 = -C / B; } 
                    else { y0 = 0; x0 = -C / A; }
                    
                    let l = -B;
                    let m = A;
                    let gcdVal = gcd(Math.abs(l), Math.abs(m));
                    if (gcdVal > 0.0001) { l /= gcdVal; m /= gcdVal; }
                    
                    result = `\\begin{cases} x = ${formatNumber(x0)} ${formatSignedNumber(l)}t \\\\ y = ${formatNumber(y0)} ${formatSignedNumber(m)}t \\end{cases}`;
                    displayMode = true;
                }
            } else if (sourceTypeVal === 'canonical' && targetTypeVal === 'general') {
                const x0 = parseFloat(document.getElementById('input-x0')?.value) || 0;
                const y0 = parseFloat(document.getElementById('input-y0')?.value) || 0;
                const l = parseFloat(document.getElementById('input-l')?.value) || 1;
                const m = parseFloat(document.getElementById('input-m')?.value) || 1;
                
                if (Math.abs(l) < 0.001 && Math.abs(m) < 0.001) {
                    result = "\\text{Ошибка: нулевой направляющий вектор}";
                } else {
                    const A = m;
                    const B = -l;
                    const C = l*y0 - m*x0;
                    result = `${formatCoefficient(A)}x ${formatSignedCoefficient(B)}y ${formatSignedCoefficient(C)} = 0`;
                }
            } else if (sourceTypeVal === 'canonical' && targetTypeVal === 'parametric') {
                const x0 = parseFloat(document.getElementById('input-x0')?.value) || 0;
                const y0 = parseFloat(document.getElementById('input-y0')?.value) || 0;
                const l = parseFloat(document.getElementById('input-l')?.value) || 1;
                const m = parseFloat(document.getElementById('input-m')?.value) || 1;
                
                if (Math.abs(l) < 0.001 && Math.abs(m) < 0.001) result = "\\text{Ошибка: нулевой направляющий вектор}";
                else { result = `\\begin{cases} x = ${formatNumber(x0)} ${formatSignedNumber(l)}t \\\\ y = ${formatNumber(y0)} ${formatSignedNumber(m)}t \\end{cases}`; displayMode = true; }
            } else if (sourceTypeVal === 'parametric' && targetTypeVal === 'canonical') {
                const x0 = parseFloat(document.getElementById('param-x0')?.value) || 0;
                const y0 = parseFloat(document.getElementById('param-y0')?.value) || 0;
                const l = parseFloat(document.getElementById('param-l')?.value) || 1;
                const m = parseFloat(document.getElementById('param-m')?.value) || 1;
                
                if (Math.abs(l) < 0.001 && Math.abs(m) < 0.001) result = "\\text{Ошибка: нулевой направляющий вектор}";
                else if (Math.abs(l) < 0.001) result = `x = ${formatNumber(x0)}`;
                else if (Math.abs(m) < 0.001) result = `y = ${formatNumber(y0)}`;
                else result = `\\frac{x - ${formatNumber(x0)}}{${formatNumber(l)}} = \\frac{y - ${formatNumber(y0)}}{${formatNumber(m)}}`;
            } else if (sourceTypeVal === 'parametric' && targetTypeVal === 'general') {
                const x0 = parseFloat(document.getElementById('param-x0')?.value) || 0;
                const y0 = parseFloat(document.getElementById('param-y0')?.value) || 0;
                const l = parseFloat(document.getElementById('param-l')?.value) || 1;
                const m = parseFloat(document.getElementById('param-m')?.value) || 1;
                
                if (Math.abs(l) < 0.001 && Math.abs(m) < 0.001) result = "\\text{Ошибка: нулевой направляющий вектор}";
                else {
                    const A = m;
                    const B = -l;
                    const C = l*y0 - m*x0;
                    result = `${formatCoefficient(A)}x ${formatSignedCoefficient(B)}y ${formatSignedCoefficient(C)} = 0`;
                }
            }
            
            resultEqElement.innerHTML = '';
            try {
                katex.render(result, resultEqElement, { throwOnError: false, displayMode: displayMode });
            } catch (e) {
                resultEqElement.textContent = result;
            }
        } catch (error) {
            resultEqElement.textContent = "Ошибка преобразования: " + error.message;
        }
    }
}

function initTwoPointsApp() {
    const calculateBtn = document.getElementById('calculate-line');
    if (!calculateBtn) return;
    
    calculateBtn.addEventListener('click', calculateLineEquation);
    
    ['point1-x', 'point1-y', 'point2-x', 'point2-y'].forEach(id => {
        const input = document.getElementById(id);
        if (input) input.addEventListener('input', calculateLineEquation);
    });
    
    calculateLineEquation();
}

function calculateLineEquation() {
    try {
        const x1 = parseFloat(document.getElementById('point1-x')?.value) || 0;
        const y1 = parseFloat(document.getElementById('point1-y')?.value) || 0;
        const x2 = parseFloat(document.getElementById('point2-x')?.value) || 0;
        const y2 = parseFloat(document.getElementById('point2-y')?.value) || 0;
        
        if (Math.abs(x1 - x2) < 0.001 && Math.abs(y1 - y2) < 0.001) throw new Error("Точки совпадают");
        
        const A = y2 - y1;
        const B = x1 - x2;
        const C = x2 * y1 - x1 * y2;
        
        const generalFormElement = document.getElementById('general-form');
        if (generalFormElement) {
            const generalEq = `${formatCoefficient(A)}x ${formatSignedCoefficient(B)}y ${formatSignedCoefficient(C)} = 0`;
            generalFormElement.innerHTML = '';
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
            let canonicalEq;
            
            if (Math.abs(l) < 0.001 && Math.abs(m) < 0.001) canonicalEq = "\\text{Ошибка: точки совпадают}";
            else if (Math.abs(l) < 0.001) canonicalEq = `x = ${x1}`;
            else if (Math.abs(m) < 0.001) canonicalEq = `y = ${y1}`;
            else canonicalEq = `\\frac{x - ${formatNumber(x1)}}{${formatNumber(l)}} = \\frac{y - ${formatNumber(y1)}}{${formatNumber(m)}}`;
            
            canonicalFormElement.innerHTML = '';
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
            let parametricEq;
            
            if (Math.abs(l) < 0.001 && Math.abs(m) < 0.001) parametricEq = "\\text{Ошибка: точки совпадают}";
            else parametricEq = `\\begin{cases} x = ${formatNumber(x1)} ${formatSignedNumber(l)}t \\\\ y = ${formatNumber(y1)} ${formatSignedNumber(m)}t \\end{cases}`;
            
            parametricFormElement.innerHTML = '';
            try {
                katex.render(parametricEq, parametricFormElement, { throwOnError: false, displayMode: true });
            } catch (e) {
                parametricFormElement.textContent = parametricEq;
            }
        }
    } catch (error) {
        const generalFormElement = document.getElementById('general-form');
        if (generalFormElement) generalFormElement.textContent = "Ошибка: " + error.message;
        const canonicalFormElement = document.getElementById('canonical-form');
        if (canonicalFormElement) canonicalFormElement.textContent = "";
        const parametricFormElement = document.getElementById('parametric-form');
        if (parametricFormElement) parametricFormElement.textContent = "";
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
            
            document.querySelectorAll('.code-block').forEach(block => block.classList.remove('active'));
            const targetBlock = document.getElementById(`${tabId}-code`);
            if (targetBlock) targetBlock.classList.add('active');
        });
    });
}

function initSwipeSupport() {
    let startX = 0;
    let startY = 0;
    
    document.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    });
    
    document.addEventListener('touchend', function(e) {
        if (startX === 0 || startY === 0) return;
        
        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        const diffX = startX - endX;
        const diffY = startY - endY;
        
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 30) {
            const slides = document.querySelectorAll('.slide');
            const currentSlideIndex = Array.from(slides).findIndex(slide => slide.classList.contains('active'));
            
            if (diffX > 0 && currentSlideIndex < slides.length - 1) {
                const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
                document.dispatchEvent(event);
            } else if (diffX < 0 && currentSlideIndex > 0) {
                const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
                document.dispatchEvent(event);
            }
        }
        
        startX = 0;
        startY = 0;
    });
}

function renderMath() {
    try {
        const render = (id, content, displayMode = false) => {
            const element = document.getElementById(id);
            if (element) katex.render(content, element, { throwOnError: false, displayMode });
        };
        
        render('title-math', "Ax + By + C = 0");
        render('def-math', "F(x, y) = 0");
        render('origin-point', "O(0,0)");
        render('point-formula', "M(x, y)");
        render('distance-formula', "d = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}");
        render('line-equation', "F(x, y) = 0");
        render('general-eq', "Ax + By + C = 0");
        render('general-example', "2x - 3y + 6 = 0");
        render('two-points-eq', "\\frac{x - x_1}{x_2 - x_1} = \\frac{y - y_1}{y_2 - y_1}");
        render('two-points-example', "\\frac{x - 1}{3} = \\frac{y - 2}{3}");
        render('canonical-eq', "\\frac{x - x_0}{l} = \\frac{y - y_0}{m}");
        render('canonical-example', "\\frac{x - 2}{3} = \\frac{y - 1}{4}");
        render('parametric-eq', "\\begin{cases} x = x_0 + lt \\\\ y = y_0 + mt \\end{cases}, t \\in \\mathbb{R}", true);
        render('parametric-example', "\\begin{cases} x = 1 + 2t \\\\ y = -1 + 3t \\end{cases}, t \\in \\mathbb{R}", true);
        render('example10-1', "2x - 3y + 6 = 0");
        render('example10-2', "\\frac{x}{3} = \\frac{y - 2}{2}");
        render('example11-1', "2x - 3y + 6 = 0");
        render('example11-2', "\\begin{cases} x = 3t \\\\ y = 2 + 2t \\end{cases}", true);
        render('example12-1', "\\frac{x - 2}{3} = \\frac{y - 1}{4}");
        render('example12-2', "4(x - 2) = 3(y - 1)");
        render('example12-3', "4x - 8 = 3y - 3");
        render('example12-4', "4x - 3y - 5 = 0");
        render('example13-1', "\\frac{x - 2}{3} = \\frac{y - 1}{4}");
        render('example13-2', "\\begin{cases} x = 2 + 3t \\\\ y = 1 + 4t \\end{cases}", true);
        render('example14-1', "\\begin{cases} x = 1 + 2t \\\\ y = -1 + 3t \\end{cases}", true);
        render('example14-2', "\\frac{x - 1}{2} = \\frac{y + 1}{3}");
        render('example15-1', "\\begin{cases} x = 1 + 2t \\\\ y = -1 + 3t \\end{cases}", true);
        render('example15-2', "3x - 2y - 5 = 0");
    } catch (error) {}
}

function formatNumber(num) {
    if (Math.abs(num) < 0.0001) return "0";
    if (Math.abs(num - Math.round(num)) < 0.0001) return Math.round(num).toString();
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
