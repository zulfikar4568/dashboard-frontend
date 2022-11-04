<template>
  <div class="card">
    <h4>Resource Counter</h4>
    <!-- <div class="row">
      <div class="col-md-6">
        <select class="form-select form-select-sm" aria-label=".form-select-sm example">
          <option selected>Resource Group</option>
          <option value="BW01-NM4">BW01-NM4</option>
          <option value="BW01-NM3">BW01-NM3</option>
          <option value="BW01-NM2">BW01-NM2</option>
          <option value="BW01-NM1">BW01-NM1</option>
        </select>
      </div>
      <div class="col-md-6">
        <select class="form-select form-select-sm" aria-label=".form-select-sm example">
          <option selected>Mfg Order</option>
          <option value="10036077">10036077</option>
        </select>
      </div>
    </div> -->
    <DoughnutChart :chartData="testData" :options="options" />
  </div>
</template>

<script lang="ts">
import { dashboardController } from '../../applications/controllers/';
import { onBeforeMount, ref, defineComponent } from 'vue';
import { DoughnutChart } from "vue-chart-3";
import { Chart, ChartData, ChartOptions, registerables } from 'chart.js';

Chart.register(...registerables);
// Chart.defaults.color = "#fff";
export default defineComponent({
  name: 'Counter',
  components: {
    DoughnutChart
  },
  setup() {
    let response = ref<any>();
    let data = ref<({name: string; value: number;})[]>();

    let delayed: boolean;
    const options = ref<ChartOptions<'doughnut'>>({
      responsive: true,
      animation: {
        onComplete: () => {
          delayed = true;
        },
        delay: (context) => {
          let delay = 0;
          if (context.type === 'data' && context.mode === 'default' && !delayed) {
            delay = context.dataIndex * 600 + context.datasetIndex * 100;
          }
          return delay;
        },
      },
      plugins: {
        legend: {
          position: 'left',
        },
      },
    });
    
    const testData = ref<ChartData<'doughnut'>>({
      labels: [],
      datasets: [
        {
          data: [],
          backgroundColor: ['#DD3FFA', '#9737DE', '#7E4AF5', '#3C37DE', '#3F6BFA', '#52CCFF', '#47DDDE', '#5BF5C8', '#47DE82', '#61FA6E'],
        },
      ],
    });

    setInterval(async () => {
      response.value = await dashboardController().getCounter({
        resourceGroup: "BW01-NM4",
        mfgOrder: "10036077",
        fromDate: "2022-08-25 08:00:00.000",
        toDate: "2022-08-27 08:00:00.000"
      }).then((res) => {
        testData.value.datasets[0].data = [];
        testData.value.labels = [];
        data.value = res.data.data;

        data.value?.map((val) => {
          testData.value.datasets[0].data.push(val.value)
          testData.value.labels?.push(`${val.name} (${val.value})`)
        })
      });
    }, 30000);

    onBeforeMount(async () => {
      response.value = await dashboardController().getCounter({
        resourceGroup: "BW01-NM4",
        mfgOrder: "10036077",
        fromDate: "2022-08-25 08:00:00.000",
        toDate: "2022-08-27 08:00:00.000"
      }).then((res) => {
        data.value = res.data.data;

        data.value?.map((val) => {
          testData.value.datasets[0].data.push(val.value)
          testData.value.labels?.push(`${val.name} (${val.value})`)
        })
      });
    });

    return {
      response,
      testData,
      options
    }
  }
})
</script>