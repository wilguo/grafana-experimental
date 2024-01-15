import React, { useState } from 'react';

import { DataSourceApi, SelectableValue } from '@grafana/data';
import { Select } from '@grafana/ui';

import { getOperationParamId } from './OperationEditor';
import { QueryBuilderLabelFilter, QueryBuilderOperationParamEditorProps, QueryBuilderOperationParamValue, VisualQuery, VisualQueryModeller } from '../types';


export const LabelParamEditor = ({
  onChange,
  index,
  operationId,
  value,
  query,
  datasource,
  queryModeller,
}: QueryBuilderOperationParamEditorProps) => {
  const [state, setState] = useState<{
    options?: SelectableValue[];
    isLoading?: boolean;
  }>({});

  return (
    <Select<QueryBuilderOperationParamValue | undefined>
      inputId={getOperationParamId(operationId, index)}
      autoFocus={value === ''}
      openMenuOnFocus
      onOpenMenu={async () => {
        setState({ isLoading: true });
        const options = await loadGroupByLabels(query, datasource, queryModeller);
        setState({ options, isLoading: undefined });
      }}
      isLoading={state.isLoading}
      allowCustomValue
      noOptionsMessage="No labels found"
      loadingMessage="Loading labels"
      options={state.options}
      value={toOption(value)}
      onChange={(value) => onChange(index, value.value!)}
    />
  );
}

async function loadGroupByLabels(query: VisualQuery, datasource: DataSourceApi, queryModeller: VisualQueryModeller): Promise<SelectableValue[]> {
  let labels: QueryBuilderLabelFilter[] = query.labels;

  // TODO: This is currently based on Prometheus logic, but should eventually be moved to the datasource
  if (query.metric && datasource.type === 'prometheus') {
    labels = [{ label: '__name__', op: '=', value: query.metric }, ...query.labels];
  }

  const queryString = queryModeller.renderLabels(labels);
  const result = await datasource.languageProvider.fetchSeriesLabels(queryString);

  return Object.keys(result).map((x) => ({
    label: x,
    value: x,
  }));
}

export const toOption = (value: QueryBuilderOperationParamValue | undefined): SelectableValue<QueryBuilderOperationParamValue | undefined> => ({ label: value?.toString(), value });
