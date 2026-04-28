
<script setup>
import { ref} from 'vue'

// PrimeVue
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import Card from 'primevue/card'
import DatePicker from 'primevue/datepicker';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import RadioButton from 'primevue/radiobutton';


const isVisible = ref(false);
const codes = ref([]); 
const count = ref('');
const location = ref('');
const amount = ref(0);
const date = ref();
const filter_location = ref('');
const isRented = ref(false);

const onChange = () => { 
  if(isRented.value === 'rented') {
    count.value = 1;
  } 
  else{
    count.value = '';
  }
}

function generateCode() {
  if (!count.value || Number(count.value) <= 0) return;

  const total = Number(count.value);

  for (let i = 0; i < total; i++) {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();

    codes.value.unshift({
      code,
      status: isRented.value ? 'rented' : 'unused',
      created_at: new Date().toLocaleString(),
      used_at: null,
      amount: amount.value,
      located_at: location.value
    });
  }

  count.value = '';
  location.value = '';
  amount.value = 0;
  isRented.value = false;
  isVisible.value = false;
}
</script>

<template>
  <div class="min-h-screen bg-gray-100 p-6">

    <!-- Header -->
    <div class="flex ">
      <div class="w-full">
        <Card class="!rounded-none !text-black">
            <template #title>Admin Dashboard</template>
            <template #content>
              <div class="flex justify-start gap-x-2">
                <div>
                  <p>Filter by date:</p>
                  <DatePicker v-model="date" placeholder="Filter by Date"/> 
                </div>
                <div>
                  <p>Filter by location:</p>
                  <InputText
                    v-model="filter_location"
                    class="" 
                    placeholder="Filter by Store/Location"
                  />
                </div>
              </div>
            </template>
        </Card>

      </div>
    </div> 
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">

      <Card class="w-full h-full !rounded-none text-black">
        <template #title>Total Used</template>
        <template #content>
          <div class="flex justify-between">
            <p>0</p>
          </div>
        </template>
      </Card>

      <Card class="w-full h-full !rounded-none text-black">
        <template #title>Total Income</template>
        <template #content>
          <div class="flex justify-between">
            <p>(used * 30)</p>
          </div>
        </template>
      </Card>

      <Card class="w-full h-full !rounded-none text-black">
        <template #title>Interest</template>
        <template #content>
          <div class="flex justify-between">
            <p>(used * 30) * 10%</p>
          </div>
        </template>
      </Card>

    </div>
    <!-- Table -->
    <div class=" !rounded-none  mt-4"> 
        <div class="text-right mb-4"> 
            <Button label="Generate New Code +" @click="isVisible = true" />
        </div>
        <Card  
          v-if="codes.length > 0" class="!rounded-none !text-black">
            <template #title> </template>
            <template #content> 
              <DataTable
                :value="codes"
                paginator
                :rows="10"
                stripedRows
                responsiveLayout="scroll"
                class="!bg-white"
              > 
                <Column field="code" header="Code"></Column> 
                <Column header="Status">
                  <template #body="slotProps">
                    <Tag
                    class="uppercase"
                      :value="slotProps.data.status"
                      :severity="slotProps.data.status === 'used' ? 'danger' : 'success'"
                    />
                  </template>
                </Column> 
                <Column field="amount" header="Amount"></Column> 
                <Column field="located_at" header="Location"></Column> 
                <Column field="created_at" header="Created"></Column> 
                <Column header="Used At">
                  <template #body="slotProps">
                    {{ slotProps.data.used_at || '-' }}
                  </template>
                </Column> 
              </DataTable>
            </template>
        </Card>
        <Card v-else class="!rounded-none !text-black">
            <template #title> </template>
            <template #content> 
              <div class="flex items-center  justify-center h-[200px]">
                <p>No Data Show.</p>
              </div>
            </template>
        </Card>
    </div>
  </div>
<Dialog v-model:visible="isVisible" modal header="Generate Code(s)" :style="{ width: '50vw' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
  <div class="mb-2">
        <label class="text-sm text-gray-600">Is Rented</label> 
        <div class="flex flex-wrap gap-3">
         <div class="flex align-items-center">
            <RadioButton v-model="isRented" @change="onChange" inputId="input-yes" name="rented" value="rented" />
            <label for="input-yes" class="ml-2">Yes</label>
          </div>

          <div class="flex align-items-center">
            <RadioButton v-model="isRented" @change="onChange" inputId="input-no" name="rented" value="unused" />
            <label for="input-no" class="ml-2">No</label>
          </div>
        </div>
  </div>
  <div class="mb-2" v-if="isRented !== 'rented'">
        <label class="text-sm text-gray-600">Generate Code Count</label>
        <InputText
          v-model="count"
          class="w-full mt-1 !bg-gray-100 border-gray-300 !text-black placeholder-gray-400" 
          placeholder="Enter Generate Code Count"
        />
  </div>
  <div class="mb-2">
        <label class="text-sm text-gray-600">Store/Located</label>
        <InputText
          v-model="location"
          class="w-full mt-1 !bg-gray-100 border-gray-300 !text-black placeholder-gray-400" 
          placeholder="Enter Store/Location"
        />
  </div>
  <div class="mb-2">
        <label class="text-sm text-gray-600">Amount</label>
        <InputText
          v-model="amount"
          class="w-full mt-1 !bg-gray-100 border-gray-300 !text-black placeholder-gray-400" 
          placeholder="Enter Amount"
        />
  </div>
  <div class="flex justify-end mt-2">
      <Button
        label="Generate Code"
        icon="pi pi-plus"
        @click="generateCode"
      />
  </div>
</Dialog>

</template>
