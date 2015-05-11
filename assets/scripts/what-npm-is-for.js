window.malarkey = require("malarkey");

module.exports = function(){
  $(what_npm_is_for)
}

var what_npm_is_for = function() {
  var el = document.querySelector('#what-npm-is-for');
  if (!el) return;
  var initialText = el.textContent;
  var pause = 800
  var opts = {
    speed: 40,
    loop: false,
    postfix: ''
  };

  var typist = malarkey(el, opts)

  typist
    // .clear()
    // .type(initialText).pause(pause).delete(initialText.length)
    .pause(2400).delete(initialText.length)
    .type('est').pause(pause).delete(3)
    .type('etpl').pause(pause).delete(4)
    .type('er').pause(pause).delete(2)
    .type('saber').pause(pause).delete(5)
    .type('saber-lang').pause(pause).delete(10)
    // .type('saber-cookie').pause(pause).delete(12)
    .type('jquery').pause(pause).delete(6)
    .type('eform').pause(pause).delete(5)
    .type('zrender').pause(pause).delete(7)
    // .type('saber-firework').pause(pause).delete(14)
    .type('echarts').pause(pause).delete(7)
    .type('underscore').pause(pause).delete(10)
    // .type('eform-uploader').pause(pause).delete(14)
    .type('rider').pause(1200)
    .call(function() {
      $(el).addClass("disabled")
    });

}
