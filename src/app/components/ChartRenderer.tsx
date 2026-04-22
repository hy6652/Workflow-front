"use client";
import { useEffect, useRef } from "react";
import {
  Chart,
  LineController,
  BarController,
  PieController,
  DoughnutController,
  RadarController,
  PolarAreaController,
  BubbleController,
  ScatterController,
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  TimeScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Legend,
  Tooltip,
  Title,
  Filler,
  ChartConfiguration,
} from "chart.js";
import type { ChartConfig } from "../interfaces/workflowOutput";

Chart.register(
  LineController,
  BarController,
  PieController,
  DoughnutController,
  RadarController,
  PolarAreaController,
  BubbleController,
  ScatterController,
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  TimeScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Legend,
  Tooltip,
  Title,
  Filler,
);

const PALETTE = [
  "#4e9af1",
  "#f1c40f",
  "#2ecc71",
  "#e74c3c",
  "#9b59b6",
  "#1abc9c",
  "#e67e22",
  "#3498db",
];

function applyDefaultColors(datasets: ChartConfig["data"]["datasets"]) {
  return datasets.map((ds, i) => {
    const color = PALETTE[i % PALETTE.length];
    return {
      borderColor: color,
      backgroundColor: color + "33",
      borderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6,
      tension: 0.3,
      ...ds,
    };
  });
}

interface Props {
  chartConfig: ChartConfig;
}

export default function ChartRenderer({ chartConfig }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const instanceRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    instanceRef.current?.destroy();

    const plugins = (chartConfig.options?.plugins ?? {}) as Record<string, unknown>;

    const config: ChartConfiguration = {
      type: chartConfig.type as ChartConfiguration["type"],
      data: {
        ...chartConfig.data,
        datasets: applyDefaultColors(chartConfig.data.datasets),
      } as ChartConfiguration["data"],
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: "#ccc" } },
          title: {
            color: "#ccc",
            ...((plugins.title as Record<string, unknown>) ?? {}),
          },
          ...plugins,
        },
        scales: {
          x: { ticks: { color: "#aaa" }, grid: { color: "#2a2a2a" } },
          y: { ticks: { color: "#aaa" }, grid: { color: "#2a2a2a" } },
        },
      },
    };

    instanceRef.current = new Chart(canvasRef.current, config);

    return () => {
      instanceRef.current?.destroy();
      instanceRef.current = null;
    };
  }, [chartConfig]);

  return (
    <div
      style={{
        width: "320px",
        height: "260px",
        backgroundColor: "#1e1e1e",
        border: "1px solid #333",
        borderRadius: "8px",
        padding: "12px",
      }}
    >
      <canvas ref={canvasRef} />
    </div>
  );
}
