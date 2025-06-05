import ColorUtils from './ColorUtils';

describe('ColorUtils.toRGBA', () => {
  it('parses 24bit number with alpha defaulting to 1', () => {
    const c = ColorUtils.toRGBA(0xff0000);
    expect(c.red).toBeCloseTo(1);
    expect(c.green).toBeCloseTo(0);
    expect(c.blue).toBeCloseTo(0);
    expect(c.alpha).toBeCloseTo(1);
  });

  it('parses 32bit number with alpha channel', () => {
    const c = ColorUtils.toRGBA(0x80ff0000);
    expect(c.red).toBeCloseTo(1);
    expect(c.green).toBeCloseTo(0);
    expect(c.blue).toBeCloseTo(0);
    expect(c.alpha).toBeCloseTo(0x80 / 255);
  });

  it('parses separate rgb components', () => {
    const c = ColorUtils.toRGBA(255, 0, 0);
    expect(c.red).toBeCloseTo(1);
    expect(c.green).toBeCloseTo(0);
    expect(c.blue).toBeCloseTo(0);
    expect(c.alpha).toBeCloseTo(1);
  });

  it('parses separate rgba components', () => {
    const c = ColorUtils.toRGBA(255, 0, 0, 128);
    expect(c.red).toBeCloseTo(1);
    expect(c.green).toBeCloseTo(0);
    expect(c.blue).toBeCloseTo(0);
    expect(c.alpha).toBeCloseTo(128 / 255);
  });
});
