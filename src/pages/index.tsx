import { type NextPage } from "next";
import Head from "next/head";
import {
  BarChart as TBArChart,
  Card,
  Title,
  Subtitle,
  Select,
  SelectItem,
  TextInput as TremorTextInput,
} from "@tremor/react";
import Papa from "papaparse";
import moment from "moment";
import axios, { type AxiosResponse } from "axios";
import iconv from "iconv-lite";

import { type InflationItem } from "../components/chart/BarChart";
import { inflation } from "../inflation";
import { useState } from "react";
import Link from "next/link";
import { Highlighted } from "../components/ui/Highlighted";
import {
  formatCurrency,
  formatCurrencyWithoutSymbol,
} from "../utils/formatCurrency";
import CardWithChart from "../components/chart/CardWithChart";
import { Selector } from "../components/ui/Selector";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-inferrable-types
const numberInputType: undefined = "number";

const valueFormatter = (number: number) =>
  `${formatCurrencyWithoutSymbol(number)} Ft`;

const years = inflation.map((item) => item.year).sort((a, b) => b - a);

const TremorBarChart = (props: {
  chartData: { name: number; ["összeg"]: number }[];
  title: string | JSX.Element;
  subtitle: string | JSX.Element;
}) => (
  <Card>
    {props.title && <Title>{props.title}</Title>}
    {props.subtitle && <Subtitle>{props.subtitle}</Subtitle>}
    <TBArChart
      className="mt-6"
      data={props.chartData}
      index="name"
      categories={["összeg"]}
      colors={["blue"]}
      valueFormatter={valueFormatter}
      yAxisWidth={48}
    />
  </Card>
);

export interface InflationData {
  code: string;
  label: string;
  prices: {
    date: string;
    value: number;
  }[];
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const Home: NextPage = (props: {
  data: {
    data: InflationData[];
    dates: string[];
  };
}) => {
  const [latestMonth, latestInflation] = Object.entries(
    inflation[inflation.length - 1]
  ).pop() as [string, number];

  const [selectedYear, setSelectedYear] = useState(2018);
  const [selectedMonth, setSelectedMonth] = useState(latestMonth);
  const [selectedAmount, setSelectedAmount] = useState(100_000);
  const [selectedPrimaryItem, setSelectedPrimaryItem] = useState("");
  const [selectedSecondaryItem, setSelectedSecondaryItem] = useState("");
  const [selectedTertiaryItem, setSelectedTertiaryItem] = useState("");
  const [minDate, setMinDate] = useState("1995");

  const __inflation = inflation.find(
    (item) => item.year === selectedYear
  ) as InflationItem;
  const selectedInflationValue = __inflation[
    selectedMonth as keyof InflationItem
  ] as number;
  const baseValue = (selectedAmount / selectedInflationValue) * 100;

  const _inflation = inflation.map((item) => {
    const year = item.year;
    const month = item[selectedMonth as keyof InflationItem];
    return { year, [selectedMonth]: ((baseValue * month) / 100).toFixed() };
  }) as unknown as InflationItem[];

  const _valueDegradation = inflation.map((item) => {
    const { year } = item;
    const month = item[selectedMonth as keyof InflationItem];

    return {
      year,
      [selectedMonth]: (
        selectedAmount *
        (selectedInflationValue / month)
      ).toFixed(),
    };
  }) as unknown as InflationItem[];

  const valueToday = _inflation.find((item) => item.year === 2023)?.[
    selectedMonth
  ] as number;

  const degradedValueToday = _valueDegradation.find(
    (item) => item.year === 2023
  )?.[selectedMonth] as number;

  const handleYearSelection = (value: number | string) => {
    setSelectedYear(Number(value));
  };

  const onAmountChange = (event: React.SyntheticEvent) => {
    const value = (event.target as HTMLInputElement).value;
    if (Number(value) > 0) setSelectedAmount(Number(value));
  };

  const chartData = _inflation.map((item) => {
    const { year } = item;
    const month = item[selectedMonth] as string;
    return { name: year, ["összeg"]: Number(month) };
  });

  const degradationChartData = _valueDegradation.map((item) => {
    const { year } = item;
    const month = item[selectedMonth] as string;
    return { name: year, ["összeg"]: Number(month) };
  });

  const options = props.data.data.map((item) => {
    return { code: item.code, label: item.label };
  });

  const bread = props.data.data.find((item) =>
    item.label.toLowerCase().startsWith("kenyér")
  ) as InflationData;
  const egg = props.data.data.find((item) =>
    item.label.toLowerCase().startsWith("tojás")
  ) as InflationData;
  const beer = props.data.data.find((item) =>
    item.label.toLowerCase().startsWith("világos sör")
  ) as InflationData;

  const dateOptions = props.data.dates
    .map((item) => {
      return { code: item, label: item };
    })
    .sort((a, b) => Number(b.code) - Number(a.code));

  const selectedPrimaryProduct = props.data.data.find(
    (item) => item.code === selectedPrimaryItem
  );

  const selectedSecondaryProduct = props.data.data.find(
    (item) => item.code === selectedSecondaryItem
  );

  const selectedTertiaryProduct = props.data.data.find(
    (item) => item.code === selectedTertiaryItem
  );

  const onSelectPrimaryItem = (value: string) => {
    setSelectedPrimaryItem(value);
  };

  const onSelectSecondaryItem = (value: string) => {
    setSelectedSecondaryItem(value);
  };

  const onSelectTertiaryItem = (value: string) => {
    setSelectedTertiaryItem(value);
  };

  const onSelectMinDate = (value: string) => {
    setMinDate(value);
  };

  return (
    <>
      <Head>
        <title>Infláció kalkulátor</title>
        <meta
          name="description"
          content="Számold ki mennyit romlott a forint értéke az évek során"
        />
        <meta itemProp="name" content="Infláció kalkulátor" />
        <meta
          itemProp="description"
          content="Számold ki mennyit romlott a forint értéke az évek során"
        />
        <meta
          itemProp="image"
          content="https://inflacio.robi.dev/og-image-inflacio.jpg"
        />

        <meta property="og:url" content="https://inflacio.robi.dev" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Infláció kalkulátor" />
        <meta
          property="og:description"
          content="Számold ki mennyit romlott a forint értéke az évek során"
        />
        <meta
          property="og:image"
          content="https://inflacio.robi.dev/og-image-inflacio.jpg"
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Infláció kalkulátor" />
        <meta
          name="twitter:description"
          content="Számold ki mennyit romlott a forint értéke az évek során"
        />
        <meta
          name="twitter:image"
          content="https://inflacio.robi.dev/og-image-inflacio.jpg"
        ></meta>
        <link rel="icon" href="/favicon.ico" />
        <script
          async
          defer
          data-website-id={process.env.STATS_WEBSITE_ID}
          src={process.env.STATS_URL}
        ></script>
      </Head>
      {/* <main className="flex min-h-screen flex-col items-center  bg-gradient-to-b from-[#2e026d] to-[#15162c]"> */}
      <main className="dark relative flex h-full min-h-screen flex-col items-center  bg-[#050b1c]">
        <div className="absolute inset-0 z-0 bg-[url(/grid.svg)] bg-center [mask-image:linear-gradient(to_bottom,transparent,black)]"></div>
        <div className="container z-10 flex flex-col items-center justify-center px-4 py-16 ">
          <div className=" flex min-h-[400px]  w-full  flex-col gap-20 ">
            <div>
              <h1 className="text-4xl font-extrabold text-white sm:text-6xl">
                Infláció kalkulátor
              </h1>
            </div>
            <div>
              <div className="flex flex-col gap-6">
                <p className="text-lg text-slate-400">
                  Termékek és szolgáltatások éves fogyasztói átlagára:
                </p>
                <div className=" max-w-sm">
                  <Selector
                    options={dateOptions}
                    placeholder="Válassz kezdő évszámot"
                    onSelect={onSelectMinDate}
                  />
                </div>
                <div className="grid grid-cols-1 grid-rows-[1fr] gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <CardWithChart
                    data={selectedPrimaryProduct ?? bread}
                    options={options}
                    onSelect={onSelectPrimaryItem}
                    minYear={Number(minDate)}
                  />
                  <CardWithChart
                    className="hidden md:block"
                    data={selectedSecondaryProduct ?? egg}
                    options={options}
                    onSelect={onSelectSecondaryItem}
                    minYear={Number(minDate)}
                  />
                  <CardWithChart
                    className="hidden lg:block"
                    data={selectedTertiaryProduct ?? beer}
                    options={options}
                    onSelect={onSelectTertiaryItem}
                    minYear={Number(minDate)}
                  />
                </div>
              </div>
              <div className="mt-4 w-full text-right text-sm text-white">
                <Link
                  className="text-dark-tremor-brand-emphasis underline"
                  target="_blank"
                  rel="noopener noreferrer"
                  href={"https://www.ksh.hu/stadat_files/ara/hu/ara0004.html"}
                >
                  ksh.hu{" "}
                </Link>
              </div>
            </div>

            <div className="flex flex-col items-start gap-4">
              <p className="text-lg text-slate-400">
                Számold ki, hogy mennyit ér vagy éppen mennyit romlott a pénzed
                értéke az évek során:
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col items-start gap-1">
                  <p className="text-sm text-slate-400"> Évszám: </p>
                  <Select
                    value={String(selectedYear)}
                    onValueChange={handleYearSelection}
                    enableClear={false}
                    className="[&>button]:text-base"
                  >
                    {years.map((year) => (
                      <SelectItem value={String(year)} key={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </Select>
                </div>

                <div className="flex flex-col gap-1">
                  <p className="text-sm text-slate-400"> Összeg: </p>

                  <TremorTextInput
                    name="amount"
                    placeholder="Disabled"
                    defaultValue="100000"
                    type={numberInputType}
                    onBlur={onAmountChange}
                    className="[&>input]:text-base"
                  />
                </div>
              </div>
            </div>

            <TremorBarChart
              chartData={chartData}
              title={
                <span className="text-sm">
                  Ez azt jelenti, hogy ami{" "}
                  <Highlighted> {selectedYear} </Highlighted> évben{" "}
                  <Highlighted> {formatCurrency(selectedAmount)}</Highlighted>{" "}
                  -ba került, azt ma{" "}
                  <Highlighted> {formatCurrency(valueToday)}</Highlighted> -ért
                  tudod megvenni
                </span>
              }
              subtitle=""
            />
            <TremorBarChart
              chartData={degradationChartData}
              title={
                <span className="text-sm">
                  Ez azt is jelenti, hogy a{" "}
                  <Highlighted> {selectedYear} </Highlighted> évben kapott{" "}
                  <Highlighted> {formatCurrency(selectedAmount)}</Highlighted>
                  fizetésednek az értéke ma{" "}
                  <Highlighted>
                    {" "}
                    {formatCurrency(degradedValueToday)}
                  </Highlighted>{" "}
                </span>
              }
              subtitle=""
            />

            <div className="w-full text-center text-sm text-white">
              A felhasznált értékek a{" "}
              <Link
                className="text-dark-tremor-brand-emphasis underline"
                target="_blank"
                rel="noopener noreferrer"
                href={"https://www.ksh.hu/stadat_files/ara/hu/ara0045.html"}
              >
                ksh maginflációs adatbázisából{" "}
              </Link>
              származnak.
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export const getStaticProps = async () => {
  try {
    // Fetch the CSV data as a stream
    const response: AxiosResponse<ArrayBuffer> = await axios({
      method: "get",
      url: "https://www.ksh.hu/stadat_files/ara/hu/ara0004.csv",
      responseType: "arraybuffer",
    });

    // Convert the response data from 'ISO-8859-2' to 'UTF-8'
    const csvText = iconv.decode(Buffer.from(response.data), "ISO-8859-2");

    // Parse the CSV text to JSON
    const data = await new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: false, // Do not treat the first row as header
        encoding: "latin2",
        skipEmptyLines: true,
        complete: (results) => {
          const rows = results.data;

          // Skip the title row
          rows.shift();

          // Process the date strings from the second row
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          const [, , ...dateStrings] = rows.shift();
          const dates = dateStrings.map((dateString: string) =>
            moment(dateString, "YYYY", "hu").format("YYYY")
          );

          const rowsWithoutValues = new Array(dates.length).fill(0);
          const parsedData = rows.map((row) => {
            const [code, name, ...values] = row as Array<string>;

            // Replace long dash and process prices
            const cleanedName = (name as string).replace(/\u0096/, "–");
            const prices = values.map((value: string, index: number) => {
              return {
                date: dates[index],
                value: parseInt(value.replace(" ", ""), 10),
              };
            });

            // Count missing values
            prices.forEach((price, index) => {
              if (price === null) {
                rowsWithoutValues[index] += 1;
              }
            });

            return {
              code,
              label: cleanedName,
              prices,
            };
          });

          // Trim data based on complete missing values
          const firstMissingAllIndex = rowsWithoutValues.findIndex(
            (value) => value === rows.length
          );
          if (firstMissingAllIndex !== -1) {
            dates.splice(firstMissingAllIndex);
            parsedData.forEach((item) => {
              item.prices.splice(firstMissingAllIndex);
            });
          }

          resolve({ dates, data: parsedData });
        },
      });
    });

    // Return the parsed data as props
    return {
      props: { data },
    };
  } catch (error) {
    console.error("Error fetching and parsing CSV:", error);
    return { props: {} };
  }
};

export default Home;
