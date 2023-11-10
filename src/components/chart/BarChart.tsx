import { ResponsiveBar } from "@nivo/bar";
import { inflation } from "../../inflation";
import { formatCurrency } from "../../utils/formatCurrency";
import { useWindowSize } from "react-use";

export interface InflationItem {
  year: number;
  january: number;
  february: number;
  march: number;
  april: number;
  may: number;
  june: number;
  july: number;
  august: number;
  september: number;
  october: number;
  november?: number;
  december?: number;
}

interface BarChartProps {
  payload?: InflationItem[];
  isAmountHidden?: boolean;
  selectedYear?: number;
}

const BarChart = ({
  payload,
  isAmountHidden = false,
  selectedYear = 2023,
}: BarChartProps) => {
  const _payload = payload ?? inflation;

  const { width } = useWindowSize();
  const isMobileScreen = width < 768;

  return (
    <ResponsiveBar
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      data={_payload}
      keys={["october"]}
      indexBy="year"
      margin={{ top: 50, right: 30, bottom: 50, left: 80 }}
      padding={0.3}
      groupMode="grouped"
      enableLabel={false}
      // enableGridY={false}
      valueScale={{ type: "linear" }}
      indexScale={{ type: "band", round: true }}
      // colors={{ scheme: "dark2" }}
      // colors={"#1b9e77"}
      colors={(element) =>
        element.data.year === selectedYear ? "#fff" : "#1b9e77"
      }
      colorBy="id"
      borderColor={{
        from: "color",
        modifiers: [["darker", 1.6]],
      }}
      theme={{
        axis: {
          ticks: {
            line: {
              stroke: "white",
            },
            text: {
              fill: "white",
            },
          },
        },
        grid: {
          line: {
            stroke: "rgba(255,255,255,.3)",
          },
        },
        legends: {
          text: {
            fill: "white",
          },
        },
      }}
      axisTop={null}
      axisRight={null}
      axisLeft={
        isAmountHidden
          ? null
          : {
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legendPosition: "middle",
              legendOffset: -55,
              format: (value) => formatCurrency(value as number),
            }
      }
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: isMobileScreen ? -60 : 0,
        legend: "",
        legendPosition: "middle",
        legendOffset: 32,
      }}
      // axisLeft={{
      //   tickSize: 5,
      //   tickPadding: 5,
      //   tickRotation: 0,
      //   legend: 'összeg',
      //   legendPosition: 'middle',
      //   legendOffset: -55,
      // }}
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor={{
        from: "color",
        modifiers: [["darker", 1.6]],
      }}
      legends={[
        {
          dataFrom: "keys",
          anchor: "top",
          direction: "row",
          justify: false,
          translateX: 0,
          translateY: -40,
          itemsSpacing: 2,
          itemWidth: 100,
          itemHeight: 20,
          itemDirection: "left-to-right",
          itemOpacity: 0.85,
          symbolSize: 20,
          effects: [
            {
              on: "hover",
              style: {
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}
      tooltip={(e) => {
        return (
          <div
            style={{
              background: "white",
              padding: "9px 12px",
              border: "1px solid #ccc",
            }}
          >
            <div className="font-bold">{e.data.year} - január</div>
            <div>{formatCurrency(e.data.october as number)}</div>
          </div>
        );
      }}
      role="application"
    />
  );
};

export default BarChart;
