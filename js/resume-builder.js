// Resume Builder Logic
const form = document.getElementById('resume-form');
const preview = document.getElementById('resume-preview');
const exportBtn = document.getElementById('export-pdf');
const themeColorInput = document.querySelector('input[name="themeColor"]');
const templateSelect = document.querySelector('select[name="template"]');

let currentTemplate = 'template1';
let debounceTimeout;

function getFormData() {
  const data = {};
  new FormData(form).forEach((v, k) => data[k] = v);
  return data;
}

function updateResumePreview() {
  const data = getFormData();
  preview.innerHTML = renderResume(data);
  
  // Save form data to localStorage
  localStorage.setItem('resumeData', JSON.stringify(data));
}

function renderResume(data) {
  const skills = data.skills ? data.skills.split(',').map(s => `
    <span class="resume-skill" style="background: ${adjustColor(data.themeColor, 0.9)}; color: ${data.themeColor}">
      ${s.trim()}
    </span>
  `).join(' ') : '';

  const theme = data.themeColor || '#4f8cff';
  
  if (data.template === 'template2') {
    return `
      <div class="resume-template2" style="border-left: 8px solid ${theme}; padding: 32px;">
        <h2 style="color:${theme}; font-size: 2.5em; margin-bottom: 8px;">${data.name || ''}</h2>
        <h4 style="color:${adjustColor(theme, 0.7)}; font-size: 1.5em; margin-bottom: 24px;">${data.title || ''}</h4>
        
        <div class="resume-section">
          <h5 style="color:${theme}">Education</h5>
          <div>${formatEducation(data.education) || ''}</div>
        </div>

        <div class="resume-section">
          <h5 style="color:${theme}">Experience</h5>
          <div>${formatExperience(data.experience) || ''}</div>
        </div>

        <div class="resume-section">
          <h5 style="color:${theme}">Skills</h5>
          <div class="skills-container">${skills}</div>
        </div>
      </div>
    `;
  }

  // Default template1
  return `
    <div class="resume-template1" style="border:2px solid ${theme}; border-radius:16px; padding:32px; background:white;">
      <div style="text-align:center; margin-bottom:32px;">
        <h2 style="color:${theme}; font-size: 2.5em; margin-bottom: 8px;">${data.name || ''}</h2>
        <h4 style="color:${adjustColor(theme, 0.7)}; font-size: 1.5em;">${data.title || ''}</h4>
      </div>

      <div class="resume-section">
        <h5 style="color:${theme}; border-bottom: 2px solid ${adjustColor(theme, 0.9)}">Education</h5>
        <div>${formatEducation(data.education) || ''}</div>
      </div>

      <div class="resume-section">
        <h5 style="color:${theme}; border-bottom: 2px solid ${adjustColor(theme, 0.9)}">Experience</h5>
        <div>${formatExperience(data.experience) || ''}</div>
      </div>

      <div class="resume-section">
        <h5 style="color:${theme}; border-bottom: 2px solid ${adjustColor(theme, 0.9)}">Skills</h5>
        <div class="skills-container">${skills}</div>
      </div>
    </div>
  `;
}

// Helper functions
function adjustColor(color, factor) {
  const hex = color.replace('#', '');
  const r = Math.floor(parseInt(hex.substr(0, 2), 16) * factor);
  const g = Math.floor(parseInt(hex.substr(2, 2), 16) * factor);
  const b = Math.floor(parseInt(hex.substr(4, 2), 16) * factor);
  return `rgba(${r}, ${g}, ${b}, 0.1)`;
}

function formatEducation(education) {
  if (!education) return '';
  return education.split(',').map(edu => `
    <div class="education-item">
      <p>${edu.trim()}</p>
    </div>
  `).join('');
}

function formatExperience(experience) {
  if (!experience) return '';
  return experience.split(',').map(exp => `
    <div class="experience-item">
      <p>${exp.trim()}</p>
    </div>
  `).join('');
}

// Event Listeners
form.addEventListener('input', (e) => {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(updateResumePreview, 300);
});

themeColorInput?.addEventListener('input', updateResumePreview);
templateSelect?.addEventListener('change', updateResumePreview);

exportBtn?.addEventListener('click', function() {
  const element = preview.firstElementChild;
  const opt = {
    margin: 1,
    filename: 'resume.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
  };
  
  // Add loading state
  exportBtn.disabled = true;
  exportBtn.textContent = 'Generating PDF...';
  
  html2pdf().set(opt).from(element).save().then(() => {
    exportBtn.disabled = false;
    exportBtn.textContent = 'Export as PDF';
  });
});

// Load saved data on page load
document.addEventListener('DOMContentLoaded', () => {
  const savedData = localStorage.getItem('resumeData');
  if (savedData) {
    const data = JSON.parse(savedData);
    Object.entries(data).forEach(([key, value]) => {
      const input = form.querySelector(`[name="${key}"]`);
      if (input) input.value = value;
    });
    updateResumePreview();
  }
}); 