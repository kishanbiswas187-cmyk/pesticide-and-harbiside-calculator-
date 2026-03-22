// script.js

// ---------- Crop Data ----------
const crops = [
  { name: 'Tomato', family: 'nightshade', emoji: '🍅' },
  { name: 'Corn', family: 'grass', emoji: '🌽' },
  { name: 'Bean', family: 'legume', emoji: '🫘' },
  { name: 'Carrot', family: 'umbellifer', emoji: '🥕' },
  { name: 'Lettuce', family: 'aster', emoji: '🥬' },
  { name: 'Pepper', family: 'nightshade', emoji: '🫑' },
  { name: 'Pea', family: 'legume', emoji: '🫛' },
  { name: 'Onion', family: 'allium', emoji: '🧅' }
];

// Grid configuration
const GRID_SIZE = 4; // 4x4
let plots = []; // 2D array storing crop objects (or null)

// DOM elements
const farmGrid = document.getElementById('farmGrid');
const cropListDiv = document.getElementById('cropList');
const saveBtn = document.getElementById('saveBtn');
const loadBtn = document.getElementById('loadBtn');
const clearBtn = document.getElementById('clearBtn');

// Drag state
let draggedCrop = null;

// ---------- Initialize ----------
function initGrid() {
  // Create empty plots
  plots = Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(null));
  renderGrid();
}

function renderGrid() {
  farmGrid.innerHTML = '';
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      const plot = document.createElement('div');
      plot.className = 'plot';
      plot.dataset.row = row;
      plot.dataset.col = col;

      const crop = plots[row][col];
      if (crop) {
        plot.textContent = crop.emoji + ' ' + crop.name;
        plot.style.backgroundColor = '#c3e0b2'; // planted color
      } else {
        plot.textContent = '⬜';
        plot.style.backgroundColor = '#d4c9a6';
      }

      // Allow dropping on plots
      plot.addEventListener('dragover', (e) => e.preventDefault());
      plot.addEventListener('drop', handleDrop);

      // Click to show warning (or remove crop with double-click)
      plot.addEventListener('click', () => checkRotationForPlot(row, col));
      plot.addEventListener('dblclick', () => removeCrop(row, col));

      farmGrid.appendChild(plot);
    }
  }
}

// Populate crop sidebar
function renderCropList() {
  cropListDiv.innerHTML = '';
  crops.forEach(crop => {
    const item = document.createElement('div');
    item.className = 'crop-item';
    item.textContent = crop.emoji + ' ' + crop.name;
    item.draggable = true;
    item.dataset.crop = JSON.stringify(crop);
    item.addEventListener('dragstart', handleDragStart);
    item.addEventListener('dragend', handleDragEnd);
    cropListDiv.appendChild(item);
  });
}

// Drag handlers
function handleDragStart(e) {
  draggedCrop = JSON.parse(e.target.dataset.crop);
  e.dataTransfer.setData('text/plain', e.target.dataset.crop);
  e.target.style.opacity = '0.5';
}

function handleDragEnd(e) {
  e.target.style.opacity = '1';
}

function handleDrop(e) {
  e.preventDefault();
  if (!draggedCrop) return;

  const row = parseInt(e.target.dataset.row);
  const col = parseInt(e.target.dataset.col);
  
  // Assign crop to plot
  plots[row][col] = { ...draggedCrop };
  
  // Clear drag state
  draggedCrop = null;
  
  // Re-render grid and check warnings
  renderGrid();
  checkAllWarnings();
}

// Remove crop from a plot
function removeCrop(row, col) {
  plots[row][col] = null;
  renderGrid();
  checkAllWarnings();
}

// ---------- Rotation Warning Logic ----------
function checkRotationForPlot(row, col) {
  const crop = plots[row][col];
  if (!crop) {
    alert('This plot is empty.');
    return;
  }

  // Check adjacent plots (up, down, left, right) for same family
  const neighbors = [
    [row-1, col], [row+1, col], [row, col-1], [row, col+1]
  ];
  const sameFamilyNeighbors = neighbors.filter(([r, c]) => 
    r >= 0 && r < GRID_SIZE && c >= 0 && c < GRID_SIZE &&
    plots[r][c] && plots[r][c].family === crop.family
  );

  if (sameFamilyNeighbors.length > 0) {
    alert(`⚠️ Warning: ${crop.name} (${crop.family}) is next to same-family crops!`);
  } else {
    alert(`✅ ${crop.name} is safely placed.`);
  }
}

function checkAllWarnings() {
  // Clear previous warning styles
  document.querySelectorAll('.plot').forEach(plot => plot.classList.remove('warning'));

  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      const crop = plots[row][col];
      if (!crop) continue;

      // Check neighbors
      const neighbors = [
        [row-1, col], [row+1, col], [row, col-1], [row, col+1]
      ];
      const hasWarning = neighbors.some(([r, c]) => 
        r >= 0 && r < GRID_SIZE && c >= 0 && c < GRID_SIZE &&
        plots[r][c] && plots[r][c].family === crop.family
      );

      if (hasWarning) {
        const plotElement = document.querySelector(`.plot[data-row="${row}"][data-col="${col}"]`);
        if (plotElement) plotElement.classList.add('warning');
      }
    }
  }
}

// ---------- Save / Load with localStorage ----------
function savePlan() {
  localStorage.setItem('cropRotationPlan', JSON.stringify(plots));
  alert('Plan saved!');
}

function loadPlan() {
  const saved = localStorage.getItem('cropRotationPlan');
  if (saved) {
    plots = JSON.parse(saved);
    renderGrid();
    checkAllWarnings();
    alert('Plan loaded!');
  } else {
    alert('No saved plan found.');
  }
}

function clearGrid() {
  if (confirm('Clear all plots?')) {
    plots = Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(null));
    renderGrid();
    checkAllWarnings();
  }
}

// ---------- Event Listeners ----------
saveBtn.addEventListener('click', savePlan);
loadBtn.addEventListener('click', loadPlan);
clearBtn.addEventListener('click', clearGrid);

// Initialize
initGrid();
renderCropList();