import { Bench } from 'tinybench';

export const createBench = (name: string, time: number) => {
  const bench = new Bench({
    name,
    setup: (_task, mode) => {
      if (mode === 'warmup' && typeof globalThis.gc === 'function') {
        globalThis.gc();
      }
    },
    time,
    warmup: true,
    warmupTime: 500,
  });

  bench.addEventListener('start', start);
  bench.addEventListener('complete', complete);

  function start() {
    console.log('%o started ...', name);
    bench.removeEventListener('start', start);
  }

  function complete() {
    console.log('%o done.', name);
    bench.removeEventListener('complete', complete);
  }

  return bench;
};

// // https://github.com/tinylibs/tinybench/blob/caffce568294825bfd7f8de19cec2abe3f65796f/src/utils.ts#L136
// const mToNs = (ms: number) => ms * 1e6;

// // https://github.com/tinylibs/tinybench/blob/caffce568294825bfd7f8de19cec2abe3f65796f/src/utils.ts#L144
// const formatNumber = (
//   x: number,
//   targetDigits: number,
//   maxFractionDigits: number,
// ): string => {
//   // Round large numbers to integers, but not to multiples of 10.
//   // The actual number of significant digits may be more than `targetDigits`.
//   if (Math.abs(x) >= 10 ** targetDigits) {
//     return x.toFixed();
//   }

//   // Round small numbers to have `maxFractionDigits` digits after the decimal dot.
//   // The actual number of significant digits may be less than `targetDigits`.
//   if (Math.abs(x) < 10 ** (targetDigits - maxFractionDigits)) {
//     return x.toFixed(maxFractionDigits);
//   }

//   // Round medium magnitude numbers to have exactly `targetDigits` significant digits.
//   return x.toPrecision(targetDigits);
// };

// https://github.com/tinylibs/tinybench/blob/caffce568294825bfd7f8de19cec2abe3f65796f/src/bench.ts#L244
export const createCustomResult = (
  name: string,
  value: string,
  bench: Bench,
): CustomResult => {
  return {
    name: `${name} \`${value}\``,
    tasks: bench.table()
      .map(task => task ?? { Samples: Infinity })
      .sort((a, b) => typeof a.Samples === 'number' && typeof b.Samples === 'number'
        ? b.Samples - a.Samples
        : 0,
      ),
  };

  // return bench.tasks.map((task) => {
  //   if (task.result?.error) {
  //     return {
  //       Task: task.name,
  //       Error: task.result.error.message,
  //       Stack: task.result.error.stack,
  //     } satisfies ErrorResult;
  //   }

  //   if (task.result) {
  //     const { latency, throughput } = task.result;

  //     return {
  //       [`${name} \`${value}\``]: task.name,
  //       'Latency avg (ns)': `${formatNumber(mToNs(latency.mean), 5, 2)} \xb1 ${latency.rme.toFixed(2)}%`,

  //       'Latency med (ns)': `${formatNumber(mToNs(latency.p50!), 5, 2)} \xb1 ${formatNumber(mToNs(latency.mad!), 5, 2)}`,
  //       'Throughput avg (ops/s)': `${Math.round(throughput.mean).toString()} \xb1 ${throughput.rme.toFixed(2)}%`,

  //       'Throughput med (ops/s)': `${Math.round(throughput.p50!).toString()} \xb1 ${Math.round(throughput.mad!).toString()}`,
  //       'Samples': latency.samples.length,
  //       'Total Time': task.result.totalTime,
  //     };
  //   }
  //   return null;
  // });
};

// interface ErrorResult {
//   Task: string;
//   Error: string;
//   Stack: string | undefined;
// }

// type TableResult = Record<string, string | number | undefined | null>;

export interface CustomResult {
  name: string;
  tasks: (null | Record<string, string | number | undefined | null>)[];
}

export type CustomSample = [string, string, number?];
