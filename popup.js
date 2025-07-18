import { setupCopyButton } from './clipboard.js';

const priceInput = document.getElementById("price");
const deliverySelect = document.getElementById("delivery");
const output = document.getElementById("output");
const copyBtn = document.getElementById("copyBtn");

const BKASH_PERCENT = 1.3;

const selectedTheme = "premium"; // options: cool, playful, premium, night
document.body.classList.add(selectedTheme);


function updateOutput() {
  const dressPriceRaw = priceInput.value;
  
  const dressPrice = dressPriceRaw
    .split('+')                             
    .map(num => parseFloat(num) || 0)
    .reduce((acc, val) => acc + val, 0)
	
	
  const deliveryCharge = parseFloat(deliverySelect.value);
  const subtotal = dressPrice + deliveryCharge;
  const bkashCharge = subtotal * (BKASH_PERCENT / 100);
  const total = subtotal + bkashCharge;

  output.textContent = 
`Dress price          : ${Math.round(dressPrice)} Taka
Delivery Charge     : ${deliveryCharge} Taka
Bkash Charge       : ${bkashCharge.toFixed(2)} Taka
Total Amount        : ${total.toFixed(2)} Taka

Including bkash and delivery charge.
Please pay by tomorrow 6 pm. We will not keep the order after that if the payment is not made within that time.(R)`;
}


priceInput.addEventListener("input", updateOutput);
deliverySelect.addEventListener("change", updateOutput);

setupCopyButton(copyBtn, output);

updateOutput();
