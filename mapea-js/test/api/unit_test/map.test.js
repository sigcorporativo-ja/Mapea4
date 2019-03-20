describe('M.map', () => {
  describe('constructor', () => {
    it('Creates a new map', () => {
      const map = M.map({ container: 'map' });
      expect(map).to.be.a(M.Map);
    });
  });
});
