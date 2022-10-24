import { css, cx } from '@emotion/css';
import React, { useState } from 'react';
import { GroupBase } from 'react-select';

import { GrafanaTheme2 } from '@grafana/data';
import {
  SelectCommonProps,
  SelectContainerProps,
  useStyles2,
  SelectContainer as BaseSelectContainer,
  Select,
} from '@grafana/ui';

interface InlineSelectProps<T> extends SelectCommonProps<T> {
  label?: string;
}

export function InlineSelect<T>({ label: labelProp, ...props }: InlineSelectProps<T>) {
  const styles = useStyles2(getSelectStyles);
  const [id] = useState(() => Math.random().toString(16).slice(2));
  const components = {
    SelectContainer,
    ValueContainer,
    SingleValue: ValueContainer,
  };

  return (
    <div className={styles.root}>
      {labelProp && (
        <label className={styles.label} htmlFor={id}>
          {labelProp}
          {':'}&nbsp;
        </label>
      )}
      {/* @ts-ignore */}
      <Select openMenuOnFocus inputId={id} {...props} components={components} />
    </div>
  );
}

const SelectContainer = <Option, isMulti extends boolean, Group extends GroupBase<Option>>(
  props: SelectContainerProps<Option, isMulti, Group>
) => {
  const { children } = props;

  const styles = useStyles2(getSelectStyles);

  return (
    <BaseSelectContainer {...props} className={cx(props.className, styles.container)}>
      {children}
    </BaseSelectContainer>
  );
};

const ValueContainer = <Option, isMulti extends boolean, Group extends GroupBase<Option>>(
  props: SelectContainerProps<Option, isMulti, Group>
) => {
  const { className, children } = props;
  const styles = useStyles2(getSelectStyles);

  return <div className={cx(className, styles.valueContainer)}>{children}</div>;
};

const getSelectStyles = (theme: GrafanaTheme2) => ({
  root: css({
    display: 'flex',
    fontSize: 12,
    alignItems: 'center',
  }),

  label: css({
    color: theme.colors.text.secondary,
    whiteSpace: 'nowrap',
  }),

  container: css({
    background: 'none',
    borderColor: 'transparent',
  }),

  valueContainer: css({
    display: 'flex',
    alignItems: 'center',
    flex: 'initial',
    color: theme.colors.text.secondary,
    fontSize: 12,
  }),
});
