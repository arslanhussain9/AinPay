(function (window, document) {
  "use strict";

  const BASE_URL =
    window.PAYME_BASE_URL ||
    (document.currentScript && document.currentScript.src
      ? new URL(document.currentScript.src).origin
      : "http://localhost:3000");

  let activeModal = null;

  function createModal(slug, options) {
    if (activeModal) {
      document.body.removeChild(activeModal);
    }

    const overlay = document.createElement("div");
    overlay.id = "payme-checkout-overlay";
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100vw";
    overlay.style.height = "100vh";
    overlay.style.backgroundColor = "rgba(13, 37, 61, 0.6)";
    overlay.style.backdropFilter = "blur(8px)";
    overlay.style.webkitBackdropFilter = "blur(8px)";
    overlay.style.zIndex = "999999";
    overlay.style.display = "flex";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";
    overlay.style.padding = "16px";

    const container = document.createElement("div");
    container.style.position = "relative";
    container.style.width = "100%";
    container.style.maxWidth = "460px";
    container.style.height = "90vh";
    container.style.maxHeight = "700px";
    container.style.backgroundColor = "#ffffff";
    container.style.borderRadius = "20px";
    container.style.overflow = "hidden";
    container.style.boxShadow = "0 20px 45px rgba(0, 55, 112, 0.15)";
    container.style.border = "1px solid #e3e8ee";

    const closeBtn = document.createElement("button");
    closeBtn.innerHTML = "&times;";
    closeBtn.style.position = "absolute";
    closeBtn.style.top = "12px";
    closeBtn.style.right = "16px";
    closeBtn.style.width = "32px";
    closeBtn.style.height = "32px";
    closeBtn.style.borderRadius = "50%";
    closeBtn.style.backgroundColor = "#f6f9fc";
    closeBtn.style.border = "1px solid #e3e8ee";
    closeBtn.style.color = "#0d253d";
    closeBtn.style.fontSize = "20px";
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

    const iframe = document.createElement("iframe");
    iframe.src = `${BASE_URL}/p/${slug}`;
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

  const PayMe = {
    open: function (options) {
      if (!options || !options.link) {
        console.error("[PayMe] 'link' slug is required in options.");
        return;
      }
      createModal(options.link, options);
    },
    close: closeModal,
  };

  document.addEventListener("DOMContentLoaded", function () {
    const buttons = document.querySelectorAll("[data-payme-pay]");
    buttons.forEach(function (button) {
      button.addEventListener("click", function (e) {
        e.preventDefault();
        const link = button.getAttribute("data-link");
        if (link) {
          PayMe.open({ link: link });
        }
      });
    });
  });

  window.PayMe = PayMe;
})(window, document);
