<script lang="ts">
  import {
    DashboardListItem,
    getDashboardsForProject,
  } from "@rilldata/web-admin/components/projects/dashboards";
  import Tooltip from "@rilldata/web-common/components/tooltip/Tooltip.svelte";
  import TooltipContent from "@rilldata/web-common/components/tooltip/TooltipContent.svelte";
  import {
    createAdminServiceGetProject,
    V1DeploymentStatus,
    V1GetProjectResponse,
  } from "../../client";

  export let organization: string;
  export let project: string;

  let dashboardListItems: DashboardListItem[];

  $: proj = createAdminServiceGetProject(organization, project);
  $: if ($proj?.isSuccess && $proj.data?.prodDeployment) {
    updateDashboardsForProject($proj.data);
  }

  // This method has to be here since we cannot have async-await in reactive statement to set dashboardListItems
  async function updateDashboardsForProject(projectData: V1GetProjectResponse) {
    const status = projectData.prodDeployment.status;
    if (
      status === V1DeploymentStatus.DEPLOYMENT_STATUS_PENDING ||
      status === V1DeploymentStatus.DEPLOYMENT_STATUS_RECONCILING
    )
      return;

    dashboardListItems = await getDashboardsForProject(projectData);
  }
</script>

{#if dashboardListItems?.length === 0}
  <p class="text-gray-500 text-xs">This project has no dashboards yet.</p>
{:else if dashboardListItems?.length > 0}
  <ol>
    {#each dashboardListItems as dashboardListItem}
      <li class="mb-1 text-xs font-medium leading-4 break-all">
        {#if dashboardListItem.isValid}
          <a
            href="/{organization}/{project}/{dashboardListItem.name}"
            class="text-gray-700 hover:underline"
          >
            {dashboardListItem?.title || dashboardListItem.name}
          </a>
        {:else}
          <Tooltip location="right" distance={4}>
            <span class="text-gray-400"
              >{dashboardListItem?.title || dashboardListItem.name}
            </span>
            <TooltipContent slot="tooltip-content">
              This dashboard isn't working. Check project logs.
            </TooltipContent>
          </Tooltip>
        {/if}
      </li>
    {/each}
  </ol>
{/if}
