export const MAP_CONSTRUCTOR_TIMEOUT = 2000;

export const createMapAndWait = (mapArgs, timeToWait = MAP_CONSTRUCTOR_TIMEOUT) => {
  return new Promise((resolve) => {
    const mapjs = M.map(mapArgs);
    setTimeout(() => {
      resolve(mapjs);
    }, timeToWait);
  });
};
