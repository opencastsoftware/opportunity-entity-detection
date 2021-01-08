/* eslint-disable class-methods-use-this */
export const detectEntitiesResult = jest.fn().mockResolvedValue(true);

export const Comprehend = {
  detectEntities()  {
    return {
      promise: detectEntitiesResult,
    };
  }
};

export const config = {
  update: jest.fn(),
};
