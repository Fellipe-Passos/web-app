import { ApexOptions } from "apexcharts";
import { useState } from "react";
import ReactApexChart from "react-apexcharts";

interface ApexChartProps {
  data: Array<{ professional: string; orders: number[] }>;
  title: string;
}

function ApexChart({ data, title }: ApexChartProps) {
  const values = data?.map((info) => {
    return info?.orders;
  });

  const labels = data?.map((info) => {
    return info?.professional;
  });

  const [chartState] = useState({
    series: [
      {
        name: "Entregas",
        data: values,
      },
    ],
    options: {
      chart: {
        height: 350,
        type: "bar",
      },
      plotOptions: {
        bar: {
          borderRadius: 10,
          dataLabels: {
            position: "top", // top, center, bottom
          },
        },
      },
      dataLabels: {
        enabled: true,
        formatter: (val: any) => val,
        offsetY: 10,
        style: {
          fontSize: "18px",
          fontWeight: 800,
          fontFamily: "Rubik",
          colors: ["#fff"],
        },
      },
      xaxis: {
        categories: labels,
        position: "bottom",
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        crosshairs: {
          fill: {
            type: "gradient",
            gradient: {
              colorFrom: "#D8E3F0",
              colorTo: "#BED1E6",
              stops: [0, 100],
              opacityFrom: 0.4,
              opacityTo: 0.5,
            },
          },
        },
        tooltip: {
          enabled: true,
        },
      },
      yaxis: {
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        labels: {
          show: false,
          formatter: (val: any) => val,
        },
      },
      title: {
        text: title,
        floating: false,
        offsetY: 0,
        align: "center",
        style: {
          color: "black",
          fontFamily: "Rubik",
          fontSize: "16px",
        },
      },
    },
  });

  return (
    <div>
      <div id="chart">
        <ReactApexChart
          options={chartState.options as ApexOptions}
          series={chartState.series}
          type="bar"
          height={310}
        />
      </div>
      <div id="html-dist"></div>
    </div>
  );
}

export default ApexChart;
