// EN/TR language switcher.
// Loads a hidden Google Translate widget, then translates the live DOM
// by driving Google Translate's own <select.goog-te-combo>. No cookies,
// no reload — works inside sandboxed preview iframes that block cookies.

(function () {
  var TARGETS = { en: 'en', tr: 'tr' };
  var currentLang = 'en';

  window.googleTranslateElementInit = function () {
    new google.translate.TranslateElement({
      pageLanguage: 'en',
      includedLanguages: 'en,tr',
      autoDisplay: false
    }, 'google_translate_element');
  };

  function waitForCombo(cb, tries) {
    tries = tries || 0;
    var sel = document.querySelector('.goog-te-combo');
    if (sel) return cb(sel);
    if (tries > 40) return; // ~4s
    setTimeout(function () { waitForCombo(cb, tries + 1); }, 100);
  }

  function applyLang(lang) {
    waitForCombo(function (sel) {
      sel.value = TARGETS[lang] || 'en';
      sel.dispatchEvent(new Event('change'));
    });
  }

  function setLang(lang) {
    if (!TARGETS[lang]) return;
    currentLang = lang;
    document.querySelectorAll('.topbar-right a.lang-link').forEach(function (a) {
      a.classList.toggle('lang-active', a.getAttribute('data-lang') === lang);
    });
    if (lang === 'en') {
      // Reset: switching the select back to 'en' restores original text.
      waitForCombo(function (sel) {
        sel.value = 'en';
        sel.dispatchEvent(new Event('change'));
        // Some pages need a nudge — clear any leftover translation wrappers.
        setTimeout(function () {
          var iframe = document.querySelector('iframe.goog-te-banner-frame');
          if (iframe) iframe.style.display = 'none';
        }, 200);
      });
    } else {
      applyLang(lang);
    }
  }

  function init() {
    if (!document.getElementById('google_translate_element')) {
      var holder = document.createElement('div');
      holder.id = 'google_translate_element';
      holder.style.cssText =
        'position:absolute;left:-9999px;top:-9999px;width:0;height:0;overflow:hidden;visibility:hidden;';
      document.body.appendChild(holder);
    }

    if (!document.getElementById('gt-hide-style')) {
      var style = document.createElement('style');
      style.id = 'gt-hide-style';
      style.textContent =
        '.goog-te-banner-frame.skiptranslate,.goog-tooltip,.goog-tooltip:hover,.goog-text-highlight{display:none!important;box-shadow:none!important;background:none!important;}' +
        'body{top:0!important;position:static!important;}';
      document.head.appendChild(style);
    }

    if (!document.querySelector('script[data-gt-script]')) {
      var s = document.createElement('script');
      s.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      s.setAttribute('data-gt-script', '');
      s.defer = true;
      document.body.appendChild(s);
    }

    document.querySelectorAll('.topbar-right a').forEach(function (a) {
      var label = (a.textContent || '').trim().toLowerCase();
      if (!TARGETS[label]) return;
      a.classList.add('lang-link');
      a.setAttribute('data-lang', label);
      if (label === currentLang) a.classList.add('lang-active');
      a.addEventListener('click', function (e) {
        e.preventDefault();
        setLang(label);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
