import { isPlainObject } from 'lodash';

const sortObjectProps = (obj: any): any => {
  return Object.keys(obj)
    .sort()
    .reduce((ordered, key) => {
      let value = obj[key];

      if (isPlainObject(value)) {
        (ordered as any)[key] = sortObjectProps(value);
      } else {
        if (Array.isArray(value)) {
          value = value.map((v) => {
            if (isPlainObject(v)) return sortObjectProps(v);
            return v;
          });
        }
        (ordered as any)[key] = value;
      }
      return ordered;
    }, {});
};

export const sortJson = (obj: any): any => {
  const sorted = sortObjectProps(obj);
  return {
    palette: sorted.palette,
    token: sorted.token,
    components: sorted.components,
  };
};
