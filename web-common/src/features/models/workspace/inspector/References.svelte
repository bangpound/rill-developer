<script lang="ts">
  import Shortcut from "@rilldata/web-common/components/tooltip/Shortcut.svelte";
  import TooltipShortcutContainer from "@rilldata/web-common/components/tooltip/TooltipShortcutContainer.svelte";
  import { getFilePathFromNameAndType } from "@rilldata/web-common/features/entity-management/entity-mappers";
  import { EntityType } from "@rilldata/web-common/features/entity-management/types";
  import CollapsibleSectionTitle from "@rilldata/web-common/layout/CollapsibleSectionTitle.svelte";
  import { LIST_SLIDE_DURATION } from "@rilldata/web-common/layout/config";
  import { formatCompactInteger } from "@rilldata/web-common/lib/formatters";
  import {
    createQueryServiceTableCardinality,
    createRuntimeServiceGetFile,
    createRuntimeServiceListCatalogEntries,
  } from "@rilldata/web-common/runtime-client";
  import * as classes from "@rilldata/web-local/lib/util/component-classes";
  import { getContext } from "svelte";
  import { derived, writable } from "svelte/store";
  import { slide } from "svelte/transition";
  import { runtime } from "../../../../runtime-client/runtime-store";
  import { getTableReferences } from "../../utils/get-table-references";
  import EmbeddedSourceReference from "./EmbeddedSourceReference.svelte";
  import { getMatchingReferencesAndEntries } from "./utils";
  import WithModelResultTooltip from "./WithModelResultTooltip.svelte";

  export let modelName: string;

  let showSourceTables = true;
  let modelHasError = false;

  const queryHighlight = getContext("rill:app:query-highlight");

  $: getModelFile = createRuntimeServiceGetFile(
    $runtime?.instanceId,
    getFilePathFromNameAndType(modelName, EntityType.Model)
  );
  $: references = getTableReferences($getModelFile?.data.blob ?? "");

  $: getAllSources = createRuntimeServiceListCatalogEntries(
    $runtime?.instanceId,
    {
      type: "OBJECT_TYPE_SOURCE",
    }
  );

  $: getAllModels = createRuntimeServiceListCatalogEntries(
    $runtime?.instanceId,
    {
      type: "OBJECT_TYPE_MODEL",
    }
  );

  // for each reference, match to an existing model or source,
  $: referencedThings = getMatchingReferencesAndEntries(modelName, references, [
    ...($getAllSources?.data?.entries || []),
    ...($getAllModels?.data?.entries || []),
  ]);

  // associate with the cardinality
  $: referencedWithMetadata = derived(
    referencedThings.map(([$thing, ref]) => {
      return derived(
        [
          writable($thing),
          writable(ref),
          createQueryServiceTableCardinality($runtime?.instanceId, $thing.name),
        ],
        ([$thing, ref, $cardinality]) => ({
          entry: $thing,
          reference: ref,
          totalRows: +$cardinality?.data?.cardinality,
        })
      );
    }),
    ($referencedThings) => $referencedThings
  );

  function focus(reference) {
    return () => {
      if (reference) {
        queryHighlight.set([reference]);
      }
    };
  }
  function blur() {
    queryHighlight.set(undefined);
  }
</script>

{#if $referencedWithMetadata?.length}
  <div class="pt-4 pb-4">
    <div class=" pl-4 pr-4">
      <CollapsibleSectionTitle
        tooltipText="References"
        bind:active={showSourceTables}
      >
        Referenced in this model
      </CollapsibleSectionTitle>
    </div>

    {#if showSourceTables}
      <div
        transition:slide|local={{ duration: LIST_SLIDE_DURATION }}
        class="mt-2"
      >
        {#each $referencedWithMetadata as reference}
          {#if reference?.entry?.embedded}
            <EmbeddedSourceReference
              entry={reference.entry}
              reference={reference.reference}
              totalRows={reference?.totalRows}
            />
          {:else}
            <div>
              <WithModelResultTooltip {modelHasError}>
                <a
                  href="/{reference?.entry?.source
                    ? 'source'
                    : 'model'}/{reference?.entry?.name}"
                  class="ui-copy-muted grid justify-between gap-x-2 {classes.QUERY_REFERENCE_TRIGGER} pl-4 pr-4"
                  style:grid-template-columns="auto max-content"
                  on:focus={focus(reference.reference)}
                  on:mouseover={focus(reference.reference)}
                  on:mouseleave={blur}
                  on:blur={blur}
                  class:text-gray-500={modelHasError}
                >
                  <div class="truncate flex items-center gap-x-2">
                    <div class="truncate">
                      {reference.entry?.embedded
                        ? reference.entry?.source?.properties?.path
                        : reference.entry.name}
                    </div>
                  </div>

                  <div class="text-gray-500">
                    {#if reference?.totalRows}
                      {`${formatCompactInteger(reference.totalRows)} rows` ||
                        ""}
                    {/if}
                  </div>
                </a>

                <svelte:fragment slot="tooltip-title">
                  <div class="break-all">
                    {reference?.entry?.embedded
                      ? reference?.entry?.source?.properties?.path
                      : reference?.entry?.name}
                  </div></svelte:fragment
                >
                <svelte:fragment slot="tooltip-right">
                  {#if reference?.entry?.source}
                    {reference?.entry?.source?.connector}
                  {/if}
                </svelte:fragment>

                <svelte:fragment slot="tooltip-description">
                  <TooltipShortcutContainer>
                    <div>Open in workspace</div>
                    <Shortcut>Click</Shortcut>
                  </TooltipShortcutContainer>
                </svelte:fragment>
              </WithModelResultTooltip>
            </div>
          {/if}
        {/each}
      </div>
    {/if}
  </div>
  <hr />
{/if}
