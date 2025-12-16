/**
 * Register Chainhooks via Hiro Platform API
 *
 * This script registers all 7 Chainhook configurations for the Time Banking Protocol
 * Usage: ts-node scripts/register-chainhooks.ts
 */

import * as fs from 'fs';
import * as path from 'path';

const HIRO_API_KEY = process.env.HIRO_API_KEY || '71b40c8f84889a88cbcf2fc6b8393723';
const PLATFORM_API_URL = 'https://api.platform.hiro.so/v1/ext';
const CHAINHOOKS_DIR = path.join(__dirname, '../chainhooks');

interface ChainhookResponse {
  uuid?: string;
  name?: string;
  error?: string;
  message?: string;
}

async function registerChainhook(configPath: string): Promise<void> {
  const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  const fileName = path.basename(configPath);

  console.log(`\n📋 Registering: ${config.name}`);
  console.log(`   File: ${fileName}`);

  try {
    const response = await fetch(`${PLATFORM_API_URL}/${HIRO_API_KEY}/chainhooks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(config),
    });

    const data: ChainhookResponse = await response.json();

    if (response.ok) {
      console.log(`   ✅ Success! UUID: ${data.uuid}`);
      console.log(`   Contract: ${config.networks.testnet.if_this.contract_identifier}`);
    } else {
      console.error(`   ❌ Failed: ${data.error || data.message}`);
      console.error(`   Response:`, JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.error(`   ❌ Error:`, error instanceof Error ? error.message : error);
  }
}

async function listChainhooks(): Promise<void> {
  console.log('\n📋 Fetching existing Chainhooks...\n');

  try {
    const response = await fetch(`${PLATFORM_API_URL}/${HIRO_API_KEY}/chainhooks`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (response.ok) {
      const chainhooks = Array.isArray(data) ? data : data.chainhooks || [];
      console.log(`Found ${chainhooks.length} existing Chainhook(s):\n`);

      if (chainhooks.length > 0) {
        chainhooks.forEach((hook: any, index: number) => {
          console.log(`${index + 1}. ${hook.name || 'Unnamed'}`);
          console.log(`   UUID: ${hook.uuid}`);
          console.log(`   Status: ${hook.enabled ? '✅ Enabled' : '⏸️  Disabled'}`);
          console.log();
        });
      } else {
        console.log('No Chainhooks registered yet.\n');
      }
    } else {
      console.error('❌ Failed to fetch Chainhooks:', data);
    }
  } catch (error) {
    console.error('❌ Error fetching Chainhooks:', error);
  }
}

async function deleteChainhook(uuid: string): Promise<void> {
  console.log(`\n🗑️  Deleting Chainhook: ${uuid}`);

  try {
    const response = await fetch(`${PLATFORM_API_URL}/${HIRO_API_KEY}/chainhooks/${uuid}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      console.log(`   ✅ Deleted successfully`);
    } else {
      const data = await response.json();
      console.error(`   ❌ Failed:`, data);
    }
  } catch (error) {
    console.error(`   ❌ Error:`, error);
  }
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  console.log('═══════════════════════════════════════════════');
  console.log('   TIME BANKING PROTOCOL - CHAINHOOKS MANAGER');
  console.log('═══════════════════════════════════════════════\n');

  if (!HIRO_API_KEY || HIRO_API_KEY === 'your_hiro_api_key_here') {
    console.error('❌ Error: HIRO_API_KEY not set in environment');
    console.log('\nPlease set HIRO_API_KEY in your .env.local file');
    process.exit(1);
  }

  console.log(`🔑 Using API Key: ${HIRO_API_KEY.substring(0, 8)}...`);

  if (command === 'list') {
    await listChainhooks();
    return;
  }

  if (command === 'delete' && args[1]) {
    await deleteChainhook(args[1]);
    return;
  }

  if (command === 'delete-all') {
    console.log('\n⚠️  This will delete ALL chainhooks. Continue? (y/N)');
    // In production, add confirmation logic
    console.log('Skipping for safety. Use "delete <uuid>" for individual deletion.');
    return;
  }

  // Default: Register all chainhooks
  console.log('\n🚀 Registering All Chainhooks...\n');

  const configFiles = fs.readdirSync(CHAINHOOKS_DIR)
    .filter(file => file.endsWith('.json'))
    .sort();

  console.log(`Found ${configFiles.length} configuration file(s)\n`);

  for (const file of configFiles) {
    const configPath = path.join(CHAINHOOKS_DIR, file);
    await registerChainhook(configPath);
    // Wait a bit between registrations
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('\n✨ Registration complete!\n');
  console.log('Next steps:');
  console.log('1. Update webhook URLs when deploying to production');
  console.log('2. Start your dev server: npm run dev');
  console.log('3. Expose webhook endpoint via ngrok for testing');
  console.log('4. Make test transactions to trigger events\n');
}

// Run the script
main().catch(console.error);
