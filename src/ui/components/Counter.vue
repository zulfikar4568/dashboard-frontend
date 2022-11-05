<template>
  <div class="card">
    <div class="row">
      <div class="col-md-6">
        <label for="form-label">Resource Group</label>
        <select v-model="resource" @change="onChangeResource" class="form-select form-select-sm" aria-label=".form-select-sm example">
          <option value="%">%</option>
          <option v-for="resourceGroup in resourceGroupList" :key="resourceGroup.ResourceGroupId" :value="resourceGroup.ResourceGroupName">{{resourceGroup.ResourceGroupName}}</option>
        </select>
      </div>
      <div class="col-md-6">
        <label for="form-label">Production Order</label>
        <select v-model="mfgOrder" @change="onChangeMfgOrder" class="form-select form-select-sm" aria-label=".form-select-sm example">
          <option value="%">%</option>
          <option v-for="mfgOrder in mfgOrderList" :key="mfgOrder.MfgOrderId" :value="mfgOrder.MfgOrderName">{{mfgOrder.MfgOrderName}}</option>
        </select>
      </div>
    </div>
    <v-date-picker v-model="range" :value="range" is-range mode="dateTime" is24hrmode="dateTime" is24hr :model-config="modelConfig" >
      <template v-slot="{ inputValue, inputEvents }">
        <div class="row flex justify-content-center">
          <div class="col-md-5">
            <label for="form-label">From Date</label>
            <input
              :value="inputValue.start"
              v-on="inputEvents.start"
              type="text" 
              class="form-control input-date"
            />
            </div>
          <div class="col-md-1 svg-date">
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
          </div>
          <div class="col-md-5">
            <label for="form-label">To Date</label>
            <input
              :value="inputValue.end"
              v-on="inputEvents.end"
              type="text" 
              class="form-control input-date"
            />
          </div>
        </div>
      </template>
    </v-date-picker>
    <CounterLoader v-if="loader"/>
    <DoughnutChart :chartData="testData" :options="options" v-if="!loader && testData.datasets[0].data.length !== 0" />
    <Empty v-if="!loader && testData.datasets[0].data.length === 0"/>
    <h5>Resource Counter</h5>
  </div>
</template>

<script lang="ts">
import { dashboardController } from '../../applications/controllers';
import { ref, defineComponent, onBeforeMount, watch } from 'vue';
import { DoughnutChart } from "vue-chart-3";
import { Chart, ChartData, ChartOptions, registerables } from 'chart.js';
import CounterLoader from './CounterLoader.vue';
import Empty from './Empty.vue';
import { IMfgOrderList, IResourceGroupList } from '../../domain'

Chart.register(...registerables);
export default defineComponent({
  name: 'Counter',
  components: {
    DoughnutChart,
    CounterLoader,
    Empty
},
  setup() {
    const mfgOrderList = ref<IMfgOrderList[]>([]);
    const resourceGroupList = ref<IResourceGroupList[]>([]);

    let response = ref<any>();
    let data = ref<({name: string; value: number;})[]>();
    const loader = ref<boolean>(false);
    
    let resource = ref<string>('%');
    let mfgOrder = ref<string>('%');

    const range = ref<{ start: Date | string, end: Date | string }>({
      start: '2022-02-01 00:00:00',
      end: new Date().toISOString()
    });

    const onChangeMfgOrder = async () => {
      await filter();
    }

    const onChangeResource = async () => {
      await filter();
    }

    onBeforeMount(async () => {
      await dashboardController().getMfgOrder().then((res) => {
        mfgOrderList.value = res.data.data as IMfgOrderList[];
      });
      await dashboardController().getResourceGroup().then((res) => {
        resourceGroupList.value = res.data.data as IResourceGroupList[];
      });
    })

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
            delay = context.dataIndex * 200 + context.datasetIndex * 100;
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
    }, 600000);

    const filter = async () => {
      loader.value = true;
      response.value = await dashboardController().getCounter({
        resourceGroup: resource.value,
        mfgOrder: mfgOrder.value,
        fromDate: typeof range.value.start == 'string' ? range.value.start : '%',
        toDate: typeof range.value.end == 'string' ? range.value.end : '%',
      }).then((res) => {
        testData.value.datasets[0].data = [];
        testData.value.labels = [];
        data.value = res.data.data;

        data.value?.map((val) => {
          testData.value.datasets[0].data.push(val.value)
          testData.value.labels?.push(`${val.name} (${val.value})`)
        });
        loader.value=false;
      });
    }

    watch(() => range.value, async () => {
      await filter();
    })

    return {
      mfgOrderList,
      resourceGroupList,
      loader,
      modelConfig: {
        type: 'string',
        mask: 'YYYY-MM-DD HH:mm:ss',
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