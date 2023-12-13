/*
 *
 * HomePage
 *
 */

import React, { useState } from 'react';
import pluginId from '../../pluginId';
import { METRICS_SERVICES } from '../../services';

const HomePage = () => {
  const [metrics, setMetrics] = useState<any>(null);

  const [intervalMS, setIntervalMS] = useState(2);
  const [start, setStart] = useState({
    start: false,
    timestamp: new Date().toISOString(),
  });

  const [intervalId, setIntervalId] = useState(null);

  const getMetrics = () => {
    METRICS_SERVICES.getMetrics('http://0.0.0.0:1337/api/metrics').then((res) => {
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

  return (
    <div>
      <h1>{pluginId}&apos;s HomePage</h1>
      <p>Happy coding</p>

      <p>{JSON.stringify(metrics)}</p>

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
    </div>
  );
};

export default HomePage;
