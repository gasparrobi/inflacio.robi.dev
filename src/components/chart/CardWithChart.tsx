import { Card, AreaChart, BadgeDelta, Flex } from "@tremor/react";

import { Selector } from "../ui/Selector";

const valueFormatter = (number: number) =>
  `${Intl.NumberFormat("hu").format(number).toString()} Ft`;

export default function CardWithChart({
  data,
  options,
  onSelect,
  minYear = 1995,
  ...props
}: {
  data: {
    code: string;
    label: string;
    prices: {
      date: string;
      value: number;
    }[];
  };
  options?: {
    code: string;
    label: string;
  }[];
  onSelect?: (value: string) => void;
  minYear?: number;
  className?: string;
}) {
  const prices = (data?.prices ?? [])
    .map((item) => {
      return { date: item.date, ["ár"]: item.value };
    })
    .filter((item) => item?.["ár"] > 0)
    .filter((item) => Number(item?.date) >= minYear);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore prices possibly undefined
  const lastYear = prices[prices.length - 1]["ár"];
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore prices possibly undefined
  const firstYear = prices[0]["ár"];

  const percentage = ((-1 + lastYear / firstYear) * 100).toFixed(0);
  const item = data;
  const fromPrice = valueFormatter(firstYear);
  const toPrice = valueFormatter(lastYear);

  return (
    <Card {...props}>
      <div className="mb-6">
        <Selector options={options} onSelect={onSelect} />
      </div>
      <Flex alignItems="start">
        <p className="text-sm text-white">{item.label}</p>
        <BadgeDelta deltaType="moderateIncrease">{percentage}%</BadgeDelta>
      </Flex>

      <div className="flex items-baseline gap-2 text-white">
        <span className="text-dark-tremor-content">{fromPrice}</span> -{" "}
        <span className="text-lg font-semibold">{toPrice}</span>
      </div>
      <AreaChart
        className="mt-6 h-28"
        data={prices}
        index="date"
        valueFormatter={valueFormatter}
        categories={["ár"]}
        colors={["blue"]}
        showXAxis={true}
        showGridLines={false}
        startEndOnly={true}
        showYAxis={false}
        showLegend={false}
        autoMinValue={true}
      />
    </Card>
  );
}
