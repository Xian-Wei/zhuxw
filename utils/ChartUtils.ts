export const percentageDifference = (a: number, b: number) => {
  return ((b - a) / a) * 100;
};

export const getHighestHighInLastSevenElements = (elements: any[]) => {
  if (elements) {
    const lastSevenElements = elements.slice(-7);

    return Math.max.apply(
      Math,
      lastSevenElements.map((element) => {
        return element.high;
      })
    );
  } else return 0;
};

export const getLowestLowInLastSevenElements = (elements: any[]) => {
  if (elements) {
    const lastSevenElements = elements.slice(-7);

    return Math.min.apply(
      Math,
      lastSevenElements.map((element) => {
        return element.low;
      })
    );
  } else return 0;
};
