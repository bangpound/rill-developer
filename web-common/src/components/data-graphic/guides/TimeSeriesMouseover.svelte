<script lang="ts">
  import { WithBisector } from "@rilldata/web-common/components/data-graphic/functional-components";
  import { LIST_SLIDE_DURATION } from "@rilldata/web-common/layout/config";
  import { fly } from "svelte/transition";
  import PointLabel from "./PointLabel.svelte";
  export let xAccessor: string;
  export let yAccessor: string;
  export let format: (d: number | Date) => string;
  export let data;
  export let mouseoverValue;

  let showRawValue = false;
  function handleKeydown(event: KeyboardEvent) {
    if (mouseoverValue) {
      if (event.metaKey && event.shiftKey) {
        showRawValue = true;
      } else {
        showRawValue = false;
      }
    }
  }
</script>

<svelte:window
  on:keydown={handleKeydown}
  on:keyup={() => {
    showRawValue = false;
  }}
/>

<WithBisector
  {data}
  value={mouseoverValue.x}
  callback={(d) => d[xAccessor]}
  let:point
>
  <PointLabel
    {point}
    {xAccessor}
    {yAccessor}
    showPoint
    showReferenceLine
    showDistanceLine
    showText={false}
    {format}
  />
  {#key showRawValue}
    <g transition:fly={{ duration: LIST_SLIDE_DURATION, x: -16 }}>
      <PointLabel
        {point}
        {xAccessor}
        {yAccessor}
        showPoint={false}
        showReferenceLine={false}
        showDistanceLine={false}
        format={showRawValue ? (v) => v.toString() : format}
      />
    </g>
  {/key}
</WithBisector>
