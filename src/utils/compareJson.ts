import type { MutableTheme } from 'antd-token-previewer';
import { difference, intersection } from 'lodash';

const formatDiff = (
  title: string,
  keys: string[],
  newObj?: Record<string, unknown>,
  oldObj?: Record<string, unknown>,
): string => {
  let text = '';
  if (keys.length > 0) {
    text = text + `### ${title}\n`;
  }
  keys.forEach((item) => {
    const from = oldObj ? ` from ${oldObj[item]}` : '';
    const to = newObj ? ` to ${newObj[item]}` : '';
    text = text + `- ${item}${from}${to}\n`;
  });

  return text;
};

const compareObj = (
  title: string,
  newObj: Record<string, unknown>,
  oldObj: Record<string, unknown>,
  isCheckChanges: boolean,
): string => {
  const newKeys = Object.keys(newObj);
  const oldKeys = Object.keys(oldObj);

  const added = difference(newKeys, oldKeys);
  const removed = difference(oldKeys, newKeys);
  const changes = isCheckChanges
    ? intersection(newKeys, oldKeys).reduce((acc, key) => {
        if (newObj[key] !== oldObj[key]) {
          acc.push(key);
        }
        return acc;
      }, [] as string[])
    : [];
  const text =
    formatDiff('Added', added, newObj) +
    formatDiff('Removed', removed) +
    formatDiff('Updated', changes, newObj, oldObj);
  if (text) {
    return `## ${title}\n` + text;
  }
  return '';
};

export const compareJson = (
  newJsonText: string,
  oldJsonText: string,
): string => {
  try {
    const newTheme = JSON.parse(newJsonText) as MutableTheme['config'];
    const oldTheme = JSON.parse(oldJsonText) as MutableTheme['config'];
    let text = '';
    text =
      text +
      compareObj(
        'Palette',
        newTheme.palette || {},
        oldTheme.palette || {},
        true,
      );
    text =
      text +
      compareObj('Tokens', newTheme.token || {}, oldTheme.token || {}, true);
    text =
      text +
      compareObj(
        'Components',
        newTheme.components || {},
        oldTheme.components || {},
        false,
      );
    intersection(
      Object.keys(newTheme.components || {}),
      Object.keys(oldTheme.components || {}),
    ).forEach((componentName) => {
      text =
        text +
        compareObj(
          `Component.${componentName}`,
          (newTheme.components as Record<string, Record<string, unknown>>)[
            componentName
          ] || {},
          (oldTheme.components as Record<string, Record<string, unknown>>)[
            componentName
          ] || {},
          true,
        );
    });
    if (text) {
      return '# Changelog\n' + text;
    }

    return 'Empty diff';
  } catch (e) {
    return 'Parse error';
  }
};
