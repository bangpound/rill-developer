<script lang="ts">
  import { EntityType } from "@rilldata/web-common/features/entity-management/types";
  import { appStore } from "@rilldata/web-common/layout/app-store";
  import { WorkspaceContainer } from "../../../layout/workspace";
  import SourceInspector from "./SourceInspector.svelte";
  import SourceWorkspaceBody from "./SourceWorkspaceBody.svelte";
  import SourceWorkspaceHeader from "./SourceWorkspaceHeader.svelte";

  export let sourceName: string;
  export let embedded = false;
  export let path: string = undefined;

  const switchToSource = async (name: string) => {
    if (!name) return;

    appStore.setActiveEntity(name, EntityType.Table);
  };

  $: switchToSource(sourceName);
</script>

{#key sourceName}
  <WorkspaceContainer assetID={sourceName}>
    <SourceWorkspaceHeader {sourceName} {path} {embedded} slot="header" />
    <SourceWorkspaceBody {sourceName} slot="body" />
    <SourceInspector {sourceName} slot="inspector" />
  </WorkspaceContainer>
{/key}
