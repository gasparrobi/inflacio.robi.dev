import { type NextPage } from "next";
import Head from "next/head";

import BarChart, { type InflationItem } from "../components/chart/BarChart";
import DropdownSelector from "../components/ui/DropdownSelector";
import { inflation } from "../inflation";
import { useState } from "react";
import { TextInput } from "../components/ui/TextInput";
import Link from "next/link";
import { Highlighted } from "../components/ui/Highlighted";
import { formatCurrency } from "../utils/formatCurrency";
import { monthToHungarianMap } from "../constants";

const years = inflation.map((item) => item.year).sort((a, b) => b - a);
const months = Object.keys(inflation.at(-1)).filter((item) => item !== "year");
const hungarianMonths = months.map((item) => monthToHungarianMap[item]);

const Home: NextPage = () => {
  const [selectedYear, setSelectedYear] = useState(2018);
  const [selectedMonth, setSelectedMonth] = useState("october");
  const [selectedAmount, setSelectedAmount] = useState(100_000);

  const __inflation = inflation.find(
    (item) => item.year === selectedYear
  ) as InflationItem;
  const selectedInflationValue = __inflation[selectedMonth] as number;
  const baseValue = (selectedAmount / selectedInflationValue) * 100;

  const _inflation = inflation.map((item) => {
    const { year, october } = item;
    return { year, october: ((baseValue * october) / 100).toFixed() };
  }) as unknown as InflationItem[];

  const _valueDegradation = inflation.map((item) => {
    const { year, october } = item;

    return {
      year,
      october: (selectedAmount * (selectedInflationValue / october)).toFixed(),
    };
  }) as unknown as InflationItem[];

  const valueToday = _inflation.find((item) => item.year === 2023)
    ?.october as number;

  const degradedValueToday = _valueDegradation.find(
    (item) => item.year === 2023
  )?.october as number;

  const handleYearSelection = (value: number | string) => {
    setSelectedYear(Number(value));
  };

  const handleMonthSelection = (value: number | string) => {
    setSelectedMonth(getMonthValue(value));
  };

  const getMonthValue = (value: string) =>
    Object.keys(monthToHungarianMap).find(
      (item) => monthToHungarianMap[item] === value
    );

  const onAmountChange = (event: React.SyntheticEvent) => {
    const value = (event.target as HTMLInputElement).value;
    if (Number(value) > 0) setSelectedAmount(Number(value));
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
          content="https://inflacio.robi.dev/og-image.jpg"
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
          content="https://inflacio.robi.dev/og-image.jpg"
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Infláció kalkulátor" />
        <meta
          name="twitter:description"
          content="Számold ki mennyit romlott a forint értéke az évek során"
        />
        <meta
          name="twitter:image"
          content="https://inflacio.robi.dev/og-image.jpg"
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
      <main className="relative flex h-full min-h-screen flex-col items-center  bg-[#17161e]">
        <div className="absolute inset-0 z-0 bg-[url(/grid.svg)] bg-center [mask-image:linear-gradient(to_bottom,transparent,black)]"></div>
        <div className="container z-10 flex flex-col items-center justify-center px-4 py-16 ">
          <div className=" flex min-h-[400px]  w-full  flex-col gap-20 ">
            <div>
              <h1 className="text-4xl font-extrabold text-white sm:text-6xl">
                Infláció kalkulátor
              </h1>
              <p className="text-lg text-slate-400">
                Érdekel, hogy mennyit ér vagy éppen mennyit romlott a pénzed
                értéke az évek során?
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <span className="font-bold text-white">Számold ki, hogy</span>
              <TextInput
                name="amount"
                defaultValue={100_000}
                type="number"
                onBlur={onAmountChange}
              />
              <span className="font-bold text-white">Forint</span>
              <DropdownSelector
                options={years}
                defaultValue={selectedYear}
                onChange={handleYearSelection}
              />{" "}
              <DropdownSelector
                options={hungarianMonths}
                defaultValue={monthToHungarianMap[selectedMonth]}
                onChange={handleMonthSelection}
              />{" "}
              <span className="font-bold text-white">
                -ban/ben mennyit ér ma
              </span>
            </div>

            <div className="flex flex-col gap-4  py-3 text-lg font-bold text-white">
              <p>
                Ez azt jelenti, hogy ami{" "}
                <Highlighted> {selectedYear} </Highlighted> évben{" "}
                <Highlighted> {formatCurrency(selectedAmount)}</Highlighted> -ba
                került, azt ma{" "}
                <Highlighted> {formatCurrency(valueToday)}</Highlighted> -ért
                tudod megvenni 🤌
              </p>
            </div>

            <div className="h-[400px] min-h-[400px]">
              <BarChart payload={_inflation} selectedYear={selectedYear} />
            </div>

            <div className="flex flex-col gap-4  py-3 text-lg font-bold text-white">
              <p>
                Ez azt is jelentheti, hogy a{" "}
                <Highlighted> {selectedYear} </Highlighted> évben kapott{" "}
                <Highlighted> {formatCurrency(selectedAmount)}</Highlighted>
                fizetésednek az értéke ma{" "}
                <Highlighted>
                  {" "}
                  {formatCurrency(degradedValueToday)}
                </Highlighted>{" "}
                🤌
              </p>
            </div>

            <div className="h-[400px] min-h-[400px]">
              <BarChart
                payload={_valueDegradation}
                selectedYear={selectedYear}
              />
            </div>

            <div className="w-full text-center text-sm text-white">
              A felhasznált értékek a{" "}
              <Link
                className="text-primary underline"
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

export default Home;
