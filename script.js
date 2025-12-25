// Добавь этот код в существующий script.js в функцию initSlideNavigation()
const totalSlidesElement = document.getElementById('total-slides');
if (totalSlidesElement) {
    totalSlidesElement.textContent = "21"; // Обновил на 21 слайд
}

// Добавь эту функцию в конец script.js
function initImageUpload() {
    const imageUpload = document.getElementById('image-upload');
    const imagePreview = document.getElementById('image-preview');
    const previewImg = document.getElementById('preview-img');
    const uploadArea = document.querySelector('.upload-area');
    
    if (!imageUpload || !imagePreview) return;
    
    imageUpload.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            
            reader.onload = function(event) {
                previewImg.src = event.target.result;
                imagePreview.style.display = 'block';
                uploadArea.style.display = 'none';
            }
            
            reader.readAsDataURL(file);
        }
    });
    
    // Drag and drop
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.style.borderColor = var(--secondary-color);
        this.style.backgroundColor = '#f0f7ff';
    });
    
    uploadArea.addEventListener('dragleave', function(e) {
        e.preventDefault();
        this.style.borderColor = '#ccc';
        this.style.backgroundColor = 'white';
    });
    
    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        this.style.borderColor = '#ccc';
        this.style.backgroundColor = 'white';
        
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            imageUpload.files = e.dataTransfer.files;
            const event = new Event('change');
            imageUpload.dispatchEvent(event);
        }
    });
}

// Вызови initImageUpload в DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    // ... остальной код ...
    initImageUpload();
});
