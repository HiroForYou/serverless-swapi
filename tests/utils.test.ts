import {describe, expect, it} from '@jest/globals';

import { translateKeysToSpanish } from '../utils';

describe('translateKeysToSpanish', () => {
  it('should return the same object for non-object input', async () => {
    const nonObject: any = 'This is not an object' as any;
    const result = await translateKeysToSpanish(nonObject);
    expect(result).toEqual(nonObject);
  });

  it('should translate keys in a simple object', async () => {
    const inputObject = {
      name: 'Name',
      age: 25,
    };
    const result = await translateKeysToSpanish(inputObject);
    expect(result).toEqual({ nombre: 'Name', Edad: 25 });
  });

  it('should translate keys in a nested object', async () => {
    const inputObject = {
      person: {
        name: 'Name',
        age: 25,
      },
    };
    const result = await translateKeysToSpanish(inputObject);
    expect(result).toEqual({ persona: { nombre: 'Name', edad: 25 } });
  });
});