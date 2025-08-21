
<script setup>
  import OverviewTab from "./Components/OverviewTab.vue";
  import {useRoute} from "vue-router";
  import {ref} from "vue";
  import ProgressTab from "./Components/ProgressTab.vue";
  import ExpenseTab from "./Components/ExpenseTab.vue";
  import ReturnsTab from "./Components/ReturnsTab.vue";
  const route = useRoute()
  const seasonId = ref(route.params.id)
</script>

<template>
  <router-link class="text-decoration-none mb-4" to="/admin/farm-projects"><i class="bi bi-chevron-left" > Back</i></router-link>
  <br>
  <br>
  <!-- buttons -->
  <ul class="nav nav-tabs" id="myTab" role="tablist">
    <li class="nav-item" role="presentation">
      <button class="nav-link active" id="overview-tab" data-bs-toggle="tab" data-bs-target="#overview-tab-pane" type="button" role="tab" aria-controls="overview-tab-pane" aria-selected="true">Overview</button>
    </li>
    <li class="nav-item" role="presentation">
      <button class="nav-link" id="Progresses-tab" data-bs-toggle="tab" data-bs-target="#Progresses-tab-pane" type="button" role="tab" aria-controls="Progresses-tab-pane" aria-selected="false">Progresses</button>
    </li>
    <li class="nav-item" role="presentation">
      <button class="nav-link" id="expense-tab" data-bs-toggle="tab" data-bs-target="#expense-tab-pane" type="button" role="tab" aria-controls="expense-tab-pane" aria-selected="false">Expenses</button>
    </li>
    <li class="nav-item" role="presentation">
      <button class="nav-link" id="expense-tab" data-bs-toggle="tab" data-bs-target="#returns-tab-pane" type="button" role="tab" aria-controls="expense-tab-pane" aria-selected="false">Returns</button>
    </li>
  </ul>

  <!-- triggered contents -->
  <div class="tab-content" id="myTabContent">
    <div class="tab-pane fade show active p-3" id="overview-tab-pane" role="tabpanel" aria-labelledby="overview-tab" tabindex="0">
     <OverviewTab :season_id="seasonId" />
    </div>

<!--    Progress Tab-->
    <div class="tab-pane fade p-3" id="Progresses-tab-pane" role="tabpanel" aria-labelledby="Progresses-tab" tabindex="0">
      <ProgressTab :season-id="seasonId" />
    </div>

<!--    Expense Tab-->
    <div class="tab-pane fade p-3" id="expense-tab-pane" role="tabpanel" aria-labelledby="expense-tab" tabindex="0">
      <ExpenseTab :season-id="seasonId" />
    </div>

<!--    Returns tab-->
    <div class="tab-pane fade p-3" id="returns-tab-pane" role="tabpanel" aria-labelledby="returns-tab" tabindex="0">
      <ReturnsTab :season-id="seasonId" />
    </div>
  </div>


</template>
