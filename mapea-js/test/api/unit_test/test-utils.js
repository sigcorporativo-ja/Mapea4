export const MAP_CONSTRUCTOR_TIMEOUT = 2000;

export const createMapAndWait = (mapArgs, timeToWait = MAP_CONSTRUCTOR_TIMEOUT) => {
  return new Promise((resolve) => {
    const mapjs = M.map(mapArgs);
    setTimeout(() => {
      resolve(mapjs);
    }, timeToWait);
  });
};

export const almostEquals = (ob1, ob2, threshold = 5) => {
  let diffs;
  if (Array.isArray(ob1) && Array.isArray(ob2)) {
    diffs = ob1.map((e, i) => Math.abs(e - ob2[i]));
  } else {
    diffs = [Math.abs(ob1 - ob2)];
  }
  diffs.every(d => expect(d).to.be.lessThan(threshold));
};
