import HermesError from './classes/HermesError';
import { HERMES_CONFIG } from './defaults';
import * as t from './types';
import { clone } from './utils/data';
import * as tester from './utils/tester';

import Hermes from './index';

const ELEMENT_ID = 'chart';
const DIMENSION_COUNT = 4;
const DATA_COUNT = 50;

class HermesTester extends Hermes {
  public getData(): t.Data { return this.data; }
  public getDataCount(): number { return this.dataCount; }
}

const tryHermes = (
  target: HTMLElement | string,
  dimensions: t.Dimension[],
  config: t.RecursivePartial<t.Config> = {},
  data: t.Data = {},
): { error?: HermesError, hermes?: HermesTester } => {
  let hermes: HermesTester | undefined;
  let error: HermesError | undefined;
  try {
    hermes = new HermesTester(target, dimensions, config, data);
  } catch (e) {
    error = e as HermesError;
  }
  return { error, hermes };
};

describe('Hermes class', () => {
  let element: HTMLDivElement;
  let dimensions: t.Dimension[];
  let data: t.Data;

  beforeEach(() => {
    element = document.createElement('div');
    element.id = ELEMENT_ID;
    document.body.appendChild(element);

    dimensions = tester.generateDimensions(DIMENSION_COUNT);
    data = tester.generateData(dimensions, DATA_COUNT);
  });

  afterEach(() => {
    document.body.removeChild(element);
  });

  describe('constructor', () => {
    it('should draw chart if all the inputs are valid', () => {
      const { error, hermes } = tryHermes(element, dimensions, {}, data);
      expect(error).toBeUndefined();
      expect(hermes).toBeInstanceOf(Hermes);
    });

    it('should create chart without data', () => {
      const { error, hermes } = tryHermes(element, dimensions, {});
      expect(error).toBeUndefined();
      expect(hermes).toBeInstanceOf(Hermes);
    });

    it('should create chart with element id', () => {
      const { error, hermes } = tryHermes(`#${ELEMENT_ID}`, dimensions, {});
      expect(error).toBeUndefined();
      expect(hermes).toBeInstanceOf(Hermes);
    });

    it('should fail if target is invalid', () => {
      const { error, hermes } = tryHermes('.nothing', dimensions, {});
      expect(error?.message).toMatch(/selector did not match anything/i);
      expect(hermes).toBeUndefined();
    });

    it('should fail if unable to get canvas 2d context', () => {
      // Save original `canvas.getContext`.
      const getContext = HTMLCanvasElement.prototype.getContext;

      // Force `canvas.getContext` to return `null`.
      HTMLCanvasElement.prototype.getContext = () => null;

      const { error, hermes } = tryHermes(element, dimensions, {});
      expect(error?.message).toMatch(/unable to get context/i);
      expect(hermes).toBeUndefined();

      // Restore `canvas.getContext`.
      HTMLCanvasElement.prototype.getContext = getContext;
    });

    it('should fail if the dimension list is empty', () => {
      const { error, hermes } = tryHermes(element, [], {});
      expect(error?.message).toMatch(/need at least one dimension defined/i);
      expect(hermes).toBeUndefined();
    });

    it('should fail if data sizes are not uniform across dimensions', () => {
      const nonuniformData = clone(data);
      const dimKeys = Object.keys(nonuniformData);

      // Make first series short one data point.
      if (dimKeys.length !== 0) {
        nonuniformData[dimKeys[0]].splice(1, 1);
      }

      const { error, hermes } = tryHermes(element, dimensions, {}, nonuniformData);
      expect(error?.message).toMatch(/data are not uniform in size/i);
      expect(hermes).toBeUndefined();
    });
  });

  describe('getTester', () => {
    it('should have `generateData` defined in tester', () => {
      const tester = HermesTester.getTester();
      expect(tester.generateData).toBeDefined();
      expect(tester.generateDimensions).toBeDefined();
    });
  });

  describe('setData', () => {
    let hermes: HermesTester | undefined;
    let newData: t.Data;
    let spyRedraw: jest.SpyInstance<void, []>;

    beforeEach(() => {
      hermes = tryHermes(element, dimensions, {}, data).hermes;
      newData = clone(data);

      // Add copy and add the first few data points back into the dimension data.
      Object.keys(data).forEach(key => {
        const dimData = data[key];
        dimData.push(dimData[0], dimData[1], dimData[2]);
      });

      if (hermes) {
        spyRedraw = jest.spyOn(hermes, 'redraw');
      }
    });

    it('should set data', () => {
      if (!hermes) throw new Error('Hermes not initialized.');
      hermes?.setData(newData);
      expect(hermes.getData()).toStrictEqual(newData);
      expect(spyRedraw).toHaveBeenCalled();
    });

    it('should set data and not redraw', () => {
      if (!hermes) throw new Error('Hermes not initialized.');
      hermes?.setData(newData, false);
      expect(hermes.getData()).toStrictEqual(newData);
      expect(spyRedraw).not.toHaveBeenCalled();
    });
  });

  describe('destroy', () => {
    it('should clean up during destroy', () => {
      const { hermes } = tryHermes(element, dimensions, {}, data);
      if (!hermes) throw new Error('Hermes not initialized.');

      // Should contain a canvas element.
      const children = [].slice.call(element.children) as HTMLElement[];
      expect(children.length).toBe(1);
      expect(children[0] instanceof HTMLCanvasElement).toBe(true);

      hermes.destroy();

      // Children list should be empty after `destroy`.
      expect([].slice.call(element.children).length).toBe(0);
    });
  });
});
