import { DNSRecordType, DNSRecordTypeEnum } from '@/lib/common/schema/dns-records';
import { getDnsRecordsUseCase } from '@/services/dnsRecords.service';

export const validateDnsRecordConflict = (
    newType: DNSRecordTypeEnum,
    newValue: string,
    existingRecords: DNSRecordType[]
): string | null => {
    const existingTypes = existingRecords.map((r) => r.type);

    const hasCNAME = existingTypes.includes(DNSRecordTypeEnum.CNAME);
    const isDuplicate = existingRecords.some(
        (r) => r.type === newType && r.value === newValue
    );


    if (isDuplicate) {
        return `Duplicate ${newType} record for this hostname already exists.`;
    }

    if (newType === DNSRecordTypeEnum.CNAME) {
        if (existingRecords.length > 0) {
            return `CNAME cannot be added: other records already exist for this hostname [${existingTypes.join(', ')}]`;
        }
    } else {
        if (hasCNAME) {
            return `${newType} cannot be added: CNAME already exists for this hostname`;
        }
    }

    return null;
}

const MAX_CNAME_DEPTH = 10;


export const resolveHostnameToIp = async (hostname: string): Promise<{
  resolvedIps: string[];
  chain: string[];
  recordType: DNSRecordTypeEnum | null;
  pointsTo?: string;
}> => {
  const visited = new Set<string>();
  let currentHostname = hostname;
  let depth = 0;
  const chain: string[] = [];

  while (depth < MAX_CNAME_DEPTH) {
    if (visited.has(currentHostname)) {
      throw new Error(`Circular CNAME reference detected: ${[...visited, currentHostname].join(' → ')}`);
    }

    visited.add(currentHostname);
    chain.push(currentHostname);

    const records: DNSRecordType[] = await getDnsRecordsUseCase(currentHostname);

    if (records.length === 0) {
      break;
    }

    const cnameRecord = records.find((r) => r.type === DNSRecordTypeEnum.CNAME);

    if (cnameRecord) {
      currentHostname = cnameRecord.value;
      depth++; 
      continue;
    }

    const aRecords = records.filter((r) => r.type === DNSRecordTypeEnum.A);
    if (aRecords.length > 0) {
      return {
        resolvedIps: aRecords.map((r) => r.value),
        chain,
        recordType: DNSRecordTypeEnum.A,
      };
    }

    break; // no resolvable A or CNAME
  }

  throw new Error(`Unable to resolve IP for hostname: ${hostname}`);
};

