<script lang="ts">
  import Tooltip from "@rilldata/web-common/components/tooltip/Tooltip.svelte";
  import TooltipContent from "@rilldata/web-common/components/tooltip/TooltipContent.svelte";
  import { fly } from "svelte/transition";
  import LeaderboardListItem from "./LeaderboardListItem.svelte";

  /** grays out the value if this is true */
  export let loading = false;

  export let active;
  /** the measure value to be displayed on the right side */
  export let measureValue;

  /** show the context number next to the actual value */
  export let showContext = false;
  /** we'll use special styling when at least one value elsewhere is active */
  export let atLeastOneActive = false;
  /** if this value is a summable measure, we'll show the bar. Otherwise, don't. */
  export let isSummableMeasure;
  /** for summable measures, this is the value we use to calculate the bar % to fill */
  export let referenceValue;

  export let excluded = false;

  /** if this is a summable measure and there's a reference value, show measureValue / referenceValue.
   * This value is between 0-1 (in theroy!). If it is > 1, the BarAndLabel component shows teeth expressing
   * the value is > 100% of the reference.
   */
  let renderedBarValue = 0;
  $: {
    renderedBarValue = isSummableMeasure
      ? referenceValue
        ? measureValue / referenceValue
        : 0
      : 0;
    // if this somehow creates an NaN, let's set it to 0.
    renderedBarValue = !isNaN(renderedBarValue) ? renderedBarValue : 0;
  }
  $: barColor = excluded
    ? "ui-measure-bar-excluded"
    : active
    ? "ui-measure-bar-included-selected"
    : "ui-measure-bar-included";
</script>

<Tooltip location="right">
  <LeaderboardListItem
    value={renderedBarValue}
    {showContext}
    isActive={active}
    {excluded}
    on:click
    color={barColor}
  >
    <!--
      title element
      -------------
      We will fix the maximum width of the title element
      to be the container width - pads - the largest value of the right hand.
      This is somewhat inelegant, but it's a lot more elegant than rewriting the
      BarAndNumber component to do things that are harder to maintain.
      The current approach does a decent enough job of maintaining the flow and scan-friendliness.
     -->
    <!-- 
      This is a very, very unfortunate hack used to deal with a render bug. 
      By consuming the let:isActive slot prop, we can reactive get this slot to update.
    -->
    <div slot="title" let:isActive>
      <div
        class:ui-copy={!atLeastOneActive && !loading}
        class:ui-copy-strong={!excluded && isActive}
        class:ui-copy-disabled={excluded}
        class="w-full text-ellipsis overflow-hidden whitespace-nowrap"
      >
        <slot name="label" />
      </div>
    </div>
    <!-- right-hand metric value -->
    <div slot="right" let:isActive>
      <!-- {#if !(atLeastOneActive && !active)} -->
      <div
        class:ui-copy-disabled={excluded}
        class:ui-copy-strong={!excluded && isActive}
        in:fly={{ duration: 200, y: 4 }}
      >
        <slot name="right" />
      </div>
      <!-- {/if} -->
    </div>
    <div slot="context" let:isActive>
      <div
        class:ui-copy-disabled={excluded}
        class:ui-copy-strong={!excluded && isActive}
      >
        <slot name="context" />
      </div>
    </div>
  </LeaderboardListItem>
  <TooltipContent slot="tooltip-content">
    <div style:max-width="300px">
      <slot name="tooltip" />
    </div>
  </TooltipContent>
</Tooltip>
