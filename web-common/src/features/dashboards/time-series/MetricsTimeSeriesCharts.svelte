<script lang="ts">
  import SimpleDataGraphic from "@rilldata/web-common/components/data-graphic/elements/SimpleDataGraphic.svelte";
  import { Axis } from "@rilldata/web-common/components/data-graphic/guides";
  import CrossIcon from "@rilldata/web-common/components/icons/CrossIcon.svelte";
  import { useDashboardStore } from "@rilldata/web-common/features/dashboards/dashboard-stores";
  import {
    humanizeDataType,
    NicelyFormattedTypes,
    nicelyFormattedTypesToNumberKind,
  } from "@rilldata/web-common/features/dashboards/humanize-numbers";
  import {
    useMetaQuery,
    useModelAllTimeRange,
  } from "@rilldata/web-common/features/dashboards/selectors";
  import { EntityStatus } from "@rilldata/web-common/features/entity-management/types";
  import { TIME_GRAIN } from "@rilldata/web-common/lib/time/config";
  import {
    createQueryServiceMetricsViewTimeSeries,
    createQueryServiceMetricsViewTotals,
    V1MetricsViewTimeSeriesResponse,
  } from "@rilldata/web-common/runtime-client";
  import type { CreateQueryResult } from "@tanstack/svelte-query";
  import {
    getAdjustedChartTime,
    getAdjustedFetchTime,
    isRangeInsideOther,
  } from "../../../lib/time/ranges";
  import { runtime } from "../../../runtime-client/runtime-store";
  import Spinner from "../../entity-management/Spinner.svelte";
  import MeasureBigNumber from "../big-number/MeasureBigNumber.svelte";
  import MeasureChart from "./MeasureChart.svelte";
  import TimeSeriesChartContainer from "./TimeSeriesChartContainer.svelte";
  import { prepareTimeSeries } from "./utils";

  export let metricViewName;
  export let workspaceWidth: number;

  $: dashboardStore = useDashboardStore(metricViewName);

  $: instanceId = $runtime.instanceId;

  // query the `/meta` endpoint to get the measures and the default time grain
  $: metaQuery = useMetaQuery(instanceId, metricViewName);
  $: selectedMeasureNames = $dashboardStore?.selectedMeasureNames;
  $: showComparison = $dashboardStore?.showComparison;
  $: interval = $dashboardStore?.selectedTimeRange?.interval;

  $: allTimeRangeQuery = useModelAllTimeRange(
    $runtime.instanceId,
    $metaQuery.data.model,
    $metaQuery.data.timeDimension,
    {
      query: {
        enabled: !!$metaQuery.data.timeDimension,
      },
    }
  );

  // get the time range name, which is the preset.
  let name;
  let allTimeRange;
  $: if ($allTimeRangeQuery?.isSuccess) {
    allTimeRange = $allTimeRangeQuery.data;
    name = $dashboardStore.selectedTimeRange.name;
  }

  $: timeStart = $dashboardStore?.selectedTimeRange?.start?.toISOString();
  $: timeEnd = $dashboardStore?.selectedTimeRange?.end?.toISOString();
  $: totalsQuery = createQueryServiceMetricsViewTotals(
    instanceId,
    metricViewName,
    {
      measureNames: selectedMeasureNames,
      timeStart: timeStart,
      timeEnd: timeEnd,
      filter: $dashboardStore?.filters,
    },
    {
      query: {
        enabled: !!timeStart && !!timeEnd && !!$dashboardStore?.filters,
      },
    }
  );

  /** Generate the big number comparison query */
  $: isComparisonRangeAvailable = isRangeInsideOther(
    allTimeRange?.start,
    allTimeRange?.end,
    $dashboardStore?.selectedComparisonTimeRange?.start,
    $dashboardStore?.selectedComparisonTimeRange?.end
  );
  $: displayComparison = showComparison && isComparisonRangeAvailable;

  $: comparisonTimeStart =
    $dashboardStore?.selectedComparisonTimeRange?.start?.toISOString();
  $: comparisonTimeEnd =
    $dashboardStore?.selectedComparisonTimeRange?.end?.toISOString();
  $: totalsComparisonQuery = createQueryServiceMetricsViewTotals(
    instanceId,
    metricViewName,
    {
      measureNames: selectedMeasureNames,
      timeStart: comparisonTimeStart,
      timeEnd: comparisonTimeEnd,
      filter: $dashboardStore?.filters,
    },
    {
      query: {
        enabled: Boolean(
          displayComparison &&
            !!comparisonTimeStart &&
            !!comparisonTimeEnd &&
            !!$dashboardStore?.filters
        ),
      },
    }
  );

  // get the totalsComparisons.
  $: totalsComparisons = $totalsComparisonQuery?.data?.data;

  let timeSeriesQuery: CreateQueryResult<
    V1MetricsViewTimeSeriesResponse,
    Error
  >;

  let timeSeriesComparisonQuery: CreateQueryResult<
    V1MetricsViewTimeSeriesResponse,
    Error
  >;

  $: if (
    $dashboardStore &&
    metaQuery &&
    $metaQuery.isSuccess &&
    !$metaQuery.isRefetching &&
    $dashboardStore?.selectedTimeRange?.start
  ) {
    const { start: adjustedStart, end: adjustedEnd } = getAdjustedFetchTime(
      $dashboardStore.selectedTimeRange?.start,
      $dashboardStore.selectedTimeRange?.end,
      interval
    );

    timeSeriesQuery = createQueryServiceMetricsViewTimeSeries(
      instanceId,
      metricViewName,
      {
        measureNames: selectedMeasureNames,
        filter: $dashboardStore?.filters,
        timeStart: adjustedStart,
        timeEnd: adjustedEnd,
        timeGranularity: interval,
      }
    );
    if (displayComparison) {
      const { start: compAdjustedStart, end: compAdjustedEnd } =
        getAdjustedFetchTime(
          $dashboardStore.selectedComparisonTimeRange?.start,
          $dashboardStore.selectedComparisonTimeRange?.end,
          interval
        );

      timeSeriesComparisonQuery = createQueryServiceMetricsViewTimeSeries(
        instanceId,
        metricViewName,
        {
          measureNames: selectedMeasureNames,
          filter: $dashboardStore?.filters,
          timeStart: compAdjustedStart,
          timeEnd: compAdjustedEnd,
          timeGranularity: interval,
        }
      );
    }
  }

  // When changing the timeseries query and the cache is empty, $timeSeriesQuery.data?.data is
  // temporarily undefined as results are fetched.
  // To avoid unmounting TimeSeriesBody, which would cause us to lose our tween animations,
  // we make a copy of the data that avoids `undefined` transition states.
  // TODO: instead, try using svelte-query's `keepPreviousData = True` option.
  let dataCopy;
  let dataComparisonCopy;

  $: if ($timeSeriesQuery?.data?.data) dataCopy = $timeSeriesQuery.data.data;
  $: if ($timeSeriesComparisonQuery?.data?.data)
    dataComparisonCopy = $timeSeriesComparisonQuery.data.data;

  // formattedData adjusts the data to account for Javascript's handling of timezones
  let formattedData;
  $: if (dataCopy && dataCopy?.length) {
    formattedData = prepareTimeSeries(
      dataCopy,
      dataComparisonCopy,
      TIME_GRAIN[interval].duration
    );
  }

  let mouseoverValue = undefined;

  let startValue: Date;
  let endValue: Date;

  // FIXME: move this logic to a function + write tests.
  $: if (
    $dashboardStore?.selectedTimeRange &&
    $dashboardStore?.selectedTimeRange?.start
  ) {
    const adjustedChartValue = getAdjustedChartTime(
      $dashboardStore.selectedTimeRange?.start,
      $dashboardStore.selectedTimeRange?.end,
      interval,
      allTimeRange?.end
    );

    startValue = adjustedChartValue?.start;
    endValue = adjustedChartValue?.end;
  }

  // FIXME: this is pending the remaining state work for show/hide measures and dimensions
  // $: metricsExplorer = $metricsExplorerStore.entities[metricViewName];

  // $: availableMeasureLabels = selectBestMeasureStrings($metaQuery);
  // $: availableMeasureKeys = selectMeasureKeys($metaQuery);
  // $: visibleMeasureKeys = metricsExplorer?.visibleMeasureKeys;
  // $: visibleMeasuresBitmask = availableMeasureKeys.map((k) =>
  //   visibleMeasureKeys.has(k)
  // );

  // const toggleMeasureVisibility = (e) => {
  //   metricsExplorerStore.toggleMeasureVisibilityByKey(
  //     metricViewName,
  //     availableMeasureKeys[e.detail.index]
  //   );
  // };
  // const setAllMeasuresNotVisible = () => {
  //   metricsExplorerStore.hideAllMeasures(metricViewName);
  // };
  // const setAllMeasuresVisible = () => {
  //   metricsExplorerStore.setMultipleMeasuresVisible(
  //     metricViewName,
  //     availableMeasureKeys
  //   );
  // };
</script>

<TimeSeriesChartContainer {workspaceWidth} start={startValue} end={endValue}>
  <div class="bg-white sticky top-0" style="z-index:100">
    <!-- FIXME: this is pending the remaining state work for show/hide measures and dimensions -->
    <!-- <SeachableFilterButton
      selectableItems={availableMeasureLabels}
      selectedItems={visibleMeasuresBitmask}
      on:item-clicked={toggleMeasureVisibility}
      on:deselect-all={setAllMeasuresNotVisible}
      on:select-all={setAllMeasuresVisible}
      label="Measures"
      tooltipText="Choose measures to display"
    /> -->
  </div>
  <div class="bg-white sticky left-0 top-0">
    <div style:padding-left="24px" style:height="20px" />
    <!-- top axis element -->
    <div />
    {#if $dashboardStore?.selectedTimeRange}
      <SimpleDataGraphic
        height={32}
        top={34}
        bottom={0}
        xMin={startValue}
        xMax={endValue}
      >
        <Axis superlabel side="top" />
      </SimpleDataGraphic>
    {/if}
  </div>
  <!-- bignumbers and line charts -->
  {#if $metaQuery.data?.measures && $totalsQuery?.isSuccess}
    <!-- FIXME: this is pending the remaining state work for show/hide measures and dimensions -->
    <!-- {#each $metaQuery.data?.measures.filter((_, i) => visibleMeasuresBitmask[i]) as measure, index (measure.name)} -->
    {#each $metaQuery.data?.measures as measure, index (measure.name)}
      <!-- FIXME: I can't select the big number by the measure id. -->
      {@const bigNum = $totalsQuery?.data.data?.[measure.name]}
      {@const showComparison = displayComparison}
      {@const comparisonValue = totalsComparisons?.[measure.name]}
      {@const comparisonPercChange =
        comparisonValue && bigNum !== undefined && bigNum !== null
          ? (bigNum - comparisonValue) / comparisonValue
          : undefined}
      {@const formatPreset =
        NicelyFormattedTypes[measure?.format] || NicelyFormattedTypes.HUMANIZE}
      <!-- FIXME: I can't select a time series by measure id. -->
      <MeasureBigNumber
        value={bigNum}
        {showComparison}
        comparisonOption={$dashboardStore?.selectedComparisonTimeRange?.name}
        {comparisonValue}
        {comparisonPercChange}
        description={measure?.description ||
          measure?.label ||
          measure?.expression}
        formatPreset={measure?.format}
        status={$totalsQuery?.isFetching
          ? EntityStatus.Running
          : EntityStatus.Idle}
      >
        <svelte:fragment slot="name">
          {measure?.label || measure?.expression}
        </svelte:fragment>
      </MeasureBigNumber>
      <div class="time-series-body" style:height="125px">
        {#if $timeSeriesQuery?.isError}
          <div class="p-5"><CrossIcon /></div>
        {:else if formattedData}
          <MeasureChart
            bind:mouseoverValue
            data={formattedData}
            xAccessor="ts_position"
            labelAccessor="ts"
            timeGrain={interval}
            yAccessor={measure.name}
            xMin={startValue}
            xMax={endValue}
            {showComparison}
            mouseoverTimeFormat={(value) => {
              /** format the date according to the time grain */
              return new Date(value).toLocaleDateString(
                undefined,
                TIME_GRAIN[interval].formatDate
              );
            }}
            numberKind={nicelyFormattedTypesToNumberKind(measure?.format)}
            mouseoverFormat={(value) =>
              formatPreset === NicelyFormattedTypes.NONE
                ? `${value}`
                : humanizeDataType(value, measure?.format)}
          />
        {:else}
          <div>
            <Spinner status={EntityStatus.Running} />
          </div>
        {/if}
      </div>
    {/each}
  {/if}
</TimeSeriesChartContainer>
