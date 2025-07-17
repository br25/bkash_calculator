export function setupCopyButton(copyBtn, output) {
  copyBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(output.textContent).then(() => {
      copyBtn.textContent = "Copied";
      setTimeout(() => {
        copyBtn.textContent = "Copy Text";
      }, 2000);
    }).catch(err => {
      console.error("Copy failed:", err);
    });
  });
}
