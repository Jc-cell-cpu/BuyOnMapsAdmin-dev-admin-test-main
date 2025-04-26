'use client'

import { ApexOptions } from 'apexcharts'
import React from 'react'
import dynamic from 'next/dynamic'
import DefaultSelectOption from '@/components/SelectOption/DefaultSelectOption'

// Dynamically import ApexCharts with no SSR
const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
  loading: () => (
    <div className="flex h-[300px] w-full items-center justify-center">
      <div className="h-64 w-64 animate-pulse rounded-full bg-gray-100 dark:bg-gray-800"></div>
    </div>
  ),
})

const ChartThree: React.FC = () => {
  const series = [65, 34, 12, 56]

  const options: ApexOptions = {
    chart: {
      fontFamily: 'Satoshi, sans-serif',
      type: 'donut',
    },
    colors: ['#5750F1', '#5475E5', '#8099EC', '#ADBCF2'],
    labels: ['Desktop', 'Tablet', 'Mobile', 'Unknown'],
    legend: {
      show: false,
      position: 'bottom',
    },
    plotOptions: {
      pie: {
        donut: {
          size: '80%',
          background: 'transparent',
          labels: {
            show: true,
            total: {
              show: true,
              showAlways: true,
              label: 'Visitors',
              fontSize: '16px',
              fontWeight: '400',
              color: '#64748b',
            },
            value: {
              show: true,
              fontSize: '28px',
              fontWeight: 'bold',
              color: '#1e293b',
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    responsive: [
      {
        breakpoint: 2600,
        options: {
          chart: {
            width: 380,
          },
        },
      },
      {
        breakpoint: 1536,
        options: {
          chart: {
            width: 340,
          },
        },
      },
      {
        breakpoint: 1280,
        options: {
          chart: {
            width: 300,
          },
        },
      },
      {
        breakpoint: 768,
        options: {
          chart: {
            width: 280,
          },
        },
      },
      {
        breakpoint: 640,
        options: {
          chart: {
            width: 240,
          },
        },
      },
    ],
  }

  return (
    <div className="col-span-12 rounded-[10px] bg-white p-4 shadow-1 dark:bg-gray-dark dark:shadow-card sm:p-6 xl:col-span-5">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h4 className="text-xl font-bold text-dark dark:text-white sm:text-2xl">
            Used Devices
          </h4>
        </div>
        <div className="min-w-[120px]">
          <DefaultSelectOption options={['Monthly', 'Yearly']} />
        </div>
      </div>

      <div className="mb-8">
        <div className="flex justify-center">
          <ReactApexChart
            options={options}
            series={series}
            type="donut"
          />
        </div>
      </div>

      <div className="mx-auto w-full max-w-[350px]">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex items-center space-x-3">
            <span className="h-3 w-3 rounded-full bg-[#5750F1]"></span>
            <div className="flex w-full justify-between text-sm font-medium text-dark dark:text-dark-6">
              <span>Desktop</span>
              <span>65%</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <span className="h-3 w-3 rounded-full bg-[#5475E5]"></span>
            <div className="flex w-full justify-between text-sm font-medium text-dark dark:text-dark-6">
              <span>Tablet</span>
              <span>34%</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <span className="h-3 w-3 rounded-full bg-[#8099EC]"></span>
            <div className="flex w-full justify-between text-sm font-medium text-dark dark:text-dark-6">
              <span>Mobile</span>
              <span>12%</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <span className="h-3 w-3 rounded-full bg-[#ADBCF2]"></span>
            <div className="flex w-full justify-between text-sm font-medium text-dark dark:text-dark-6">
              <span>Unknown</span>
              <span>56%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChartThree

