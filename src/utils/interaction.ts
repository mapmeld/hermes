import NiceScale from '../classes/NiceScale';
import { FILTER } from '../defaults';
import * as t from '../types';

import { clone } from './data';

export const FILTER_REMOVE_THRESHOLD = 1;
export const FILTER_RESIZE_THRESHOLD = 3;

export const getDragBound = (index: number, drag: t.Drag, bound: t.Rect): t.Rect => {
  const isLabelDrag = drag.action === t.ActionType.LabelMove && drag.shared.index === index;
  return isLabelDrag && drag.dimension.bound1 ? drag.dimension.bound1 : bound;
};

export const isFilterEmpty = (filter: t.Filter): boolean => {
  return isNaN(filter.p0) && isNaN(filter.p1);
};

export const isFilterInvalid = (filter: t.Filter): boolean => {
  return filter.p0 >= filter.p1;
};

export const isIntersectingFilters = (filter0: t.Filter, filter1: t.Filter): boolean => {
  return filter0.p0 <= filter1.p1 && filter1.p0 <= filter0.p1;
};

export const mergeFilters = (filter0: t.Filter, filter1: t.Filter): t.Filter => {
  const newFilter: t.Filter = clone(FILTER);
  if (filter0.p0 < filter1.p0) {
    newFilter.p0 = filter0.p0;
    newFilter.value0 = filter0.value0;
  } else {
    newFilter.p0 = filter1.p0;
    newFilter.value0 = filter1.value0;
  }
  if (filter0.p1 > filter1.p1) {
    newFilter.p1 = filter0.p1;
    newFilter.value1 = filter0.value1;
  } else {
    newFilter.p1 = filter1.p1;
    newFilter.value1 = filter1.value1;
  }
  return newFilter;
};
