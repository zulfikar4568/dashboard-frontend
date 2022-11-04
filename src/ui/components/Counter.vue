<template>
  <div class="card">
    <h4>Resource Counter</h4>
    <div class="row">
      <div class="col-md-6">
        <select v-model="resource" @change="onChangeResource" class="form-select form-select-sm" aria-label=".form-select-sm example">
          <option value="%">%</option>
          <option value="BW01-NM4">BW01-NM4</option>
          <option value="BW01-NM3">BW01-NM3</option>
          <option value="BW01-NM2">BW01-NM2</option>
          <option value="BW01-NM1">BW01-NM1</option>
        </select>
      </div>
      <div class="col-md-6">
        <select v-model="mfgOrder" @change="onChangeMfgOrder" class="form-select form-select-sm" aria-label=".form-select-sm example">
          <option value="%">%</option>
          <option value="10036077">10036077</option>
        </select>
      </div>
      <div class="col-md-12">
        <v-date-picker v-model="range" is-range mode="dateTime" is24hrmode="dateTime" is24hr :model-config="modelConfig" >
          <template v-slot="{ inputValue, inputEvents }">
            <div class="flex justify-center items-center">
              <input
                :value="inputValue.start"
                v-on="inputEvents.start"
                class="border px-2 py-1 w-32 rounded focus:outline-none focus:border-indigo-300"
              />
              <svg
                class="w-4 h-4 mx-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
              <input
                :value="inputValue.end"
                v-on="inputEvents.end"
                class="border px-2 py-1 w-32 rounded focus:outline-none focus:border-indigo-300"
              />
            </div>
          </template>
        </v-date-picker>
      </div>
    </div>
    <DoughnutChart :chartData="testData" :options="options" />
  </div>
</template>

<script lang="ts">
import { dashboardController } from '../../applications/controllers';
import { ref, defineComponent } from 'vue';
import { DoughnutChart } from "vue-chart-3";
import { Chart, ChartData, ChartOptions, registerables } from 'chart.js';

Chart.register(...registerables);
export default defineComponent({
  name: 'Counter',
  components: {
    DoughnutChart
  },
  setup() {
    let response = ref<any>();
    let data = ref<({name: string; value: number;})[]>();
    
    let resource = ref<string>('%');
    let mfgOrder = ref<string>('%');

    const range = ref({
      start: new Date(2022, 1, 5),
      end: new Date()
    });

    const onChangeMfgOrder = async () => {
      await filter();
    }

    const onChangeResource = async () => {
      await filter();
    }

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
      await filter();
    }, 60000);

    const filter = async () => {
      response.value = await dashboardController().getCounter({
        resourceGroup: resource.value,
        mfgOrder: mfgOrder.value,
        fromDate: range.value.start.toISOString(),
        toDate: range.value.end.toISOString()
      }).then((res) => {
        testData.value.datasets[0].data = [];
        testData.value.labels = [];
        data.value = res.data.data;

        data.value?.map((val) => {
          testData.value.datasets[0].data.push(val.value)
          testData.value.labels?.push(`${val.name} (${val.value})`)
        })
      });
    }

    return {
      modelConfig: {
        type: 'string',
        mask: 'YYYY-MM-DD HH:mm:ss', // Uses 'iso' if missing
      },
      mfgOrder,
      onChangeMfgOrder,
      onChangeResource,
      resource,
      range,
      response,
      testData,
      options
    }
  }
})
</script>