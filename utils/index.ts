import translate from 'translate-google';
import { TranslatedObject } from '../interfaces';

// Función para obtener todas las claves de un objeto de forma recursiva
const getAllKeys = (obj: Record<string, any>): string[] => {
    const keysSet = new Set<string>();

    // Función recursiva para agregar claves al conjunto de claves
    const addKeysToSet = (inputObj: Record<string, any>) => {
        for (const key in inputObj) {
            if (inputObj.hasOwnProperty(key)) {
                keysSet.add(key);
                // Si el valor es un objeto, llamamos de forma recursiva para obtener las claves internas
                if (typeof inputObj[key] === 'object') {
                    addKeysToSet(inputObj[key]);
                }
            }
        }
    };

    addKeysToSet(obj);

    return [...keysSet];
};

// Función para fusionar objetos con traducción
const mergeObjectsWithTranslation = (
  inputObject: Record<string, any>,
  translations: Record<string, any>
): Record<string, any> => {
  const outputObject: Record<string, any> = {};

  // Itera a través de las claves del objeto de entrada
  for (const key in inputObject) {
    if (inputObject.hasOwnProperty(key)) {
      const translatedKey = translations[key] || key;
      const value = inputObject[key];

      if (Array.isArray(value)) {
        // Si es un arreglo, traduce sus elementos
        const translatedArray = value.map((item: any) => {
          if (typeof item === 'object') {
            // Si es un objeto, llámalo de forma recursiva
            const translatedSubObject = mergeObjectsWithTranslation(item, translations);
            return translatedSubObject;
          } else {
            // Traduce el elemento
            return translations[item] || item;
          }
        });
        outputObject[translatedKey] = translatedArray;
      } else if (typeof value === 'object') {
        // Si es un objeto, llámalo de forma recursiva
        const translatedSubObject = mergeObjectsWithTranslation(value, translations);
        outputObject[translatedKey] = translatedSubObject;
      } else {
        // Si es un valor simple, tradúcelo
        outputObject[translatedKey] = value;
      }
    }
  }

  return outputObject;
};

// Función para traducir las claves de un objeto JSON de inglés a español
export const translateKeysToSpanish = async (obj: Record<string, any>): Promise<TranslatedObject> => {
  if (typeof obj !== 'object') {
    // Si el objeto no es un objeto, devuélvelo sin cambios
    return obj;
  }

  const keysToTranslate: string[] = getAllKeys(obj);

  // Convierte keysToTranslate en un solo string separado por comas
  const keysToTranslateString = keysToTranslate.join(',');

  // Traduce todas las claves en una sola llamada
  const translatedKeysResult: string = await translate(keysToTranslateString, {
    from: 'en',
    to: 'es'
  });

  // Convierte el resultado en un array de strings
  const translatedKeysArray: string[] = translatedKeysResult.includes(",")
    ? translatedKeysResult.split(',').map(k => k.trim())
    : translatedKeysResult.split(' ').map(k => k.trim());

  // Asocia las claves originales con las claves traducidas
  const mergedResult: Record<string, string> = {};
  for (let i = 0; i < keysToTranslate.length; i++) {
    mergedResult[keysToTranslate[i]] = translatedKeysArray[i];
  }

  // Realiza la traducción de las claves y valores en el objeto
  const translatedObj: TranslatedObject = mergeObjectsWithTranslation(obj, mergedResult);

  return translatedObj;
};