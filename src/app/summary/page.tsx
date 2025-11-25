"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type DemographicGroups = {
  race: Record<string, number>;
  age: Record<string, number>;
  gender: Record<string, number>;
};

type ApiResponse = {
  message: string;
  data: DemographicGroups;
};

type GroupKey = "race" | "age" | "gender";

const RACE_DISPLAY_ORDER = [
  "white",
  "latino hispanic",
  "southeast asian",
  "south asian",
  "black",
  "east asian",
  "middle eastern",
];

const AGE_DISPLAY_ORDER = [
  "0-2",
  "3-9",
  "10-19",
  "20-29",
  "30-39",
  "40-49",
  "50-59",
  "60-69",
  "70+",
];

const GENDER_DISPLAY_ORDER = ["female", "male"];

function toPercent(value: number | undefined) {
  if (!value || Number.isNaN(value)) return 0;
  return Math.round(value * 100);
}

function formatLabel(key: string) {
  return key
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function getBestKey(group: Record<string, number> | undefined | null) {
  if (!group) return "";
  const entries = Object.entries(group);
  if (!entries.length) return "";
  return entries.reduce((max, current) =>
    current[1] > max[1] ? current : max
  )[0];
}

export default function SummaryPage() {
  const router = useRouter();
  const [data, setData] = useState<DemographicGroups | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeGroup, setActiveGroup] = useState<GroupKey>("race");
  const [selectedKeys, setSelectedKeys] = useState<
    Partial<Record<GroupKey, string>>
  >({});

  useEffect(() => {
    async function fetchDemographics() {
      try {
        setLoading(true);
        setError(null);

        const capturedImage = window.localStorage.getItem(
          "skinstric_captured_image"
        );
        const stored = window.localStorage.getItem("skinstric_demographics");

        if (!capturedImage) {
          if (stored) {
            const parsed: DemographicGroups = JSON.parse(stored);
            setData(parsed);
            setSelectedKeys({
              race: getBestKey(parsed.race),
              age: getBestKey(parsed.age),
              gender: getBestKey(parsed.gender),
            });
            setLoading(false);
            return;
          } else {
            throw new Error("No captured image found.");
          }
        }

        const response = await fetch(
          "https://us-central1-api-skinstric-ai.cloudfunctions.net/skinstricPhaseTwo",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              image: capturedImage,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch demographics");
        }

        const json: ApiResponse = await response.json();
        setData(json.data);
        setSelectedKeys({
          race: getBestKey(json.data.race),
          age: getBestKey(json.data.age),
          gender: getBestKey(json.data.gender),
        });
        window.localStorage.setItem(
          "skinstric_demographics",
          JSON.stringify(json.data)
        );
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Something went wrong");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchDemographics();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const previousBg = document.body.style.backgroundColor;
    const previousOverflowY = document.body.style.overflowY;

    document.body.style.backgroundColor = "#ffffff";

    const updateOverflow = () => {
      if (window.innerWidth >= 768) {
        document.body.style.overflowY = "hidden";
      } else {
        document.body.style.overflowY = "auto";
      }
    };

    updateOverflow();
    window.addEventListener("resize", updateOverflow);

    return () => {
      document.body.style.backgroundColor = previousBg;
      document.body.style.overflowY = previousOverflowY;
      window.removeEventListener("resize", updateOverflow);
    };
  }, []);

  const raceRows = useMemo(() => {
    if (!data?.race) return [];
    const ordered = RACE_DISPLAY_ORDER.filter((key) => key in data.race);
    const others = Object.keys(data.race).filter(
      (key) => !RACE_DISPLAY_ORDER.includes(key)
    );
    const fullOrder = [...ordered, ...others];
    return fullOrder.map((key) => ({
      key,
      label: formatLabel(key),
      percent: toPercent(data.race[key]),
    }));
  }, [data]);

  const ageRows = useMemo(() => {
    if (!data?.age) return [];
    const ordered = AGE_DISPLAY_ORDER.filter((key) => key in data.age);
    const others = Object.keys(data.age).filter(
      (key) => !AGE_DISPLAY_ORDER.includes(key)
    );
    const fullOrder = [...ordered, ...others];
    return fullOrder.map((key) => ({
      key,
      label: key,
      percent: toPercent(data.age[key]),
    }));
  }, [data]);

  const genderRows = useMemo(() => {
    if (!data?.gender) return [];
    const ordered = GENDER_DISPLAY_ORDER.filter((key) => key in data.gender);
    const others = Object.keys(data.gender).filter(
      (key) => !GENDER_DISPLAY_ORDER.includes(key)
    );
    const fullOrder = [...ordered, ...others];
    return fullOrder.map((key) => ({
      key,
      label: formatLabel(key),
      percent: toPercent(data.gender[key]),
    }));
  }, [data]);

  let tableHeaderLabel = "Race";
  let rows = raceRows;
  if (activeGroup === "age") {
    tableHeaderLabel = "Age";
    rows = ageRows;
  } else if (activeGroup === "gender") {
    tableHeaderLabel = "Sex";
    rows = genderRows;
  }

  const bestRaceKey = data?.race ? getBestKey(data.race) : "";
  const bestAgeKey = data?.age ? getBestKey(data.age) : "";
  const bestGenderKey = data?.gender ? getBestKey(data.gender) : "";

  const activeSelectedKey =
    selectedKeys[activeGroup] ||
    (activeGroup === "race" && bestRaceKey
      ? bestRaceKey
      : activeGroup === "age" && bestAgeKey
      ? bestAgeKey
      : activeGroup === "gender" && bestGenderKey
      ? bestGenderKey
      : rows.length > 0
      ? rows[0].key
      : "");

  const activeRow =
    rows.find((row) => row.key === activeSelectedKey) || rows[0] || null;

  const selectedPercent = activeRow ? activeRow.percent : 0;
  const circumference = 2 * Math.PI * 49.15;
  const dashOffset =
    circumference * (1 - (selectedPercent > 0 ? selectedPercent : 0) / 100);

  let mainLabel = "-";
  if (activeRow) {
    if (activeGroup === "race") {
      mainLabel = activeRow.label;
    } else if (activeGroup === "age") {
      mainLabel = `${activeRow.key} y.o.`;
    } else if (activeGroup === "gender") {
      mainLabel = activeRow.label.toUpperCase();
    }
  }

  const raceSummaryLabel =
    selectedKeys.race && data?.race
      ? formatLabel(selectedKeys.race)
      : bestRaceKey
      ? formatLabel(bestRaceKey)
      : loading
      ? "Loading..."
      : "-";

  const ageSummaryLabel =
    selectedKeys.age && data?.age
      ? selectedKeys.age
      : bestAgeKey
      ? bestAgeKey
      : loading
      ? "Loading..."
      : "-";

  const genderSummaryLabel =
    selectedKeys.gender && data?.gender
      ? formatLabel(selectedKeys.gender)
      : bestGenderKey
      ? formatLabel(bestGenderKey)
      : loading
      ? "Loading..."
      : "-";

  function handleRowClick(group: GroupKey, key: string) {
    setSelectedKeys((prev) => ({
      ...prev,
      [group]: key,
    }));
  }

  return (
    <div className="min-h-screen md:h-screen flex flex-col bg-white text-black md:overflow-hidden">
      <main className="flex-1 w-full bg-white">
        <div className="h-full max-w-[480px] md:max-w-full mx-auto md:mx-5 px-4 md:px-0 flex flex-col">
          <div className="text-start mb-4 md:mb-10">
            <h2 className="text-base font-semibold mb-1 leading-[24px]">
              A.I. ANALYSIS
            </h2>
            <h3 className="text-4xl md:text-[72px] font-normal leading-[64px] tracking-tighter">
              DEMOGRAPHICS
            </h3>
            <h4 className="text-sm mt-2 leading-[24px]">
              PREDICTED RACE &amp; AGE
            </h4>
          </div>

          <div className="grid md:grid-cols-[1.5fr_8.5fr_3.15fr] gap-4 mt-6 md:mt-10 pb-10 md:pb-0">
            <div className="hidden md:flex order-3 md:order-1 bg-white space-y-3 flex-col h-[62%]">
              <button
                type="button"
                onClick={() => setActiveGroup("race")}
                className={`p-3 cursor-pointer flex-1 flex flex-col justify-between border-t ${
                  activeGroup === "race"
                    ? "bg-[#1A1B1C] text-white hover:bg-black"
                    : "bg-[#F3F3F4] hover:bg-[#E1E1E2] text-black"
                }`}
              >
                <p className="text-base font-semibold">{raceSummaryLabel}</p>
                <h4 className="text-base font-semibold mb-1">RACE</h4>
              </button>

              <button
                type="button"
                onClick={() => setActiveGroup("age")}
                className={`p-3 cursor-pointer flex-1 flex flex-col justify-between border-t ${
                  activeGroup === "age"
                    ? "bg-[#1A1B1C] text-white hover:bg-black"
                    : "bg-[#F3F3F4] hover:bg-[#E1E1E2] text-black"
                }`}
              >
                <p className="text-base font-semibold">{ageSummaryLabel}</p>
                <h4 className="text-base font-semibold mb-1">AGE</h4>
              </button>

              <button
                type="button"
                onClick={() => setActiveGroup("gender")}
                className={`p-3 cursor-pointer flex-1 flex flex-col justify-between border-t ${
                  activeGroup === "gender"
                    ? "bg-[#1A1B1C] text-white hover:bg-black"
                    : "bg-[#F3F3F4] hover:bg-[#E1E1E2] text-black"
                }`}
              >
                <p className="text-base font-semibold">
                  {genderSummaryLabel.toUpperCase()}
                </p>
                <h4 className="text-base font-semibold mb-1">SEX</h4>
              </button>
            </div>

            <div className="hidden md:flex md:order-2 relative bg_WHITE md:bg-gray-100 p-0 md:p-4 flex-col md:h-[57vh] md:border-t">
              <p className="hidden md:block md:absolute text-[40px] mb-2 left-7 top-4">
                {mainLabel}
              </p>

              <div className="flex w-full h-full items-center justify-center">
                <div className="relative w-[310px] md:w-[360px] lg:w-[400px] xl:w-[440px] 2xl:w-[460px] aspect-square">
                  <div className="w-full h-full relative">
                    <svg
                      className="CircularProgressbar text-[#1A1B1C]"
                      viewBox="0 0 100 100"
                    >
                      <path
                        className="CircularProgressbar-trail"
                        d="
                          M 50,50
                          m 0,-49.15
                          a 49.15,49.15 0 1 1 0,98.3
                          a 49.15,49.15 0 1 1 0,-98.3
                        "
                        strokeWidth={1.7}
                        fill="none"
                        style={{
                          strokeLinecap: "butt",
                          strokeDasharray: `${circumference}px, ${circumference}px`,
                          strokeDashoffset: 0,
                        }}
                      />
                      <path
                        className="CircularProgressbar-path"
                        d="
                          M 50,50
                          m 0,-49.15
                          a 49.15,49.15 0 1 1 0,98.3
                          a 49.15,49.15 0 1 1 0,-98.3
                        "
                        strokeWidth={1.7}
                        fill="none"
                        style={{
                          stroke: "#1A1B1C",
                          strokeLinecap: "butt",
                          strokeDasharray: `${circumference}px, ${circumference}px`,
                          strokeDashoffset: dashOffset,
                          transitionDuration: "0.8s",
                        }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-3xl md:text-[40px] font-normal relative text-black">
                        {selectedPercent}
                        <span className="absolute text-xl md:text-3xl">%</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT TABLE + MOBILE STUFF */}
            <div className="order-1 md:order-3 bg-[#F4F5F7] pt-0 md:pt-4 pb-0 md:pb-4 md:border-t md:h_[57vh]">
              <div className="md:hidden mb-0 space-y-0">
                <button
                  type="button"
                  onClick={() => setActiveGroup("race")}
                  className={`w-full px-4 py-3 cursor-pointer flex flex-col justify-between border-t ${
                    activeGroup === "race"
                      ? "bg-[#1A1B1C] text-white hover:bg-black"
                      : "bg-[#F3F3F4] hover:bg-[#E1E1E2] text-black"
                  }`}
                >
                  <p className="text-base font-semibold">{raceSummaryLabel}</p>
                  <h4 className="text-base font-semibold mb-1">RACE</h4>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveGroup("age")}
                  className={`w-full px-4 py-3 cursor-pointer flex flex-col justify-between border-t ${
                    activeGroup === "age"
                      ? "bg-[#1A1B1C] text-white hover:bg-black"
                      : "bg-[#F3F3F4] hover:bg-[#E1E1E2] text-black"
                  }`}
                >
                  <p className="text-base font-semibold">{ageSummaryLabel}</p>
                  <h4 className="text-base font-semibold mb-1">AGE</h4>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveGroup("gender")}
                  className={`w-full px-4 py-3 cursor-pointer flex flex-col justify-between border-t ${
                    activeGroup === "gender"
                      ? "bg-[#1A1B1C] text-white hover:bg-black"
                      : "bg-[#F3F3F4] hover:bg-[#E1E1E2] text-black"
                  }`}
                >
                  <p className="text-base font-semibold">
                    {genderSummaryLabel.toUpperCase()}
                  </p>
                  <h4 className="text-base font-semibold mb-1">SEX</h4>
                </button>
              </div>

              <div className="md:hidden bg-white flex flex-col items-center justify-center py-8 mb-6">
                <div className="relative w-full max-w-[384px] aspect-square mb-4">
                  <div className="w-full h-full max-h-[384px] relative">
                    <svg
                      className="CircularProgressbar text-[#1A1B1C]"
                      viewBox="0 0 100 100"
                    >
                      <path
                        className="CircularProgressbar-trail"
                        d="
                          M 50,50
                          m 0,-49.15
                          a 49.15,49.15 0 1 1 0,98.3
                          a 49.15,49.15 0 1 1 0,-98.3
                        "
                        strokeWidth={1.7}
                        fill="none"
                      />
                      <path
                        className="CircularProgressbar-path"
                        d="
                          M 50,50
                          m 0,-49.15
                          a 49.15,49.15 0 1 1 0,98.3
                          a 49.15,49.15 0 1 1 0,-98.3
                        "
                        strokeWidth={1.7}
                        fill="none"
                        style={{
                          stroke: "#1A1B1C",
                          strokeLinecap: "butt",
                          strokeDasharray: `${circumference}px, ${circumference}px`,
                          strokeDashoffset: dashOffset,
                          transitionDuration: "0.8s",
                        }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-3xl font-normal relative text-black">
                        {selectedPercent}
                        <span className="absolute text-xl">%</span>
                      </p>
                    </div>
                  </div>
                </div>
                <p className="mt-2 text-[11px] font-normal leading-[24px] text-center text-black">
                  If A.I. estimate is wrong, select the correct one.
                </p>
              </div>

              <div className="space-y-0">
                <div className="flex justify-between px-4">
                  <h4 className="text-base leading-[24px] tracking-tight font-medium mb-2">
                    {tableHeaderLabel.toUpperCase()}
                  </h4>
                  <h4 className="text-base leading-[24px] tracking-tight font-medium mb-2">
                    A.I. CONFIDENCE
                  </h4>
                </div>

                {loading && (
                  <div className="px-4 py-3 text-sm text-neutral-500">
                    Loading...
                  </div>
                )}

                {error && !loading && (
                  <div className="px-4 py-3 text-sm text-red-500">
                    {error}
                  </div>
                )}

                {!loading &&
                  !error &&
                  rows.map((row) => {
                    const isActive = row.key === activeSelectedKey;
                    return (
                      <button
                        key={row.key}
                        type="button"
                        onClick={() => handleRowClick(activeGroup, row.key)}
                        className={`flex items-center justify-between h-[48px] px-4 cursor-pointer w-full ${
                          isActive
                            ? "bg-[#1A1B1C] text-white hover:bg-black"
                            : "hover:bg-[#E1E1E2] bg-transparent text.black"
                        }`}
                      >
                        <div className="flex items-center gap-1">
                          <div
                            className={`w-[12px] h-[12px] mr-2 border border-current rotate-45 ${
                              isActive ? "bg.white" : "bg-transparent"
                            }`}
                          />
                          <span className="font-normal text-base leading-6 tracking-tight">
                            {row.label}
                          </span>
                        </div>
                        <span className="font-normal text-base leading-6 tracking-tight">
                          {row.percent}%
                        </span>
                      </button>
                    );
                  })}
              </div>
            </div>
          </div>

          <div className="pt-8 md:pt-[37px] pb-10 bg-white">
            <div className="flex items-center justify-between max-w-full mx-auto">
              <button
                onClick={() => router.push("/result")}
                className="group flex flex-row relative justify-center items-center cursor-pointer"
              >
                <div className="flex sm:hidden w-12 h-12 items-center justify-center border border-[#1A1B1C] rotate-45 transition-transform duration-200 group-hover:scale-105">
                  <span className="-rotate-45 text-xs font-semibold">BACK</span>
                </div>

                <div className="hidden sm:flex flex-row relative justify-center items-center">
                  <div className="w-12 h-12 hidden sm:flex justify-center border border-[#1A1B1C] rotate-45 scale-[0.85] group-hover:scale-[0.92] ease duration-300" />
                  <span className="absolute left-[15px] bottom-[13px] scale-[0.9] rotate-180 hidden sm:block group-hover:scale-[0.92] ease duration-300">
                    ▶
                  </span>
                  <span className="text-sm font-semibold hidden sm.block ml-6">
                    BACK
                  </span>
                </div>
              </button>

              <p className="hidden md:block text-[11px] md:text-sm font-normal leading-[24px] text-center text-black">
                If A.I. estimate is wrong, select the correct one.
              </p>

              <button
                onClick={() => router.push("/")}
                className="group flex flex-row relative justify-center items-center cursor-pointer"
              >
                <div className="flex sm:hidden w-12 h-12 items-center justify.center border border-[#1A1B1C] rotate-45 transition-transform duration-200 group-hover:scale-105">
                  <span className="-rotate-45 text-xs font-semibold">
                    HOME
                  </span>
                </div>

                <div className="hidden sm:flex flex-row relative justify-center items.center">
                  <span className="text-sm font-semibold hidden sm:block mr-5">
                    HOME
                  </span>
                  <div className="w-12 h-12 hidden sm:flex justify.center border border-[#1A1B1C] rotate-45 scale-[0.85] group-hover:scale-[0.92] ease duration-300" />
                  <span className="absolute right-[15px] bottom-[13px] scale-[0.9] hidden sm:block group-hover:scale-[0.92] ease duration-300">
                    ▶
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
