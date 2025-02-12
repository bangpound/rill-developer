<script lang="ts">
  import {
    getAllowedTimeGrains,
    isGrainBigger,
  } from "@rilldata/web-common/lib/time/grains";
  import { createEventDispatcher } from "svelte";
  import { Button } from "../../../components/button";
  import type { DashboardTimeControls } from "../../../lib/time/types";
  import type { V1TimeGrain } from "../../../runtime-client";
  import Litepicker from "@rilldata/web-common/components/date-picker/Litepicker.svelte";
  import { parseLocaleStringDate } from "@rilldata/web-common/components/date-picker/util";

  export let minTimeGrain: V1TimeGrain;
  export let boundaryStart: Date;
  export let boundaryEnd: Date;
  export let defaultDate: DashboardTimeControls;

  const dispatch = createEventDispatcher();

  let start: string;
  let end: string;

  $: if (!start && !end && defaultDate) {
    start = getDateFromObject(defaultDate.start);
    end = getDateFromObject(defaultDate.end);
  }

  // functions for extracting the right kind of date string out of
  // a Date object. Used in the input elements.
  export function getDateFromObject(date: Date): string {
    return date.toLocaleDateString(window.navigator.language, {
      timeZone: "UTC",
    });
  }

  export function getDateFromISOString(isoDate: string): string {
    return isoDate.split("T")[0];
  }

  export function getISOStringFromDate(
    date: string,
    timeZone?: string
  ): string {
    return parseLocaleStringDate(date, timeZone).toISOString();
  }

  function validateTimeRange(
    start: Date,
    end: Date,
    minTimeGrain: V1TimeGrain
  ): string {
    const allowedTimeGrains = getAllowedTimeGrains(start, end);
    const allowedMaxGrain = allowedTimeGrains[allowedTimeGrains.length - 1];

    const isGrainPossible = !isGrainBigger(minTimeGrain, allowedMaxGrain.grain);

    if (start > end) {
      return "Start date must be before end date";
    } else if (!isGrainPossible) {
      return "Range is not valid for given min time grain";
    } else {
      return undefined;
    }
  }

  // HAM, you left off here.
  $: error = validateTimeRange(
    parseLocaleStringDate(start),
    parseLocaleStringDate(end),
    minTimeGrain
  );
  $: disabled = !start || !end || !!error;

  $: max = getDateFromISOString(boundaryEnd.toISOString());
  $: min = getDateFromISOString(boundaryStart.toISOString());

  function applyCustomTimeRange() {
    // Shift the selected dates to start in UTC instead of system timezone
    const startDate = getISOStringFromDate(start, "UTC");
    const endDate = getISOStringFromDate(end, "UTC");
    dispatch("apply", {
      startDate,
      endDate,
    });
  }

  let startEl, endEl, editingDate, isOpen;

  const handleDatePickerChange = (d) => {
    start = getDateFromObject(d.detail.start);
    end = getDateFromObject(d.detail.end);
  };

  const handleEditingChange = (d) => {
    editingDate = d.detail;
  };

  const handleToggle = (d) => {
    isOpen = d.detail;
  };

  let labelClasses = "font-semibold text-[10px]";
  $: getInputClasses = (v) =>
    `cursor-pointer w-full ${
      isOpen && v === editingDate ? "input-outline" : ""
    } `;

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter") {
      e.currentTarget.blur();
    }
  };
</script>

<form
  class="flex flex-col gap-y-3 mt-3 mb-1 px-3 relative"
  id="custom-time-range-form"
  on:submit|preventDefault={applyCustomTimeRange}
>
  <div class="flex flex-row gap-x-3">
    <div class="flex flex-col gap-y-1 relative">
      <label class={labelClasses} for="start-date">Start date</label>
      <input
        bind:this={startEl}
        class={getInputClasses(0)}
        id="start-date"
        {max}
        {min}
        name="start-date"
        on:blur={() => dispatch("close-calendar")}
        on:keydown={handleInputKeyDown}
        type="text"
      />
    </div>

    <div class="flex flex-col gap-y-1 relative">
      <label class={labelClasses} for="end-date">End date</label>
      <input
        bind:this={endEl}
        id="end-date"
        {min}
        {max}
        name="end-date"
        class={getInputClasses(1)}
        on:blur={() => dispatch("close-calendar")}
        on:keydown={handleInputKeyDown}
        type="text"
      />
    </div>
  </div>

  <div class="flex mt-3 items-center">
    {#if error}
      <div style:font-size="11px" class="text-red-600 mr-2">
        {error}
      </div>
    {/if}
    <div class="flex-grow" />
    <Button {disabled} form="custom-time-range-form" submitForm type="primary">
      Apply
    </Button>
  </div>
  {#if startEl && endEl}
    <Litepicker
      {startEl}
      {endEl}
      defaultStart={start}
      defaultEnd={end}
      openOnMount
      on:change={handleDatePickerChange}
      on:editing={handleEditingChange}
      on:toggle={handleToggle}
    />
  {/if}
</form>

<style>
  .input-outline {
    outline-offset: 2px;
    /* FF */
    outline: Highlight auto 1px;
    /* Chrome/Safari */
    outline: -webkit-focus-ring-color auto 1px;
  }
</style>
