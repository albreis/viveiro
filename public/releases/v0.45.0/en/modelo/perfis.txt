# Versioned parameter profiles

The experiment laboratory’s editor shows all 12 inputs in catalog v1, including
unit, allowed range, code source and classification as hypothesis or approximation.
These bounds are prototype rules, not species-calibrated confidence intervals.

## Create and repeat

Open **Experiments**, then **Edit and save a parameter profile**. Enter identifier,
name and version; choose an existing biological revision and adjust inputs. The
five optional inputs can remain unchecked: they then preserve original model behavior.

**Apply to experiment** changes parameters and biological profile in the isolated
plan. Seed, duration, initial mode and decision policy remain those of the plan.
No 3D terrarium save or IndexedDB record is changed. **Use in sweep** changes only
the sweep base; its axis values remain defined in the sweep configuration.

Export profile JSON and also retain seed, executed configuration, Viveiro version
and manifest arithmetic policy. Import the same profile in another browser,
apply it to an experiment with the same seed and run it. A profile file alone is
neither an ant-nest snapshot nor a record of every factor in a run.

## Immutable versions and storage

JSON uses `viveiro-parameter-profile-v1`, `catalogVersion: 1`, an identifier,
positive version, name, explicit biological reference and canonical parameters.
In the local library, one `id@version` can only be reused with identical content.
To save changes, increase the version or use another identifier. Imports
conflicting with an existing version are rejected; nothing is overwritten.

The library uses the independent localStorage key `viveiro.parameter-profiles.v1`,
with up to 100 versions and 256 KiB. The importer accepts files up to 64 KiB.
Quota, corruption and format errors are visible and preserve earlier data.
The library is not synchronized over the network: exported files transfer it
between origins and browsers. Existing saves are neither migrated nor deleted.

## Provenance and variations

The plan and manifest store the complete **origin** profile in `parameterProfile`,
alongside parameters and biological profile **actually executed**. This distinction
lets a sweep record where it started while executing different values along its
chosen axis. Editing plan JSON can also produce variations: executed values come
from `parameters`, not the origin profile.

Applying a profile through the editor copies all its values, including optional
input presence/absence. There is no invisible filling of the five optional inputs
in the exported file. Reimporting and applying identical configuration, model
version and seed preserves the run; importing a profile does not promise parity
between different simulator versions.

The editor covers the experiment input catalog, not every internal physics or
biology coefficient. Published biological profiles are immutable references;
this editor does not create a calibrated species or replace P3 data and reviews.

## Reproduction evidence

Profile qa-perfis-44@1 was exported, modified in the editor and reimported in the
browser. With seed PROFILE-BROWSER-44 and three days, CSV and manifest were
byte-identical in the first run, after reimporting, in the CLI and in the compiled
bundle. The study also rejected different content under a saved version and
checked application to the sweep base.

[Exported profile](../experimentos/profile-044/profile.json),
[executed plan](../experimentos/profile-044/plan.json) and
[raw files and hashes](../experimentos/profile-044/arquivos.json).
This verifies the tested scenarios, not biological calibration or compatibility
between different model versions.
