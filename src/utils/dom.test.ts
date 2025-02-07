import getBoundingClientRect from 'test/mocks/getBoundingClientRect';
import { DEFAULT_BOUNDING_CLIENT_RECT } from 'test/utils';

import * as utils from './dom';

describe('DOM utilities', () => {
  const DIV_ID = 'b-block';
  const div = document.createElement('div');
  div.id = DIV_ID;

  const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;

  beforeAll(() => {
    Element.prototype.getBoundingClientRect = getBoundingClientRect(DEFAULT_BOUNDING_CLIENT_RECT);
    document.body.appendChild(div);
  });

  afterAll(() => {
    Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;
    document.body.removeChild(div);
  });

  describe('getElement', () => {
    it('should get element by selector', () => {
      expect(utils.getElement(`#${DIV_ID}`)).toBe(div);
    });

    it('should get element by reference', () => {
      expect(utils.getElement(div)).toBe(div);
    });
  });

  describe('getMousePoint', () => {
    const tests = [
      {
        input: new window.MouseEvent('mousedown', { clientX: 0, clientY: 0 }),
        output: { x: -50, y: -100 },
      },
      {
        input: new window.MouseEvent('mousemove', { clientX: 50, clientY: 100 }),
        output: { x: 0, y: 0 },
      },
      {
        input: new window.MouseEvent('mouseup', { clientX: 100, clientY: 200 }),
        output: { x: 50, y: 100 },
      },
    ];

    it('should get mouse point relative to element position', () => {
      tests.forEach(test => {
        const result = utils.getMousePoint(test.input as MouseEvent, div);
        expect(result).toStrictEqual(test.output);
      });
    });
  });
});
