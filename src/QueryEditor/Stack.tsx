import { css } from '@emotion/css';
import React, { CSSProperties, useCallback } from 'react';

import { GrafanaTheme2 } from '@grafana/data';
import { useStyles2 } from '@grafana/ui';

interface StackProps {
  direction?: CSSProperties['flexDirection'];
  alignItems?: CSSProperties['alignItems'];
  wrap?: boolean;
  gap?: number;
  flexGrow?: CSSProperties['flexGrow'];
}

/**
 * @deprecated use the Stack component from @grafana/ui instead. Available starting from @grafana/ui@10.2.3
 */
export const Stack = ({ children, ...props }: React.PropsWithChildren<StackProps>) => {
  const styles = useStyles2(useCallback((theme) => getStyles(theme, props), [props]));

  return <div className={styles.root}>{children}</div>;
};

const getStyles = (theme: GrafanaTheme2, props: StackProps) => ({
  root: css({
    display: 'flex',
    flexDirection: props.direction ?? 'row',
    flexWrap: props.wrap ?? true ? 'wrap' : undefined,
    alignItems: props.alignItems,
    gap: theme.spacing(props.gap ?? 2),
    flexGrow: props.flexGrow,
  }),
});
