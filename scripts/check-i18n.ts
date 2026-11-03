import {
  catalogs,
  defaultLocale,
  supportedLocales,
} from "../src/i18n/catalogs.ts";
import { validateCatalogs } from "../src/i18n/validation.ts";
const issues = validateCatalogs(catalogs, defaultLocale);
if (issues.length) {
  process.stderr.write(
    JSON.stringify({ status: "invalid", issues }, null, 2) + "\n",
  );
  process.exitCode = 1;
} else
  process.stdout.write(
    JSON.stringify({
      status: "ok",
      locales: supportedLocales,
      messages: Object.keys(catalogs[defaultLocale]).length,
    }) + "\n",
  );
