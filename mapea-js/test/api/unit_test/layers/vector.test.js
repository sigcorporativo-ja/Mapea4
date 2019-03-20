describe('M.layer.Vector', () => {
  describe('constructor', () => {
    it('Creates a new M.layer.Vector', () => {
      const vector = new M.layer.Vector({});
      expect(vector).to.be.a(M.layer.Vector);
      expect(vector).to.be.a(M.Layer);
    });
    it('Name parameter is correct', () => {
      const vector = new M.layer.Vector({ name: 'layer_vector' });
      expect(vector.name).to.eql('layer_vector');
    });
  });
});
