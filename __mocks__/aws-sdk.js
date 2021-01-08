/* eslint-disable class-methods-use-this */
const detectEntitiesResult = jest.fn().mockResolvedValue(true);

const Comprehend = {
  detectEntities()  {
    return {
      promise: detectEntitiesResult,
    };
  }
};

const config = {
  update: jest.fn(),
};

module.exports = {
  Comprehend,
  config
}
