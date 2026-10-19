(function (window, document) {
  "use strict";

  const BASE_URL =
    window.QUICKUPI_BASE_URL ||
    (document.currentScript && document.currentScript.src
      ? new URL(document.currentScript.src).origin
      : "http://localhost:3000");

  let activeModal = null;

  function createModal(campaignSlug, options) {
    if (activeModal) {
      document.body.removeChild(activeModal);
    }

    // Modal Overlay
    const overlay = document.createElement("div");
    overlay.id = "quickupi-checkout-overlay";
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100vw";
    overlay.style.height = "100vh";
    overlay.style.backgroundColor = "rgba(11, 15, 23, 0.85)";
    overlay.style.backdropFilter = "blur(12px)";
    overlay.style.webkitBackdropFilter = "blur(12px)";
    overlay.style.zIndex = "999999";
    overlay.style.display = "flex";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";
    overlay.style.padding = "16px";
    overlay.style.animation = "quickupiFadeIn 0.2s ease-out";

    // Modal Container
    const container = document.createElement("div");
    container.style.position = "relative";
    container.style.width = "100%";
    container.style.maxWidth = "480px";
    container.style.height = "90vh";
    container.style.maxHeight = "720px";
    container.style.backgroundColor = "#0B0F17";
    container.style.borderRadius = "24px";
    container.style.overflow = "hidden";
    container.style.boxShadow = "0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 40px -5px rgba(16, 185, 129, 0.2)";
    container.style.border = "1px solid rgba(16, 185, 129, 0.25)";

    // Close Button
    const closeBtn = document.createElement("button");
    closeBtn.innerHTML = "&times;";
    closeBtn.style.position = "absolute";
    closeBtn.style.top = "12px";
    closeBtn.style.right = "16px";
    closeBtn.style.width = "36px";
    closeBtn.style.height = "36px";
    closeBtn.style.borderRadius = "50%";
    closeBtn.style.backgroundColor = "rgba(30, 41, 59, 0.8)";
    closeBtn.style.border = "1px solid rgba(255, 255, 255, 0.1)";
    closeBtn.style.color = "#FFFFFF";
    closeBtn.style.fontSize = "22px";
    closeBtn.style.cursor = "pointer";
    closeBtn.style.display = "flex";
    closeBtn.style.alignItems = "center";
    closeBtn.style.justifyContent = "center";
    closeBtn.style.zIndex = "10";
    closeBtn.onclick = function () {
      closeModal();
      if (options && typeof options.onDismiss === "function") {
        options.onDismiss();
      }
    };

    // Sandboxed Iframe
    const iframe = document.createElement("iframe");
    iframe.src = `${BASE_URL}/r/${campaignSlug}`;
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    iframe.style.border = "none";
    iframe.allow = "clipboard-write";

    container.appendChild(closeBtn);
    container.appendChild(iframe);
    overlay.appendChild(container);
    document.body.appendChild(overlay);

    activeModal = overlay;
  }

  function closeModal() {
    if (activeModal && activeModal.parentNode) {
      activeModal.parentNode.removeChild(activeModal);
      activeModal = null;
    }
  }

  // Public SDK Object
  const QuickUPI = {
    open: function (options) {
      if (!options || !options.campaign) {
        console.error("[QuickUPI] 'campaign' slug is required in options.");
        return;
      }
      createModal(options.campaign, options);
    },
    close: closeModal,
  };

  // Auto-bind declarative HTML buttons: [data-quickupi-pay]
  document.addEventListener("DOMContentLoaded", function () {
    const buttons = document.querySelectorAll("[data-quickupi-pay]");
    buttons.forEach(function (button) {
      button.addEventListener("click", function (e) {
        e.preventDefault();
        const campaign = button.getAttribute("data-campaign");
        if (campaign) {
          QuickUPI.open({ campaign: campaign });
        } else {
          console.warn("[QuickUPI] Button missing data-campaign attribute.");
        }
      });
    });
  });

  window.QuickUPI = QuickUPI;
})(window, document);
