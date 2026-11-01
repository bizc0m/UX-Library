// Reolink Mass Downloader - JavaScript
// Global variables
let selectedDays = [];
let allClips = [];
let dateRanges = [];

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
const dateRangesContainer = document.getElementById('dateRangesContainer');
const addDateRangeBtn = document.getElementById('addDateRangeBtn');

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
    addDateRangeBtn.addEventListener('click', addDateRange);
    selectAllBtn.addEventListener('click', selectAllDays);
    deselectAllBtn.addEventListener('click', deselectAllDays);
    listClipsBtn.addEventListener('click', listClips);
    selectAllClipsBtn.addEventListener('click', selectAllClips);
    downloadBtn.addEventListener('click', downloadClips);
    resetBtn.addEventListener('click', resetApplication);
    
    // Add initial date range
    addDateRange();
});

// Add a new date range input
function addDateRange() {
    const dateRangeElement = document.createElement('div');
    dateRangeElement.className = 'date-range-item';
    dateRangeElement.innerHTML = `
        <div class="form-group">
            <label>Plage ${dateRanges.length + 1} - Début :</label>
            <input type="date" class="startDate" required>
        </div>
        <div class="form-group">
            <label>Plage ${dateRanges.length + 1} - Fin :</label>
            <input type="date" class="endDate" required>
        </div>
    `;
    
    dateRangesContainer.appendChild(dateRangeElement);
    
    // Set default values for new range
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    
    const endOfWeek = new Date(now);
    endOfWeek.setDate(now.getDate() + (6 - now.getDay()));
    
    dateRangeElement.querySelector('.startDate').valueAsDate = startOfWeek;
    dateRangeElement.querySelector('.endDate').valueAsDate = endOfWeek;
    
    // Add to array
    dateRanges.push({
        start: startOfWeek.toISOString().split('T')[0],
        end: endOfWeek.toISOString().split('T')[0]
    });
}

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
        
        // In a real implementation, we would test connection to the camera
        // For now, we'll simulate successful connection
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        connectionStatus.className = 'success';
        connectionStatus.textContent = 'Connexion réussie à la caméra !';
        
        // Show record days section
        recordDaysSection.style.display = 'block';
        
        // Simulate loading of record days (in a real app this would call the API)
        setTimeout(() => {
            displayRecordDays(["2025-08-01", "2025-08-02", "2025-08-07"]);
        }, 500);
        
    } catch (error) {
        console.error('Connection error:', error);
        connectionStatus.className = 'error';
        connectionStatus.textContent = 'Erreur de connexion : ' + error.message;
    } finally {
        connectBtn.disabled = false;
        connectBtn.textContent = 'Se connecter';
    }
}

// Discover Reolink cameras on the network
async function discoverCameras() {
    try {
        // In a real implementation, this would scan local network for Reolink cameras
        // We'll simulate discovery with some test cameras
        
        const cameras = [
            { ip: "192.168.1.42", port: 80, status: "active" },
            { ip: "192.168.1.100", port: 80, status: "active" },
            { ip: "192.168.1.200", port: 80, status: "inactive" }
        ];
        
        displayDiscoveredCameras(cameras);
    } catch (error) {
        console.error('Discovery error:', error);
        connectionStatus.className = 'error';
        connectionStatus.textContent = 'Erreur lors de la découverte : ' + error.message;
    }
}

// Display discovered cameras
function displayDiscoveredCameras(cameras) {
    camerasList.innerHTML = '';
    
    cameras.forEach(camera => {
        const cameraDiv = document.createElement('div');
        cameraDiv.className = 'camera-item';
        cameraDiv.innerHTML = `
            <strong>${camera.ip}</strong> (port: ${camera.port}) - 
            ${camera.status === 'active' ? 'Connecté' : 'Non connecté'}
            <button onclick="connectToCamera('${camera.ip}', ${camera.port})">Se connecter</button>
        `;
        camerasList.appendChild(cameraDiv);
    });
    
    discoveryResults.style.display = 'block';
}

// Connect to a specific camera from discovery
function connectToCamera(ip, port) {
    document.getElementById('cameraIP').value = ip;
    document.getElementById('port').value = port;
    discoveryResults.style.display = 'none';
    
    // Trigger auto-connection simulation
    const event = new Event('submit', { cancelable: true });
    connectionForm.dispatchEvent(event);
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

// List clips for selected date ranges
async function listClips() {
    // In a real implementation, this would fetch the actual clips from the API
    // For now we'll simulate with sample data
    
    try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const sampleClips = [
            { id: '1', name: 'clip_20250801_143022.mp4', date: '2025-08-01T14:30:22Z', duration: 30, eventType: 'Motion' },
            { id: '2', name: 'clip_20250801_164533.mp4', date: '2025-08-01T16:45:33Z', duration: 45, eventType: 'Personne' },
            { id: '3', name: 'clip_20250802_091511.mp4', date: '2025-08-02T09:15:11Z', duration: 20, eventType: 'Véhicule' },
            { id: '4', name: 'clip_20250807_220512.mp4', date: '2025-08-07T22:05:12Z', duration: 60, eventType: 'Motion' },
        ];
        
        allClips = sampleClips;
        displayClips(sampleClips);
        
        // Show clips section
        document.getElementById('clipListSection').style.display = 'block';
        downloadBtn.disabled = false;
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
                <div class="clip-date">${new Date(clip.date).toLocaleString('fr-FR')}</div>
                <div class="clip-duration">Durée: ${clip.duration} secondes - Type: ${clip.eventType}</div>
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
function simulateDownloadProgress(clips) {
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
        setTimeout(() => {}, duration);
    }
    
    // Add final message when all complete
    setTimeout(() => {
        progressContainer.innerHTML += '<p style="margin-top: 20px; text-align: center; font-weight: bold;">Tous les téléchargements terminés !</p>';
    }, clips.length * 30000);
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