import { DNSRecordType, getDnsRecordsApi } from "@/lib/common/schema/dns-records";
import { ApiRequest, ApiResponse, createEndpoint, endpointsWrapper, onMethodNotSupported } from "@/lib/server/nextEndpointHelper";
import { authAndRateLimit } from "@/middleware/authRateLimit";
import { getDnsRecordsUseCase } from "@/services/dnsRecords.service";


const getDnsRecord = async (
    req: ApiRequest<getDnsRecordsApi["request"]>,
    res: ApiResponse<getDnsRecordsApi["response"]>
) => {

    const { hostname } = req.query;

    const decodedHostname = decodeURIComponent(hostname as string).toLowerCase().trim();

    const records: DNSRecordType[] = await getDnsRecordsUseCase(decodedHostname);

    return res.status(200).json({
        hostname: decodedHostname,
        records: records.map(record => ({
            type: record.type,
            value: record.value,
        }))
    });
};

export default endpointsWrapper(
    createEndpoint().use(authAndRateLimit()).get(getDnsRecord).all(onMethodNotSupported)
);
