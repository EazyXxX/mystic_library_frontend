import React from "react";
import ReactECharts from "echarts-for-react";
import styled from "styled-components";
import { Book } from "../../../types/book";

interface BookStatisticsProps {
  books: Book[];
}

const BookStatistics: React.FC<BookStatisticsProps> = ({ books }) => {
  const genreData = books.reduce((acc, book) => {
    acc[book.genre] = (acc[book.genre] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const languageData = books.reduce((acc, book) => {
    acc[book.language] = (acc[book.language] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const genreChartOption = {
    title: {
      text: "Books by Genre",
      left: "center",
    },
    tooltip: {
      trigger: "item",
      formatter: "{b}: {c} ({d}%)",
    },
    legend: {
      orient: "vertical",
      left: "left",
      top: "8%",
    },
    series: [
      {
        type: "pie",
        radius: "70%",
        data: Object.entries(genreData).map(([name, value]) => ({
          name,
          value,
        })),
        labelLine: { show: false },
        label: { show: false },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
  };

  const statusData = {
    available: books.filter((book) => book.status === "available").length,
    borrowed: books.filter((book) => book.status === "borrowed").length,
  };

  const statusChartOption = {
    title: {
      text: "Book Status Distribution",
      left: "center",
    },
    tooltip: {
      trigger: "item",
      formatter: "{b}: {c} ({d}%)",
    },
    legend: {
      orient: "vertical",
      left: "left",
      top: "8%",
    },
    series: [
      {
        type: "pie",
        radius: "70%",
        data: [
          {
            name: "Available",
            value: statusData.available,
            itemStyle: { color: "#52c41a" },
          },
          {
            name: "Borrowed",
            value: statusData.borrowed,
            itemStyle: { color: "#f5222d" },
          },
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
        labelLine: { show: false },
        label: { show: false },
      },
    ],
  };

  const yearDistribution = books.reduce((acc, book) => {
    const decade = Math.floor(book.year / 10) * 10;
    acc[decade] = (acc[decade] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  const yearChartOption = {
    title: {
      text: "Books by Decade",
      left: "center",
    },
    tooltip: {
      trigger: "axis",
    },
    xAxis: {
      type: "category",
      data: Object.keys(yearDistribution).sort(),
      name: "Decade",
    },
    yAxis: {
      type: "value",
      name: "Number of Books",
    },
    series: [
      {
        data: Object.entries(yearDistribution)
          .sort(([a], [b]) => Number(a) - Number(b))
          .map(([, i]) => i),
        type: "bar",
        showBackground: true,
        backgroundStyle: {
          color: "rgba(180, 180, 180, 0.2)",
        },
      },
    ],
  };

  const languageChartOption = {
    title: {
      text: "Books by Language",
      left: "center",
    },
    tooltip: {
      trigger: "item",
      formatter: "{b}: {c} ({d}%)",
    },
    legend: {
      orient: "vertical",
      left: "left",
      top: "8%",
    },
    series: [
      {
        type: "pie",
        radius: "70%",
        data: Object.entries(languageData).map(([name, value]) => ({
          name,
          value,
        })),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
        labelLine: { show: false },
        label: { show: false },
      },
    ],
  };

  return (
    <StatisticsContainer>
      <ChartCard>
        <ReactECharts option={genreChartOption} style={{ height: "400px" }} />
      </ChartCard>
      <ChartCard>
        <ReactECharts option={statusChartOption} style={{ height: "400px" }} />
      </ChartCard>
      <ChartCard>
        <ReactECharts option={yearChartOption} style={{ height: "400px" }} />
      </ChartCard>
      <ChartCard>
        <ReactECharts
          option={languageChartOption}
          style={{ height: "400px" }}
        />
      </ChartCard>
    </StatisticsContainer>
  );
};

export default BookStatistics;

const StatisticsContainer = styled.div`
  margin-bottom: 24px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
`;

const ChartCard = styled.div`
  background: ${(props) => props.theme.colorBgLayout};
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;
