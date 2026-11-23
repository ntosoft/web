/* Drobný skript webu. Bez knihoven, bez sledování. */
(function () {
  "use strict";

  // --- E-mail: adresa není v HTML ani v tomto souboru v čitelné podobě.
  //     Skládá se až po kliknutí (obrácený řetězec zakódovaný v base64).
  //     Každá oblast (info, sales, support, dev, security) má vlastní dvojici.
  var P = {"info": ["dGNhdG5vYw==", "bW9jLnRmb3NvdG4="], "sales": ["dGNhdG5vYw==", "bW9jLnRmb3NvdG4="], "support": ["dHJvcHB1cw==", "bW9jLnRmb3NvdG4="], "dev": ["dmVk", "bW9jLnRmb3NvdG4="], "security": ["eXRpcnVjZXM=", "bW9jLnRmb3NvdG4="]};
  function rev(s) { return s.split("").reverse().join(""); }
  function address(k) { var p = P[k] || P.info; return rev(atob(p[0])) + "@" + rev(atob(p[1])); }

  function reveal(btn) {
    var key = btn.getAttribute("data-reveal") || "info";
    var a = address(key);
    var link = document.createElement("a");
    link.className = "addr";
    link.href = "mailto:" + a;
    link.textContent = a;
    btn.parentNode.replaceChild(link, btn);
    // ostatní tlačítka se stejnou adresou také nahradíme
    var rest = document.querySelectorAll("button[data-reveal]");
    for (var i = 0; i < rest.length; i++) {
      if ((rest[i].getAttribute("data-reveal") || "info") !== key) { continue; }
      var l2 = link.cloneNode(true);
      rest[i].parentNode.replaceChild(l2, rest[i]);
    }
  }

  document.addEventListener("click", function (e) {
    var t = e.target;
    while (t && t !== document) {
      if (t.matches && t.matches("button[data-reveal]")) { reveal(t); return; }
      t = t.parentNode;
    }
  });

  // --- Mobilní menu
  var burger = document.querySelector(".burger");
  var panel = document.getElementById("nav-panel");
  if (burger && panel) {
    burger.addEventListener("click", function () {
      var open = panel.classList.toggle("open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  // --- Kontaktní formulář: záměrně nefunkční. Nic se neodesílá ani neukládá.
  var form = document.getElementById("contact-form");
  if (form) {
    var alertBox = document.getElementById("form-alert");
    var submit = form.querySelector("button[type=submit]");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (form.website && form.website.value) { return; } // honeypot
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var label = submit.textContent;
      submit.disabled = true;
      submit.textContent = submit.getAttribute("data-sending") || "…";
      alertBox.classList.remove("show");
      window.setTimeout(function () {
        submit.disabled = false;
        submit.textContent = label;
        alertBox.classList.add("show");
        alertBox.focus();
      }, 1100);
    });
  }
})();
