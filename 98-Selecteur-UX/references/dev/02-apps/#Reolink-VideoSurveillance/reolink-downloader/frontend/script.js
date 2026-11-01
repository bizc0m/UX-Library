// Global variables
let selectedDays = [];
let allClips = [];

// DOM Elements
const connectionForm = document.getElementById('connectionForm');
const connectBtn = document.getElementById('connectBtn');
const discoverBtn = document.getElementById('discoverBtn');
const connectionStatus = document.getElementById('connectionStatus');
const recordDaysSection = document.getElementById('recordDaysSection');
const dateRangeSection = document.getElementById('dateRangeSection');
const progressSection = document.getElementById('progressSection');
const daysGrid = document.getElementById('daysGrid');
const clipsContainer = document.getElementById('clipsContainer');
const progressContainer = document.getElementById('progressContainer');
const selectAllBtn = document.getElementById('selectAllBtn');
const deselectAllBtn = document.getElementById('deselectAllBtn');
const listClipsBtn = document.getElementById('listClipsBtn');
const selectAllClipsBtn = document.getElementById('selectAllClipsBtn');
const downloadBtn = document.getElementById('downloadBtn');
const resetBtn = document.getElementById('resetBtn');
const camerasList = document.getElementById('camerasList');
const discoveryResults = document.getElementById('discoveryResults');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Set default date range to current week
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    
    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() + (6 - today.getDay()));
    
    document.getElementById('startDate').valueAsDate = startOfWeek;
    document.getElementById('endDate').valueAsDate = endOfWeek;
    
    // Event listeners
    connectionForm.addEventListener('submit', handleConnection);
    discoverBtn.addEventListener('click', discoverCameras);
    selectAllBtn.addEventListener('click', selectAllDays);
    deselectAllBtn.addEventListener('click', deselectAllDays);
    listClipsBtn.addEventListener('click', listClips);
    selectAllClipsBtn.addEventListener('click', selectAllClips);
    downloadBtn.addEventListener('click', downloadClips);
    resetBtn.addEventListener('click', resetApplication);
});

// Handle connection to camera
async function handleConnection(e) {
    e.preventDefault();
    
    const formData = new FormData(connectionForm);
    const cameraIP = formData.get('cameraIP');
    const port = formData.get('port');
    const username = formData.get('username');
    const password = formData.get('password');
    
    try {
        connectBtn.disabled = true;
        connectBtn.textContent = 'Connexion en cours...';
        
        const response = await fetch('/connect', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ip: cameraIP,
                port: parseInt(port),
                username,
                password
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            connectionStatus.className = 'success';
            connectionStatus.textContent = 'Connexion réussie à la caméra !';
            
            // Show record days section
            recordDaysSection.style.display = 'block';
            
            // Load record days
            loadRecordDays();
        } else {
            connectionStatus.className = 'error';
            connectionStatus.textContent = result.message || 'Échec de la connexion.';
        }
    } catch (error) {
        console.error('Connection error:', error);
        connectionStatus.className = 'error';
        connectionStatus.textContent = 'Erreur de connexion : ' + error.message;
    } finally {
        connectBtn.disabled = false;
        connectBtn.textContent = 'Se connecter';
    }
}

// Load record days
async function loadRecordDays() {
    try {
        const response = await fetch('/record-days');
        const result = await response.json();
        
        if (result.success) {
            displayRecordDays(result.days);
        } else {
            console.error('Failed to load record days:', result.message);
        }
    } catch (error) {
        console.error('Error loading record days:', error);
    }
}

// Display record days in calendar grid
function displayRecordDays(days) {
    if (!days || days.length === 0) {
        daysGrid.innerHTML = '<p>Aucun enregistrement disponible.</p>';
        return;
    }
    
    daysGrid.innerHTML = '';
    
    days.forEach(day => {
        const dayCard = document.createElement('div');
        dayCard.className = 'day-card';
        dayCard.innerHTML = `<span>${day}</span>`;
        dayCard.dataset.date = day;
        
        dayCard.addEventListener('click', function() {
            toggleDaySelection(this);
        });
        
        daysGrid.appendChild(dayCard);
    });
}

// Toggle day selection
function toggleDaySelection(element) {
    element.classList.toggle('selected');
    
    const date = element.dataset.date;
    const index = selectedDays.indexOf(date);
    
    if (index > -1) {
        selectedDays.splice(index, 1);
    } else {
        selectedDays.push(date);
    }
}

// Select all days
function selectAllDays() {
    const dayCards = document.querySelectorAll('.day-card');
    dayCards.forEach(card => {
        if (!card.classList.contains('selected')) {
            card.classList.add('selected');
            selectedDays.push(card.dataset.date);
        }
    });
}

// Deselect all days
function deselectAllDays() {
    const dayCards = document.querySelectorAll('.day-card');
    dayCards.forEach(card => {
        card.classList.remove('selected');
    });
    selectedDays = [];
}

// List clips for selected date range
async function listClips() {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    
    if (!startDate || !endDate) {
        alert('Veuillez sélectionner une période.');
        return;
    }
    
    try {
        const response = await fetch('/list-clips', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                start: startDate,
                end: endDate
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            allClips = result.clips;
            displayClips(result.clips);
            
            // Show clips section
            document.getElementById('clipListSection').style.display = 'block';
        } else {
            console.error('Failed to list clips:', result.message);
            alert('Erreur lors de la liste des clips : ' + result.message);
        }
    } catch (error) {
        console.error('Error listing clips:', error);
        alert('Erreur lors de la liste des clips : ' + error.message);
    }
}

// Display clips in a table
function displayClips(clips) {
    clipsContainer.innerHTML = '';
    
    if (!clips || clips.length === 0) {
        clipsContainer.innerHTML = '<p>Aucun clip disponible pour cette période.</p>';
        return;
    }
    
    clips.forEach(clip => {
        const clipItem = document.createElement('div');
        clipItem.className = 'clip-item';
        clipItem.innerHTML = `
            <input type="checkbox" id="clip-${clip.id}">
            <div class="clip-details">
                <div class="clip-name">${clip.name}</div>
                <div class="clip-date">${clip.date ? new Date(clip.date).toLocaleString('fr-FR') : 'Date non disponible'}</div>
                <div class="clip-duration">Durée: ${clip.duration} secondes</div>
            </div>
        `;
        
        clipsContainer.appendChild(clipItem);
    });
}

// Select all clips
function selectAllClips() {
    const checkboxes = document.querySelectorAll('.clip-item input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = true;
    });
}

// Download selected clips
async function downloadClips() {
    // Get selected clips
    const checkedClips = [];
    allClips.forEach(clip => {
        const checkbox = document.getElementById(`clip-${clip.id}`);
        if (checkbox && checkbox.checked) {
            checkedClips.push(clip);
        }
    });
    
    if (checkedClips.length === 0) {
        alert('Veuillez sélectionner au moins un clip à télécharger.');
        return;
    }
    
    // Hide date range section and show progress
    dateRangeSection.style.display = 'none';
    progressSection.style.display = 'block';
    
    // Simulate download progress
    simulateDownloadProgress(checkedClips);
}

// Simulate download progress
async function simulateDownloadProgress(clips) {
    const totalClips = clips.length;
    let completedCount = 0;
    
    progressContainer.innerHTML = `<p>Téléchargement en cours... (${completedCount}/${totalClips} clips)</p>`;
    
    // Show progress bar for first clip with initial progress
    const progressBar = document.createElement('div');
    progressBar.className = 'progress-item';
    progressBar.innerHTML = `
        <div class="progress-name">${clips[0].name}</div>
        <div class="progress-bar">
            <div class="progress-fill" style="width: 0%"></div>
        </div>
        <div class="status-text">En cours...</div>
    `;
    
    progressContainer.appendChild(progressBar);
    
    for (let i = 0; i < clips.length; i++) {
        const clip = clips[i];
        const progressFill = document.createElement('div');
        progressFill.className = 'progress-fill';
        progressFill.style.width = '0%';
        
        // Create a new progress item
        const progressItem = document.createElement('div');
        progressItem.className = 'progress-item';
        progressItem.innerHTML = `
            <div class="progress-name">${clip.name}</div>
            <div class="progress-bar">
                ${progressFill.outerHTML}
            </div>
            <div class="status-text">En cours...</div>
        `;
        
        // Add to container
        progressContainer.appendChild(progressItem);
        
        // Simulate download progress for this clip (10-30 seconds)
        const duration = 10000 + Math.random() * 20000; // 10-30 seconds
        
        // Update progress periodically
        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                
                // Update status text
                const statusText = progressItem.querySelector('.status-text');
                if (statusText) {
                    statusText.textContent = 'Terminé';
                    statusText.style.color = '#27ae60';
                }
                
                completedCount++;
                updateProgressDisplay(completedCount, totalClips);
            }
            
            // Update progress bar
            const fill = progressItem.querySelector('.progress-fill');
            if (fill) {
                fill.style.width = `${progress}%`;
            }
        }, 500); // Update every 500ms
        
        // Wait for this clip to 'download' before starting the next one
        await new Promise(resolve => setTimeout(resolve, duration));
    }
}

// Update progress display
function updateProgressDisplay(completed, total) {
    const progressP = document.querySelector('#progressContainer p');
    if (progressP) {
        progressP.textContent = `Téléchargement en cours... (${completed}/${total} clips)`;
    }
}

// Reset application to initial state
function resetApplication() {
    // Reset selected days
    selectedDays = [];
    
    // Hide sections
    recordDaysSection.style.display = 'none';
    dateRangeSection.style.display = 'none';
    progressSection.style.display = 'none';
    
    // Show connection section and reset form
    document.getElementById('connectionForm').reset();
    connectionStatus.textContent = '';
    connectionStatus.className = '';
    
    // Clear displays
    daysGrid.innerHTML = '';
    clipsContainer.innerHTML = '';
    progressContainer.innerHTML = '';
    
    // Reset buttons
    downloadBtn.disabled = true;
}