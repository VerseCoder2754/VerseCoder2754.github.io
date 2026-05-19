/* ============================================
   ResumeCraft - Professional Resume Builder
   Main Application Logic
   ============================================ */

// App State
const state = {
    currentSection: 'personal',
    template: 'minimal',
    font: 'Inter',
    accentColor: '#2563eb',
    zoom: 100,
    darkMode: false,
    history: [],
    historyIndex: -1,
    resumeData: {
        personal: {
            photo: '',
            fullName: '',
            jobTitle: '',
            email: '',
            phone: '',
            location: '',
            website: ''
        },
        summary: '',
        experience: [],
        education: [],
        skills: [],
        languages: [],
        projects: [],
        certifications: [],
        social: []
    }
};

// DOM Elements
const elements = {};

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    initializeElements();
    loadFromStorage();
    setupEventListeners();
    setupKeyboardShortcuts();
    updatePreview();
    updateStrengthMeter();
});

// Initialize DOM Elements
function initializeElements() {
    elements.onboarding = document.getElementById('onboarding');
    elements.app = document.getElementById('app');
    elements.startBtn = document.getElementById('startBtn');
    elements.toggleSidebar = document.getElementById('toggleSidebar');
    elements.sidebar = document.querySelector('.sidebar');
    elements.navItems = document.querySelectorAll('.nav-item');
    elements.sectionTitle = document.getElementById('sectionTitle');
    elements.formSections = document.querySelectorAll('.form-section');
    elements.resumeForm = document.getElementById('resumeForm');
    
    // Personal Info
    elements.photoDropZone = document.getElementById('photoDropZone');
    elements.photoInput = document.getElementById('photoInput');
    elements.photoPreview = document.getElementById('photoPreview');
    elements.photoPlaceholder = document.getElementById('photoPlaceholder');
    elements.removePhoto = document.getElementById('removePhoto');
    
    // Form fields
    elements.fullName = document.getElementById('fullName');
    elements.jobTitle = document.getElementById('jobTitle');
    elements.email = document.getElementById('email');
    elements.phone = document.getElementById('phone');
    elements.location = document.getElementById('location');
    elements.website = document.getElementById('website');
    elements.summary = document.getElementById('summary');
    elements.summaryCount = document.getElementById('summaryCount');
    
    // Lists
    elements.experienceList = document.getElementById('experienceList');
    elements.educationList = document.getElementById('educationList');
    elements.skillsList = document.getElementById('skillsList');
    elements.languagesList = document.getElementById('languagesList');
    elements.projectsList = document.getElementById('projectsList');
    elements.certificationsList = document.getElementById('certificationsList');
    elements.socialList = document.getElementById('socialList');
    
    // Skill inputs
    elements.skillName = document.getElementById('skillName');
    elements.skillLevel = document.getElementById('skillLevel');
    elements.addSkill = document.getElementById('addSkill');
    
    // Add buttons
    elements.addExperience = document.getElementById('addExperience');
    elements.addEducation = document.getElementById('addEducation');
    elements.addLanguage = document.getElementById('addLanguage');
    elements.addProject = document.getElementById('addProject');
    elements.addCertification = document.getElementById('addCertification');
    elements.addSocial = document.getElementById('addSocial');
    
    // Preview controls
    elements.templateSelect = document.getElementById('templateSelect');
    elements.fontSelect = document.getElementById('fontSelect');
    elements.accentColor = document.getElementById('accentColor');
    elements.zoomIn = document.getElementById('zoomIn');
    elements.zoomOut = document.getElementById('zoomOut');
    elements.zoomLevel = document.getElementById('zoomLevel');
    elements.fullscreenPreview = document.getElementById('fullscreenPreview');
    elements.previewFrame = document.getElementById('previewFrame');
    elements.previewContainer = document.getElementById('previewContainer');
    
    // Actions
    elements.undoBtn = document.getElementById('undoBtn');
    elements.redoBtn = document.getElementById('redoBtn');
    elements.importBtn = document.getElementById('importBtn');
    elements.exportBtn = document.getElementById('exportBtn');
    elements.downloadPdfBtn = document.getElementById('downloadPdfBtn');
    elements.darkModeToggle = document.getElementById('darkModeToggle');
    
    // Strength meter
    elements.strengthFill = document.getElementById('strengthFill');
    elements.strengthPercent = document.getElementById('strengthPercent');
    
    // Modals
    elements.templateModal = document.getElementById('templateModal');
    elements.importModal = document.getElementById('importModal');
    elements.closeTemplateModal = document.getElementById('closeTemplateModal');
    elements.closeImportModal = document.getElementById('closeImportModal');
    elements.templateCards = document.querySelectorAll('.template-card');
    elements.importData = document.getElementById('importData');
    elements.confirmImport = document.getElementById('confirmImport');
    
    // Toast
    elements.toastContainer = document.getElementById('toastContainer');
}

// Setup Event Listeners
function setupEventListeners() {
    // Onboarding
    elements.startBtn.addEventListener('click', startApp);
    
    // Navigation
    elements.navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            navigateToSection(item.dataset.section);
        });
    });
    
    // Sidebar toggle
    elements.toggleSidebar.addEventListener('click', toggleSidebar);
    
    // Personal Info
    elements.photoDropZone.addEventListener('click', () => elements.photoInput.click());
    elements.photoInput.addEventListener('change', handlePhotoUpload);
    elements.photoDropZone.addEventListener('dragover', handleDragOver);
    elements.photoDropZone.addEventListener('dragleave', handleDragLeave);
    elements.photoDropZone.addEventListener('drop', handlePhotoDrop);
    elements.removePhoto.addEventListener('click', removePhoto);
    
    // Form fields
    elements.fullName.addEventListener('input', saveState);
    elements.jobTitle.addEventListener('input', saveState);
    elements.email.addEventListener('input', saveState);
    elements.phone.addEventListener('input', saveState);
    elements.location.addEventListener('input', saveState);
    elements.website.addEventListener('input', saveState);
    elements.summary.addEventListener('input', handleSummaryInput);
    
    // Dynamic sections
    elements.addExperience.addEventListener('click', () => addDynamicItem('experience'));
    elements.addEducation.addEventListener('click', () => addDynamicItem('education'));
    elements.addLanguage.addEventListener('click', () => addDynamicItem('language'));
    elements.addProject.addEventListener('click', () => addDynamicItem('project'));
    elements.addCertification.addEventListener('click', () => addDynamicItem('certification'));
    elements.addSocial.addEventListener('click', () => addDynamicItem('social'));
    
    // Skills
    elements.addSkill.addEventListener('click', addSkill);
    elements.skillName.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addSkill();
    });
    
    // Preview controls
    elements.templateSelect.addEventListener('change', (e) => {
        state.template = e.target.value;
        updatePreview();
        saveToStorage();
    });
    
    elements.fontSelect.addEventListener('change', (e) => {
        state.font = e.target.value;
        updatePreview();
        saveToStorage();
    });
    
    elements.accentColor.addEventListener('input', (e) => {
        state.accentColor = e.target.value;
        updatePreview();
        saveToStorage();
    });
    
    elements.zoomIn.addEventListener('click', () => adjustZoom(10));
    elements.zoomOut.addEventListener('click', () => adjustZoom(-10));
    elements.fullscreenPreview.addEventListener('click', toggleFullscreen);
    
    // Actions
    elements.undoBtn.addEventListener('click', undo);
    elements.redoBtn.addEventListener('click', redo);
    elements.importBtn.addEventListener('click', () => elements.importModal.classList.remove('hidden'));
    elements.exportBtn.addEventListener('click', exportData);
    elements.downloadPdfBtn.addEventListener('click', downloadPDF);
    elements.darkModeToggle.addEventListener('click', toggleDarkMode);
    
    // Modals
    elements.closeTemplateModal.addEventListener('click', () => elements.templateModal.classList.add('hidden'));
    elements.closeImportModal.addEventListener('click', () => elements.importModal.classList.add('hidden'));
    elements.confirmImport.addEventListener('click', importData);
    
    elements.templateCards.forEach(card => {
        card.addEventListener('click', () => {
            state.template = card.dataset.template;
            elements.templateSelect.value = state.template;
            elements.templateModal.classList.add('hidden');
            updatePreview();
            saveToStorage();
            showToast('Template changed successfully', 'success');
        });
    });
    
    // Close modals on outside click
    window.addEventListener('click', (e) => {
        if (e.target === elements.templateModal) elements.templateModal.classList.add('hidden');
        if (e.target === elements.importModal) elements.importModal.classList.add('hidden');
    });
}

// Start App
function startApp() {
    elements.onboarding.classList.add('hidden');
    elements.app.classList.remove('hidden');
    setTimeout(updatePreview, 100);
}

// Navigate to Section
function navigateToSection(section) {
    state.currentSection = section;
    
    // Update nav items
    elements.navItems.forEach(item => {
        item.classList.toggle('active', item.dataset.section === section);
    });
    
    // Update form sections
    elements.formSections.forEach(sec => {
        sec.classList.toggle('active', sec.id === `${section}Section`);
    });
    
    // Update title
    const titles = {
        personal: 'Personal Information',
        summary: 'Professional Summary',
        experience: 'Work Experience',
        education: 'Education',
        skills: 'Skills',
        languages: 'Languages',
        projects: 'Projects',
        certifications: 'Certifications',
        social: 'Social Links'
    };
    elements.sectionTitle.textContent = titles[section];
}

// Toggle Sidebar
function toggleSidebar() {
    elements.app.classList.toggle('sidebar-collapsed');
    elements.sidebar.classList.toggle('visible');
}

// Photo Upload Handlers
function handleDragOver(e) {
    e.preventDefault();
    elements.photoDropZone.classList.add('dragover');
}

function handleDragLeave(e) {
    e.preventDefault();
    elements.photoDropZone.classList.remove('dragover');
}

function handlePhotoDrop(e) {
    e.preventDefault();
    elements.photoDropZone.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        processPhoto(file);
    }
}

function handlePhotoUpload(e) {
    const file = e.target.files[0];
    if (file) {
        processPhoto(file);
    }
}

function processPhoto(file) {
    if (file.size > 2 * 1024 * 1024) {
        showToast('Image size should be less than 2MB', 'warning');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
        state.resumeData.personal.photo = e.target.result;
        elements.photoPreview.src = e.target.result;
        elements.photoPreview.classList.remove('hidden');
        elements.photoPlaceholder.classList.add('hidden');
        elements.removePhoto.classList.remove('hidden');
        saveState();
    };
    reader.readAsDataURL(file);
}

function removePhoto() {
    state.resumeData.personal.photo = '';
    elements.photoPreview.src = '';
    elements.photoPreview.classList.add('hidden');
    elements.photoPlaceholder.classList.remove('hidden');
    elements.removePhoto.classList.add('hidden');
    elements.photoInput.value = '';
    saveState();
}

// Summary Input Handler
function handleSummaryInput() {
    const text = elements.summary.value;
    elements.summaryCount.textContent = text.length;
    if (text.length > 500) {
        elements.summary.value = text.slice(0, 500);
        elements.summaryCount.textContent = 500;
    }
    saveState();
}

// Dynamic Items Management
function addDynamicItem(type) {
    const item = {
        id: Date.now(),
        title: '',
        subtitle: '',
        date: '',
        location: '',
        description: ''
    };
    
    if (type === 'language') {
        item.language = '';
        item.proficiency = 'intermediate';
    } else if (type === 'social') {
        item.platform = 'linkedin';
        item.url = '';
    } else if (type === 'project' || type === 'certification') {
        item.url = '';
    }
    
    state.resumeData[type + 's'].push(item);
    renderDynamicItems();
    saveState();
}

function removeDynamicItem(type, id) {
    state.resumeData[type + 's'] = state.resumeData[type + 's'].filter(item => item.id !== id);
    renderDynamicItems();
    saveState();
}

function updateDynamicItem(type, id, field, value) {
    const item = state.resumeData[type + 's'].find(i => i.id === id);
    if (item) {
        item[field] = value;
        saveState();
    }
}

function renderDynamicItems() {
    renderExperience();
    renderEducation();
    renderLanguages();
    renderProjects();
    renderCertifications();
    renderSocial();
    renderSkills();
}

function renderExperience() {
    elements.experienceList.innerHTML = state.resumeData.experience.map((item, index) => `
        <div class="dynamic-item" data-id="${item.id}">
            <div class="dynamic-item-header">
                <span class="dynamic-item-title">Position ${index + 1}</span>
                <button type="button" class="btn-remove" onclick="removeDynamicItem('experience', ${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Job Title</label>
                    <input type="text" value="${item.title}" 
                           onchange="updateDynamicItem('experience', ${item.id}, 'title', this.value)"
                           placeholder="Software Engineer">
                </div>
                <div class="form-group">
                    <label>Company</label>
                    <input type="text" value="${item.subtitle}" 
                           onchange="updateDynamicItem('experience', ${item.id}, 'subtitle', this.value)"
                           placeholder="Google Inc.">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Start Date</label>
                    <input type="month" value="${item.date?.split(',')[0] || ''}" 
                           onchange="updateDynamicItem('experience', ${item.id}, 'date', this.value + ', ' + (this.value ? 'Present' : ''))">
                </div>
                <div class="form-group">
                    <label>Location</label>
                    <input type="text" value="${item.location}" 
                           onchange="updateDynamicItem('experience', ${item.id}, 'location', this.value)"
                           placeholder="San Francisco, CA">
                </div>
            </div>
            <div class="form-group">
                <label>Description</label>
                <textarea rows="4" 
                          onchange="updateDynamicItem('experience', ${item.id}, 'description', this.value)"
                          placeholder="Describe your responsibilities and achievements...">${item.description}</textarea>
            </div>
        </div>
    `).join('');
}

function renderEducation() {
    elements.educationList.innerHTML = state.resumeData.education.map((item, index) => `
        <div class="dynamic-item" data-id="${item.id}">
            <div class="dynamic-item-header">
                <span class="dynamic-item-title">Education ${index + 1}</span>
                <button type="button" class="btn-remove" onclick="removeDynamicItem('education', ${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Degree</label>
                    <input type="text" value="${item.title}" 
                           onchange="updateDynamicItem('education', ${item.id}, 'title', this.value)"
                           placeholder="Bachelor of Science in Computer Science">
                </div>
                <div class="form-group">
                    <label>School</label>
                    <input type="text" value="${item.subtitle}" 
                           onchange="updateDynamicItem('education', ${item.id}, 'subtitle', this.value)"
                           placeholder="Stanford University">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Graduation Date</label>
                    <input type="month" value="${item.date?.split('-')[0] + '-' + item.date?.split('-')[1] || ''}" 
                           onchange="updateDynamicItem('education', ${item.id}, 'date', this.value)">
                </div>
                <div class="form-group">
                    <label>GPA (Optional)</label>
                    <input type="text" value="${item.location}" 
                           onchange="updateDynamicItem('education', ${item.id}, 'location', this.value)"
                           placeholder="3.8/4.0">
                </div>
            </div>
        </div>
    `).join('');
}

function renderLanguages() {
    elements.languagesList.innerHTML = state.resumeData.languages.map((item, index) => `
        <div class="dynamic-item" data-id="${item.id}">
            <div class="dynamic-item-header">
                <span class="dynamic-item-title">Language ${index + 1}</span>
                <button type="button" class="btn-remove" onclick="removeDynamicItem('language', ${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Language</label>
                    <input type="text" value="${item.language}" 
                           onchange="updateDynamicItem('language', ${item.id}, 'language', this.value)"
                           placeholder="English">
                </div>
                <div class="form-group">
                    <label>Proficiency</label>
                    <select onchange="updateDynamicItem('language', ${item.id}, 'proficiency', this.value)">
                        <option value="basic" ${item.proficiency === 'basic' ? 'selected' : ''}>Basic</option>
                        <option value="intermediate" ${item.proficiency === 'intermediate' ? 'selected' : ''}>Intermediate</option>
                        <option value="advanced" ${item.proficiency === 'advanced' ? 'selected' : ''}>Advanced</option>
                        <option value="fluent" ${item.proficiency === 'fluent' ? 'selected' : ''}>Fluent</option>
                        <option value="native" ${item.proficiency === 'native' ? 'selected' : ''}>Native</option>
                    </select>
                </div>
            </div>
        </div>
    `).join('');
}

function renderProjects() {
    elements.projectsList.innerHTML = state.resumeData.projects.map((item, index) => `
        <div class="dynamic-item" data-id="${item.id}">
            <div class="dynamic-item-header">
                <span class="dynamic-item-title">Project ${index + 1}</span>
                <button type="button" class="btn-remove" onclick="removeDynamicItem('project', ${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <div class="form-group">
                <label>Project Name</label>
                <input type="text" value="${item.title}" 
                       onchange="updateDynamicItem('project', ${item.id}, 'title', this.value)"
                       placeholder="E-commerce Platform">
            </div>
            <div class="form-group">
                <label>Project URL (Optional)</label>
                <input type="url" value="${item.url}" 
                       onchange="updateDynamicItem('project', ${item.id}, 'url', this.value)"
                       placeholder="https://github.com/username/project">
            </div>
            <div class="form-group">
                <label>Description</label>
                <textarea rows="4" 
                          onchange="updateDynamicItem('project', ${item.id}, 'description', this.value)"
                          placeholder="Describe the project, technologies used, and your role...">${item.description}</textarea>
            </div>
        </div>
    `).join('');
}

function renderCertifications() {
    elements.certificationsList.innerHTML = state.resumeData.certifications.map((item, index) => `
        <div class="dynamic-item" data-id="${item.id}">
            <div class="dynamic-item-header">
                <span class="dynamic-item-title">Certification ${index + 1}</span>
                <button type="button" class="btn-remove" onclick="removeDynamicItem('certification', ${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <div class="form-group">
                <label>Certification Name</label>
                <input type="text" value="${item.title}" 
                       onchange="updateDynamicItem('certification', ${item.id}, 'title', this.value)"
                       placeholder="AWS Certified Solutions Architect">
            </div>
            <div class="form-group">
                <label>Issuing Organization</label>
                <input type="text" value="${item.subtitle}" 
                       onchange="updateDynamicItem('certification', ${item.id}, 'subtitle', this.value)"
                       placeholder="Amazon Web Services">
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Date</label>
                    <input type="month" value="${item.date}" 
                           onchange="updateDynamicItem('certification', ${item.id}, 'date', this.value)">
                </div>
                <div class="form-group">
                    <label>Credential URL (Optional)</label>
                    <input type="url" value="${item.url}" 
                           onchange="updateDynamicItem('certification', ${item.id}, 'url', this.value)">
                </div>
            </div>
        </div>
    `).join('');
}

function renderSocial() {
    elements.socialList.innerHTML = state.resumeData.social.map((item, index) => `
        <div class="dynamic-item" data-id="${item.id}">
            <div class="dynamic-item-header">
                <span class="dynamic-item-title">Social Link ${index + 1}</span>
                <button type="button" class="btn-remove" onclick="removeDynamicItem('social', ${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Platform</label>
                    <select onchange="updateDynamicItem('social', ${item.id}, 'platform', this.value)">
                        <option value="linkedin" ${item.platform === 'linkedin' ? 'selected' : ''}>LinkedIn</option>
                        <option value="github" ${item.platform === 'github' ? 'selected' : ''}>GitHub</option>
                        <option value="twitter" ${item.platform === 'twitter' ? 'selected' : ''}>Twitter</option>
                        <option value="portfolio" ${item.platform === 'portfolio' ? 'selected' : ''}>Portfolio</option>
                        <option value="other" ${item.platform === 'other' ? 'selected' : ''}>Other</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>URL</label>
                    <input type="url" value="${item.url}" 
                           onchange="updateDynamicItem('social', ${item.id}, 'url', this.value)"
                           placeholder="https://linkedin.com/in/username">
                </div>
            </div>
        </div>
    `).join('');
}

// Skills Management
function addSkill() {
    const name = elements.skillName.value.trim();
    const level = elements.skillLevel.value;
    
    if (!name) {
        showToast('Please enter a skill name', 'warning');
        return;
    }
    
    state.resumeData.skills.push({ name, level, id: Date.now() });
    elements.skillName.value = '';
    renderSkills();
    saveState();
}

function removeSkill(id) {
    state.resumeData.skills = state.resumeData.skills.filter(s => s.id !== id);
    renderSkills();
    saveState();
}

function renderSkills() {
    const levelDots = { beginner: 1, intermediate: 2, advanced: 3, expert: 4 };
    
    elements.skillsList.innerHTML = state.resumeData.skills.map(skill => `
        <div class="skill-tag" data-id="${skill.id}">
            <span>${skill.name}</span>
            <div class="skill-level">
                ${Array(4).fill(0).map((_, i) => 
                    `<span class="level-dot ${i < levelDots[skill.level] ? 'filled' : ''}"></span>`
                ).join('')}
            </div>
            <i class="fas fa-times remove-skill" onclick="removeSkill(${skill.id})"></i>
        </div>
    `).join('');
    
    // Make skills sortable
    new Sortable(elements.skillsList, {
        animation: 150,
        onEnd: () => saveState()
    });
}

// Save State (with history for undo/redo)
function saveState() {
    // Get current form values
    state.resumeData.personal.fullName = elements.fullName.value;
    state.resumeData.personal.jobTitle = elements.jobTitle.value;
    state.resumeData.personal.email = elements.email.value;
    state.resumeData.personal.phone = elements.phone.value;
    state.resumeData.personal.location = elements.location.value;
    state.resumeData.personal.website = elements.website.value;
    state.resumeData.summary = elements.summary.value;
    
    // Add to history
    const currentState = JSON.stringify(state.resumeData);
    
    if (state.historyIndex < state.history.length - 1) {
        state.history = state.history.slice(0, state.historyIndex + 1);
    }
    
    if (!state.history.length || state.history[state.history.length - 1] !== currentState) {
        state.history.push(currentState);
        state.historyIndex++;
        
        // Limit history size
        if (state.history.length > 50) {
            state.history.shift();
            state.historyIndex--;
        }
    }
    
    updatePreview();
    updateStrengthMeter();
    saveToStorage();
}

// Undo/Redo
function undo() {
    if (state.historyIndex > 0) {
        state.historyIndex--;
        state.resumeData = JSON.parse(state.history[state.historyIndex]);
        loadResumeData();
        updatePreview();
        updateStrengthMeter();
        showToast('Undo successful', 'success');
    }
}

function redo() {
    if (state.historyIndex < state.history.length - 1) {
        state.historyIndex++;
        state.resumeData = JSON.parse(state.history[state.historyIndex]);
        loadResumeData();
        updatePreview();
        updateStrengthMeter();
        showToast('Redo successful', 'success');
    }
}

// Load Resume Data into Form
function loadResumeData() {
    const data = state.resumeData;
    
    elements.fullName.value = data.personal.fullName || '';
    elements.jobTitle.value = data.personal.jobTitle || '';
    elements.email.value = data.personal.email || '';
    elements.phone.value = data.personal.phone || '';
    elements.location.value = data.personal.location || '';
    elements.website.value = data.personal.website || '';
    elements.summary.value = data.summary || '';
    elements.summaryCount.textContent = data.summary?.length || 0;
    
    // Photo
    if (data.personal.photo) {
        elements.photoPreview.src = data.personal.photo;
        elements.photoPreview.classList.remove('hidden');
        elements.photoPlaceholder.classList.add('hidden');
        elements.removePhoto.classList.remove('hidden');
    } else {
        elements.photoPreview.classList.add('hidden');
        elements.photoPlaceholder.classList.remove('hidden');
        elements.removePhoto.classList.add('hidden');
    }
    
    renderDynamicItems();
}

// Update Preview
function updatePreview() {
    const iframe = elements.previewFrame;
    const doc = iframe.contentDocument || iframe.contentWindow.document;
    
    const html = generateResumeHTML();
    doc.open();
    doc.write(html);
    doc.close();
}

// Generate Resume HTML based on template
function generateResumeHTML() {
    const data = state.resumeData;
    const template = state.template;
    const font = state.font;
    const color = state.accentColor;
    
    const templates = {
        minimal: generateMinimalTemplate,
        sidebar: generateSidebarTemplate,
        executive: generateExecutiveTemplate,
        creative: generateCreativeTemplate,
        dark: generateDarkTemplate,
        tech: generateTechTemplate,
        ats: generateAtsTemplate,
        timeline: generateTimelineTemplate,
        gradient: generateGradientTemplate,
        international: generateInternationalTemplate
    };
    
    return templates[template](data, font, color);
}

// Template Generators
function generateMinimalTemplate(data, font, color) {
    return `<!DOCTYPE html>
<html>
<head>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=${font.replace(' ', '+')}:wght@300;400;500;600;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: '${font}', sans-serif; line-height: 1.6; color: #333; max-width: 210mm; margin: 0 auto; padding: 15mm; background: white; }
        .header { border-bottom: 2px solid #333; padding-bottom: 15px; margin-bottom: 20px; }
        .name { font-size: 28px; font-weight: 700; color: #000; letter-spacing: -0.5px; }
        .title { font-size: 14px; color: #666; margin-top: 4px; text-transform: uppercase; letter-spacing: 1px; }
        .contact { display: flex; gap: 15px; flex-wrap: wrap; margin-top: 12px; font-size: 13px; color: #555; }
        .contact span { display: flex; align-items: center; gap: 5px; }
        h2 { font-size: 14px; font-weight: 600; color: #000; text-transform: uppercase; letter-spacing: 1px; margin: 20px 0 12px; padding-bottom: 6px; border-bottom: 1px solid #ddd; }
        .summary { font-size: 13px; line-height: 1.7; color: #444; }
        .item { margin-bottom: 15px; }
        .item-header { display: flex; justify-content: space-between; margin-bottom: 4px; }
        .item-title { font-weight: 600; font-size: 14px; color: #222; }
        .item-subtitle { font-size: 13px; color: #555; }
        .item-date { font-size: 13px; color: #777; font-weight: 500; }
        .item-location { font-size: 13px; color: #666; font-style: italic; }
        .item-description { font-size: 13px; color: #555; line-height: 1.6; margin-top: 6px; }
        .skills { display: flex; flex-wrap: wrap; gap: 8px; }
        .skill { background: #f5f5f5; padding: 4px 10px; border-radius: 4px; font-size: 12px; color: #333; }
        .languages-list, .social-list { list-style: none; }
        .languages-list li, .social-list li { font-size: 13px; color: #555; margin-bottom: 4px; }
        .photo { width: 100px; height: 100px; border-radius: 50%; object-fit: cover; float: right; margin-left: 20px; }
    </style>
</head>
<body>
    ${data.personal.photo ? `<img src="${data.personal.photo}" class="photo" alt="Profile">` : ''}
    <div class="header">
        <div class="name">${data.personal.fullName || 'Your Name'}</div>
        <div class="title">${data.personal.jobTitle || 'Professional Title'}</div>
        <div class="contact">
            ${data.personal.email ? `<span><i class="far fa-envelope"></i> ${data.personal.email}</span>` : ''}
            ${data.personal.phone ? `<span><i class="fas fa-phone"></i> ${data.personal.phone}</span>` : ''}
            ${data.personal.location ? `<span><i class="fas fa-map-marker-alt"></i> ${data.personal.location}</span>` : ''}
            ${data.personal.website ? `<span><i class="fas fa-globe"></i> ${data.personal.website}</span>` : ''}
        </div>
    </div>
    
    ${data.summary ? `<h2>Profile</h2><p class="summary">${data.summary}</p>` : ''}
    
    ${data.experience.length ? `<h2>Experience</h2>${data.experience.map(exp => `
        <div class="item">
            <div class="item-header">
                <span class="item-title">${exp.title}</span>
                <span class="item-date">${formatDate(exp.date)}</span>
            </div>
            <div class="item-subtitle">${exp.subtitle}${exp.location ? ` • ${exp.location}` : ''}</div>
            ${exp.description ? `<p class="item-description">${exp.description}</p>` : ''}
        </div>
    `).join('')}` : ''}
    
    ${data.education.length ? `<h2>Education</h2>${data.education.map(edu => `
        <div class="item">
            <div class="item-header">
                <span class="item-title">${edu.title}</span>
                <span class="item-date">${formatDate(edu.date)}</span>
            </div>
            <div class="item-subtitle">${edu.subtitle}${edu.location ? ` • GPA: ${edu.location}` : ''}</div>
        </div>
    `).join('')}` : ''}
    
    ${data.skills.length ? `<h2>Skills</h2><div class="skills">${data.skills.map(s => `<span class="skill">${s.name}</span>`).join('')}</div>` : ''}
    
    ${data.languages.length ? `<h2>Languages</h2><ul class="languages-list">${data.languages.map(l => `<li>${l.language} - ${capitalize(l.proficiency)}</li>`).join('')}</ul>` : ''}
    
    ${data.projects.length ? `<h2>Projects</h2>${data.projects.map(p => `
        <div class="item">
            <div class="item-title">${p.title}</div>
            ${p.description ? `<p class="item-description">${p.description}</p>` : ''}
        </div>
    `).join('')}` : ''}
    
    ${data.certifications.length ? `<h2>Certifications</h2>${data.certifications.map(c => `
        <div class="item">
            <div class="item-title">${c.title}</div>
            <div class="item-subtitle">${c.subtitle}${c.date ? ` • ${formatDate(c.date)}` : ''}</div>
        </div>
    `).join('')}` : ''}
</body>
</html>`;
}

function generateSidebarTemplate(data, font, color) {
    return `<!DOCTYPE html>
<html>
<head>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=${font.replace(' ', '+')}:wght@300;400;500;600;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: '${font}', sans-serif; line-height: 1.6; display: flex; max-width: 210mm; margin: 0 auto; min-height: 297mm; background: white; }
        .sidebar { width: 32%; background: ${color}; color: white; padding: 25px 20px; }
        .main { width: 68%; padding: 25px; }
        .photo { width: 120px; height: 120px; border-radius: 50%; object-fit: cover; margin-bottom: 20px; border: 3px solid rgba(255,255,255,0.3); }
        .sidebar-name { font-size: 22px; font-weight: 700; margin-bottom: 5px; }
        .sidebar-title { font-size: 13px; opacity: 0.9; margin-bottom: 25px; }
        .sidebar-section { margin-top: 25px; }
        .sidebar-title-sm { font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; opacity: 0.9; }
        .contact-item { font-size: 12px; margin-bottom: 8px; display: flex; align-items: center; gap: 8px; }
        .skill-bar { margin-bottom: 10px; }
        .skill-name { font-size: 12px; margin-bottom: 4px; }
        .bar { height: 6px; background: rgba(255,255,255,0.3); border-radius: 3px; overflow: hidden; }
        .bar-fill { height: 100%; background: white; border-radius: 3px; }
        .lang-item { font-size: 12px; margin-bottom: 6px; }
        h2 { font-size: 14px; font-weight: 600; color: ${color}; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 15px; padding-bottom: 8px; border-bottom: 2px solid ${color}; }
        .item { margin-bottom: 18px; }
        .item-title { font-weight: 600; font-size: 14px; color: #222; }
        .item-subtitle { font-size: 13px; color: #666; }
        .item-date { font-size: 12px; color: #888; }
        .item-description { font-size: 13px; color: #555; line-height: 1.6; margin-top: 6px; }
    </style>
</head>
<body>
    <div class="sidebar">
        ${data.personal.photo ? `<img src="${data.personal.photo}" class="photo" alt="Profile">` : ''}
        <div class="sidebar-name">${data.personal.fullName || 'Your Name'}</div>
        <div class="sidebar-title">${data.personal.jobTitle || 'Professional Title'}</div>
        
        <div class="sidebar-section">
            <div class="sidebar-title-sm">Contact</div>
            ${data.personal.email ? `<div class="contact-item">${data.personal.email}</div>` : ''}
            ${data.personal.phone ? `<div class="contact-item">${data.personal.phone}</div>` : ''}
            ${data.personal.location ? `<div class="contact-item">${data.personal.location}</div>` : ''}
        </div>
        
        ${data.skills.length ? `<div class="sidebar-section">
            <div class="sidebar-title-sm">Skills</div>
            ${data.skills.map(s => {
                const levels = { beginner: 25, intermediate: 50, advanced: 75, expert: 100 };
                return `<div class="skill-bar">
                    <div class="skill-name">${s.name}</div>
                    <div class="bar"><div class="bar-fill" style="width: ${levels[s.level]}%"></div></div>
                </div>`;
            }).join('')}
        </div>` : ''}
        
        ${data.languages.length ? `<div class="sidebar-section">
            <div class="sidebar-title-sm">Languages</div>
            ${data.languages.map(l => `<div class="lang-item">${l.language} - ${capitalize(l.proficiency)}</div>`).join('')}
        </div>` : ''}
    </div>
    
    <div class="main">
        ${data.summary ? `<h2>Profile</h2><p style="font-size: 13px; color: #555; margin-bottom: 20px;">${data.summary}</p>` : ''}
        
        ${data.experience.length ? `<h2>Experience</h2>${data.experience.map(exp => `
            <div class="item">
                <div class="item-title">${exp.title}</div>
                <div class="item-subtitle">${exp.subtitle} • ${formatDate(exp.date)}</div>
                ${exp.description ? `<p class="item-description">${exp.description}</p>` : ''}
            </div>
        `).join('')}` : ''}
        
        ${data.education.length ? `<h2>Education</h2>${data.education.map(edu => `
            <div class="item">
                <div class="item-title">${edu.title}</div>
                <div class="item-subtitle">${edu.subtitle} • ${formatDate(edu.date)}</div>
            </div>
        `).join('')}` : ''}
        
        ${data.projects.length ? `<h2>Projects</h2>${data.projects.map(p => `
            <div class="item">
                <div class="item-title">${p.title}</div>
                ${p.description ? `<p class="item-description">${p.description}</p>` : ''}
            </div>
        `).join('')}` : ''}
        
        ${data.certifications.length ? `<h2>Certifications</h2>${data.certifications.map(c => `
            <div class="item">
                <div class="item-title">${c.title}</div>
                <div class="item-subtitle">${c.subtitle} • ${formatDate(c.date)}</div>
            </div>
        `).join('')}` : ''}
    </div>
</body>
</html>`;
}

function generateExecutiveTemplate(data, font, color) {
    return `<!DOCTYPE html>
<html>
<head>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=${font.replace(' ', '+')}:wght@300;400;500;600;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: '${font}', serif; line-height: 1.7; color: #1a1a1a; max-width: 210mm; margin: 0 auto; padding: 20mm; background: white; }
        .header { text-align: center; border-bottom: 1px solid #d4af37; padding-bottom: 20px; margin-bottom: 25px; }
        .name { font-size: 32px; font-weight: 600; color: #1a1a1a; letter-spacing: 3px; text-transform: uppercase; }
        .title { font-size: 13px; color: #d4af37; margin-top: 8px; letter-spacing: 2px; }
        .contact { display: flex; justify-content: center; gap: 20px; flex-wrap: wrap; margin-top: 15px; font-size: 12px; color: #666; }
        h2 { font-size: 13px; font-weight: 600; color: #1a1a1a; text-transform: uppercase; letter-spacing: 2px; margin: 22px 0 14px; padding-bottom: 8px; border-bottom: 1px solid #eee; }
        .summary { font-size: 13px; line-height: 1.8; color: #444; text-align: justify; }
        .item { margin-bottom: 16px; }
        .item-header { display: flex; justify-content: space-between; margin-bottom: 5px; }
        .item-title { font-weight: 600; font-size: 14px; color: #1a1a1a; }
        .item-subtitle { font-size: 13px; color: #555; font-style: italic; }
        .item-date { font-size: 12px; color: #888; }
        .item-description { font-size: 13px; color: #555; line-height: 1.7; margin-top: 6px; }
        .skills { display: flex; flex-wrap: wrap; gap: 10px; }
        .skill { border: 1px solid #ddd; padding: 5px 12px; border-radius: 0; font-size: 12px; color: #333; }
    </style>
</head>
<body>
    <div class="header">
        <div class="name">${data.personal.fullName || 'Your Name'}</div>
        <div class="title">${data.personal.jobTitle || 'Professional Title'}</div>
        <div class="contact">
            ${data.personal.email ? `<span>${data.personal.email}</span>` : ''}
            ${data.personal.phone ? `<span>${data.personal.phone}</span>` : ''}
            ${data.personal.location ? `<span>${data.personal.location}</span>` : ''}
            ${data.personal.website ? `<span>${data.personal.website}</span>` : ''}
        </div>
    </div>
    
    ${data.summary ? `<h2>Executive Profile</h2><p class="summary">${data.summary}</p>` : ''}
    
    ${data.experience.length ? `<h2>Professional Experience</h2>${data.experience.map(exp => `
        <div class="item">
            <div class="item-header">
                <span class="item-title">${exp.title}</span>
                <span class="item-date">${formatDate(exp.date)}</span>
            </div>
            <div class="item-subtitle">${exp.subtitle}, ${exp.location}</div>
            ${exp.description ? `<p class="item-description">${exp.description}</p>` : ''}
        </div>
    `).join('')}` : ''}
    
    ${data.education.length ? `<h2>Education</h2>${data.education.map(edu => `
        <div class="item">
            <div class="item-header">
                <span class="item-title">${edu.title}</span>
                <span class="item-date">${formatDate(edu.date)}</span>
            </div>
            <div class="item-subtitle">${edu.subtitle}</div>
        </div>
    `).join('')}` : ''}
    
    ${data.skills.length ? `<h2>Core Competencies</h2><div class="skills">${data.skills.map(s => `<span class="skill">${s.name}</span>`).join('')}</div>` : ''}
</body>
</html>`;
}

function generateCreativeTemplate(data, font, color) {
    return `<!DOCTYPE html>
<html>
<head>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=${font.replace(' ', '+')}:wght@300;400;500;600;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: '${font}', sans-serif; line-height: 1.6; max-width: 210mm; margin: 0 auto; background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); min-height: 297mm; }
        .container { background: white; margin: 15px; padding: 30px; border-radius: 0; box-shadow: 0 10px 40px rgba(0,0,0,0.1); }
        .header { position: relative; padding-bottom: 25px; margin-bottom: 25px; }
        .header::before { content: ''; position: absolute; top: -30px; left: -30px; right: -30px; height: 8px; background: linear-gradient(90deg, #0ea5e9, #8b5cf6, #ec4899); }
        .name { font-size: 32px; font-weight: 700; color: #1e293b; letter-spacing: -1px; }
        .title { font-size: 14px; color: ${color}; margin-top: 6px; font-weight: 500; }
        .contact { display: flex; gap: 15px; flex-wrap: wrap; margin-top: 15px; font-size: 13px; color: #64748b; }
        h2 { font-size: 14px; font-weight: 600; color: #1e293b; margin: 25px 0 15px; position: relative; padding-left: 15px; }
        h2::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 4px; background: linear-gradient(180deg, #0ea5e9, #8b5cf6); border-radius: 2px; }
        .summary { font-size: 13px; line-height: 1.7; color: #475569; }
        .item { margin-bottom: 18px; padding-left: 15px; border-left: 2px solid #e2e8f0; }
        .item-title { font-weight: 600; font-size: 14px; color: #1e293b; }
        .item-subtitle { font-size: 13px; color: #64748b; }
        .item-date { font-size: 12px; color: #94a3b8; }
        .item-description { font-size: 13px; color: #64748b; line-height: 1.6; margin-top: 6px; }
        .skills { display: flex; flex-wrap: wrap; gap: 8px; }
        .skill { background: linear-gradient(135deg, #e0f2fe, #dbeafe); padding: 6px 12px; border-radius: 20px; font-size: 12px; color: #0369a1; font-weight: 500; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="name">${data.personal.fullName || 'Your Name'}</div>
            <div class="title">${data.personal.jobTitle || 'Professional Title'}</div>
            <div class="contact">
                ${data.personal.email ? `<span>✉️ ${data.personal.email}</span>` : ''}
                ${data.personal.phone ? `<span>📱 ${data.personal.phone}</span>` : ''}
                ${data.personal.location ? `<span>📍 ${data.personal.location}</span>` : ''}
            </div>
        </div>
        
        ${data.summary ? `<h2>About Me</h2><p class="summary">${data.summary}</p>` : ''}
        
        ${data.experience.length ? `<h2>Experience</h2>${data.experience.map(exp => `
            <div class="item">
                <div class="item-title">${exp.title}</div>
                <div class="item-subtitle">${exp.subtitle} • ${formatDate(exp.date)}</div>
                ${exp.description ? `<p class="item-description">${exp.description}</p>` : ''}
            </div>
        `).join('')}` : ''}
        
        ${data.education.length ? `<h2>Education</h2>${data.education.map(edu => `
            <div class="item">
                <div class="item-title">${edu.title}</div>
                <div class="item-subtitle">${edu.subtitle} • ${formatDate(edu.date)}</div>
            </div>
        `).join('')}` : ''}
        
        ${data.skills.length ? `<h2>Skills</h2><div class="skills">${data.skills.map(s => `<span class="skill">${s.name}</span>`).join('')}</div>` : ''}
        
        ${data.projects.length ? `<h2>Projects</h2>${data.projects.map(p => `
            <div class="item">
                <div class="item-title">${p.title}</div>
                ${p.description ? `<p class="item-description">${p.description}</p>` : ''}
            </div>
        `).join('')}` : ''}
    </div>
</body>
</html>`;
}

function generateDarkTemplate(data, font, color) {
    return `<!DOCTYPE html>
<html>
<head>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=${font.replace(' ', '+')}:wght@300;400;500;600;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: '${font}', sans-serif; line-height: 1.6; max-width: 210mm; margin: 0 auto; background: #0f172a; color: #e2e8f0; min-height: 297mm; padding: 15mm; }
        .header { border-bottom: 2px solid ${color}; padding-bottom: 15px; margin-bottom: 20px; }
        .name { font-size: 28px; font-weight: 700; color: #f8fafc; letter-spacing: -0.5px; }
        .title { font-size: 14px; color: ${color}; margin-top: 4px; text-transform: uppercase; letter-spacing: 1px; }
        .contact { display: flex; gap: 15px; flex-wrap: wrap; margin-top: 12px; font-size: 13px; color: #94a3b8; }
        h2 { font-size: 14px; font-weight: 600; color: #f8fafc; text-transform: uppercase; letter-spacing: 1px; margin: 20px 0 12px; padding-bottom: 6px; border-bottom: 1px solid #334155; }
        .summary { font-size: 13px; line-height: 1.7; color: #cbd5e1; }
        .item { margin-bottom: 15px; }
        .item-title { font-weight: 600; font-size: 14px; color: #f1f5f9; }
        .item-subtitle { font-size: 13px; color: #94a3b8; }
        .item-date { font-size: 13px; color: #64748b; }
        .item-description { font-size: 13px; color: #cbd5e1; line-height: 1.6; margin-top: 6px; }
        .skills { display: flex; flex-wrap: wrap; gap: 8px; }
        .skill { background: #1e293b; padding: 4px 10px; border-radius: 4px; font-size: 12px; color: #e2e8f0; border: 1px solid #334155; }
    </style>
</head>
<body>
    <div class="header">
        <div class="name">${data.personal.fullName || 'Your Name'}</div>
        <div class="title">${data.personal.jobTitle || 'Professional Title'}</div>
        <div class="contact">
            ${data.personal.email ? `<span>📧 ${data.personal.email}</span>` : ''}
            ${data.personal.phone ? `<span>📱 ${data.personal.phone}</span>` : ''}
            ${data.personal.location ? `<span>📍 ${data.personal.location}</span>` : ''}
        </div>
    </div>
    
    ${data.summary ? `<h2>Profile</h2><p class="summary">${data.summary}</p>` : ''}
    
    ${data.experience.length ? `<h2>Experience</h2>${data.experience.map(exp => `
        <div class="item">
            <div class="item-title">${exp.title}</div>
            <div class="item-subtitle">${exp.subtitle} • ${formatDate(exp.date)}</div>
            ${exp.description ? `<p class="item-description">${exp.description}</p>` : ''}
        </div>
    `).join('')}` : ''}
    
    ${data.education.length ? `<h2>Education</h2>${data.education.map(edu => `
        <div class="item">
            <div class="item-title">${edu.title}</div>
            <div class="item-subtitle">${edu.subtitle} • ${formatDate(edu.date)}</div>
        </div>
    `).join('')}` : ''}
    
    ${data.skills.length ? `<h2>Skills</h2><div class="skills">${data.skills.map(s => `<span class="skill">${s.name}</span>`).join('')}</div>` : ''}
</body>
</html>`;
}

function generateTechTemplate(data, font, color) {
    return `<!DOCTYPE html>
<html>
<head>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'JetBrains Mono', monospace; line-height: 1.6; max-width: 210mm; margin: 0 auto; background: #0d1117; color: #c9d1d9; min-height: 297mm; padding: 15mm; }
        .header { border-bottom: 1px solid #30363d; padding-bottom: 15px; margin-bottom: 20px; }
        .name { font-size: 24px; font-weight: 600; color: #58a6ff; }
        .title { font-size: 13px; color: #8b949e; margin-top: 6px; }
        .contact { display: flex; gap: 15px; flex-wrap: wrap; margin-top: 12px; font-size: 12px; color: #8b949e; }
        .contact span::before { content: '> '; color: #238636; }
        h2 { font-size: 13px; font-weight: 600; color: #f0f6fc; margin: 20px 0 12px; padding-bottom: 6px; border-bottom: 1px solid #30363d; }
        h2::before { content: '// '; color: #8b949e; }
        .summary { font-size: 12px; line-height: 1.7; color: #c9d1d9; background: #161b22; padding: 12px; border-radius: 6px; border: 1px solid #30363d; }
        .item { margin-bottom: 15px; }
        .item-title { font-weight: 600; font-size: 13px; color: #f0f6fc; }
        .item-title::before { content: '▸ '; color: #238636; }
        .item-subtitle { font-size: 12px; color: #8b949e; }
        .item-date { font-size: 11px; color: #6e7681; }
        .item-description { font-size: 12px; color: #c9d1d9; line-height: 1.6; margin-top: 6px; }
        .skills { display: flex; flex-wrap: wrap; gap: 6px; }
        .skill { background: #161b22; padding: 3px 8px; border-radius: 6px; font-size: 11px; color: #58a6ff; border: 1px solid #30363d; }
        .skill::before { content: '['; color: #8b949e; }
        .skill::after { content: ']'; color: #8b949e; }
    </style>
</head>
<body>
    <div class="header">
        <div class="name">${data.personal.fullName || 'your_name'}</div>
        <div class="title">${data.personal.jobTitle || '// professional_title'}</div>
        <div class="contact">
            ${data.personal.email ? `<span>${data.personal.email}</span>` : ''}
            ${data.personal.phone ? `<span>${data.personal.phone}</span>` : ''}
            ${data.personal.location ? `<span>${data.personal.location}</span>` : ''}
            ${data.personal.website ? `<span>${data.personal.website}</span>` : ''}
        </div>
    </div>
    
    ${data.summary ? `<h2>summary</h2><p class="summary">${data.summary}</p>` : ''}
    
    ${data.experience.length ? `<h2>experience</h2>${data.experience.map(exp => `
        <div class="item">
            <div class="item-title">${exp.title}</div>
            <div class="item-subtitle">${exp.subtitle} • ${formatDate(exp.date)}</div>
            ${exp.description ? `<p class="item-description">${exp.description}</p>` : ''}
        </div>
    `).join('')}` : ''}
    
    ${data.education.length ? `<h2>education</h2>${data.education.map(edu => `
        <div class="item">
            <div class="item-title">${edu.title}</div>
            <div class="item-subtitle">${edu.subtitle} • ${formatDate(edu.date)}</div>
        </div>
    `).join('')}` : ''}
    
    ${data.skills.length ? `<h2>skills</h2><div class="skills">${data.skills.map(s => `<span class="skill">${s.name}</span>`).join('')}</div>` : ''}
    
    ${data.projects.length ? `<h2>projects</h2>${data.projects.map(p => `
        <div class="item">
            <div class="item-title">${p.title}</div>
            ${p.description ? `<p class="item-description">${p.description}</p>` : ''}
        </div>
    `).join('')}` : ''}
</body>
</html>`;
}

function generateAtsTemplate(data, font, color) {
    return `<!DOCTYPE html>
<html>
<head>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=${font.replace(' ', '+')}:wght@400;500;600&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: '${font}', Arial, sans-serif; line-height: 1.5; max-width: 210mm; margin: 0 auto; background: white; color: #000; padding: 10mm; }
        .header { margin-bottom: 15px; }
        .name { font-size: 20px; font-weight: 700; }
        .title { font-size: 13px; margin-top: 3px; }
        .contact { font-size: 11px; margin-top: 6px; }
        .contact span { margin-right: 15px; }
        h2 { font-size: 12px; font-weight: 700; margin: 15px 0 8px; text-transform: uppercase; }
        .summary { font-size: 11px; line-height: 1.5; margin-bottom: 12px; }
        .item { margin-bottom: 10px; }
        .item-header { display: flex; justify-content: space-between; }
        .item-title { font-weight: 600; font-size: 12px; }
        .item-subtitle { font-size: 11px; }
        .item-date { font-size: 11px; }
        .item-description { font-size: 11px; line-height: 1.5; margin-top: 4px; }
        .skills { font-size: 11px; }
        .skills span { margin-right: 10px; }
    </style>
</head>
<body>
    <div class="header">
        <div class="name">${data.personal.fullName || 'YOUR NAME'}</div>
        <div class="title">${data.personal.jobTitle || 'TARGET POSITION'}</div>
        <div class="contact">
            ${data.personal.email ? `<span>${data.personal.email}</span>` : ''}
            ${data.personal.phone ? `<span>${data.personal.phone}</span>` : ''}
            ${data.personal.location ? `<span>${data.personal.location}</span>` : ''}
        </div>
    </div>
    
    ${data.summary ? `<h2>PROFESSIONAL SUMMARY</h2><p class="summary">${data.summary}</p>` : ''}
    
    ${data.experience.length ? `<h2>WORK EXPERIENCE</h2>${data.experience.map(exp => `
        <div class="item">
            <div class="item-header">
                <span class="item-title">${exp.title}</span>
                <span class="item-date">${formatDate(exp.date)}</span>
            </div>
            <div class="item-subtitle">${exp.subtitle}, ${exp.location}</div>
            ${exp.description ? `<p class="item-description">${exp.description}</p>` : ''}
        </div>
    `).join('')}` : ''}
    
    ${data.education.length ? `<h2>EDUCATION</h2>${data.education.map(edu => `
        <div class="item">
            <div class="item-header">
                <span class="item-title">${edu.title}</span>
                <span class="item-date">${formatDate(edu.date)}</span>
            </div>
            <div class="item-subtitle">${edu.subtitle}</div>
        </div>
    `).join('')}` : ''}
    
    ${data.skills.length ? `<h2>SKILLS</h2><p class="skills">${data.skills.map(s => s.name).join(' | ')}</p>` : ''}
    
    ${data.certifications.length ? `<h2>CERTIFICATIONS</h2>${data.certifications.map(c => `
        <div class="item">
            <span class="item-title">${c.title}</span> - <span class="item-subtitle">${c.subtitle}</span>
        </div>
    `).join('')}` : ''}
</body>
</html>`;
}

function generateTimelineTemplate(data, font, color) {
    return `<!DOCTYPE html>
<html>
<head>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=${font.replace(' ', '+')}:wght@300;400;500;600;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: '${font}', sans-serif; line-height: 1.6; max-width: 210mm; margin: 0 auto; background: white; padding: 15mm; }
        .header { text-align: center; margin-bottom: 30px; }
        .name { font-size: 28px; font-weight: 700; color: #1e293b; }
        .title { font-size: 14px; color: ${color}; margin-top: 6px; }
        .contact { display: flex; justify-content: center; gap: 20px; flex-wrap: wrap; margin-top: 12px; font-size: 13px; color: #64748b; }
        h2 { font-size: 14px; font-weight: 600; color: #1e293b; margin: 25px 0 15px; text-align: center; }
        .timeline { position: relative; padding-left: 50%; }
        .timeline::before { content: ''; position: absolute; left: 50%; top: 0; bottom: 0; width: 2px; background: ${color}; transform: translateX(-50%); }
        .timeline-item { position: relative; margin-bottom: 25px; width: 45%; }
        .timeline-item:nth-child(odd) { left: 0; text-align: right; padding-right: 30px; }
        .timeline-item:nth-child(even) { left: 55%; text-align: left; padding-left: 30px; }
        .timeline-item::before { content: ''; position: absolute; top: 5px; width: 12px; height: 12px; background: ${color}; border-radius: 50%; }
        .timeline-item:nth-child(odd)::before { right: -36px; }
        .timeline-item:nth-child(even)::before { left: -36px; }
        .item-title { font-weight: 600; font-size: 14px; color: #1e293b; }
        .item-subtitle { font-size: 13px; color: #64748b; }
        .item-date { font-size: 12px; color: ${color}; font-weight: 500; margin: 4px 0; }
        .item-description { font-size: 13px; color: #64748b; line-height: 1.6; margin-top: 6px; }
        .summary { font-size: 13px; color: #475569; max-width: 600px; margin: 0 auto 25px; text-align: center; }
    </style>
</head>
<body>
    <div class="header">
        <div class="name">${data.personal.fullName || 'Your Name'}</div>
        <div class="title">${data.personal.jobTitle || 'Professional Title'}</div>
        <div class="contact">
            ${data.personal.email ? `<span>${data.personal.email}</span>` : ''}
            ${data.personal.phone ? `<span>${data.personal.phone}</span>` : ''}
            ${data.personal.location ? `<span>${data.personal.location}</span>` : ''}
        </div>
    </div>
    
    ${data.summary ? `<p class="summary">${data.summary}</p>` : ''}
    
    ${data.experience.length ? `<h2>Experience</h2><div class="timeline">${data.experience.map(exp => `
        <div class="timeline-item">
            <div class="item-title">${exp.title}</div>
            <div class="item-subtitle">${exp.subtitle}</div>
            <div class="item-date">${formatDate(exp.date)}</div>
            ${exp.description ? `<p class="item-description">${exp.description}</p>` : ''}
        </div>
    `).join('')}</div>` : ''}
    
    ${data.education.length ? `<h2>Education</h2><div class="timeline">${data.education.map(edu => `
        <div class="timeline-item">
            <div class="item-title">${edu.title}</div>
            <div class="item-subtitle">${edu.subtitle}</div>
            <div class="item-date">${formatDate(edu.date)}</div>
        </div>
    `).join('')}</div>` : ''}
</body>
</html>`;
}

function generateGradientTemplate(data, font, color) {
    return `<!DOCTYPE html>
<html>
<head>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=${font.replace(' ', '+')}:wght@300;400;500;600;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: '${font}', sans-serif; line-height: 1.6; max-width: 210mm; margin: 0 auto; background: white; min-height: 297mm; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; }
        .name { font-size: 32px; font-weight: 700; letter-spacing: -1px; }
        .title { font-size: 14px; opacity: 0.9; margin-top: 6px; }
        .contact { display: flex; gap: 15px; flex-wrap: wrap; margin-top: 15px; font-size: 13px; opacity: 0.9; }
        .content { padding: 30px; }
        h2 { font-size: 14px; font-weight: 600; color: #667eea; margin: 25px 0 15px; text-transform: uppercase; letter-spacing: 1px; }
        .summary { font-size: 13px; line-height: 1.7; color: #475569; background: linear-gradient(135deg, #f0f9ff, #e0f2fe); padding: 15px; border-radius: 10px; }
        .item { margin-bottom: 18px; }
        .item-title { font-weight: 600; font-size: 14px; color: #1e293b; }
        .item-subtitle { font-size: 13px; color: #64748b; }
        .item-date { font-size: 12px; color: #94a3b8; }
        .item-description { font-size: 13px; color: #64748b; line-height: 1.6; margin-top: 6px; }
        .skills { display: flex; flex-wrap: wrap; gap: 8px; }
        .skill { background: linear-gradient(135deg, #667eea20, #764ba220); padding: 6px 12px; border-radius: 20px; font-size: 12px; color: #667eea; font-weight: 500; border: 1px solid #667eea30; }
    </style>
</head>
<body>
    <div class="header">
        <div class="name">${data.personal.fullName || 'Your Name'}</div>
        <div class="title">${data.personal.jobTitle || 'Professional Title'}</div>
        <div class="contact">
            ${data.personal.email ? `<span>✉ ${data.personal.email}</span>` : ''}
            ${data.personal.phone ? `<span>✆ ${data.personal.phone}</span>` : ''}
            ${data.personal.location ? `<span>⌂ ${data.personal.location}</span>` : ''}
            ${data.personal.website ? `<span>⚑ ${data.personal.website}</span>` : ''}
        </div>
    </div>
    
    <div class="content">
        ${data.summary ? `<h2>About</h2><p class="summary">${data.summary}</p>` : ''}
        
        ${data.experience.length ? `<h2>Experience</h2>${data.experience.map(exp => `
            <div class="item">
                <div class="item-title">${exp.title}</div>
                <div class="item-subtitle">${exp.subtitle} • ${formatDate(exp.date)}</div>
                ${exp.description ? `<p class="item-description">${exp.description}</p>` : ''}
            </div>
        `).join('')}` : ''}
        
        ${data.education.length ? `<h2>Education</h2>${data.education.map(edu => `
            <div class="item">
                <div class="item-title">${edu.title}</div>
                <div class="item-subtitle">${edu.subtitle} • ${formatDate(edu.date)}</div>
            </div>
        `).join('')}` : ''}
        
        ${data.skills.length ? `<h2>Skills</h2><div class="skills">${data.skills.map(s => `<span class="skill">${s.name}</span>`).join('')}</div>` : ''}
        
        ${data.projects.length ? `<h2>Projects</h2>${data.projects.map(p => `
            <div class="item">
                <div class="item-title">${p.title}</div>
                ${p.description ? `<p class="item-description">${p.description}</p>` : ''}
            </div>
        `).join('')}` : ''}
    </div>
</body>
</html>`;
}

function generateInternationalTemplate(data, font, color) {
    return `<!DOCTYPE html>
<html>
<head>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=${font.replace(' ', '+')}:wght@300;400;500;600;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: '${font}', sans-serif; line-height: 1.6; max-width: 210mm; margin: 0 auto; background: white; padding: 15mm; }
        .header { border: 2px solid #003399; padding: 20px; margin-bottom: 20px; background: linear-gradient(90deg, #003399 0%, #ffcc00 50%, #003399 100%); color: white; }
        .name { font-size: 24px; font-weight: 700; text-align: center; }
        .title { font-size: 13px; text-align: center; margin-top: 6px; opacity: 0.9; }
        .contact { display: flex; justify-content: center; gap: 20px; flex-wrap: wrap; margin-top: 12px; font-size: 12px; }
        .content { padding: 10px; }
        h2 { font-size: 13px; font-weight: 700; color: #003399; margin: 20px 0 10px; padding: 8px 12px; background: #f0f4ff; border-left: 4px solid #003399; }
        .summary { font-size: 12px; line-height: 1.7; color: #333; }
        .item { margin-bottom: 15px; padding: 10px; border: 1px solid #e0e0e0; }
        .item-title { font-weight: 600; font-size: 13px; color: #003399; }
        .item-subtitle { font-size: 12px; color: #666; }
        .item-date { font-size: 11px; color: #888; }
        .item-description { font-size: 12px; color: #555; line-height: 1.6; margin-top: 6px; }
        table { width: 100%; border-collapse: collapse; margin: 10px 0; }
        td { padding: 8px; border: 1px solid #ddd; font-size: 12px; }
        th { background: #f0f4ff; padding: 10px; text-align: left; font-size: 12px; color: #003399; }
    </style>
</head>
<body>
    <div class="header">
        <div class="name">${data.personal.fullName || 'YOUR NAME'}</div>
        <div class="title">${data.personal.jobTitle || 'PROFESSIONAL TITLE'}</div>
        <div class="contact">
            ${data.personal.email ? `<span>📧 ${data.personal.email}</span>` : ''}
            ${data.personal.phone ? `<span>📱 ${data.personal.phone}</span>` : ''}
            ${data.personal.location ? `<span>🏠 ${data.personal.location}</span>` : ''}
        </div>
    </div>
    
    <div class="content">
        ${data.summary ? `<h2>PERSONAL STATEMENT</h2><p class="summary">${data.summary}</p>` : ''}
        
        ${data.experience.length ? `<h2>WORK EXPERIENCE</h2>${data.experience.map(exp => `
            <div class="item">
                <div class="item-title">${exp.title}</div>
                <div class="item-subtitle">${exp.subtitle} | ${formatDate(exp.date)} | ${exp.location}</div>
                ${exp.description ? `<p class="item-description">${exp.description}</p>` : ''}
            </div>
        `).join('')}` : ''}
        
        ${data.education.length ? `<h2>EDUCATION AND TRAINING</h2>${data.education.map(edu => `
            <div class="item">
                <div class="item-title">${edu.title}</div>
                <div class="item-subtitle">${edu.subtitle} | ${formatDate(edu.date)}</div>
            </div>
        `).join('')}` : ''}
        
        ${data.skills.length ? `<h2>PERSONAL SKILLS</h2>
        <table>
            <tr><th>Technical Skills</th></tr>
            <tr><td>${data.skills.map(s => s.name).join(', ')}</td></tr>
        </table>` : ''}
        
        ${data.languages.length ? `<h2>LANGUAGES</h2>
        <table>
            <tr><th>Language</th><th>Proficiency Level</th></tr>
            ${data.languages.map(l => `<tr><td>${l.language}</td><td>${capitalize(l.proficiency)}</td></tr>`).join('')}
        </table>` : ''}
        
        ${data.certifications.length ? `<h2>CERTIFICATES AND AWARDS</h2>${data.certifications.map(c => `
            <div class="item">
                <div class="item-title">${c.title}</div>
                <div class="item-subtitle">${c.subtitle} | ${formatDate(c.date)}</div>
            </div>
        `).join('')}` : ''}
    </div>
</body>
</html>`;
}

// Helper Functions
function formatDate(dateStr) {
    if (!dateStr) return '';
    return dateStr;
}

function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Zoom Controls
function adjustZoom(delta) {
    state.zoom = Math.max(50, Math.min(150, state.zoom + delta));
    elements.zoomLevel.textContent = `${state.zoom}%`;
    elements.previewFrame.style.transform = `scale(${state.zoom / 100})`;
    elements.previewFrame.style.transformOrigin = 'top left';
}

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        elements.previewContainer.requestFullscreen().catch(err => {
            showToast('Fullscreen not supported', 'warning');
        });
    } else {
        document.exitFullscreen();
    }
}

// Dark Mode
function toggleDarkMode() {
    state.darkMode = !state.darkMode;
    document.documentElement.setAttribute('data-theme', state.darkMode ? 'dark' : 'light');
    elements.darkModeToggle.innerHTML = state.darkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    saveToStorage();
    showToast(state.darkMode ? 'Dark mode enabled' : 'Light mode enabled', 'success');
}

// Storage Functions
function saveToStorage() {
    localStorage.setItem('resumeData', JSON.stringify(state.resumeData));
    localStorage.setItem('resumeSettings', JSON.stringify({
        template: state.template,
        font: state.font,
        accentColor: state.accentColor,
        darkMode: state.darkMode
    }));
}

function loadFromStorage() {
    const savedData = localStorage.getItem('resumeData');
    const savedSettings = localStorage.getItem('resumeSettings');
    
    if (savedData) {
        state.resumeData = JSON.parse(savedData);
        loadResumeData();
        
        // Add initial state to history
        state.history = [JSON.stringify(state.resumeData)];
        state.historyIndex = 0;
    }
    
    if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        state.template = settings.template || 'minimal';
        state.font = settings.font || 'Inter';
        state.accentColor = settings.accentColor || '#2563eb';
        state.darkMode = settings.darkMode || false;
        
        elements.templateSelect.value = state.template;
        elements.fontSelect.value = state.font;
        elements.accentColor.value = state.accentColor;
        
        if (state.darkMode) {
            document.documentElement.setAttribute('data-theme', 'dark');
            elements.darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }
    }
}

// Export/Import
function exportData() {
    const data = JSON.stringify(state.resumeData, null, 2);
    elements.importData.value = data;
    elements.importModal.classList.remove('hidden');
    showToast('Copy the JSON data to save your resume', 'success');
}

function importData() {
    try {
        const data = JSON.parse(elements.importData.value);
        state.resumeData = data;
        loadResumeData();
        saveState();
        elements.importModal.classList.add('hidden');
        showToast('Resume data imported successfully', 'success');
    } catch (e) {
        showToast('Invalid JSON format', 'error');
    }
}

// PDF Download
async function downloadPDF() {
    showToast('Generating PDF...', 'success');
    
    const iframe = elements.previewFrame;
    const element = iframe.contentDocument.body;
    
    try {
        const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            logging: false
        });
        
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jspdf.jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });
        
        const imgWidth = 210;
        const pageHeight = 297;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;
        
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        
        while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }
        
        const name = state.resumeData.personal.fullName || 'resume';
        pdf.save(`${name.replace(/\s+/g, '_')}_resume.pdf`);
        showToast('PDF downloaded successfully!', 'success');
    } catch (e) {
        showToast('Error generating PDF', 'error');
        console.error(e);
    }
}

// Strength Meter
function updateStrengthMeter() {
    let score = 0;
    const maxScore = 8;
    
    if (state.resumeData.personal.fullName) score++;
    if (state.resumeData.personal.email) score++;
    if (state.resumeData.personal.phone) score++;
    if (state.resumeData.summary) score++;
    if (state.resumeData.experience.length > 0) score++;
    if (state.resumeData.education.length > 0) score++;
    if (state.resumeData.skills.length > 0) score++;
    if (state.resumeData.languages.length > 0 || state.resumeData.projects.length > 0) score++;
    
    const percentage = Math.round((score / maxScore) * 100);
    elements.strengthFill.style.width = `${percentage}%`;
    elements.strengthPercent.textContent = `${percentage}%`;
}

// Keyboard Shortcuts
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey || e.metaKey) {
            switch (e.key.toLowerCase()) {
                case 's':
                    e.preventDefault();
                    saveToStorage();
                    showToast('Saved successfully', 'success');
                    break;
                case 'z':
                    e.preventDefault();
                    if (e.shiftKey) redo();
                    else undo();
                    break;
                case 'y':
                    e.preventDefault();
                    redo();
                    break;
                case 'p':
                    e.preventDefault();
                    downloadPDF();
                    break;
            }
        }
    });
}

// Toast Notifications
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'exclamation-triangle'}"></i>
        <span class="toast-message">${message}</span>
        <button class="toast-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    elements.toastContainer.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideInRight 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Make functions globally available
window.removeDynamicItem = removeDynamicItem;
window.updateDynamicItem = updateDynamicItem;
window.removeSkill = removeSkill;
