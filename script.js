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
    let isAnimating = false;
    
    if (totalSlidesElement) {
        totalSlidesElement.textContent = totalSlides;
    }
    
    function showSlide(index, direction = 'auto') {
        if (isAnimating) return;
        
        if (index < 0) index = 0;
        if (index >= totalSlides) index = totalSlides - 1;
        if (index === currentSlideIndex) return;
        
        isAnimating = true;
        
        const currentSlide = slides[currentSlideIndex];
        const nextSlide = slides[index];
        
        if (direction === 'auto') {
            direction = index > currentSlideIndex ? 'next' : 'prev';
        }
        
        currentSlide.classList.add(direction === 'next' ? 'prev' : 'next');
        nextSlide.classList.add('active');
        
        if (direction === 'next') {
            nextSlide.style.transform = 'translateX(100%)';
            setTimeout(() => {
                nextSlide.style.transform = 'translateX(0)';
            }, 10);
        } else {
            nextSlide.style.transform = 'translateX(-100%)';
            setTimeout(() => {
                nextSlide.style.transform = 'translateX(0)';
            }, 10);
        }
        
        setTimeout(() => {
            currentSlide.classList.remove('active', 'prev', 'next');
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
                        } catch (e) {
                        }
                    }
                });
            }
        }, 100);
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            if (isAnimating) return;
            showSlide(currentSlideIndex - 1, 'prev');
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            if (isAnimating) return;
            showSlide(currentSlideIndex + 1, 'next');
        });
    }
    
    document.addEventListener('keydown', function(e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA') {
            return;
        }
        
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
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            updateSourceEquation();
            if (document.getElementById('source-equation').textContent.trim() !== '') {
                setTimeout(performConversion, 100);
            }
        });
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
            
            if (Math.abs(l) < 0.001 && Math.abs(m) < 0.001) {
                equation = "\\text{Ошибка: нулевой направляющий вектор}";
            } else if (Math.abs(l) < 0.001) {
                equation = `x = ${x0}`;
            } else if (Math.abs(m) < 0.001) {
                equation = `y = ${y0}`;
            } else {
                equation = `\\frac{x - ${formatNumber(x0)}}{${formatNumber(l)}} = \\frac{y - ${formatNumber(y0)}}{${formatNumber(m)}}`;
            }
            
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
                    if (gcdVal > 0.0001) {
                        l /= gcdVal;
                        m /= gcdVal;
                    }
                    
                    if (Math.abs(l) < 0.001 && Math.abs(m) < 0.001) {
                        result = "\\text{Ошибка: нулевой направляющий вектор}";
                    } else if (Math.abs(l) < 0.001) {
                        result = `x = ${formatNumber(x0)}`;
                    } else if (Math.abs(m) < 0.001) {
                        result = `y = ${formatNumber(y0)}`;
                    } else {
                        result = `\\frac{x - ${formatNumber(x0)}}{${formatNumber(l)}} = \\frac{y - ${formatNumber(y0)}}{${formatNumber(m)}}`;
                    }
                }
                
            } else if (sourceTypeVal === 'general' && targetTypeVal === 'parametric') {
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
                    if (gcdVal > 0.0001) {
                        l /= gcdVal;
                        m /= gcdVal;
                    }
                    
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
                
                if (Math.abs(l) < 0.001 && Math.abs(m) < 0.001) {
                    result = "\\text{Ошибка: нулевой направляющий вектор}";
                } else {
                    result = `\\begin{cases} x = ${formatNumber(x0)} ${formatSignedNumber(l)}t \\\\ y = ${formatNumber(y0)} ${formatSignedNumber(m)}t \\end{cases}`;
                    displayMode = true;
                }
                
            } else if (sourceTypeVal === 'parametric' && targetTypeVal === 'canonical') {
                const x0 = parseFloat(document.getElementById('param-x0')?.value) || 0;
                const y0 = parseFloat(document.getElementById('param-y0')?.value) || 0;
                const l = parseFloat(document.getElementById('param-l')?.value) || 1;
                const m = parseFloat(document.getElementById('param-m')?.value) || 1;
                
                if (Math.abs(l) < 0.001 && Math.abs(m) < 0.001) {
                    result = "\\text{Ошибка: нулевой направляющий вектор}";
                } else if (Math.abs(l) < 0.001) {
                    result = `x = ${formatNumber(x0)}`;
                } else if (Math.abs(m) < 0.001) {
                    result = `y = ${formatNumber(y0)}`;
                } else {
                    result = `\\frac{x - ${formatNumber(x0)}}{${formatNumber(l)}} = \\frac{y - ${formatNumber(y0)}}{${formatNumber(m)}}`;
                }
                
            } else if (sourceTypeVal === 'parametric' && targetTypeVal === 'general') {
                const x0 = parseFloat(document.getElementById('param-x0')?.value) || 0;
                const y0 = parseFloat(document.getElementById('param-y0')?.value) || 0;
                const l = parseFloat(document.getElementById('param-l')?.value) || 1;
                const m = parseFloat(document.getElementById('param-m')?.value) || 1;
                
                if (Math.abs(l) < 0.001 && Math.abs(m) < 0.001) {
                    result = "\\text{Ошибка: нулевой направляющий вектор}";
                } else {
                    const A = m;
                    const B = -l;
                    const C = l*y0 - m*x0;
                    
                    result = `${formatCoefficient(A)}x ${formatSignedCoefficient(B)}y ${formatSignedCoefficient(C)} = 0`;
                }
            }
            
            resultEqElement.innerHTML = '';
            
            try {
                katex.render(result, resultEqElement, { 
                    throwOnError: false, 
                    displayMode: displayMode 
                });
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
            generalFormElement.innerHTML = '';
            try {
                katex.render(generalEq, generalFormElement, { 
                    throwOnError: false 
                });
            } catch (e) {
                generalFormElement.textContent = generalEq;
            }
        }
        
        const canonicalFormElement = document.getElementById('canonical-form');
        if (canonicalFormElement) {
            const l = x2 - x1;
            const m = y2 - y1;
            
            let canonicalEq;
            if (Math.abs(l) < 0.001 && Math.abs(m) < 0.001) {
                canonicalEq = "\\text{Ошибка: точки совпадают}";
            } else if (Math.abs(l) < 0.001) {
                canonicalEq = `x = ${x1}`;
            } else if (Math.abs(m) < 0.001) {
                canonicalEq = `y = ${y1}`;
            } else {
                canonicalEq = `\\frac{x - ${formatNumber(x1)}}{${formatNumber(l)}} = \\frac{y - ${formatNumber(y1)}}{${formatNumber(m)}}`;
            }
            
            canonicalFormElement.innerHTML = '';
            try {
                katex.render(canonicalEq, canonicalFormElement, { 
                    throwOnError: false 
                });
            } catch (e) {
                canonicalFormElement.textContent = canonicalEq;
            }
        }
        
        const parametricFormElement = document.getElementById('parametric-form');
        if (parametricFormElement) {
            const l = x2 - x1;
            const m = y2 - y1;
            
            let parametricEq;
            if (Math.abs(l) < 0.001 && Math.abs(m) < 0.001) {
                parametricEq = "\\text{Ошибка: точки совпадают}";
            } else {
                parametricEq = `\\begin{cases} x = ${formatNumber(x1)} ${formatSignedNumber(l)}t \\\\ y = ${formatNumber(y1)} ${formatSignedNumber(m)}t \\end{cases}`;
            }
            
            parametricFormElement.innerHTML = '';
            try {
                katex.render(parametricEq, parametricFormElement, { 
                    throwOnError: false, 
                    displayMode: true 
                });
            } catch (e) {
                parametricFormElement.textContent = parametricEq;
            }
        }
        
    } catch (error) {
        const generalFormElement = document.getElementById('general-form');
        if (generalFormElement) {
            generalFormElement.textContent = "Ошибка: " + error.message;
        }
        
        const canonicalFormElement = document.getElementById('canonical-form');
        if (canonicalFormElement) {
            canonicalFormElement.textContent = "";
        }
        
        const parametricFormElement = document.getElementById('parametric-form');
        if (parametricFormElement) {
            parametricFormElement.textContent = "";
        }
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
        
        if (document.getElementById('origin-point')) {
            katex.render("O(0,0)", document.getElementById('origin-point'), {
                throwOnError: false
            });
        }
        
        if (document.getElementById('point-formula')) {
            katex.render("M(x, y)", document.getElementById('point-formula'), {
                throwOnError: false
            });
        }
        
        if (document.getElementById('distance-formula')) {
            katex.render("d = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}", document.getElementById('distance-formula'), {
                throwOnError: false
            });
        }
        
        if (document.getElementById('line-equation')) {
            katex.render("F(x, y) = 0", document.getElementById('line-equation'), {
                throwOnError: false
            });
        }
        
        if (document.getElementById('general-eq')) {
            katex.render("Ax + By + C = 0", document.getElementById('general-eq'), {
                throwOnError: false
            });
        }
        
        if (document.getElementById('general-example')) {
            katex.render("2x - 3y + 6 = 0", document.getElementById('general-example'), {
                throwOnError: false
            });
        }
        
        if (document.getElementById('two-points-eq')) {
            katex.render("\\frac{x - x_1}{x_2 - x_1} = \\frac{y - y_1}{y_2 - y_1}", document.getElementById('two-points-eq'), {
                throwOnError: false
            });
        }
        
        if (document.getElementById('two-points-example')) {
            katex.render("\\frac{x - 1}{3} = \\frac{y - 2}{3}", document.getElementById('two-points-example'), {
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
            katex.render("\\begin{cases} x = x_0 + lt \\\\ y = y_0 + mt \\end{cases}, t \\in \\mathbb{R}", document.getElementById('parametric-eq'), {
                throwOnError: false,
                displayMode: true
            });
        }
        
        if (document.getElementById('parametric-example')) {
            katex.render("\\begin{cases} x = 1 + 2t \\\\ y = -1 + 3t \\end{cases}, t \\in \\mathbb{R}", document.getElementById('parametric-example'), {
                throwOnError: false,
                displayMode: true
            });
        }
        
        if (document.getElementById('example10-1')) {
            katex.render("2x - 3y + 6 = 0", document.getElementById('example10-1'), {
                throwOnError: false
            });
        }
        
        if (document.getElementById('example10-2')) {
            katex.render("\\frac{x}{3} = \\frac{y - 2}{2}", document.getElementById('example10-2'), {
                throwOnError: false
            });
        }
        
        if (document.getElementById('example11-1')) {
            katex.render("2x - 3y + 6 = 0", document.getElementById('example11-1'), {
                throwOnError: false
            });
        }
        
        if (document.getElementById('example11-2')) {
            katex.render("\\begin{cases} x = 3t \\\\ y = 2 + 2t \\end{cases}", document.getElementById('example11-2'), {
                throwOnError: false,
                displayMode: true
            });
        }
        
        if (document.getElementById('example12-1')) {
            katex.render("\\frac{x - 2}{3} = \\frac{y - 1}{4}", document.getElementById('example12-1'), {
                throwOnError: false
            });
        }
        
        if (document.getElementById('example12-2')) {
            katex.render("4(x - 2) = 3(y - 1)", document.getElementById('example12-2'), {
                throwOnError: false
            });
        }
        
        if (document.getElementById('example12-3')) {
            katex.render("4x - 8 = 3y - 3", document.getElementById('example12-3'), {
                throwOnError: false
            });
        }
        
        if (document.getElementById('example12-4')) {
            katex.render("4x - 3y - 5 = 0", document.getElementById('example12-4'), {
                throwOnError: false
            });
        }
        
        if (document.getElementById('example13-1')) {
            katex.render("\\frac{x - 2}{3} = \\frac{y - 1}{4}", document.getElementById('example13-1'), {
                throwOnError: false
            });
        }
        
        if (document.getElementById('example13-2')) {
            katex.render("\\begin{cases} x = 2 + 3t \\\\ y = 1 + 4t \\end{cases}", document.getElementById('example13-2'), {
                throwOnError: false,
                displayMode: true
            });
        }
        
        if (document.getElementById('example14-1')) {
            katex.render("\\begin{cases} x = 1 + 2t \\\\ y = -1 + 3t \\end{cases}", document.getElementById('example14-1'), {
                throwOnError: false,
                displayMode: true
            });
        }
        
        if (document.getElementById('example14-2')) {
            katex.render("\\frac{x - 1}{2} = \\frac{y + 1}{3}", document.getElementById('example14-2'), {
                throwOnError: false
            });
        }
        
        if (document.getElementById('example15-1')) {
            katex.render("\\begin{cases} x = 1 + 2t \\\\ y = -1 + 3t \\end{cases}", document.getElementById('example15-1'), {
                throwOnError: false,
                displayMode: true
            });
        }
        
        if (document.getElementById('example15-2')) {
            katex.render("3x - 2y - 5 = 0", document.getElementById('example15-2'), {
                throwOnError: false
            });
        }
        
    } catch (error) {
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
