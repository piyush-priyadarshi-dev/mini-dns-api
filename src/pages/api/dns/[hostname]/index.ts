import { deleteDnsRecordsApi, DNSRecordTypeEnum, resolveDnsRecordApi } from "@/lib/common/schema/dns-records";
import { ApiRequest, ApiResponse, createEndpoint, endpointsWrapper, onMethodNotSupported } from "@/lib/server/nextEndpointHelper";
import { authAndRateLimit } from "@/middleware/authRateLimit";
import { deleteDnsRecordsUseCase } from "@/services/dnsRecords.service";
import { resolveHostnameToIp } from "@/utils/dnsRules";
import * as yup from "yup";


const resolveDnsRecord = async (
    req: ApiRequest<resolveDnsRecordApi["request"]>,
    res: ApiResponse<resolveDnsRecordApi["response"]>
) => {

    const { hostname } = req.query;

    const decodedHostname = decodeURIComponent(hostname as string).toLowerCase().trim();

    const result = await resolveHostnameToIp(decodedHostname);

    return res.status(200).json({
        hostname: decodedHostname,
        resolvedIps: result.resolvedIps,
        recordType: result.recordType,
        pointsTo: result.chain.length > 1 ? result.chain[1] : null,
    });
};

const deleteDnsRecordQuerySchema = yup
    .object()
    .shape({
        type: yup
            .string()
            .oneOf(Object.values(DNSRecordTypeEnum), 'Invalid DNS record type')
            .required(),
        hostname: yup.string().required(),
        value: yup.string().required(),
    })
    .strict()
    .noUnknown();

const deleteDnsRecord = async (
    req: ApiRequest<deleteDnsRecordsApi["request"]>,
    res: ApiResponse<deleteDnsRecordsApi["response"]>
) => {

    try {
        await deleteDnsRecordQuerySchema.validate(req.query);
    } catch (error: any) {
        return res.status(400).json({ message: error.message });
    }

    const { hostname, type, value } = req.query;
    const decodedHostname = decodeURIComponent(hostname as string).toLowerCase().trim();

    const result = await deleteDnsRecordsUseCase(decodedHostname, type, value)

    if (result === 0) {
        return res.status(404).json({ message: 'DNS record not found for deletion' });
    }

    return res.status(200).json({ success: true, message: 'DNS record deleted successfully' });

}
export default endpointsWrapper(
    createEndpoint()
        .get(resolveDnsRecord)
        .use(authAndRateLimit()) // Added after the get method internally to let users resolve the hostname without auth
        .delete(deleteDnsRecord)
        .all(onMethodNotSupported)
);
