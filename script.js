
const products = {
  glyphosate: { name: 'Glyphosate 41%', rate: 1.5, unit: 'L' },
  '2,4-d': { name: '2,4-D Amine', rate: 1.0, unit: 'L' },
  atrazine: { name: 'Atrazine 90DF', rate: 2.0, unit: 'lb' },
  custom: { name: 'Custom', rate: null, unit: null }
};

const areaToAcres = {
  acre: 1,
  ha: 2.47105,
  m2: 0.000247105
};


const waterToLiters = {
  L: 1,
  gal: 3.78541
};

// DOM elements
const areaInput = document.getElementById('area');
const areaUnitSelect = document.getElementById('areaUnit');
const productSelect = document.getElementById('product');
const customRateGroup = document.getElementById('customRateGroup');
const customRateInput = document.getElementById('customRate');
const customUnitSelect = document.getElementById('customUnit');
const waterRateInput = document.getElementById('waterRate');
const waterUnitSelect = document.getElementById('waterUnit');
const calculateBtn = document.getElementById('calculateBtn');
const productAmountP = document.getElementById('productAmount');
const waterAmountP = document.getElementById('waterAmount');
const totalMixP = document.getElementById('totalMix');

productSelect.addEventListener('change', function() {
  if (this.value === 'custom') {
    customRateGroup.classList.remove('hidden');
  } else {
    customRateGroup.classList.add('hidden');
  }
});


calculateBtn.addEventListener('click', function() {
 
  const areaValue = parseFloat(areaInput.value);
  if (isNaN(areaValue) || areaValue <= 0) {
    alert('Please enter a valid positive area.');
    return;
  }
  const areaUnit = areaUnitSelect.value;
  const areaAcres = areaValue * areaToAcres[areaUnit];


  let productRate, productUnit;
  const selectedProduct = productSelect.value;

  if (selectedProduct === 'custom') {
    productRate = parseFloat(customRateInput.value);
    productUnit = customUnitSelect.value;
    if (isNaN(productRate) || productRate <= 0) {
      alert('Please enter a valid custom product rate.');
      return;
    }
  } else {
    productRate = products[selectedProduct].rate;
    productUnit = products[selectedProduct].unit;
  }


  const totalProduct = productRate * areaAcres;

 
  const waterRateValue = parseFloat(waterRateInput.value);
  if (isNaN(waterRateValue) || waterRateValue <= 0) {
    alert('Please enter a valid water volume per acre.');
    return;
  }
  const waterUnit = waterUnitSelect.value;
  const waterRateLitersPerAcre = waterRateValue * waterToLiters[waterUnit];

 
  const totalWaterLiters = waterRateLitersPerAcre * areaAcres;

 
  let totalMixVolume = totalWaterLiters;
  if (productUnit === 'L' || productUnit === 'gal') {
   
    let productLiters = totalProduct;
    if (productUnit === 'gal') {
      productLiters = totalProduct * 3.78541;
    }
    totalMixVolume += productLiters;
  }


  let productDisplay = `${totalProduct.toFixed(2)} ${productUnit}`;
 
  if (areaUnit !== 'acre' && productUnit) {

  }

  productAmountP.textContent = `🧴 Product needed: ${productDisplay}`;

 
  let waterDisplay, totalDisplay;
  if (waterUnit === 'gal') {
    waterDisplay = (totalWaterLiters / 3.78541).toFixed(2) + ' gal';
    totalDisplay = (totalMixVolume / 3.78541).toFixed(2) + ' gal';
  } else {
    waterDisplay = totalWaterLiters.toFixed(2) + ' L';
    totalDisplay = totalMixVolume.toFixed(2) + ' L';
  }

  waterAmountP.textContent = `💧 Water needed: ${waterDisplay}`;
  totalMixP.textContent = `🧪 Total spray mixture: ${totalDisplay}`;
});
