var assert = require('assert');
var sinon = require('sinon');
var dispatch = require('../lib/dispatch');

describe('dispatch', function() {

  it('triggers an event on the passed DOM element', function() {

    // Skips this test in unsupporting browsers.
    if (!document.createEvent) this.skip();

    var spy = sinon.spy();
    document.addEventListener('click', spy);

    dispatch(document.body, 'click');

    assert(spy.calledOnce);

    document.removeEventListener('click', spy);
  });


  it('supports passing data via the detail property', function() {

    // Skips this test in unsupporting browsers.
    if (!document.createEvent) this.skip();

    var spy = sinon.spy();
    document.addEventListener('click', spy);

    dispatch(document.body, 'click', {detail: {foo: 'bar'}});

    assert(spy.calledOnce);
    assert.deepEqual(spy.getCall(0).args[0].detail, {foo: 'bar'});

    document.removeEventListener('click', spy);
  });


  it('supports specifying the event constructor', function() {

    // Skips this test in unsupporting browsers.
    if (!document.createEvent) this.skip();

    var spy = sinon.spy();
    document.addEventListener('click', spy);

    dispatch(document.body, 'click', 'MouseEvent');

    assert(spy.calledOnce);
    assert(spy.getCall(0).args[0] instanceof window.MouseEvent);

    document.removeEventListener('click', spy);
  });


  it('supports specifying event attributes via an optional object', function() {

    // Skips this test in unsupporting browsers.
    if (!document.createEvent) this.skip();

    var spy = sinon.spy(function(event) {
      assert(!event.bubbles);
      assert(!event.cancelable);
    });

    document.body.addEventListener('click', spy);
    document.addEventListener('click', spy);

    dispatch(document.body, 'click', 'MouseEvent', {
      bubbles: false,
      cancelable: false
    });

    // Since the event doesn't bubble, only <body> should receive the event.
    assert(spy.calledOnce);

    document.body.removeEventListener('click', spy);
    document.removeEventListener('click', spy);
  });


  it('returns the value of element.dispatchEvent', function() {

    // Skips this test in unsupporting browsers.
    if (!document.createEvent) this.skip();

    assert(dispatch(document.body, 'click'));

    var spy = sinon.spy(function(event) {
      event.preventDefault();
    });
    document.addEventListener('click', spy);

    assert(!dispatch(document.body, 'click'));

    document.removeEventListener('click', spy);
  });

});
