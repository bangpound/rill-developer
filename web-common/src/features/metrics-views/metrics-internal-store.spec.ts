import { describe, it, expect } from "vitest";
import {
  initBlankDashboardYAML,
  MetricsInternalRepresentation,
} from "@rilldata/web-common/features/metrics-views/metrics-internal-store";

function createInternalRepresentation(yaml = initBlankDashboardYAML("AdBids")) {
  const internalRepresentation = new MetricsInternalRepresentation(yaml, () => {
    // no-op
  });
  internalRepresentation.bindStore(() => {
    // no-op
  });
  return internalRepresentation;
}

// TODO: add more exhaustive tests
describe("Metrics Internal Store", () => {
  it("Add remove dimensions", () => {
    const internalRepresentation = createInternalRepresentation();

    internalRepresentation.addNewDimension();
    expect(internalRepresentation.internalYAML)
      .toEqual(`# Visit https://docs.rilldata.com/reference/project-files to learn more about Rill project files.

title: "AdBids"
model: ""
default_time_range: ""
smallest_time_grain: ""
timeseries: ""
measures: []
dimensions:
  - label: ""
    property: ""
    description: ""
`);
    internalRepresentation.updateDimension(0, "label", "Publisher");
    internalRepresentation.updateDimension(0, "property", "publisher");
    expect(internalRepresentation.internalYAML)
      .toEqual(`# Visit https://docs.rilldata.com/reference/project-files to learn more about Rill project files.

title: "AdBids"
model: ""
default_time_range: ""
smallest_time_grain: ""
timeseries: ""
measures: []
dimensions:
  - label: Publisher
    property: publisher
    description: ""
`);
  });

  it("Add remove measures", () => {
    const internalRepresentation = createInternalRepresentation();

    internalRepresentation.addNewMeasure();
    expect(internalRepresentation.internalYAML)
      .toEqual(`# Visit https://docs.rilldata.com/reference/project-files to learn more about Rill project files.

title: "AdBids"
model: ""
default_time_range: ""
smallest_time_grain: ""
timeseries: ""
measures:
  - label: ""
    expression: ""
    name: measure
    description: ""
    format_preset: humanize
dimensions: []
`);

    internalRepresentation.updateMeasure(0, "expression", "count(*)");
    internalRepresentation.updateMeasure(0, "name", "impressions");
    internalRepresentation.updateMeasure(0, "label", "Total Impressions");
    expect(internalRepresentation.internalYAML)
      .toEqual(`# Visit https://docs.rilldata.com/reference/project-files to learn more about Rill project files.

title: "AdBids"
model: ""
default_time_range: ""
smallest_time_grain: ""
timeseries: ""
measures:
  - label: Total Impressions
    expression: count(*)
    name: impressions
    description: ""
    format_preset: humanize
dimensions: []
`);

    internalRepresentation.addNewMeasure();
    expect(internalRepresentation.internalYAML)
      .toEqual(`# Visit https://docs.rilldata.com/reference/project-files to learn more about Rill project files.

title: "AdBids"
model: ""
default_time_range: ""
smallest_time_grain: ""
timeseries: ""
measures:
  - label: Total Impressions
    expression: count(*)
    name: impressions
    description: ""
    format_preset: humanize
  - label: ""
    expression: ""
    name: measure
    description: ""
    format_preset: humanize
dimensions: []
`);

    internalRepresentation.addNewMeasure();
    expect(internalRepresentation.internalYAML)
      .toEqual(`# Visit https://docs.rilldata.com/reference/project-files to learn more about Rill project files.

title: "AdBids"
model: ""
default_time_range: ""
smallest_time_grain: ""
timeseries: ""
measures:
  - label: Total Impressions
    expression: count(*)
    name: impressions
    description: ""
    format_preset: humanize
  - label: ""
    expression: ""
    name: measure
    description: ""
    format_preset: humanize
  - label: ""
    expression: ""
    name: measure_1
    description: ""
    format_preset: humanize
dimensions: []
`);

    internalRepresentation.updateMeasure(1, "name", "measure_2");
    internalRepresentation.addNewMeasure();
    expect(internalRepresentation.internalYAML)
      .toEqual(`# Visit https://docs.rilldata.com/reference/project-files to learn more about Rill project files.

title: "AdBids"
model: ""
default_time_range: ""
smallest_time_grain: ""
timeseries: ""
measures:
  - label: Total Impressions
    expression: count(*)
    name: impressions
    description: ""
    format_preset: humanize
  - label: ""
    expression: ""
    name: measure_2
    description: ""
    format_preset: humanize
  - label: ""
    expression: ""
    name: measure_1
    description: ""
    format_preset: humanize
  - label: ""
    expression: ""
    name: measure
    description: ""
    format_preset: humanize
dimensions: []
`);
  });

  describe("Measure Name backwards compatibility", () => {
    const MetricsYAML = `title: "AdBids"
model: ""
default_time_range: ""
smallest_time_grain: ""
timeseries: ""
dimensions: []
measures:
`;
    [
      [
        "From an old project without measure name keys",
        `
  - label: Total Impressions
    expression: count(*)
    description: ""
    format_preset: humanize
  - label: Bids
    expression: avg(bid_price)
    description: ""
    format_preset: humanize`,
        `
  - label: Total Impressions
    expression: count(*)
    description: ""
    format_preset: humanize
    name: measure
  - label: Bids
    expression: avg(bid_price)
    description: ""
    format_preset: humanize
    name: measure_1
  - label: ""
    expression: ""
    name: measure_2
    description: ""
    format_preset: humanize`,
      ],
      [
        "From an old project with some measure name keys",
        `
  - label: Total Impressions
    name: measure_1
    expression: count(*)
    description: ""
    format_preset: humanize
  - label: Bids
    expression: avg(bid_price)
    description: ""
    format_preset: humanize`,
        `
  - label: Total Impressions
    name: measure_1
    expression: count(*)
    description: ""
    format_preset: humanize
  - label: Bids
    expression: avg(bid_price)
    description: ""
    format_preset: humanize
    name: measure
  - label: ""
    expression: ""
    name: measure_2
    description: ""
    format_preset: humanize`,
      ],
    ].forEach(([title, original, expected]) => {
      it(title, () => {
        const internalRepresentation = createInternalRepresentation(
          MetricsYAML + original
        );
        internalRepresentation.addNewMeasure();
        expect(internalRepresentation.internalYAML).toEqual(
          MetricsYAML + expected + "\n"
        );
      });
    });
  });
});
