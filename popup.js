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
  const roundedBkashCharge = Math.floor(bkashCharge);
  const total = subtotal + bkashCharge;
  const roundedTotal = Math.floor(total);

  output.textContent = 
`Dress price          : ${dressPriceRaw} Taka
Delivery Charge     : ${deliveryCharge} Taka
Bkash Charge       : ${roundedBkashCharge} Taka
Total Amount        : ${roundedTotal} Taka

Including bkash and delivery charge.
Please pay by tomorrow 6 pm. We will not keep the order after that if the payment is not made within that time.(R)`;
}







document.getElementById("showBkashBtn").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: () => {
        const priceCells = document.querySelectorAll("td.price");
        let priceList = [];

        priceCells.forEach(cell => {
          const text = cell.innerText.trim().replace(/,/g, '');
          const value = parseFloat(text);
          if (!isNaN(value)) {
            priceList.push(Math.round(value)); // Round each price if needed
          }
        });

        const total = priceList.reduce((acc, val) => acc + val, 0);
        const joinedPrices = priceList.join('+');

        // ----------- Inject Bkash label above QR Code -----------
        const existingLabel = document.getElementById("bkash-label-extension");
        if (!existingLabel) {
          const qrImg = document.querySelector("img.center-block");
          if (qrImg) {
            const bkashDiv = document.createElement("div");
            bkashDiv.id = "bkash-label-extension";
            bkashDiv.innerText = "Bkash";
            bkashDiv.style.fontSize = "30px";
            bkashDiv.style.fontWeight = "bold";
            bkashDiv.style.color = "#000";
            bkashDiv.style.textAlign = "right";
            bkashDiv.style.marginBottom = "5px";
            qrImg.parentNode.insertBefore(bkashDiv, qrImg);
          }
        }

        return joinedPrices;
      }
    }, (results) => {
      if (chrome.runtime.lastError || !results || !results[0]) {
        console.error("Error during calculation or injection");
        return;
      }

      const priceString = results[0].result;
      const priceInput = document.getElementById("price");
      if (priceInput && priceString) {
        priceInput.value = priceString;
        priceInput.dispatchEvent(new Event("input"));
      }
    });
  });
});








priceInput.addEventListener("input", updateOutput);
deliverySelect.addEventListener("change", updateOutput);

setupCopyButton(copyBtn, output);

updateOutput();