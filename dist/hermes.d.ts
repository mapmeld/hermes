import * as t from './types';
declare class Hermes {
    private element;
    private canvas;
    private ctx;
    private resizeObserver;
    private data;
    private dataCount;
    private dimensions;
    private dimensionsOriginal;
    private options;
    private size;
    private ix;
    private filters;
    private _?;
    constructor(target: HTMLElement | string, data: t.HermesData, dimensions: t.Dimension[], options?: t.RecursivePartial<t.HermesOptions>);
    static getTester(): any;
    destroy(): void;
    setSize(w: number, h: number): void;
    private calculate;
    private calculateScales;
    private calculateLayout;
    private calculateStyles;
    private getFocusByPoint;
    private updateActiveLabel;
    private setActiveFilter;
    private updateActiveFilter;
    private cleanUpFilters;
    private updateCursor;
    private draw;
    private drawDebugOutline;
    private handleResize;
    private handleDoubleClick;
    private handleMouseDown;
    private handleMouseMove;
    private handleMouseUp;
}
export default Hermes;
