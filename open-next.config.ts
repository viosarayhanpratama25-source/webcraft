// default open-next.config.ts file created by @opennextjs/cloudflare
import { defineCloudflareConfig } from "@opennextjs/cloudflare";

const config = defineCloudflareConfig({});

config.cloudflare = {
	useWorkerdCondition: false, // Skips copyWorkerdPackages step to avoid pg-cloudflare bundle errors
};

export default config;
