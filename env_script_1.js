
(function(){
  var params = new URLSearchParams(window.location.search);
  if (params.get('beta') === 'pacdi2026') {
    try { sessionStorage.setItem('betaUnlock', '1'); } catch(e) {}
  }
  window.isBetaUnlocked = function() {
    try { return sessionStorage.getItem('betaUnlock') === '1'; } catch(e) { return false; }
  };
})();
