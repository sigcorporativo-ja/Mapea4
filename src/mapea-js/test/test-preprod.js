window.map = M.map({
  container: 'map',
  controls: ['layerswitcher'],
});

map.on(M.evt.COMPLETED, () => console.log("e"));
