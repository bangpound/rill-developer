<script lang="ts">
  import { page } from "$app/stores";
  import ColumnProfile from "@rilldata/web-common/components/column-profile/ColumnProfile.svelte";
  import RenameAssetModal from "@rilldata/web-common/features/entity-management/RenameAssetModal.svelte";
  import { EntityType } from "@rilldata/web-common/features/entity-management/types";
  import {
    useEmbeddedSources,
    useSourceNames,
  } from "@rilldata/web-common/features/sources/selectors";
  import {
    createRuntimeServiceListCatalogEntries,
    createRuntimeServicePutFileAndReconcile,
    V1CatalogEntry,
  } from "@rilldata/web-common/runtime-client";
  import { useQueryClient } from "@tanstack/svelte-query";
  import { flip } from "svelte/animate";
  import { slide } from "svelte/transition";
  import { LIST_SLIDE_DURATION } from "../../../layout/config";
  import NavigationEntry from "../../../layout/navigation/NavigationEntry.svelte";
  import NavigationHeader from "../../../layout/navigation/NavigationHeader.svelte";
  import { runtime } from "../../../runtime-client/runtime-store";
  import AddAssetButton from "../../entity-management/AddAssetButton.svelte";
  import { useModelNames } from "../../models/selectors";
  import AddSourceModal from "../add-source/AddSourceModal.svelte";
  import { createModelFromSource } from "../createModel";
  import EmbeddedSourceNav from "./EmbeddedSourceNav.svelte";
  import SourceMenuItems from "./SourceMenuItems.svelte";
  import SourceTooltip from "./SourceTooltip.svelte";
  import { behaviourEvent } from "../../../metrics/initMetrics";
  import {
    BehaviourEventAction,
    BehaviourEventMedium,
  } from "../../../metrics/service/BehaviourEventTypes";
  import { appScreen } from "../../../layout/app-store";
  import { MetricsEventSpace } from "../../../metrics/service/MetricsTypes";

  $: sourceNames = useSourceNames($runtime.instanceId);
  $: modelNames = useModelNames($runtime.instanceId);
  const createModelMutation = createRuntimeServicePutFileAndReconcile();

  $: sourceCatalogsQuery = useEmbeddedSources($runtime?.instanceId);
  let embeddedSourceCatalogs: Array<V1CatalogEntry>;
  $: embeddedSourceCatalogs = $sourceCatalogsQuery?.data ?? [];

  const queryClient = useQueryClient();

  let showTables = true;

  let showAddSourceModal = false;

  const openShowAddSourceModal = () => {
    showAddSourceModal = true;

    behaviourEvent?.fireSourceTriggerEvent(
      BehaviourEventAction.SourceAdd,
      BehaviourEventMedium.Button,
      $appScreen,
      MetricsEventSpace.LeftPanel
    );
  };

  const queryHandler = async (tableName: string) => {
    await createModelFromSource(
      queryClient,
      $runtime.instanceId,
      $modelNames.data,
      tableName,
      tableName,
      $createModelMutation
    );
    // TODO: fire telemetry
  };

  let showRenameTableModal = false;
  let renameTableName = null;

  const openRenameTableModal = (tableName: string) => {
    showRenameTableModal = true;
    renameTableName = tableName;
  };

  $: catalogQuery = createRuntimeServiceListCatalogEntries($runtime.instanceId);
  $: hasNoAssets = $catalogQuery?.data?.entries.length === 0;
</script>

<NavigationHeader bind:show={showTables} toggleText="sources"
  >Sources</NavigationHeader
>

{#if showTables}
  <div class="pb-3" transition:slide|local={{ duration: LIST_SLIDE_DURATION }}>
    {#if $sourceNames?.data}
      {#each $sourceNames.data as sourceName (sourceName)}
        <div
          animate:flip={{ duration: 200 }}
          out:slide={{ duration: LIST_SLIDE_DURATION }}
        >
          <NavigationEntry
            href={`/source/${sourceName}`}
            open={$page.url.pathname === `/source/${sourceName}`}
            on:command-click={() => queryHandler(sourceName)}
            name={sourceName}
          >
            <svelte:fragment slot="more">
              <div transition:slide|local={{ duration: LIST_SLIDE_DURATION }}>
                <ColumnProfile indentLevel={1} objectName={sourceName} />
              </div>
            </svelte:fragment>

            <svelte:fragment slot="tooltip-content">
              <SourceTooltip {sourceName} connector="" />
            </svelte:fragment>

            <svelte:fragment slot="menu-items" let:toggleMenu>
              <SourceMenuItems
                {sourceName}
                {toggleMenu}
                on:rename-asset={() => {
                  openRenameTableModal(sourceName);
                }}
              />
            </svelte:fragment>
          </NavigationEntry>
        </div>
      {/each}
    {/if}
    <EmbeddedSourceNav />
    <AddAssetButton
      id="add-table"
      label="Add source"
      bold={hasNoAssets}
      on:click={openShowAddSourceModal}
    />
  </div>
{/if}

{#if showAddSourceModal}
  <AddSourceModal
    on:close={() => {
      showAddSourceModal = false;
    }}
  />
{/if}
{#if showRenameTableModal}
  <RenameAssetModal
    entityType={EntityType.Table}
    closeModal={() => (showRenameTableModal = false)}
    currentAssetName={renameTableName}
  />
{/if}
