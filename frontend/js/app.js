// Main application JavaScript
document.addEventListener('DOMContentLoaded', function() {
    console.log('🐐 Goat Project initialized');
    
    // Check API health on load
    checkApiHealth();
    
    // Initialize event listeners
    initializeEventListeners();
    
    // Load initial data
    loadGoats();
});

// API base URL
const API_BASE = '/api';

// Check if the API is running
async function checkApiHealth() {
    try {
        const response = await fetch(`${API_BASE}/health`);
        const data = await response.json();
        
        const statusElement = document.getElementById('system-status');
        if (response.ok) {
            statusElement.textContent = '✅ Online';
            statusElement.style.color = '#27ae60';
        } else {
            statusElement.textContent = '❌ Offline';
            statusElement.style.color = '#e74c3c';
        }
    } catch (error) {
        console.error('API health check failed:', error);
        const statusElement = document.getElementById('system-status');
        statusElement.textContent = '❌ Offline';
        statusElement.style.color = '#e74c3c';
    }
}

// Initialize event listeners
function initializeEventListeners() {
    const addGoatBtn = document.getElementById('add-goat-btn');
    const viewGoatsBtn = document.getElementById('view-goats-btn');
    
    if (addGoatBtn) {
        addGoatBtn.addEventListener('click', showAddGoatForm);
    }
    
    if (viewGoatsBtn) {
        viewGoatsBtn.addEventListener('click', loadGoats);
    }
}

// Load goats from the API
async function loadGoats() {
    try {
        // This will be implemented when the API endpoints are created
        console.log('Loading goats...');
        
        // For now, show placeholder data
        const goatList = document.getElementById('goat-list');
        goatList.innerHTML = `
            <div class="goat-item">
                <div class="goat-info">
                    <h4>Sample Goat</h4>
                    <p>Breed: Boer | Age: 3 years | Weight: 45kg</p>
                </div>
                <div class="goat-actions">
                    <button class="btn btn-secondary">Edit</button>
                </div>
            </div>
            <p style="text-align: center; color: #6c757d; margin-top: 1rem;">
                <em>API endpoints not yet implemented. This is placeholder data.</em>
            </p>
        `;
        
        // Update total count
        document.getElementById('total-goats').textContent = '1';
        
    } catch (error) {
        console.error('Error loading goats:', error);
        const goatList = document.getElementById('goat-list');
        goatList.innerHTML = '<p style="color: #e74c3c;">Error loading goats. Please try again.</p>';
    }
}

// Show add goat form
function showAddGoatForm() {
    // For now, just show an alert
    alert('Add Goat form will be implemented when the backend API is ready!');
    console.log('Add goat form requested');
}

// Utility function to format dates
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Utility function to handle API errors
function handleApiError(error) {
    console.error('API Error:', error);
    return {
        success: false,
        message: 'An error occurred while communicating with the server.'
    };
}