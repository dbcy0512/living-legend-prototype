# PixelLab Zone 1 POI Anchors

Runtime copies live in `public/assets/environment`.

Accepted assets:

| Runtime File | PixelLab ID | Runtime Use |
| --- | --- | --- |
| `zone1-poi-water-source-v1.png` | `b6a84cfc-1b6e-4da1-b8a9-fda5207f9851` | Water source pond and shoreline anchor. |
| `zone1-poi-stone-outcrop-v1.png` | `bd15c264-ee59-4406-ac1b-b1643e2acee7` | Stone outcrop landmark and stone resource context. |
| `zone1-poi-herb-berry-patch-v1.png` | `8553b341-c86a-43fe-8844-26f4bf6fa9bb` | Herb and berry patch living growth anchor. |
| `zone1-poi-clay-mud-bank-v1.png` | `0be594ed-ac5e-408a-b30e-fdf730dad0a7` | Clay and mud bank natural wet-ground anchor. |
| `zone1-poi-animal-trail-v1.png` | `6d7802f4-fedb-4270-8a61-62c87c14d5f9` | Animal trail crossing and pressure corridor context. |
| `zone1-poi-future-gate-v1.png` | `5ed0796d-96e9-4f48-a593-cf2b488aa7e9` | Future danger gate soft-warning landmark. |
| `zone1-poi-deep-forest-deadfall-v1.png` | `b279a4b6-eec3-4dda-bcf7-a3125347f598` | Deep forest deadfall and wood/bark context. |
| `basic-workbench-v1.png` | `5adaee0f-0c90-4053-820c-829b0f89b2e7` | First visible progression station after building the workbench. |

Rejected from runtime:

| PixelLab ID | Reason |
| --- | --- |
| `6c03f019-7f79-4f07-82ad-720b1df63cc6` | Clay/mud result read as an isometric walled platform. |
| `1f495580-81de-435a-81c2-970796be0da6` | Clay/mud replacement still read as a built basin instead of natural wet ground. |
| `4594ac03-ab08-4c23-818f-bcdc7fbdc975` | Deep forest deadfall silhouette read too much like creature wings. |

Selected review source:

| PixelLab ID | Selected Frame | Reason |
| --- | --- | --- |
| `12ff8adc-f826-41ce-9642-98c227fec26e` | `3` | Best natural clay/mud candidate without constructed borders. |

Design rule: POI anchors explain why resources and enemies belong in a place. They should not replace authored terrain patches, resource nodes, enemy habitat anchors, or future animated PixelLab effects.
