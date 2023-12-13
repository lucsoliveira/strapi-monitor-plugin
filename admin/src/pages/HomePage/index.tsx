/*
 *
 * HomePage
 *
 */

import { Box, Table, Tbody, Td, Th, Thead, Tr, Typography } from '@strapi/design-system';

import * as ApexCharts from 'apexcharts';
import React, { useEffect, useState } from 'react';
import pluginId from '../../pluginId';
import { METRICS_SERVICES } from '../../services';

const Chart = ApexCharts.default;
export type RowItem = (string | number)[];
export const MetricsTable = (props: { columns: string[]; rows: RowItem[] }) => {
  return (
    <Box padding={8} background="neutral100">
      <Table colCount={props.columns.length} rowCount={props.rows.length}>
        <Thead>
          <Tr>
            {props.columns.map((c) => (
              <Th>
                <Typography variant="sigma">{c}</Typography>
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {props.rows.map((r, index) => (
            <Tr key={index}>
              {r.map((c) => (
                <Td>
                  <Typography textColor="neutral800">{c}</Typography>
                </Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

const HomePage = () => {
  const [metrics, setMetrics] = useState<any>(null);

  const [intervalMS, setIntervalMS] = useState(2);
  const [start, setStart] = useState({
    start: false,
    timestamp: new Date().toISOString(),
  });
  const [intervalId, setIntervalId] = useState(null);
  const [dataTable, setDatatable] = useState<RowItem[]>([]);
  const [lastMetrics, setLastMetrics] = useState<RowItem[]>([]);

  const getMetrics = () => {
    METRICS_SERVICES.getMetrics('http://localhost:1337/api/metrics').then((res) => {
      if (res.success && res.data) {
        setMetrics(res.data.mb);
      }
    });
  };

  React.useEffect(() => {
    if (start.start) {
      const iObj: any = setInterval(getMetrics, intervalMS * 1000);
      setIntervalId(iObj);
    } else {
      clearInterval(Number(intervalId));
    }
  }, [start]);

  useEffect(() => {
    if (metrics) {
      const normalizedItems: RowItem[] = [];

      let i = 1;
      for (const key of Object.keys(metrics)) {
        const value = metrics[key];
        normalizedItems.push([i, key, value]);

        i++;
      }

      setDatatable(normalizedItems);

      const verify = Array.isArray(lastMetrics);
      console.log({
        verify,
      });

      if (verify) {
        const newValue = [...lastMetrics];
        newValue.push(metrics);
        setLastMetrics(newValue);
      }
    }
  }, [metrics]);
  return (
    <div>
      <h1>{pluginId}&apos;s HomePage</h1>

      <input
        type="number"
        value={intervalMS}
        onChange={(event) => {
          const val = event.currentTarget.value;
          setIntervalMS(Number(val));
        }}
      />

      <button
        type="button"
        onClick={() => {
          setStart({
            start: true,
            timestamp: new Date().toISOString(),
          });
        }}
      >
        Iniciar
      </button>

      <button
        type="button"
        onClick={() => {
          setStart({
            start: false,
            timestamp: new Date().toISOString(),
          });
        }}
      >
        Parar
      </button>

      <button
        type="button"
        onClick={() => {
          setLastMetrics([]);
        }}
      >
        Limpar
      </button>
      <MetricsTable columns={['ID', 'METRIC', 'MB']} rows={dataTable} />

      <textarea value={JSON.stringify(lastMetrics)}></textarea>
    </div>
  );
};

export default HomePage;
