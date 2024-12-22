import './style.css'

const CARBON_FACTORS = {
  car: 0.2, // kg CO2 per km
  bus: 0.08,
  train: 0.04,
  bicycle: 0,
  walking: 0
};

const ECO_POINTS = {
  car: 0,
  bus: 5,
  train: 8,
  bicycle: 15,
  walking: 20
};

document.querySelector('#app').innerHTML = `
  <div class="container">
    <h1>Carbon Footprint Calculator</h1>
    
    <form class="calculator-form" id="carbonForm">
      <div class="form-group">
        <label for="distance">Distance (km)</label>
        <input type="number" id="distance" required min="0" step="0.1">
      </div>
      
      <div class="form-group">
        <label for="transport">Mode of Transport</label>
        <select id="transport" required>
          <option value="car">Car</option>
          <option value="bus">Bus</option>
          <option value="train">Train</option>
          <option value="bicycle">Bicycle</option>
          <option value="walking">Walking</option>
        </select>
      </div>
      
      <button type="submit">Calculate Impact</button>
    </form>
    
    <div id="results" class="results hidden">
      <h3>Journey Impact</h3>
      <p>Carbon Footprint: <span id="carbonOutput"></span> kg CO2</p>
      <div class="eco-options">
        <h4>Eco-friendly Alternatives</h4>
        <div id="alternatives"></div>
        <div id="ecoPoints" class="points-badge"></div>
      </div>
    </div>
  </div>
`

const form = document.getElementById('carbonForm');
const results = document.getElementById('results');
const carbonOutput = document.getElementById('carbonOutput');
const alternatives = document.getElementById('alternatives');
const ecoPoints = document.getElementById('ecoPoints');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const distance = parseFloat(document.getElementById('distance').value);
  const transport = document.getElementById('transport').value;
  
  // Calculate carbon footprint
  const carbonFootprint = calculateCarbonFootprint(distance, transport);
  
  // Display results
  carbonOutput.textContent = carbonFootprint.toFixed(2);
  
  // Generate alternatives
  const alternativeOptions = generateAlternatives(distance, transport);
  alternatives.innerHTML = alternativeOptions;
  
  // Calculate and display eco points
  const points = ECO_POINTS[transport];
  ecoPoints.textContent = `You earned ${points} eco points for this journey!`;
  
  // Show results
  results.classList.remove('hidden');
});

function calculateCarbonFootprint(distance, transport) {
  return distance * CARBON_FACTORS[transport];
}

function generateAlternatives(distance, currentTransport) {
  let html = '<ul>';
  
  for (const [mode, factor] of Object.entries(CARBON_FACTORS)) {
    if (mode !== currentTransport) {
      const carbonSaved = (CARBON_FACTORS[currentTransport] - factor) * distance;
      if (carbonSaved > 0) {
        html += `
          <li>Switch to ${mode} and save ${carbonSaved.toFixed(2)} kg CO2
          ${ECO_POINTS[mode] > 0 ? `(+${ECO_POINTS[mode]} eco points!)` : ''}
          </li>
        `;
      }
    }
  }
  
  html += '</ul>';
  return html;
}