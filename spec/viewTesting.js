'use strict';

describe("defaultTimeSlot", function() {
  it ('calculates the time slot', function() {
    expect(defaultTimeSlot()).toEqual(Math.floor(defaultTimeSlot()));
    expect(defaultTimeSlot()).toBeGreaterThan(0);
    expect(defaultTimeSlot()).toBeLessThan(7);
  });
});
